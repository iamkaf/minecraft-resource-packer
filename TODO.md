# TODO.md

Comprehensive backlog for **minecraft-resource-packer**.
Every checkbox below is a discrete, test‑covered task.
UI components **must** ship with Vitest + RTL tests; overall coverage ≥ 90 %.

---

## Global UX

- [ ] Undo/Redo queue (last 20 actions)
- [x] Persist window size and position across launches
- [ ] Open the most recently used project on startup; add a setting to disable this

---

## Project Manager

- [x] Better selection behavior in the project manager
- [ ] Better bulk action detection when using hotkeys
- [x] Ability to edit a project's name

---

## Editor

### Asset Browser

- [ ] Dirty badge for changed assets
- [ ] Custom namespace support (non-`minecraft` assets)
- [x] Persist search query, category filters and zoom level between sessions
- [ ] Arrow key navigation between thumbnails

### Asset Info & Texture Inspector

- [ ] Revision history (max 20)
- [ ] Preview against the vanilla texture using the `Diff` component
- [x] Generic icon thumbnail for text files
- [ ] More robust JSON editor
- [ ] Optional 3D preview for entity models and item textures

### Project Info Panel

- [ ] Ability to edit project metadata from the ProjectInfoPanel
- [ ] Integrate PackIconEditor for changing the pack icon
- [x] Fix the randomize icon button not working due to incorrect file path

---

## Pack Settings

- [ ] Editable `pack.mcmeta` (description, `pack_format`, language)
- [ ] Editable license field in Pack Metadata modal
- [ ] Target resolution radio (16×/32×/64×)
- [ ] Validation checklist (missing textures, duplicates)
- [ ] Version field for projects; it should also appear in exported file names
- [ ] Remember the last export target folder using electron store on successful exports

---

## Import & Export

- [ ] Import wizard supporting folders or `.zip` archives
- [ ] Detect pack version from `pack.mcmeta` when importing `.zip`
- [ ] Import wizard: option to merge into existing project
- [ ] Compression progress with ETA
- [ ] Post‑actions: Open folder • Copy to resourcepacks • Test‑launch Minecraft

---

## Templates

- [ ] JSON store in `templates/`
- [ ] “Start from Template” dialog (e.g., _Gold Tools & Armor_, _All Food Items_)
- [ ] Add templates to existing projects

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
