/** The reference's scrolling promo strip, repurposed as a credibility ticker. */
export default function Ticker({ items }: { items: string[] }) {
  const run = [...items, ...items, ...items, ...items]

  return (
    <div className="overflow-hidden border-b border-line-dark bg-ink py-2.5 text-paper">
      <div className="ticker-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {run.map((item, index) => (
              <span
                key={`${copy}-${index}`}
                className="label num flex items-center whitespace-nowrap px-5 text-paper/70"
              >
                {item}
                <span className="ml-5 text-paper/25">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
