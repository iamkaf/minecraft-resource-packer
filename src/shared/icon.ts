import { z } from 'zod';

export const IconOptionsSchema = z.object({
  item: z.string().optional(),
  bgColor: z.string().optional(),
  borderColor: z.string().default('#000'),
  data: z.string().optional(),
});

export type IconOptions = z.infer<typeof IconOptionsSchema>;
