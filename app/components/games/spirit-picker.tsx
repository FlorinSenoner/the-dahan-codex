import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface SpiritPickerProps {
  value: Id<"spirits"> | null;
  onChange: (
    spiritId: Id<"spirits">,
    spiritName: string,
    variant?: string,
  ) => void;
  placeholder?: string;
}

export function SpiritPicker({
  value,
  onChange,
  placeholder = "Select spirit...",
}: SpiritPickerProps) {
  const [open, setOpen] = React.useState(false);

  // Fetch all spirits for the picker
  const { data: spirits } = useSuspenseQuery(
    convexQuery(api.spirits.listSpirits, {}),
  );

  const selected = spirits.find((s) => s._id === value);

  const getDisplayName = (spirit: (typeof spirits)[number]) => {
    if (spirit.aspectName) {
      return `${spirit.name} (${spirit.aspectName})`;
    }
    return spirit.name;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected ? getDisplayName(selected) : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search spirits..." />
          <CommandList>
            <CommandEmpty>No spirit found.</CommandEmpty>
            <CommandGroup>
              {spirits.map((spirit) => (
                <CommandItem
                  key={spirit._id}
                  value={getDisplayName(spirit)}
                  onSelect={() => {
                    onChange(spirit._id, spirit.name, spirit.aspectName);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === spirit._id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {getDisplayName(spirit)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
