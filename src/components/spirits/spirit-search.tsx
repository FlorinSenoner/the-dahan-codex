import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface SpiritSearchProps {
  value: string
  onChange: (value: string) => void
}

export function SpiritSearch({ value, onChange }: SpiritSearchProps) {
  const [localValue, setLocalValue] = useState(value)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  // Sync prop → local state (initial load, back navigation, external clear)
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (newValue: string) => {
    setLocalValue(newValue)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onChange(newValue), 300)
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search spirits..."
        type="search"
        value={localValue}
      />
    </div>
  )
}
