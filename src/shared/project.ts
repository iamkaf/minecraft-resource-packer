import { z } from 'zod';

export const ProjectMetadataSchema = z.object({
  name: z.string(),
  version: z.string(),
  assets: z.array(z.string()).default([]),
  noExport: z.array(z.string()).default([]),
  lastOpened: z.number().optional(),
  description: z.string().default(''),
  author: z.string().default(''),
  urls: z.array(z.string()).default([]),
  created: z.number().optional(),
  updated: z.number().optional(),
  license: z.string().default(''),
});

export type ProjectMetadata = z.infer<typeof ProjectMetadataSchema>;

export const PackMetaSchema = z.object({
  description: z.string().default(''),
  author: z.string().default(''),
  urls: z.array(z.string()).default([]),
  created: z.number().optional(),
  updated: z.number().optional(),
  license: z.string().default(''),
});

export type PackMeta = z.infer<typeof PackMetaSchema>;
