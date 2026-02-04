import { Search } from 'lucide-react'

interface SpiritSearchProps {
  value: string
  onChange: (value: string) => void
}

export function SpiritSearch({ value, onChange }: SpiritSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search spirits..."
        type="search"
        value={value}
      />
    </div>
  )
}
