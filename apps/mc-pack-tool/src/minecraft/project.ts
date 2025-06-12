import { z } from 'zod';

export const ProjectMetadataSchema = z.object({
  name: z.string(),
  version: z.string(),
  assets: z.array(z.string()).default([]),
});

export type ProjectMetadata = z.infer<typeof ProjectMetadataSchema>;
