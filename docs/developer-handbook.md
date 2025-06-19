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

Electron requires a graphical environment. Running on a headless server will fail with an EPIPE error. Use the headless variant when no display is available:

```bash
npm run dev:headless
```

This command uses [`xvfb-maybe`](https://github.com/anaisbetts/xvfb-maybe) to launch Electron under a virtual display when one is not available. See the [Electron headless CI guide](https://www.electronjs.org/docs/latest/tutorial/testing-on-headless-ci) for more details.

3. Run the linter and tests:

```bash
npm run lint
npm test
```

4. Format the codebase:

```bash
npm run format
```

5. Window size, position and fullscreen state persist across launches thanks to `electron-store`.
6. The Asset Browser remembers the last search text, category filters and zoom level using `electron-store`.
7. The most recently opened project is saved and reopened on launch when the `Open last project on startup` preference is enabled.
8. Export dialogs default to the most recently used folder, which is stored via `electron-store` after each successful export.

## Project Structure

- `src/main/` – Electron entry point and IPC controllers
- `src/preload/` – preload script and IPC bindings
- `src/renderer/` – React UI with components, hooks, styles and utils
- `src/shared/` – utilities and typed IPC definitions shared across processes
- `__tests__/` – Vitest unit tests

## Views

The renderer separates the interface into four top‑level views found under
`src/renderer/views`:

- **Project Manager** – choose, create or import projects.
- **Editor** – edit project assets and export the finished pack.
- **Settings** – application preferences.
- **About** – version information, license and links.
- Each view header features a small **Help** button linking to the relevant article on
  [minecraft.wiki](https://minecraft.wiki/). The button uses `ExternalLink` and shows
  a toast if the link fails to open.

Navigation is handled by `react-router-dom` using a `HashRouter`, so each view
corresponds to a URL fragment: `#/`, `#/editor`, `#/settings` and `#/about`.

## Adding Functionality

When adding features that need access to Node APIs:

1. Create a function in the `src/main` process and expose it via `ipcMain.handle`.
2. Declare a matching function in `src/preload/index.ts` using `contextBridge.exposeInMainWorld`.
3. Call this API from the React renderer via `window.electronAPI.yourApi()`.

Remember that the renderer runs in a browser-like sandbox, so heavy filesystem work belongs in the main process.

Use spaces for indentation in `.ts` and `.tsx` files and keep React components functional.

### Toasts

Use the `useToast` hook to display brief notifications. Call it with an options
object:

```ts
toast({ message: 'Saved!', type: 'success', duration: 5000, closable: true });
```

Types correspond to daisyUI alert variants (`info`, `success`, `warning`, `error`,
`neutral`, `loading`). The toast automatically disappears after the specified
duration unless closable.

## IPC Pattern

Electron uses a main ↔ preload ↔ renderer pipeline. Functions are implemented in
`src/main` and registered via `ipcMain.handle`. The preload layer exposes typed
wrappers with `contextBridge.exposeInMainWorld` so the React renderer can call
them through `window.electronAPI.*`. Shared helpers and the IPC request/response
types live under `src/shared`. Node integration is enabled and context
isolation disabled in `src/main/index.ts` on purpose, so leave these settings
as they are.

## Styling

Tailwind CSS is configured with the `daisyUI` plugin. The `index.css`
file defines a custom **minecraft** theme. The application supports three
themes:

- **light** – bright variant inspired by Minecraft's UI
- **dark** – the default "minecraft" theme
- **system** – automatically picks light or dark based on OS settings

The current theme is stored in Electron's settings store and applied by setting
`data-theme` on the root element.

## Custom Protocols

Two custom protocols simplify image previews:

- `vanilla://` serves textures from the Minecraft client cache. URLs use the
  form `vanilla://<relative-path>`.
- `asset://` serves files directly from the project directory and is used by the
  asset browser to preview modified assets.

Both protocols are registered in `src/main/index.ts` when Electron starts.

## Asset Cache

Downloads from Mojang are stored under `<userData>/assets-cache`. Each
version gets its own folder inside this directory. The client JAR is saved as
`client.jar` and extracted to `client/` where `assets/minecraft/textures` lives.
`ensureAssets` fetches and extracts the JAR the first time a version is
requested; later calls simply reuse the existing folder.

## Project Metadata Sidebar

The projects dashboard includes a sidebar next to the project table. Selecting a
row loads metadata from `project.json` via IPC and displays the pack description,
author, related URLs and creation timestamps. Use the **Edit** button to modify
these fields and save back to `project.json`. The sidebar also includes a
**Rename** button that opens a modal to change the project's folder name and
updates `project.json` accordingly.

Pack metadata, including the pack version, can also be edited from the Editor's **Project Info Panel** using the form at the bottom of the panel. The selected version is stored in `project.json` and appended to export filenames.

## Row Selection

Checkboxes in the project table select rows. Hold **Shift** while clicking to
select a contiguous range beginning from the last clicked row. Selected rows are
highlighted and selections persist when sorting or filtering the table.

## Bulk Export

Select multiple rows using the checkboxes in the projects table and click
**Bulk Export**. Choose a destination folder when prompted and each project
is zipped to `<name>.zip` in that location. Progress appears in a modal with a
toast confirming success or failure.

Each project's `project.json` stores a `noExport` array listing files that
should be excluded from exports. The asset browser context menu includes a
**No Export** toggle to manage this flag on one or multiple selected files.

## Import Wizard

Click **Import** in the New Project dialog to bring up the Import Wizard.
The wizard asks the main process to open an `electron.dialog` so the user can
select a `.zip` archive. A modal shows a spinner while the project is extracted
and then displays a brief summary of the import.

## Asset Browser

The vanilla asset browser lets you search textures from the selected Minecraft
version. Results are grouped into collapsible **Blocks**, **Items**, **Entity**,
**UI**, **Audio**, **Lang** and **Misc** sections using daisyUI's collapse component. Only assets
that match the search query appear in each section. Thumbnails respect the zoom
slider (24–128 px) and textures can be clicked or dragged into the asset browser
to add them to the project.
Text files such as `.txt` and `.json` display a document icon instead of a thumbnail.
Language files under `lang/` are listed in their own **Lang** section.
Audio files (`.ogg` and `.wav`) include a **Play Audio** button that opens a daisyUI modal
with an HTML5 `<audio>` element for playback.

Beside the asset information panel, a **Preview Pane** shows the currently
selected texture under neutral lighting. The pane renders textures at a 1:1
pixel scale and includes a zoom slider (1–8×). Scrolling the mouse wheel over
the pane adjusts the zoom. The pane is lazy loaded and displays a
daisyUI skeleton indicator while loading.

The **Texture Lab** editor is canvas based and uses `fabric.js` for interaction.
Users can crop, rotate, flip or scale images, draw freehand and add text layers.
Edit operations are sent to the main process with the `apply-image-edits` IPC
handler where Sharp applies them before saving.

The **Atlas Viewer** modal stitches multiple textures together for a high-
resolution preview. It requests the combined image through the `createAtlas`
IPC handler and displays a loading spinner until the data URL is returned.

The **Pack Icon Editor** modal customises `pack.png` for a project. You can
randomise the item and background, choose a border colour or upload a custom PNG.
The image is processed with Sharp in the main process and saved at 128×128.

## Asset Info

The panel beside the asset browser displays details about the selected file. When
viewing a PNG texture the panel offers a **Compare with Vanilla** button. It
opens a modal that uses the daisyUI `Diff` component to show the project texture
against the original game asset side by side.

The **Revisions** button opens a modal listing previous versions of the file.
Revisions are stored in a hidden `.history` folder within each project and up to
20 entries are kept per asset. Selecting a revision will restore that version
and store the current file as a new revision.

## Windows Paths

When writing tests or other code that constructs file system paths, prefer
`path.join()` over string concatenation. Hard coded `/` separators can cause
failures on Windows where the standard separator is `\`.

## 3D Model Preview

Use the `MinecraftModelPreview` component to display vanilla models. The
`getTexture` utility resolves texture paths to the custom `vanilla://` protocol.

```tsx
import MinecraftModelPreview from '../components/assets/MinecraftModelPreview';
import getTexture from '../utils/getTexture';

<MinecraftModelPreview
  modelType="block"
  modelJson={{ parent: 'block/cube_all', textures: { all: 'minecraft:stone' } }}
  getTexture={getTexture}
/>;
```
