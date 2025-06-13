# TODO.md

Comprehensive backlog for **minecraft-resource-packer**.  
Every checkbox below is a discrete, test‑covered task.  
UI components **must** ship with Vitest + RTL tests; overall coverage ≥ 90 %.

---

## 1. Global Shell & UX

- [x] Drawer layout with hamburger toggle
- [x] Navbar with title and 🌓 theme switch (persists in `localStorage`)
- [x] Toast/alert system via daisyUI `toast`
- [x] Loading indicators for every async op (`react-loader-spinner`)
- [x] Confetti celebration on successful export (`react-canvas-confetti`)
- [ ] Undo/Redo queue (last 20 actions)

### Wiki Quick‑Links

- [ ] ❓ icon on each view header opens relevant <https://minecraft.wiki/> page in default browser

---

## 2. Projects Dashboard

- [x] Zebra table: Name ▸ MC Version ▸ Assets ▸ Last opened
- [x] Placeholder names generated with `unique-names-generator`
- [x] Create • Import • Duplicate • Delete (confirm) • Open actions
- [x] Fuzzy search + version filter chips
- [ ] Bulk export selected rows
- [x] Rich metadata sidebar (Description, Author, URLs, etc.)

---

## 3. Vanilla Asset Browser

- [ ] Categorized sections
- [x] Properly formatted texture names, with original filename fallback
- [x] Responsive grid thumbnails (zoom 24–128 px, hover ring)
- [ ] Drag‑or‑click to add asset to project
- [ ] Quick filters: Blocks / Items / Entity / UI / Audio
- [ ] Neutral‑lighting preview pane

---

## 4. Project File Explorer

- [ ] Real‑time watcher with `chokidar`
- [x] Context menu: Reveal, Open, Rename, Delete
- [x] React context menu with daisyUI dropdown + delete modal
- [ ] Dirty badge for changed assets
- [ ] 🔒 No‑export toggle per file
- [ ] Custom namespace support (non‑`minecraft` assets)

---

## 5. Texture Inspector

- [ ] 1 : 1 pixel preview + zoom slider
- [ ] External edit button (auto‑reload on save)
- [ ] Sharp mini‑lab: Hue‑shift • Rotate 90° • Gray‑scale • ±Saturation • ±Brightness
- [ ] Revision history (max 20)

---

## 6. Pack Settings

- [ ] Editable `pack.mcmeta` (description, `pack_format`, language)
- [x] Randomly generated pack icon (pastel bg + border + random Minecraft item texture Sharp)
- [ ] Pack Icon Editor modal (randomise, colour, border, upload custom)
- [ ] Target resolution radio (16×/32×/64×)
- [ ] License & authors
- [ ] Validation checklist (missing textures, duplicates)

---

## 7. Templates

- [ ] JSON store in `templates/`
- [ ] “Start from Template” dialog (e.g., _Gold Tools & Armor_, _All Food Items_)
- [ ] Add templates to existing projects

---

## 8. Import / Export

- [ ] Import wizard: ingest `.zip`, parse `pack.mcmeta` + optional `pack.json`
- [ ] Import wizard: option to merge into existing project
- [ ] Export ZIP with `archiver` + progress bar
- [ ] Embed `pack.json` for round‑trip metadata
- [ ] Honour No‑export flags

---

## 9. Export Wizard

- [ ] Destination picker (defaults to Downloads)
- [ ] Compression progress + ETA
- [ ] Post‑actions: Open folder • Copy to resourcepacks • Test‑launch Minecraft
- [ ] Summary modal (file count, size, time, warnings)

---

## 10. Preferences / About

- [ ] Paths (override `.minecraft`, external editor)
- [ ] Theme (Light / Dark / System)
- [ ] Editable keyboard shortcuts
- [ ] Update channel + analytics opt‑in
- [x] About pane (logo, version, links, license)
- [x] GitHub/Documentation links open externally

---

## 11. Quality & Accessibility

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
- [`react-loader-spinner`](https://www.npmjs.com/package/react-loader-spinner) loading indicators
- [`chokidar`](https://www.npmjs.com/package/chokidar) file watching
- [`archiver`](https://www.npmjs.com/package/archiver) ZIP export
