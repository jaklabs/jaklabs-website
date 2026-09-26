"""Download the exact Google Fonts this site uses into src/fonts/.

Run from the repo root:  python3 scripts/fetch-fonts.py

This is the ONLY thing that should ever write src/fonts/. The site self-hosts
its type so the build makes no network call -- see the note at the top of any
page that loads a font. Run this when a page needs a weight that is not already
on disk, then add the new { path, weight } entry to that page's localFont call.

Picks the `/* latin */` @font-face block for each requested weight, matching the
`subsets: ['latin']` every call site already declares. Requesting anything wider
would ship bytes no page renders.
"""
import re, sys, urllib.request, pathlib

UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/120.0 Safari/537.36')

FAMILIES = {
    # The site's own type: font-sans and font-heading in tailwind.config.ts.
    'Inter':               ['400', '500', '600', '700'],
    'Poppins':             ['400', '500', '600', '700'],
    'Newsreader':          ['400', '500'],
    'Instrument Sans':     ['400', '500', '600', '700'],
    'IBM Plex Mono':       ['500', '600'],
    'Space Grotesk':       ['500', '600', '700'],
    'JetBrains Mono':      ['400', '500'],
    'Archivo':             ['600', '700', '800'],
    'IBM Plex Sans':       ['400', '500', '600'],
    'Bricolage Grotesque': ['500', '600', '700', '800'],
    'DM Mono':             ['400', '500'],
    'Hanken Grotesk':      ['400', '500', '600', '700'],
}

def get(url):
    return urllib.request.urlopen(
        urllib.request.Request(url, headers={'User-Agent': UA}), timeout=45)

root = pathlib.Path('src/fonts')
total = 0
for family, weights in FAMILIES.items():
    slug = family.replace(' ', '')
    out = root / slug
    out.mkdir(parents=True, exist_ok=True)
    css = get(f"https://fonts.googleapis.com/css2?family={family.replace(' ', '+')}"
              f":wght@{';'.join(weights)}&display=swap").read().decode()

    # Blocks are preceded by a /* subset */ comment. Keep only latin.
    blocks = re.findall(r'/\*\s*([\w-]+)\s*\*/\s*@font-face\s*\{(.*?)\}', css, re.S)
    found = {}
    for subset, body in blocks:
        if subset != 'latin':
            continue
        w = re.search(r'font-weight:\s*(\d+)', body)
        u = re.search(r'url\((https://[^)]+\.woff2)\)', body)
        if w and u:
            found[w.group(1)] = u.group(1)

    missing = [w for w in weights if w not in found]
    if missing:
        sys.exit(f"FAILED {family}: no latin block for weight(s) {missing} — refusing to write a partial family")

    for w in weights:
        data = get(found[w]).read()
        if len(data) < 1000:
            sys.exit(f"FAILED {family} {w}: {len(data)} bytes, that is not a font")
        (out / f'{w}.woff2').write_bytes(data)
        total += len(data)
        print(f"  {family:22} {w}  {len(data)//1024:4} KB")

print(f"\n{sum(len(v) for v in FAMILIES.values())} files, {total//1024} KB total")
