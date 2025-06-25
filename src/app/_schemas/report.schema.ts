import { z } from "zod";

export const ReportFormSchema = z.object({
  reasons: z
    .array(z.string())
    .min(1, "Please select at least one reason for reporting"),
  additionalDetails: z
    .string()
    .max(500, "Additional details cannot exceed 500 characters")
    .optional(),
});

// Infer TypeScript type from schema
export type ReportFormData = z.infer<typeof ReportFormSchema>;
