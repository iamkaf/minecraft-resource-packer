# AGENTS.md

## Project overview

You are a coding agent in a monorepo that hosts an Electron + React + TypeScript application
called **minecraft-resource-packer**.
Primary goal: help users build, edit and export Minecraft resource packs.
For more details on project structure and IPC patterns, see `docs/developer-handbook.md`.

## Commands & workflows

- **Install deps:** `npm i`
- **Dev server:** `npm run dev` (Electron Forge with reload)
  - Requires a graphical environment. Use `npm run dev:headless` on headless systems to avoid EPIPE errors. This variant also passes `--no-sandbox` so Electron can run as root in CI.
- **Lint:** `npm run lint`
- **Unit tests:** `npm test` (Vitest)
- **Package:** `npm run make`
- **Format:** `npm run format` (Prettier)

## Testing hints

- When you create a new component, add a minimal Vitest spec in `__tests__`.
- Ensure `npm test` returns exit 0 before marking a task complete.

## Coding conventions

- React functional components, Tailwind CSS.
- Tailwind CSS with daisyUI themes.
- Refer to https://daisyui.com/llms.txt for usage guidelines.
- Spaces for indentation in `.ts`, `.tsx`.
- Use `zod` for runtime schemas.

## Libraries of note

- electron, electron-forge, react, react-dom, typescript
- chokidar, archiver, minecraft-data
- daisyui

## Definition of done

A task is _complete_ when:

1. Code compiles (`npm run dev`),
2. Tests pass (`npm test`),
3. The feature appears in the UI without console errors,
4. All files lint clean (`npm run lint`),
5. Code is formatted (`npm run format`).

## Bad practices to avoid

- Don’t commit `.env` or `dist/*.zip`; add them to `.gitignore`.
- Don’t use `eval`.

## Minecraft Information

Use https://minecraft.wiki/ as the source of truth for up-to-date Minecraft information.

Minecraft version information can be found at: https://launchermeta.mojang.com/mc/game/version_manifest.json

## Task Context
1. The repository root contains `TODO.md`, a list of unchecked feature bullets.  
2. Each bullet is terse; the expanded requirements live in the glossary below.  
3. Every UI component and helper must ship with **Vitest + React-Testing-Library tests** and keep total coverage ≥ 90 %.

## Glossary of Definitions

### Global Shell & UX
* **Drawer layout** – daisyUI `drawer`; collapses to icons < 768 px; toggled with hamburger.  
* **Navbar** – title text, 🌓 theme switch persisted in `localStorage`.  
* **Toast system** – daisyUI `toast`, ARIA live region.
* **Loading indicators** – wrap async ops in `<Suspense>` with `react-loader-spinner`.
* **Confetti** – `react-canvas-confetti`, auto-disabled by `prefers-reduced-motion`.
* **Undo/Redo** – global queue (20 actions).  
* **Auto-update** – checks GitHub releases, shows banner.  

### Projects Dashboard  
* **Placeholder names** – generated via `unique-names-generator`; must be pronounceable.
* Zebra table columns: Name · MC Version · Assets · Last opened; sortable.  
* CRUD actions: New / Import / Duplicate / Delete / Open.  
* Search + version filter chips.  
* Status badge if `pack_format` outdated (refer to pack-format list on Minecraft Wiki).
* Bulk export selected rows.  
* Metadata sidebar: description, author, URLs, timestamps.

### Vanilla Asset Browser  
* Namespace tree from `minecraft-assets`; grid with zoom 24–128 px; hover ring.  
* Drag-or-click to add; quick filters (Blocks, Items, Entity, UI, Audio).  
* Neutral-lighting preview pane.

### Project File Explorer  
* **Chokidar watcher** for `assets/**`, < 200 ms refresh.  
* Context menu: Reveal, Open, Rename, Delete.  
* Dirty badge; 🔒 No-export toggle; custom namespaces (non-`minecraft`).  

### Texture Inspector  
* 1 : 1 canvas preview + zoom.  
* External edit; auto-reload; revision history (20).  
* **Sharp mini-lab**: hue-shift, rotate 90°, gray-scale, ±saturation, ±brightness. :contentReference[oaicite:7]{index=7}  

### Pack Settings  
* Editable `pack.mcmeta` (desc, `pack_format`, language).  
* **Random icon seed** – Sharp composited 128×128 PNG (pastel BG, 4 px border, centered item sprite).  
* **Pack-Icon Editor** – modal to randomise sprite/background/border, or upload custom PNG; always outputs 128 × 128.  
* Target resolution radio 16×/32×/64×; license; validation.

### Templates  
* JSON files under `templates/` → `{name, mcVersion, assets[]}` (e.g., “Gold Tools & Armor”).  

### Import / Export  
* Import wizard – use `adm-zip` to ingest `.zip`, read `pack.mcmeta` + optional `pack.json`. :contentReference[oaicite:8]{index=8}  
* Export – `archiver` with progress bar; embed `pack.json`; respect No-export flags; confetti on success.  

### Export Wizard  
* Destination picker (Downloads default); compression ETA; post-actions (Open folder, Copy to resourcepacks, Test-launch MC).  

### Preferences / About  
* Paths, theme, shortcuts, update channel, analytics opt-in, about pane.  

### Quality & Accessibility  
* Full keyboard nav; daisyUI high-contrast theme; responsive grid; 8-pt spacing.
