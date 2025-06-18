import { z } from 'zod';

export const ProjectMetadataSchema = z.object({
  name: z.string(),
  minecraft_version: z.string(),
  version: z.string().default('1.0.0'),
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

/** Create a default project metadata object. */
export function createDefaultProjectMeta(
  name: string,
  minecraftVersion: string
): ProjectMetadata {
  return ProjectMetadataSchema.parse({
    name,
    minecraft_version: minecraftVersion,
    created: Date.now(),
    lastOpened: Date.now(),
  });
}

export const PackMetaSchema = z.object({
  version: z.string().default('unknown'),
  description: z.string().default(''),
  author: z.string().default(''),
  urls: z.array(z.string()).default([]),
  created: z.number().optional(),
  updated: z.number().optional(),
  license: z.string().default(''),
});

export type PackMeta = z.infer<typeof PackMetaSchema>;
