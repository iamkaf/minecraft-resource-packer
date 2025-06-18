# Custom Sounds Tutorial

Getting custom audio into Minecraft boils down to four repeatable steps—convert → place → reference → test. You put `.ogg` files under `assets/<namespace>/sounds/…`, list the file-paths in `sounds.json` under a **sound-event key** (such as `entity.wolf.howl`), zip the pack, press **F3 + T** to reload, and Minecraft plays your sound instead of vanilla’s. The guide below walks through every step—including how to discover the right event names, convert audio to Ogg Vorbis, debug silent files, and handle multiple variants—so you can drop it straight into a `docs/sound-pack-tutorial.md` file.

## 1 — Prerequisites

- Minecraft Java Edition 1.6 or newer (asset-index system).
- Audio in **Ogg Vorbis** format—MP3/WAV will be ignored. ([mcreator.net][1])
- A zip-ready resource-pack folder with a valid `pack.mcmeta`.

> **Tip:** Keep filenames lowercase and avoid spaces; Minecraft doesn’t care, but command blocks and mods often do.

---

## 2 — Folder & file structure

```text
YourPack/
├─ assets/
│  └─ minecraft/          # namespace; use your mod id for custom sounds
│     ├─ sounds/
│     │  └─ ambient/cave/cave1.ogg
│     └─ sounds.json
└─ pack.mcmeta
```

- Everything lives inside `assets/<namespace>/sounds/` ([reddit.com][2]).
- Sub-folders are arbitrary; Mojang’s convention is `category/subfolder/file.ogg`. ([modrinth.com][3])

---

## 3 — Finding the correct sound-event name

1. **Check vanilla `sounds.json`** for your version in `.minecraft/assets/indexes/<version>.json`; it maps every event to its default file. ([reddit.com][4])
2. Search community lists like DigMinecraft’s interactive table for quick look-ups. ([digminecraft.com][5])
3. In-game debug: run `/playsound <event> @p` until you hear the right cue.

---

## 4 — Creating `sounds.json`

`sounds.json` is a dictionary: **key = sound event**, **value = object with “sounds” array**.

```json
{
  "ambient.cave": {
    "sounds": [{ "name": "ambient/cave/cave1", "stream": false, "volume": 0.8 }]
  }
}
```

- Omit the `.ogg` extension in `name`. ([reddit.com][6])
- `"volume"` (0 – 1 +) and `"pitch"` (default 1) tweak playback.
- Add multiple entries to randomize: `["random/explode1", "random/explode2"]`. ([youtube.com][7])

---

## 5 — Converting audio to Ogg Vorbis

- Use Audacity or online converters; export **44.1 kHz/16-bit** or **48 kHz** mono/stereo. Minecraft ignores Opus-in-Ogg. ([reddit.com][8])
- Keep file size modest (< 1 MB) to avoid RAM spikes on servers.

---

## 6 — Testing your pack

1. Zip the resource-pack folder (not the parent directory).
2. Drop it in `.minecraft/resourcepacks/`.
3. In the Options → Resource Packs menu, enable it.
4. Press **F3 + T** to hot-reload without leaving the world. ([reddit.com][9])
5. Trigger the event (`/playsound ambient.cave @p`)—your audio should play.

---

## 7 — Advanced tricks

### 7.1 Multiple quality variants

Use sub-packs (`pack_format` array) or separate top-level packs (e.g., _HQ Sounds_).

### 7.2 Streaming music

Set `"stream": true` for long tracks (> 10 s) so they stream from disk. ([minecraft.fandom.com][10], [reddit.com][6])

### 7.3 Custom namespaces for mods

Replace `minecraft` with your mod ID to avoid clashes; trigger with `/playsound yourmod:sound.event`.

### 7.4 Locating vanilla OGGs for reference

Original files live under hashed names in `.minecraft/assets/objects/`; the index JSON tells you which hash is which path. ([reddit.com][4])

---

## 8 — Troubleshooting checklist

| Issue                   | Fix                                                         |
| ----------------------- | ----------------------------------------------------------- |
| Pack loads but silent   | Wrong event key or wrong path in `sounds.json`.             |
| “Unknown file format”   | File isn’t Ogg Vorbis—re-export.                            |
| Only some variants play | All array entries must point to valid paths.                |
| Game lags when playing  | Convert to mono, lower bitrate, or enable `"stream": true`. |

---

## 9 — Useful references

- **Minecraft Wiki – `sounds.json` spec** ([minecraft.fandom.com][10])
- **Reddit tutorial** on editing sounds (step-by-step) ([reddit.com][6])
- **DigMinecraft sound list** for quick event lookup ([digminecraft.com][5])
- **F3 + T reload explanation** ([reddit.com][9])
- **Assets cache layout** thread ([reddit.com][4])
- **Folder path example** on r/mcresourcepack ([reddit.com][2])
- **Video tutorial** (YouTube) for visual learners ([youtube.com][7])
- **Vorbis-only requirement** (MCreator wiki) ([mcreator.net][1])
- **Streaming flag** covered in Minecraft Wiki examples ([minecraft.fandom.com][10])
- **Debug Keys mod (reload outside world)** for pack devs ([modrinth.com][3])

---

Drop this markdown into `/docs/resource-pack-sounds.md` (or anywhere in your repo) and you’ll have a ready reference for every future audio tweak. Happy sound-crafting!

[1]: https://mcreator.net/wiki/how-convert-mp3-or-wav-file-ogg-minecraft-sounds?utm_source=chatgpt.com 'How to convert MP3 or WAV file to OGG for Minecraft sounds'
[2]: https://www.reddit.com/r/mcresourcepack/comments/w8gewq/directories_of_sound_files_within_a_resource_pack/?utm_source=chatgpt.com 'Directories of sound files within a resource pack. : r/mcresourcepack'
[3]: https://modrinth.com/mod/f3-t-everywhere?utm_source=chatgpt.com 'Debug Keys (F3+T) Everywhere - Minecraft Mod - Modrinth'
[4]: https://www.reddit.com/r/Minecraft/comments/4w1ytl/where_do_i_located_default_soundmusic_files/?utm_source=chatgpt.com 'Where do I located default sound/music files. - Minecraft - Reddit'
[5]: https://www.digminecraft.com/lists/sound_list_pc.php?utm_source=chatgpt.com 'Sound Effect List (Java Edition) - DigMinecraft'
[6]: https://www.reddit.com/r/Minecraft/comments/bmyort/finally_figured_out_how_to_edit_sounds_in_a/?utm_source=chatgpt.com 'Finally figured out how to edit sounds in a Resource pack. : r/Minecraft'
[7]: https://www.youtube.com/watch?v=pSlbpvjt1zw&utm_source=chatgpt.com 'Minecraft - How to Replace Sounds! (Resource Pack Tutorial)'
[8]: https://www.reddit.com/r/MinecraftCommands/comments/lnnru7/does_minecraft_support_opus_encoding_in_ogg_files/?utm_source=chatgpt.com 'Does Minecraft support opus encoding in .ogg files in resource ...'
[9]: https://www.reddit.com/r/Minecraft/comments/f9vy3u/reload_resource_pack/?utm_source=chatgpt.com 'Reload Resource Pack : r/Minecraft - Reddit'
[10]: https://minecraft.fandom.com/wiki/Sounds.json?utm_source=chatgpt.com 'Sounds.json - Minecraft Wiki'
