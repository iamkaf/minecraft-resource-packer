/**
 * Resolve a Minecraft resource location to the custom vanilla:// protocol path.
 * @param modelType - Item or block model type.
 * @param mcPath - Resource location such as "minecraft:stone".
 * @returns Vanilla protocol URL for use in image sources.
 */
export default function getTexture(
  modelType: 'item' | 'block',
  mcPath: string
): string {
  const id = mcPath.replace(/^minecraft:/, '').replace(/^\//, '');
  const clean = id.replace(/^block\//, '').replace(/^item\//, '');
  return `vanilla://${modelType}/${clean}`;
}
