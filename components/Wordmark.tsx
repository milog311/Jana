/**
 * Wordmark in the reference's house style: lowercase, split by a slash,
 * trailed by a catalogue number.
 */
export default function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-1.5 ${className}`}>
      <span className="text-[1.0625rem] font-medium tracking-[-0.02em] lowercase">
        ja<span className="opacity-40">/</span>na
      </span>
      <span className="num font-mono text-[0.625rem] opacity-40">00.00</span>
    </span>
  )
}
