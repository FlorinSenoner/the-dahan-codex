import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SCENARIOS } from '@/lib/game-data'

interface ScenarioPickerProps {
  value: { name: string; difficulty?: number } | null
  onChange: (scenario: { name: string; difficulty?: number } | null) => void
  placeholder?: string
}

export function ScenarioPicker({
  value,
  onChange,
  placeholder = 'Select scenario...',
}: ScenarioPickerProps) {
  const handleChange = (name: string) => {
    const scenario = SCENARIOS.find((s) => s.name === name)
    if (scenario) {
      onChange({
        name: scenario.name,
        difficulty: scenario.difficulty > 0 ? scenario.difficulty : undefined,
      })
    }
  }

  const showClear = value?.name && value.name !== 'No Scenario'

  return (
    <div className="flex gap-2 items-center">
      <Select onValueChange={handleChange} value={value?.name ?? ''}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {SCENARIOS.map((scenario) => (
            <SelectItem key={scenario.name} value={scenario.name}>
              {scenario.name}
              {scenario.difficulty > 0 && ` (+${scenario.difficulty})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showClear && (
        <Button
          aria-label="Clear scenario"
          onClick={() => onChange(null)}
          size="icon"
          variant="ghost"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
