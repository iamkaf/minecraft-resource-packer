# minecraft-resource-packer

This workspace contains an Electron Forge application used to build and export Minecraft resource packs.

## Features
- Project Manager window for selecting existing packs or creating a new one
- Main window with an Asset Browser that live reloads when files change
- Exporter utility that creates a zipped pack and generates `pack.mcmeta`

## Development
Install dependencies and launch the development server:

```bash
npm i
npm run dev
```

Run unit tests with `npm test` and lint the codebase using `npm run lint`.
