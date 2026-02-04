import { useNavigate } from '@tanstack/react-router'
import { Filter } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { FilterPill } from '@/components/ui/filter-pill'
import { complexityFilterColors, elementFilterColors } from '@/lib/spirit-colors'

// Filter options
const COMPLEXITY_OPTIONS = ['Low', 'Moderate', 'High', 'Very High'] as const
const ELEMENT_OPTIONS = ['Sun', 'Moon', 'Fire', 'Air', 'Water', 'Earth', 'Plant', 'Animal'] as const

interface FilterSheetProps {
  currentFilters: {
    complexity?: string[]
    elements?: string[]
  }
  activeCount: number
}

export function FilterSheet({ currentFilters, activeCount }: FilterSheetProps) {
  const navigate = useNavigate({ from: '/spirits/' })
  const [open, setOpen] = useState(false)

  // Local state for pending filter changes
  const [pendingComplexity, setPendingComplexity] = useState<string[]>(
    currentFilters.complexity || [],
  )
  const [pendingElements, setPendingElements] = useState<string[]>(currentFilters.elements || [])

  // Reset pending state when drawer opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setPendingComplexity(currentFilters.complexity || [])
      setPendingElements(currentFilters.elements || [])
    }
    setOpen(isOpen)
  }

  // Toggle a filter option
  const toggleComplexity = (value: string) => {
    setPendingComplexity((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const toggleElement = (value: string) => {
    setPendingElements((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  // Apply filters
  const applyFilters = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        complexity: pendingComplexity.length > 0 ? pendingComplexity : undefined,
        elements: pendingElements.length > 0 ? pendingElements : undefined,
      }),
      replace: true,
    })
    setOpen(false)
  }

  const pendingCount = pendingComplexity.length + pendingElements.length

  return (
    <Drawer onOpenChange={handleOpenChange} open={open}>
      <DrawerTrigger asChild>
        <Button
          aria-label="Filter"
          className="relative min-w-[44px] min-h-[44px]"
          size="icon"
          variant="outline"
        >
          <Filter className="h-4 w-4" />
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
              {activeCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <DrawerTitle className="font-headline">Filter Spirits</DrawerTitle>
            {pendingCount > 0 && (
              <Button
                className="text-muted-foreground"
                onClick={() => {
                  setPendingComplexity([])
                  setPendingElements([])
                }}
                size="sm"
                variant="ghost"
              >
                Clear all
              </Button>
            )}
          </div>
        </DrawerHeader>

        <div className="px-4 py-6 space-y-6 overflow-y-auto" data-vaul-no-drag>
          {/* Complexity filter */}
          <div>
            <h3 className="font-headline font-medium text-sm text-foreground mb-3">Complexity</h3>
            <div className="flex flex-wrap gap-2">
              {COMPLEXITY_OPTIONS.map((option) => (
                <FilterPill
                  key={option}
                  label={option}
                  onClick={() => toggleComplexity(option)}
                  selected={pendingComplexity.includes(option)}
                  selectedClass={complexityFilterColors[option].selected}
                  unselectedClass={complexityFilterColors[option].unselected}
                />
              ))}
            </div>
          </div>

          {/* Elements filter */}
          <div>
            <h3 className="font-headline font-medium text-sm text-foreground mb-3">Elements</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Spirit must have ALL selected elements
            </p>
            <div className="flex flex-wrap gap-2">
              {ELEMENT_OPTIONS.map((option) => (
                <FilterPill
                  key={option}
                  label={option}
                  onClick={() => toggleElement(option)}
                  selected={pendingElements.includes(option)}
                  selectedClass={elementFilterColors[option].selected}
                  unselectedClass={elementFilterColors[option].unselected}
                />
              ))}
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t border-border">
          <div className="flex gap-3">
            <DrawerClose asChild>
              <Button className="flex-1" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
            <Button className="flex-1" onClick={applyFilters}>
              Apply Filters
              {pendingCount > 0 && ` (${pendingCount})`}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
