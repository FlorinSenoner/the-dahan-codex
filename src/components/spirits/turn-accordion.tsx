import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Text } from '@/components/ui/typography'

interface Turn {
  turn: number
  title?: string
  instructions: string
}

interface TurnAccordionProps {
  turns: Turn[]
}

export function TurnAccordion({ turns }: TurnAccordionProps) {
  // Default all turns to open
  const defaultValues = turns.map((t) => `turn-${t.turn}`)

  return (
    <Accordion className="w-full" defaultValue={defaultValues} type="multiple">
      {turns.map((turn) => (
        <AccordionItem key={turn.turn} value={`turn-${turn.turn}`}>
          <AccordionTrigger className="text-left">
            {turn.title || `Turn ${turn.turn}`}
          </AccordionTrigger>
          <AccordionContent>
            <Text className="text-foreground whitespace-pre-wrap">{turn.instructions}</Text>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
