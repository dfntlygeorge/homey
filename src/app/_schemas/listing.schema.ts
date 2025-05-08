import { z } from "zod";

export const ListingFilterSchema = z.object({
  q: z.string().optional(),
  minRent: z.string().optional(),
  maxRent: z.string().optional(),
  roomType: z.string().optional(),
  genderPolicy: z.string().optional(),
});
