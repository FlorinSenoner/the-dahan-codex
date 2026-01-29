import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { type OpeningFormData, openingFormSchema } from "@/lib/schemas/opening";

interface Spirit {
  _id: string;
  name: string;
  aspectName?: string;
}

interface OpeningFormProps {
  defaultValues?: Partial<OpeningFormData>;
  onSubmit: (data: OpeningFormData) => Promise<void>;
  spirits: Spirit[];
  isSubmitting?: boolean;
}

export function OpeningForm({
  defaultValues,
  onSubmit,
  spirits,
  isSubmitting = false,
}: OpeningFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OpeningFormData>({
    resolver: zodResolver(openingFormSchema),
    defaultValues: {
      turns: [{ turn: 1, instructions: "", title: "", notes: "" }],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "turns",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Spirit selector */}
      <div className="space-y-2">
        <label
          htmlFor="spiritId"
          className="text-sm font-medium text-foreground"
        >
          Spirit
        </label>
        <select
          id="spiritId"
          {...register("spiritId")}
          className="w-full border border-border rounded-md p-2 bg-background text-foreground"
        >
          <option value="">Select spirit...</option>
          {spirits.map((spirit) => (
            <option key={spirit._id} value={spirit._id}>
              {spirit.name}
              {spirit.aspectName ? ` (${spirit.aspectName})` : ""}
            </option>
          ))}
        </select>
        {errors.spiritId?.message && (
          <p className="text-sm text-destructive mt-1">
            {errors.spiritId.message}
          </p>
        )}
      </div>

      {/* Name and Slug fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="w-full border border-border rounded-md p-2 bg-background text-foreground"
          />
          {errors.name?.message && (
            <p className="text-sm text-destructive mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium text-foreground">
            Slug
          </label>
          <input
            id="slug"
            type="text"
            {...register("slug")}
            placeholder="lowercase-with-hyphens"
            className="w-full border border-border rounded-md p-2 bg-background text-foreground"
          />
          {errors.slug?.message && (
            <p className="text-sm text-destructive mt-1">
              {errors.slug.message}
            </p>
          )}
        </div>
      </div>

      {/* Description field */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-foreground"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          placeholder="Brief strategy summary (optional)"
          rows={3}
          className="w-full border border-border rounded-md p-2 bg-background text-foreground"
        />
        {errors.description?.message && (
          <p className="text-sm text-destructive mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Difficulty selector */}
      <div className="space-y-2">
        <label
          htmlFor="difficulty"
          className="text-sm font-medium text-foreground"
        >
          Difficulty
        </label>
        <select
          id="difficulty"
          {...register("difficulty")}
          className="w-full border border-border rounded-md p-2 bg-background text-foreground"
        >
          <option value="">Select difficulty (optional)</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Turns section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Turns</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                turn: fields.length + 1,
                instructions: "",
                title: "",
                notes: "",
              })
            }
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Turn
          </Button>
        </div>

        {errors.turns?.message && (
          <p className="text-sm text-destructive">{errors.turns.message}</p>
        )}

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border border-border rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Turn {index + 1}</h4>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  aria-label={`Remove turn ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>

            {/* Hidden turn number */}
            <input
              type="hidden"
              {...register(`turns.${index}.turn`, { valueAsNumber: true })}
              value={index + 1}
            />

            {/* Title input (optional) */}
            <div className="space-y-2">
              <label
                htmlFor={`turns.${index}.title`}
                className="text-sm font-medium text-foreground"
              >
                Title (optional)
              </label>
              <input
                id={`turns.${index}.title`}
                type="text"
                {...register(`turns.${index}.title`)}
                placeholder="e.g., Setup, Initial Expansion"
                className="w-full border border-border rounded-md p-2 bg-background text-foreground"
              />
            </div>

            {/* Instructions textarea (required) */}
            <div className="space-y-2">
              <label
                htmlFor={`turns.${index}.instructions`}
                className="text-sm font-medium text-foreground"
              >
                Instructions
              </label>
              <textarea
                id={`turns.${index}.instructions`}
                {...register(`turns.${index}.instructions`)}
                placeholder="Describe the actions for this turn..."
                rows={4}
                className="w-full border border-border rounded-md p-2 bg-background text-foreground"
              />
              {errors.turns?.[index]?.instructions?.message && (
                <p className="text-sm text-destructive mt-1">
                  {errors.turns[index]?.instructions?.message}
                </p>
              )}
            </div>

            {/* Notes textarea (optional) */}
            <div className="space-y-2">
              <label
                htmlFor={`turns.${index}.notes`}
                className="text-sm font-medium text-foreground"
              >
                Notes (optional)
              </label>
              <textarea
                id={`turns.${index}.notes`}
                {...register(`turns.${index}.notes`)}
                placeholder="Additional tips or context..."
                rows={2}
                className="w-full border border-border rounded-md p-2 bg-background text-foreground"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Attribution section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="author"
            className="text-sm font-medium text-foreground"
          >
            Author (optional)
          </label>
          <input
            id="author"
            type="text"
            {...register("author")}
            className="w-full border border-border rounded-md p-2 bg-background text-foreground"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="sourceUrl"
            className="text-sm font-medium text-foreground"
          >
            Source URL (optional)
          </label>
          <input
            id="sourceUrl"
            type="url"
            {...register("sourceUrl")}
            placeholder="https://..."
            className="w-full border border-border rounded-md p-2 bg-background text-foreground"
          />
          {errors.sourceUrl?.message && (
            <p className="text-sm text-destructive mt-1">
              {errors.sourceUrl.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit button */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : "Save Opening"}
      </Button>
    </form>
  );
}
