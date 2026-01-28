import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Text } from "@/components/ui/typography";

interface Turn {
  turn: number;
  title?: string;
  instructions: string;
  notes?: string;
}

interface TurnAccordionProps {
  turns: Turn[];
}

export function TurnAccordion({ turns }: TurnAccordionProps) {
  // Default all turns to open
  const defaultValues = turns.map((t) => `turn-${t.turn}`);

  return (
    <Accordion type="multiple" defaultValue={defaultValues} className="w-full">
      {turns.map((turn) => (
        <AccordionItem key={turn.turn} value={`turn-${turn.turn}`}>
          <AccordionTrigger className="text-left">
            {turn.title || `Turn ${turn.turn}`}
          </AccordionTrigger>
          <AccordionContent>
            <Text className="text-foreground whitespace-pre-wrap">
              {turn.instructions}
            </Text>
            {turn.notes && (
              <Text variant="muted" className="mt-3 text-sm italic">
                {turn.notes}
              </Text>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
