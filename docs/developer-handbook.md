# Developer Handbook

Welcome to **minecraft-resource-packer**. This workspace uses Electron Forge with a React + TypeScript front end.

## Getting Started

1. Install dependencies from the repo root:

```bash
npm i
```

2. Start the development build:

```bash
npm run dev
```

Electron requires a graphical environment. Running on a headless server will fail with an EPIPE error.

3. Run the linter and tests:

```bash
npm run lint
npm test
```

## Project Structure

- `apps/mc-pack-tool/` – main Electron application
- `src/main/` – Node processes and IPC handlers
- `src/renderer/` – React UI components
- `src/minecraft/` – utilities for interacting with Minecraft data
- `__tests__/` – Vitest unit tests

## Adding Functionality

When adding features that need access to Node APIs:

1. Create a function in the `src/main` process and expose it via `ipcMain.handle`.
2. Declare a matching function in `preload.ts` using `contextBridge.exposeInMainWorld`.
3. Call this API from the React renderer via `window.electron.yourApi()`.

Remember that the renderer runs in a browser-like sandbox, so heavy filesystem work belongs in the main process.

Use spaces for indentation in `.ts` and `.tsx` files and keep React components functional.

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

Both protocols are registered in `src/index.ts` when Electron starts.
