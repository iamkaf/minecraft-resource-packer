# minecraft-resource-packer

An Electron-based tool for creating Minecraft resource packs. The interface is designed to be fun and beginner friendly so anyone can pick a version, edit textures and export a ready to use pack.

## Views

- **Project Manager** – lists available packs with their Minecraft version and chosen assets. Create new projects or open existing ones.
- **Editor** – browse and modify textures inside a project then export the finished pack.
- **Settings** – customise application preferences.
- **About** – see version info, license and helpful links.

## Features

- **Asset Selection** – textures are pulled from Mojang's version manifest and cached locally for quick searching.
- **Secure Previews** – images load through custom `vanilla://` and `asset://` protocols so `file://` access is never required.
- **Asset Editing** – when an asset is added it is copied into the correct folder structure inside the project. Files can be opened in Explorer/Finder or with the default program for that type. Any changes on disk instantly appear in the UI.
- **Live Asset Browser** – the Editor view lists all files in the project directory and automatically reloads when something changes.
- **Random pack icon** – new packs start with a pastel background and random item image; you can regenerate from pack settings.
- **Export** – generate a zipped resource pack containing the selected files along with a valid `pack.mcmeta`. The output is ready to drop into Minecraft.
- **External Editing** – configure your favourite image editor in **Settings** and launch it from the asset info panel.
- **Revision History** – every save keeps the previous version inside a hidden `.history` folder. Up to 20 revisions can be restored from the Asset Info panel.

### Texture Naming

Texture filenames are displayed in a friendlier form by removing the path and extension, replacing underscores with spaces and capitalising each word. The original filename is still shown alongside the formatted name and in tooltips.

### External Editor

Specify the path to your preferred image editor under **Settings**. PNG textures can then be opened directly from the asset info panel using the **Edit Externally** button.

### Keyboard Shortcuts

The Project Manager supports a few hotkeys:

- **Enter** – open all selected projects.
- **Delete** – remove all selected projects.

## Documentation

The docs are built with [VitePress](https://vitepress.dev) and published to
GitHub Pages. View them locally with:

```bash
npm run docs:dev
```

Generate the static site using:

```bash
npm run docs:build
```

- [User Guide](docs/user-guide.md)
- [Developer Handbook](docs/developer-handbook.md)

## Development

Run the development build with:

```bash
npm run dev
```

On headless systems (for example in CI) use the headless variant which relies on `xvfb-maybe` to provide a virtual display:

```bash
npm run dev:headless
```
