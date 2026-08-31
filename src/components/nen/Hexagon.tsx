/**
 * The Nen hexagon — the chart the tool prints, redrawn for the web.
 *
 * WHY THE GEOMETRY IS COMPUTED, NOT PASTED
 *
 * The hexagon in canon is not decorative: the six categories sit in a fixed
 * cyclic order so that each one's OPPOSITE is exactly three positions away, and
 * every affinity percentage the tool prints is read off that distance
 * (100 / 80 / 60 / 40). If the vertex coordinates were hardcoded, the picture and
 * the arithmetic could drift apart silently — the diagram would keep looking
 * right while claiming a neighbour was an opposite.
 *
 * So `CATEGORIES` is stored in hexagon order and every point on screen is derived
 * from an index. Reordering the array moves the drawing and the affinity table
 * together, or not at all. Same instinct as the tool itself: the reading has to be
 * re-derivable, not asserted.
 *
 * The plotted shape is scaled against the STRONGEST reading rather than against
 * 100%, because a realistic distribution peaks around 40–50% and a 100%-scaled
 * polygon collapses into an unreadable dot near the centre.
 *
 * Server component. No JS ships; the ripple is SMIL and is hidden outright under
 * prefers-reduced-motion rather than merely slowed.
 */

// Hexagon order, clockwise from the top. Opposites are three apart:
// Enhancer↔Specialist (0↔3), Emitter↔Conjurer (1↔4), Manipulator↔Transmuter (2↔5).
// The colours are the tool's own terminal palette, dark-background variants.
export const CATEGORIES = [
  { cat: 'Enhancer', jp: '強化系', colour: '#E58468', pct: 14.6 },
  { cat: 'Emitter', jp: '放出系', colour: '#63BCCE', pct: 1.9 },
  { cat: 'Manipulator', jp: '操作系', colour: '#A292DA', pct: 20.1 },
  { cat: 'Specialist', jp: '特質系', colour: '#DDB55E', pct: 0.0 },
  { cat: 'Conjurer', jp: '具現化系', colour: '#72BE94', pct: 49.0 },
  { cat: 'Transmuter', jp: '変化系', colour: '#DC85B3', pct: 14.4 },
]

const CX = 230
const CY = 182
const R = 122

/** Vertex `i` of the hexagon, optionally pulled in towards the centre. */
function vertex(i: number, scale = 1): [number, number] {
  const a = (Math.PI / 3) * i - Math.PI / 2
  return [CX + Math.cos(a) * R * scale, CY + Math.sin(a) * R * scale]
}

const points = (scale: (i: number) => number) =>
  CATEGORIES.map((_, i) => vertex(i, scale(i)).map((n) => n.toFixed(1)).join(',')).join(' ')

const peak = Math.max(...CATEGORIES.map((c) => c.pct))
const dominant = CATEGORIES.reduce((a, b) => (b.pct > a.pct ? b : a))
const opposite = CATEGORIES[(CATEGORIES.indexOf(dominant) + 3) % 6]

export function NenHexagon() {
  const [ox, oy] = vertex(CATEGORIES.indexOf(dominant))
  const [px, py] = vertex(CATEGORIES.indexOf(opposite))

  return (
    <svg
      viewBox="0 0 460 372"
      role="img"
      aria-label={
        `Hexagon of the six Nen categories. This reading is ${dominant.cat} at ${dominant.pct}%, `
        + `with ${opposite.cat} — its opposite, three positions away — at ${opposite.pct}%.`
      }
      className="mx-auto block h-auto w-full max-w-xl"
    >
      {/* Three concentric guides, so a shape can be read as a proportion. */}
      {[0.33, 0.66, 1].map((s) => (
        <polygon
          key={s}
          points={points(() => s)}
          fill="none"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth={1}
        />
      ))}

      {/* Spokes. */}
      {CATEGORIES.map((c, i) => {
        const [x, y] = vertex(i)
        return (
          <line
            key={c.cat}
            x1={CX}
            y1={CY}
            x2={x}
            y2={y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        )
      })}

      {/* The opposite axis for this reading — the line the affinity is read along. */}
      <line
        x1={ox}
        y1={oy}
        x2={px}
        y2={py}
        stroke={dominant.colour}
        strokeWidth={1}
        strokeDasharray="4 5"
        opacity={0.5}
      />

      {/* The reading itself. */}
      <polygon
        points={points((i) => (peak === 0 ? 0 : CATEGORIES[i].pct / peak))}
        fill={dominant.colour}
        fillOpacity={0.17}
        stroke={dominant.colour}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Each measured point, in its own colour. */}
      {CATEGORIES.map((c, i) => {
        const [x, y] = vertex(i, peak === 0 ? 0 : c.pct / peak)
        return <circle key={c.cat} cx={x} cy={y} r={c === dominant ? 5 : 3} fill={c.colour} />
      })}

      {/* The water. Aura channelled into the glass; the ripple is the tell. */}
      <circle cx={CX} cy={CY} r={3.5} fill="rgba(255,255,255,0.5)" />
      <circle
        cx={CX}
        cy={CY}
        r={4}
        fill="none"
        stroke={dominant.colour}
        strokeWidth={1.5}
        className="motion-reduce:hidden"
      >
        <animate attributeName="r" values="4;34" dur="3.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.85;0" dur="3.6s" repeatCount="indefinite" />
      </circle>

      {/* Labels. Anchored off the sign of the vertex so nothing overruns the box. */}
      {CATEGORIES.map((c, i) => {
        const [x, y] = vertex(i)
        const right = x > CX + 1
        const left = x < CX - 1
        const anchor = right ? 'start' : left ? 'end' : 'middle'
        const lx = right ? x + 14 : left ? x - 14 : x
        const ly = i === 0 ? y - 20 : i === 3 ? y + 26 : y - 3
        return (
          <text key={c.cat} x={lx} y={ly} textAnchor={anchor} fontSize={12.5}>
            <tspan fill={c.colour} fontWeight={600}>
              {c.cat.toLowerCase()}
            </tspan>
            <tspan x={lx} dy={16} fill="#71717a" fontSize={11}>
              {c.jp} · {c.pct.toFixed(1)}%
            </tspan>
          </text>
        )
      })}
    </svg>
  )
}

/**
 * The same numbers as a bar chart.
 *
 * The hexagon shows the SHAPE of a reading — which side of the wheel you sit on.
 * The bars show the MARGIN, which is the part that decides whether a verdict is
 * worth anything: 49 / 20 is a result, 21 / 20 is a coin toss wearing a costume.
 * Neither view carries both, so the page carries both views.
 */
export function NenBars() {
  const ordered = [...CATEGORIES].sort((a, b) => b.pct - a.pct)
  return (
    <div className="space-y-3">
      {ordered.map((c) => (
        <div key={c.cat} className="flex items-center gap-3">
          <span className="w-28 shrink-0 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {c.cat}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full"
              style={{ width: `${(c.pct / peak) * 100}%`, backgroundColor: c.colour }}
            />
          </div>
          <span
            className="w-14 shrink-0 text-right font-mono text-xs tabular-nums"
            style={{ color: c === dominant ? c.colour : '#71717a' }}
          >
            {c.pct.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  )
}
