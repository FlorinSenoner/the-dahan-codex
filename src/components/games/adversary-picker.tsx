import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePublicSnapshot } from '@/data/public-snapshot'
import {
  selectAdversaryById,
  selectAdversaryByName,
  selectAdversaryLevelDifficulty,
  selectAdversaryList,
} from '@/lib/reference-selectors'
import type { GameCreateInput } from '@/types/convex'

const ADVERSARY_LEVELS = [0, 1, 2, 3, 4, 5, 6] as const

type AdversaryRefInput = NonNullable<GameCreateInput['adversaryRef']>

export interface AdversarySelection {
  adversaryId?: AdversaryRefInput['adversaryId'] | null
  name: string
  level: AdversaryRefInput['level']
  difficulty?: number
}

interface AdversaryPickerProps {
  value: AdversarySelection | null
  onChange: (adversary: AdversarySelection | null) => void
  placeholder?: string
}

export function AdversaryPicker({
  value,
  onChange,
  placeholder = 'Select adversary...',
}: AdversaryPickerProps) {
  const snapshot = usePublicSnapshot()
  const adversaries = snapshot ? selectAdversaryList(snapshot) : []
  const selectedAdversary =
    snapshot && value?.adversaryId
      ? selectAdversaryById(snapshot, value.adversaryId)
      : snapshot && value?.name
        ? selectAdversaryByName(snapshot, value.name)
        : null
  const selectedName = selectedAdversary?.name ?? value?.name ?? ''

  const buildSelection = (
    name: string,
    level: number,
    currentId?: AdversaryRefInput['adversaryId'] | null,
    currentDifficulty?: number,
  ): AdversarySelection => {
    const selected = snapshot ? selectAdversaryByName(snapshot, name) : null
    const difficulty = selected
      ? level === 0
        ? selected.baseDifficulty
        : (selectAdversaryLevelDifficulty(selected, level) ?? currentDifficulty ?? level)
      : (currentDifficulty ?? level)

    return {
      adversaryId: selected?._id ?? currentId ?? null,
      name: selected?.name ?? name,
      level,
      difficulty,
    }
  }

  const handleNameChange = (name: string) => {
    onChange(buildSelection(name, value?.level ?? 0, value?.adversaryId, value?.difficulty))
  }

  const handleLevelChange = (levelStr: string) => {
    const name = selectedName || value?.name || ''
    onChange(buildSelection(name, Number(levelStr), value?.adversaryId, value?.difficulty))
  }

  return (
    <div className="flex gap-2 items-center">
      <Select disabled={!snapshot} onValueChange={handleNameChange} value={selectedName}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {!snapshot ? (
            <SelectItem disabled value="__loading__">
              Loading adversaries...
            </SelectItem>
          ) : adversaries.length === 0 ? (
            <SelectItem disabled value="__empty__">
              No adversaries available
            </SelectItem>
          ) : (
            adversaries.map((adv) => (
              <SelectItem key={adv._id} value={adv.name}>
                {adv.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {(value?.adversaryId || value?.name) && (
        <>
          <Select onValueChange={handleLevelChange} value={String(value.level)}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ADVERSARY_LEVELS.map((l) => (
                <SelectItem key={l} value={String(l)}>
                  L{l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            aria-label="Clear adversary"
            onClick={() => onChange(null)}
            size="icon"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )
}
