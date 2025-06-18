import { z } from "zod";

export const PageSchema = z
  .string() // expected type of the page query parameter.
  .transform((val) => Math.max(1, Number(val))) // convert the value to a number and ensure it's at least 1.
  .optional(); // make it optional since it's not required.
