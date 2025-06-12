# minecraft-resource-packer

An Electron-based tool for creating Minecraft resource packs. The interface is designed to be fun and beginner friendly so anyone can pick a version, edit textures and export a ready to use pack.

## Features

- **Project Manager** – integrated into the main window, it keeps a list of projects with their name, Minecraft version and chosen assets. You can create new packs or open and edit existing ones without switching windows.
- **Asset Selection** – textures are pulled from Mojang's version manifest and cached locally for quick searching.
- **Secure Previews** – images load through custom `texture://` and `ptex://` protocols so `file://` access is never required.
- **Asset Editing** – when an asset is added it is copied into the correct folder structure inside the project. Files can be opened in Explorer/Finder or with the default program for that type. Any changes on disk instantly appear in the UI.
- **Live Asset Browser** – the editor window lists all files in the project directory and automatically reloads when something changes.
- **Export** – generate a zipped resource pack containing the selected files along with a valid `pack.mcmeta`. The output is ready to drop into Minecraft.

## Development

Install dependencies and launch the development build:

```bash
npm i
npm run dev
# Use this variant on servers without a display (runs xvfb and adds --no-sandbox)
npm run dev:headless
```

System packages needed for headless development and RPM creation are listed in
[docs/setup.md](docs/setup.md).

Run unit tests and lint the codebase with:

```bash
npm test
npm run lint
```

Format all files using Prettier:

```bash
npm run format
```

### Styling

This project uses **Tailwind CSS** with the
[`daisyUI`](https://daisyui.com) plugin. A custom
"minecraft" theme provides light and dark modes that match the game's look.
