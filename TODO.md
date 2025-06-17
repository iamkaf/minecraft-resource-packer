# TODO.md

Comprehensive backlog for **minecraft-resource-packer**.
Every checkbox below is a discrete, test‑covered task.
UI components **must** ship with Vitest + RTL tests; overall coverage ≥ 90 %.

---

## Global UX

- [ ] Undo/Redo queue (last 20 actions)
- [x] Persist window size and position across launches
- [x] Open the most recently used project on startup; add a setting to disable this

---

## Project Manager

- [x] Better selection behavior in the project manager
- [x] Better bulk action detection when using hotkeys
- [x] Ability to edit a project's name

---

## Editor

### Asset Browser

- [ ] Dirty badge for changed assets
- [ ] Custom namespace support (non-`minecraft` assets)
- [x] Persist search query, category filters and zoom level between sessions
- [ ] Arrow key navigation between thumbnails
- [ ] Audio & language asset management with previews (`.ogg`, `.wav`, `.json`)
- [ ] Asset atlas viewer for stitching HD texture previews
- [ ] Asset dependency graph showing overrides

### Asset Info & Texture Inspector

- [x] Initial revision history implementation (max 20)
- [ ] Make revision history work for textures as soon as they're updated
- [ ] Add confirmation dialog when restoring or deleting revisions
- [ ] Add revision history preview
- [x] Preview against the vanilla texture using the `Diff` component
- [x] Generic icon thumbnail for text files
- [x] More robust JSON editor
- [ ] Optional 3D preview for entity models and item textures
- [ ] Custom models & blockstates editor with live validation
- [ ] Normal & specular map creator using Sharp in the Texture Lab: Using Sharp to generate `_n` (normal) and `_s` (specular) maps from textures, optionally with user-tuneable detail intensity sliders. Useful for shader/HDR packs.
- [ ] Wizard to configure CTM overrides and biome-shading variations: auto-generate `connect.json` or biome folder structures for advanced texture packs with live preview of the connected textures.

### Project Info Panel

- [x] Ability to edit project metadata from the ProjectInfoPanel
- [ ] Integrate PackIconEditor for changing the pack icon
- [x] Fix the randomize icon button not working due to incorrect file path

---

## Pack Settings

- [ ] Editable `pack.mcmeta` (description, `pack_format`, language)
- [ ] Editable license field in Pack Metadata modal
- [ ] Target resolution radio (16×/32×/64×)
- [ ] Validation checklist (missing textures, duplicates)
- [ ] Version field for projects; it should also appear in exported file names
- [x] Remember the last export target folder using electron store on successful exports
- [ ] Sub-pack support for multi-variant packs in `pack.mcmeta`

---

## Import & Export

- [ ] Import wizard supporting folders or `.zip` archives
- [ ] Detect pack version from `pack.mcmeta` when importing `.zip`
- [ ] Import wizard: option to merge into existing project
- [ ] Compression progress with ETA
- [ ] Post‑actions: Open folder • Copy to resourcepacks • Test‑launch Minecraft
- [ ] Live test client launch from a specified Minecraft path

---

## Templates

- [ ] JSON store in `templates/`
- [ ] “Start from Template” dialog (e.g., _Gold Tools & Armor_, _All Food Items_)
- [ ] Add templates to existing projects
- [ ] Pack theme bundles and presets: Offer curated theme bundles (e.g. minimalist, vibrant, medieval) that set palette, fonts, in‑tool UI colors, and template assets—helping users get started faster.
- [ ] Use the Modrinth API to pre-populate assets for popular mods
- [ ] Community-driven template downloads

---

## Preferences

- [ ] Path override for `.minecraft` folder
- [ ] Editable keyboard shortcuts
- [ ] Update channel + analytics opt‑in

---

## Quality & Accessibility

- [ ] Keyboard navigation across all components
- [ ] High‑contrast mode via daisyUI preset
- [ ] Responsive grid (single‑column < 1024 px)
- [ ] 8‑pt spacing grid for pixel crispness
- [ ] **Tests for every UI component and util**

---

## Appendix A. Libraries Reference

- [`unique-names-generator`](https://www.npmjs.com/package/unique-names-generator) random placeholder pack names
- [`sharp`](https://www.npmjs.com/package/sharp) image processing
- [`react-canvas-confetti`](https://www.npmjs.com/package/react-canvas-confetti) export confetti
- [daisyUI loading components](https://daisyui.com/components/loading/) loading indicators
- [`chokidar`](https://www.npmjs.com/package/chokidar) file watching
- [`archiver`](https://www.npmjs.com/package/archiver) ZIP export
