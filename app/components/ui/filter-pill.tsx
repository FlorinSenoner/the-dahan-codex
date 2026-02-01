import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterPillProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  selectedClass?: string;
  unselectedClass?: string;
  children?: React.ReactNode;
}

export function FilterPill({
  label,
  selected,
  onClick,
  selectedClass,
  unselectedClass,
  children,
}: FilterPillProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn(
        "h-auto px-3 py-1.5 rounded-full text-sm font-medium",
        selected
          ? selectedClass || "bg-primary text-primary-foreground border-primary"
          : unselectedClass ||
              "bg-muted/30 text-foreground border-border hover:bg-muted/50",
      )}
    >
      {label}
      {children}
    </Button>
  );
}
