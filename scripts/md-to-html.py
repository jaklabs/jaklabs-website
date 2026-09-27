"""Markdown -> the HTML the blog renderer expects.

WHY THIS EXISTS

Nine of the sixteen published posts were stored as raw markdown. The renderer
emits stored content as HTML, so readers saw the syntax: 78 literal ** and 6
literal ## on one page, and 10 stray ``` fences on another. The other seven
posts were HTML, so the table held two formats and only one of them worked.

ORDER IS THE WHOLE TRICK. Fenced and inline code are lifted out to placeholders
BEFORE any inline rule runs, and restored at the end. Convert in the other order
and the ** inside a code sample becomes <strong>, silently corrupting the one
part of a post a reader is most likely to copy.

Tags are limited to what the existing HTML posts already use -- p, h2, h3,
strong, em, code, pre, a, ul, li, blockquote, hr -- so nothing renders unstyled.
"""
import html
import re


def convert(md: str) -> str:
    blocks: list[str] = []

    def stash(payload: str) -> str:
        blocks.append(payload)
        return f'\x00BLOCK{len(blocks) - 1}\x00'

    # 1. fenced code, before anything can touch its contents.
    #    The placeholder is padded with blank lines so the block splitter below
    #    still sees it as its own block -- without that, the fence swallows the
    #    separator and the next list or paragraph is absorbed into the <pre>.
    def fence(m):
        body = m.group(1).rstrip('\n')
        return '\n\n' + stash(f'<pre><code>{html.escape(body)}</code></pre>') + '\n\n'
    md = re.sub(r'(?m)^```[^\n]*\n(.*?)\n?^```[ \t]*$', fence, md, flags=re.S)

    # An UNCLOSED fence. Not hypothetical: one published post is truncated
    # mid-regex, so its last fence never closes. Left alone the ``` renders as
    # literal text, which reads as a different bug than the real one. Closing it
    # here does not repair the post -- it still ends mid-sentence -- it just
    # stops a truncation from also looking like broken markup.
    md = re.sub(r'(?ms)^```[^\n]*\n(.*)\Z', fence, md)

    # 2. inline code, same reason
    md = re.sub(r'`([^`\n]+)`', lambda m: stash(f'<code>{html.escape(m.group(1))}</code>'), md)

    out = []
    for block in re.split(r'\n\s*\n', md):
        b = block.strip()
        if not b:
            continue
        if b.startswith('\x00BLOCK') and b.endswith('\x00') and b.count('\x00') == 2:
            out.append(b)
            continue
        if re.fullmatch(r'-{3,}', b):
            out.append('<hr>')
            continue
        if re.match(r'(?m)^[-*] ', b):
            items = [re.sub(r'^[-*] ', '', l).strip() for l in b.split('\n') if l.strip()]
            out.append('<ul>\n' + '\n'.join(f'  <li>{i}</li>' for i in items) + '\n</ul>')
            continue
        if b.startswith('> '):
            inner = ' '.join(l.lstrip('> ').strip() for l in b.split('\n'))
            out.append(f'<blockquote><p>{inner}</p></blockquote>')
            continue
        flat = ' '.join(l.strip() for l in b.split('\n'))
        if flat.startswith('### '):
            out.append(f'<h3>{flat[4:]}</h3>')
        elif flat.startswith('## '):
            out.append(f'<h2>{flat[3:]}</h2>')
        elif flat.startswith('# '):
            out.append(f'<h2>{flat[2:]}</h2>')      # never a second <h1>; the page has one
        else:
            out.append(f'<p>{flat}</p>')

    doc = '\n\n'.join(out)

    # 3. inline rules, now that code is safely out of reach
    doc = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', doc)
    doc = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', doc, flags=re.S)
    doc = re.sub(r'(?<![*\w])\*([^*\n]+?)\*(?![*\w])', r'<em>\1</em>', doc)

    # 4. put the code back
    for i, payload in enumerate(blocks):
        doc = doc.replace(f'\x00BLOCK{i}\x00', payload)
    return doc


def residue(doc: str) -> list[str]:
    """Markdown that survived conversion. Anything here would render as text."""
    outside = re.sub(r'<pre><code>.*?</code></pre>|<code>.*?</code>', '', doc, flags=re.S)
    found = []
    for name, pat in (('bold', r'\*\*'), ('heading', r'(?m)^#{1,6} '),
                      ('fence', r'```'), ('link', r'\[[^\]]+\]\([^)]+\)')):
        if re.search(pat, outside):
            found.append(name)
    return found
