# Minecraft Resource Pack Format Changelog

This document outlines the significant changes for each resource pack format version in Minecraft: Java Edition. Changes from development snapshots are generally attributed to the pack format version they belong to, or the subsequent release if the format version itself was not part of a final release.

---

## Pack Format 1

**Releases:** 1.6.1 – 1.8.9

**Significant Changes:**
- First implementation of the resource pack system. See [Java Edition 1.6.1/Resource pack changes](https://minecraft.wiki/w/Java_Edition_1.6.1/Resource_pack_changes) for the list of file names changed.

---

## Pack Format 2

**Releases:** 1.9 – 1.10.2

**Significant Changes:**
- Changes in the [model](https://minecraft.wiki/w/Model) system, such as [item tags](https://minecraft.wiki/w/Model#Item_tags), [multipart](https://minecraft.wiki/w/Model#Block_states), and changes to display tags.

---

## Pack Format 3

**Releases:** 1.11 – 1.12.2

**Significant Changes:**
- Now requires lowercase file names for all files in the resource pack.

---

## Pack Format 4

**Releases:** 1.13 – 1.14.4

**Significant Changes:**
- Most of the block and item textures have been renamed. See [Java Edition 1.13/Resource pack changes](https://minecraft.wiki/w/Java_Edition_1.13/Resource_pack_changes) for the list of file names changed. The resource pack folder `textures/blocks` got renamed to `textures/block`.The resource pack folder `textures/items` got renamed to `textures/item`.

---

## Pack Format 5

**Releases:** 1.15 – 1.16.1

**Significant Changes:**
- Changed texture mappings with all chests, banner and shield patterns now use alpha channels. The [ender dragon](https://minecraft.wiki/w/Ender_dragon) no longer has a separate texture for the bottom of its wing. The glint texture for [enchanted](https://minecraft.wiki/w/Enchant) [items](https://minecraft.wiki/w/Item) now appears like it does in-game. The game now supports conversion with some of version 4 resource packs' outdated textures to the newer ones.Increased the size limit for the client-side downloading of resource packs from 50 MB to 100 MB.

---

## Pack Format 6

**Releases:** 1.16.2 – 1.16.5

**Significant Changes:**
- Fixed MC-197275 — Due to changes to walls, `pack_format: 5` is no longer cross-compatible between 1.15 and 1.16.

---

## Pack Format 7

**Releases:** 1.17 – 1.17.1

**Significant Changes:**
- [Drowned](https://minecraft.wiki/w/Drowned) texture mirroring has changed, Grass path has been renamed to dirt path. Slots for the game mode selector are now 26 pixels instead of 25.

---

## Pack Format 8

**Releases:** 1.18 – 1.18.2

**Significant Changes:**
- [inventory.png](https://minecraft.wiki/w/Inventory.png) now contains an extra sprite for a thin-layout version of the effect list in the inventory.

---

## Pack Format 9

**Releases:** 1.19 – 1.19.2

**Significant Changes:**
- Resource pack can have a `filter` section in `pack.mcmeta` now.

---

## Pack Format 11 (Development Snapshots (leading to 1.19.3))

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Removed "fixers" for resource packs with a `pack_format` value of `3` and `4` (pre-flattening);the game will no longer try to adapt packs with those values to the current version.

---

## Pack Format 12

**Releases:** 1.19.3

**Significant Changes:**
- The model and textures of the vex have been updated. `tabs.png` is now skinnier by 2 pixels, with the 7th tab being added to it. Resource packs can have configuration files now, located in the new `atlases` directory, that control which images are included in the atlases. Block and item textures are now loaded before they are processed by block and item models.

---

## Pack Format 13

**Releases:** 1.19.4

**Significant Changes:**
- The enchantment glint now has two separate texture files: `enchanted_glint_entity.png` and `enchanted_glint_item.png`.The former smithing table GUI texture has been renamed to `legacy_smithing.png` in preparations for [Java Edition 1.20](https://minecraft.wiki/w/Java_Edition_1.20), where the new smithing GUI texture is named as `smithing.png` instead, superseding the previous, similarly-named texture.

---

## Pack Format 14 (Development Snapshots (leading to 1.20 – 1.20.1))

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Updated the sprite layout of `minecraft.png` and `invite_icon.png`. `minecraft.png` logo has been reworked to be high quality and is no longer split across 2 rows.

---

## Pack Format 15

**Releases:** 1.20 – 1.20.1

**Significant Changes:**
- `legacy_unicode` glyph provider has been removed. Bitmaps used by `uniform` font have been removed.`uniform` font has been updated to use Unifont 15.0.01, where it changes shape of multiple characters, while also adding support for new ones, and combining characters no longer include circle overlayed over them. Added second level of organization of entries in credits.json on top of `titles`, called `disciplines`.

---

## Pack Format 16 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Pack metadata now includes an optional field `supported_formats` which describes a range for pack formats that this pack supports. Packs can now contain overlay directories ("overlays").

---

## Pack Format 17 (Development Snapshots (leading to 1.20.2))

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- The text field background is now a nine-sliced sprite at `widget/text_field`, and `widget/text_field_highlighted`. The scroll bar in lists and text fields is now a nine-sliced sprite at `widget/scroller`. Added new village structure icons to `map_icons.png`.

---

## Pack Format 18

**Releases:** 1.20.2

**Significant Changes:**
- No specific changes listed.

---

## Pack Format 19 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Added block model, item model and block state definitions for [Crafter](https://minecraft.wiki/w/Crafter). Associated GUI slot texture and sprites have also been added as well.

---

## Pack Format 20 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- The [bat](https://minecraft.wiki/w/Bat) has a new model, resulting the texture mappings for `bat.png` to be changed.

---

## Pack Format 21 (Development Snapshots (leading to 1.20.3 – 1.20.4))

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Now support only `.png` files for textures.

---

## Pack Format 22

**Releases:** 1.20.3 – 1.20.4

**Significant Changes:**
- Renamed `grass` block and item to `short_grass`.

---

## Pack Format 24 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Adjusted the texture of the Wolf Collar layer to be more consistent with the new Wolf Armor.The `ttf` font provider transforms have been adjusted to have more reasonable defaults.

---

## Pack Format 25 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Added texture and model files for vault block.Removed unused attributes in core shader definitions.

---

## Pack Format 26 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Added font variant filters.

---

## Pack Format 28 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Adjusted menu GUI textures. Added additional textures to support colored layers of wolf armor for the wolf model and wolf armor item. Added three semi-transparent textures for the cracks to show on the wolf armor layer.

---

## Pack Format 29 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Adjusted menu GUI textures.

---

## Pack Format 30 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Split `map_icons.png` into individual sprites in the `textures/map/decorations` directory.

---

## Pack Format 31 (Development Snapshots (leading to 1.20.5 – 1.20.6))

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Added new particle types and sound events.

---

## Pack Format 32

**Releases:** 1.20.5 – 1.20.6

**Significant Changes:**
- The `shift` in TTF glyph providers is now restricted to the range `[-512; 512]`.

---

## Pack Format 33 (Development Snapshots (leading to 1.21 – 1.21.1))

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- The sound events for ominous trial spawner becoming active and ambient sound were renamed.Added new music discs.

---

## Pack Format 34

**Releases:** 1.21 – 1.21.1

**Significant Changes:**
- Added the block.vault.reject_rewarded_player sound event.

---

## Pack Format 35 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Changed shaders and post-process effects.

---

## Pack Format 36 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Changed shader and post-process effect definitions and imports.

---

## Pack Format 37 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Introduced equipment models and more customizable tooltips.

---

## Pack Format 38 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Added GUI Sprite of the highlighted slots.

---

## Pack Format 39 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Added Bundle variants and changed torch models.

---

## Pack Format 40 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Increased to support the new experimental changes.

---

## Pack Format 41 (Development Snapshots (leading to 1.21.2 – 1.21.3))

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Added texture for empty air bubble and sound for when air bubble pops.

---

## Pack Format 42

**Releases:** 1.21.2 – 1.21.3

**Significant Changes:**
- Added texture for bundle slot background.

---

## Pack Format 43 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Added resin, eyeblossoms, and changes some GUI sprites and magma cube texture layout with UV mapping.

---

## Pack Format 44 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Adds new format for data-driven item models.

---

## Pack Format 45 (Development Snapshots (leading to 1.21.4))

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- All blocks that previously rendered only block entity will now also render normal block model over it.

---

## Pack Format 46

**Releases:** 1.21.4

**Significant Changes:**
- Added a way to suppress first-person hand animation on item change for specific models.

---

## Pack Format 47 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Added wildflowers, falling leaves, and new pig textures.

---

## Pack Format 48 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Changed the size of the `pig_saddle` texture and added new equipment layer to pigs and striders.

---

## Pack Format 49 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Changed item model components.

---

## Pack Format 50 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Added new cow variants and new bush blocks.

---

## Pack Format 51 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Added new chicken textures, new eggs, cactus flower, and tall and short dry grass.

---

## Pack Format 52 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Updated mooshroom model, removed shader program definitions for core shaders and post-processing effects as JSON files, and updated item rendering.

---

## Pack Format 53 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Updated spawn egg textures, removed spawn_egg.png and spawn_egg_overlay.png, added an undercoat texture to sheep, and changed wolf sounds.

---

## Pack Format 54 (Development Snapshots (leading to 1.21.5))

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Renamed `misc/enchanted_glint_entity.png` to `misc/enchanted_glint_armor.png`, and "global" uniforms may now be defined in any shader and the game will attempt to fill it.

---

## Pack Format 55

**Releases:** 1.21.5

**Significant Changes:**
- Tweaked leaf litter model.

---

## Pack Format 56 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- The game will now consistently respect blur texture parameter in .png.mcmeta files.

---

## Pack Format 57 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- All core shader uniforms are now uniform blocks, clouds.png can no longer be colored, and Block Model rotations are no longer limited to multiplies of 22.5.

---

## Pack Format 58 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- FOG_IS_SKY has been removed.

---

## Pack Format 59 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Locator bar arrows are now animated using the standard method. Unifont updated to 16.0.03. UNIHEX font provider's `size_overrides` field is now optional.

---

## Pack Format 60 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Panorama textures must now all be the same size and square.

---

## Pack Format 61 (Development Snapshots)

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Added `icon/music_notes` and `toast/now_playing` sprites.

---

## Pack Format 62 (Development Snapshots (leading to 1.21.6))

**Associated Releases:** Development phase, not tied to a specific final release number for this format directly.

**Significant Changes:**
- Added `entity/leashknot/break` sound, renamed leash sound names,and added sounds for shearing Saddles, Horse Armor, and Carpets from Llamas.

---

## Pack Format 63

**Releases:** 1.21.6

**Significant Changes:**
- Added `oversized_in_gui` item model field and introduced new player head special model type.

---

*This changelog is based on information from the [Minecraft Wiki](https://minecraft.wiki/w/Pack_format).*
