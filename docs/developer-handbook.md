# Developer Handbook

Welcome to **minecraft-resource-packer**. This project uses Electron Forge with a React + TypeScript front end.

## Getting Started

1. Install dependencies from the repo root:

```bash
npm i
```

2. Start the development build:

```bash
npm run dev
```

Electron requires a graphical environment. Running on a headless server will fail with an EPIPE error. Use the headless variant when no display is available:

```bash
npm run dev:headless
```

3. Run the linter and tests:

```bash
npm run lint
npm test
```

4. Format the codebase:

```bash
npm run format
```

## Project Structure

- Project root contains the Electron application
  - `src/main/` – Electron entry point and IPC controllers
  - `src/preload/` – preload script and IPC bindings
  - `src/renderer/` – React UI with components, hooks, styles and utils
  - `src/shared/` – utilities and typed IPC definitions shared across processes
  - `__tests__/` – Vitest unit tests
  - `resources/` – icons and other assets

## Adding Functionality

When adding features that need access to Node APIs:

1. Create a function in the `src/main` process and expose it via `ipcMain.handle`.
2. Declare a matching function in `src/preload/index.ts` using `contextBridge.exposeInMainWorld`.
3. Call this API from the React renderer via `window.electron.yourApi()`.

Remember that the renderer runs in a browser-like sandbox, so heavy filesystem work belongs in the main process.

Use spaces for indentation in `.ts` and `.tsx` files and keep React components functional.

## IPC Pattern

Electron uses a main ↔ preload ↔ renderer pipeline. Functions are implemented in
`src/main` and registered via `ipcMain.handle`. The preload layer exposes typed
wrappers with `contextBridge.exposeInMainWorld` so the React renderer can call
them through `window.electron.*`. Shared helpers and the IPC request/response
types live under `src/shared`. Node integration is enabled and context
isolation disabled in `src/main/index.ts` on purpose, so leave these settings
as they are.

## Styling

Tailwind CSS is configured with the `daisyUI` plugin. The `tailwind.config.js`
file defines a custom **minecraft** theme with matching light and dark modes.
You can switch themes using the `data-theme` attribute on any element.

## Custom Protocols

Two custom protocols simplify image previews:

- `texture://` serves textures from the Minecraft client cache or the active
  project. URLs use the form `texture://<relative-path>`.
- `ptex://` serves files directly from the project directory and is used by the
  asset browser to preview modified assets.

Both protocols are registered in `src/main/index.ts` when Electron starts.

## Project Metadata Sidebar

The projects dashboard includes a sidebar next to the project table. Selecting a
row loads `pack.json` via IPC and displays the pack description, author, related
URLs and creation timestamps. Use the **Edit** button to modify these fields and
save back to `pack.json`.

## Asset Browser

The vanilla asset browser lets you search textures from the selected Minecraft
version. Results are grouped into collapsible **Blocks**, **Items**, **Entity**,
**UI**, **Audio** and **Misc** sections using daisyUI's collapse component. Only assets
that match the search query appear in each section. Thumbnails respect the zoom
slider (24–128 px) and clicking a texture adds it to the project.
