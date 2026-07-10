import { Search } from 'lucide-react'

interface SpiritSearchProps {
  value: string
  onChange: (value: string) => void
}

export function SpiritSearch({ value, onChange }: SpiritSearchProps) {
  const inputId = 'spirit-search-input'

  return (
    <div className="relative">
      <label className="sr-only" htmlFor={inputId}>
        Search spirits
      </label>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        aria-label="Search spirits"
        autoComplete="off"
        className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        id={inputId}
        name="spirit-search"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search spirits..."
        type="search"
        value={value}
      />
    </div>
  )
}
