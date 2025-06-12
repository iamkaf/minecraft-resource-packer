# AGENTS.md

## Project overview

You are a coding agent in a monorepo that hosts an Electron + React + TypeScript application
called **minecraft-resource-packer**.
Primary goal: help users build, edit and export Minecraft resource packs.
For more details on project structure and IPC patterns, see `docs/developer-handbook.md`.

## Commands & workflows

- **Install deps:** `npm i`
- **Dev server:** `npm run dev` (Electron Forge with reload)
  - Requires a graphical environment; headless systems fail with an EPIPE error.
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
- chokidar, archiver, minecraft-data

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
