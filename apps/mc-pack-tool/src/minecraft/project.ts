import { z } from 'zod';

export const ProjectMetadataSchema = z.object({
  name: z.string(),
  version: z.string(),
  assets: z.array(z.string()).default([]),
  lastOpened: z.number().optional(),
});

export type ProjectMetadata = z.infer<typeof ProjectMetadataSchema>;
