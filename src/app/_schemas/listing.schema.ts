import { z } from "zod";

export const ListingFilterSchema = z.object({
  q: z.string().optional(),
  minRent: z.string().optional(),
  maxRent: z.string().optional(),
  roomType: z.string().optional(),
  genderPolicy: z.string().optional(),
  curfew: z.string().optional(),
  laundry: z.string().optional(),
  caretaker: z.string().optional(),
  kitchen: z.string().optional(),
  wifi: z.string().optional(),
  pets: z.string().optional(),
  utilities: z.string().optional(),
  sortBy: z.string().optional(),
});
