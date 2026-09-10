#!/usr/bin/env node
//  Refuses a source image that next/image cannot optimize.
//
//  WHY THIS EXISTS
//
//  about-hero.jpg shipped at 8256x5504 / 51 MB — a camera export dropped into
//  public/ unprocessed. next/image does not fail loudly on that: it gives up and
//  streams the ORIGINAL to the browser, with the upstream S3 headers and no
//  cache-control. Every visitor to /about downloaded 51 MB, for a photo sitting
//  behind a 75%-opaque gradient. The page still rendered and the build stayed
//  green, so the only signal was strangers saying the page was slow.
//
//  The check is on DIMENSIONS as well as bytes on purpose. Bytes alone are a
//  proxy: a hard-compressed 45MP frame can be under a megabyte and still blow up
//  the optimizer, which decodes to raw pixels before it resizes. Megapixels are
//  the thing that actually breaks, so that is what is measured.
//
//  Reading the header rather than trusting the extension, because a .jpg that is
//  really a PNG is exactly the kind of thing that would slip past a lazier check.

import { readdirSync, statSync, openSync, readSync, closeSync } from 'node:fs'
import { join, extname } from 'node:path'

const DIR = 'public/images'
const MAX_MEGAPIXELS = 12      // 4000x3000. Above this the optimizer is at risk.
const MAX_BYTES = 2_000_000    // A source this big means nobody looked at it.

// Long edge we actually serve. next/image's largest srcset entry is 3840, so a
// source wider than that is decoded and thrown away on every optimization.
const MAX_EDGE = 3840

// Segments are walked by seeking rather than by reading a fixed window. Six of
// these files carry ~82 KB of embedded stock-photo metadata before the frame
// header, so a 64 KB buffer missed them — and a check that cannot read a file
// must never be the same observable as one that passed.
function dimensions(path) {
    const fd = openSync(path, 'r')
    const at = (pos, len) => {
        const b = Buffer.alloc(len)
        return readSync(fd, b, 0, len, pos) === len ? b : null
    }

    try {
        const head = at(0, 24)
        if (!head) return null

        // PNG: IHDR is always the first chunk, width and height at a fixed offset.
        if (head.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
            return { w: head.readUInt32BE(16), h: head.readUInt32BE(20) }
        }

        // JPEG: walk segment to segment until the start-of-frame, which carries
        // the size. Every APP/quantization segment declares its own length, so
        // this costs four bytes per segment however much metadata is embedded.
        if (head[0] === 0xff && head[1] === 0xd8) {
            let off = 2
            const size = statSync(path).size
            while (off + 4 <= size) {
                const seg = at(off, 4)
                if (!seg || seg[0] !== 0xff) return null
                const marker = seg[1]
                if (marker === 0xd8 || marker === 0xd9) return null
                if (marker === 0xda) return null          // image data; no frame header found
                if (marker >= 0xc0 && marker <= 0xcf &&
                    marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
                    const sof = at(off + 4, 5)
                    return sof ? { h: sof.readUInt16BE(1), w: sof.readUInt16BE(3) } : null
                }
                off += 2 + seg.readUInt16BE(2)
            }
        }

        return null   // Unread, NOT assumed fine — reported separately below.
    } finally {
        closeSync(fd)
    }
}

const problems = []
const unread = []

for (const name of readdirSync(DIR).sort()) {
    const path = join(DIR, name)
    if (!statSync(path).isFile()) continue
    if (!['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(extname(name).toLowerCase())) continue

    const bytes = statSync(path).size
    const dim = dimensions(path)

    if (!dim) {
        // A format this script cannot parse is not a pass. Say so out loud, so
        // the gap is visible rather than reported as health.
        unread.push(`${name} (${(bytes / 1024).toFixed(0)} KB) — header not understood`)
        if (bytes > MAX_BYTES) problems.push(`${name}: ${(bytes / 1e6).toFixed(1)} MB, over the ${MAX_BYTES / 1e6} MB limit`)
        continue
    }

    const mp = (dim.w * dim.h) / 1e6
    const edge = Math.max(dim.w, dim.h)

    if (mp > MAX_MEGAPIXELS)
        problems.push(`${name}: ${dim.w}x${dim.h} = ${mp.toFixed(1)}MP, over the ${MAX_MEGAPIXELS}MP limit — next/image will serve the original instead of optimizing`)
    else if (edge > MAX_EDGE)
        problems.push(`${name}: ${dim.w}x${dim.h} — long edge over ${MAX_EDGE}px, which is wider than anything the site serves`)

    if (bytes > MAX_BYTES)
        problems.push(`${name}: ${(bytes / 1e6).toFixed(1)} MB, over the ${MAX_BYTES / 1e6} MB limit`)
}

if (unread.length) {
    console.log(`  ${unread.length} file(s) whose dimensions could not be read:`)
    for (const u of unread) console.log(`    ${u}`)
}

if (problems.length) {
    console.error(`\n  ${problems.length} image problem(s) in ${DIR}:\n`)
    for (const p of problems) console.error(`    ${p}`)
    console.error(`
  Resize before committing, e.g.:

    python3 -c "from PIL import Image; p='${DIR}/<file>'; im=Image.open(p); \\
      w=2560; im.resize((w, round(im.height*w/im.width)), Image.LANCZOS).save(
      p, quality=82, optimize=True, progressive=True)"
`)
    process.exit(1)
}

console.log(`  ${DIR}: all images within ${MAX_MEGAPIXELS}MP / ${MAX_EDGE}px / ${MAX_BYTES / 1e6}MB`)
