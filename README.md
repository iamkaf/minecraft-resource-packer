# minecraft-resource-packer

An Electron-based tool for creating Minecraft resource packs. The interface is designed to be fun and beginner friendly so anyone can pick a version, edit textures and export a ready to use pack.

## Features

- **Project Manager** – similar to Godot's launcher, it keeps a list of projects with their name, Minecraft version and chosen assets. You can create new packs or open and edit existing ones.
- **Asset Selection** – search for vanilla textures by name using the `minecraft-data` and `minecraft-assets` libraries. Add assets to your project with a click.
- **Asset Editing** – when an asset is added it is copied into the correct folder structure inside the project. Files can be opened in Explorer/Finder or with the default program for that type. Any changes on disk instantly appear in the UI.
- **Live Asset Browser** – the editor window lists all files in the project directory and automatically reloads when something changes.
- **Export** – generate a zipped resource pack containing the selected files along with a valid `pack.mcmeta`. The output is ready to drop into Minecraft.

## Development

Install dependencies and launch the development build:

```bash
npm i
npm run dev
```

Run unit tests and lint the codebase with:

```bash
npm test
npm run lint
```
