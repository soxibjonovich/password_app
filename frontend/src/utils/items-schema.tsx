import { z } from "zod"

export const schema = z.object({
  id: z.number(),
  name: z.string(),
  barcode: z.string(),
  stock_quantity: z.number(),
  stock_quantity_type: z.string(),
  price: z.number(),
  category: z.string(),
  created_at: z.string(),
})