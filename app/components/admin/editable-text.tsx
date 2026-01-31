import { cn } from "@/lib/utils";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  displayClassName?: string;
  required?: boolean;
}

export function EditableText({
  value,
  onChange,
  isEditing,
  multiline = false,
  placeholder,
  className,
  displayClassName,
  required = false,
}: EditableTextProps) {
  if (!isEditing) {
    return (
      <span className={cn("text-foreground", displayClassName)}>
        {value || (
          <span className="text-muted-foreground italic">
            {placeholder || "Empty"}
          </span>
        )}
      </span>
    );
  }

  const showError = required && !value.trim();

  const inputClassName = cn(
    "w-full bg-muted/30 border rounded px-2 py-1",
    "focus:ring-1 focus:outline-none",
    "text-foreground placeholder:text-muted-foreground",
    showError
      ? "border-destructive focus:border-destructive focus:ring-destructive/50"
      : "border-primary/30 focus:border-primary focus:ring-primary/50",
    className,
  );

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputClassName, "min-h-[100px] resize-y")}
        placeholder={placeholder}
        required={required}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputClassName}
      placeholder={placeholder}
      required={required}
    />
  );
}
