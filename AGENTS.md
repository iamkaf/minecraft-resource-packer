# AGENTS.md

## Project overview

You are a coding agent in a monorepo that hosts an Electron + React + TypeScript application
called **minecraft-resource-packer**.  
Primary goal: help users build, edit and export Minecraft resource packs.

## Commands & workflows

- **Install deps:** `npm i`
- **Dev server:** `npm run dev` (Electron Forge with reload)
- **Lint:** `npm run lint`
- **Unit tests:** `npm test` (Vitest)
- **Package:** `npm run make`
- **Format:** `npm run format` (Prettier)

## Testing hints

- When you create a new component, add a minimal Vitest spec in `__tests__`.
- Ensure `npm test` returns exit 0 before marking a task complete.

## Coding conventions

- React functional components, Tailwind CSS.
- Spaces for indentation in `.ts`, `.tsx`.
- Use `zod` for runtime schemas.

## Libraries of note

- electron, electron-forge, react, react-dom, typescript
- chokidar, archiver, minecraft-assets, minecraft-data

## Definition of done

A task is _complete_ when:

1. Code compiles (`npm run dev`),
2. Tests pass (`npm test`),
3. The feature appears in the UI without console errors,
4. All files lint clean (`npm run lint`).

## Bad practices to avoid

- Don’t commit `.env` or `dist/*.zip`; add them to `.gitignore`.
- Don’t use `eval`.

## Minecraft Information

Use https://minecraft.wiki/ as the source of truth for up-to-date Minecraft information.

Minecraft version information can be found at: https://launchermeta.mojang.com/mc/game/version_manifest.json
