import { z } from "zod";

const turnSchema = z.object({
  turn: z.number().min(1),
  title: z.string().optional(),
  instructions: z.string().min(1, "Instructions are required"),
  notes: z.string().optional(),
});

export const openingFormSchema = z.object({
  spiritId: z.string().min(1, "Spirit is required"),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(50, "Slug too long")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers, and hyphens only",
    ),
  description: z
    .string()
    .max(500, "Description too long")
    .optional()
    .or(z.literal("")),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  turns: z.array(turnSchema).min(1, "At least one turn is required"),
  author: z
    .string()
    .max(100, "Author name too long")
    .optional()
    .or(z.literal("")),
  sourceUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type OpeningFormData = z.infer<typeof openingFormSchema>;
