import { z } from 'zod';
/* c8 ignore start */
export interface TextureEditOptions {
  rotate?: number;
  hue?: number;
  grayscale?: boolean;
  saturation?: number;
  brightness?: number;
}

export const ImageEditOperationSchema = z.discriminatedUnion('op', [
  z.object({ op: z.literal('rotate'), angle: z.number() }),
  z.object({ op: z.literal('flipX') }),
  z.object({ op: z.literal('flipY') }),
  z.object({ op: z.literal('scale'), factor: z.number().positive() }),
  z.object({
    op: z.literal('crop'),
    left: z.number(),
    top: z.number(),
    width: z.number(),
    height: z.number(),
  }),
  z.object({
    op: z.literal('text'),
    text: z.string(),
    left: z.number(),
    top: z.number(),
  }),
  z.object({
    op: z.literal('brush'),
    path: z.array(z.tuple([z.number(), z.number()])),
  }),
]);
export type ImageEditOperation = z.infer<typeof ImageEditOperationSchema>;
/* c8 ignore end */
