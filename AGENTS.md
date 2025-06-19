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
5. There are no type errors (`npm run typecheck`),
6. Code is formatted (`npm run format`).

## Bad practices to avoid

- Don’t commit `.env` or `dist/*.zip`; add them to `.gitignore`.
- Don’t use `eval`.

## Minecraft Information

Use https://minecraft.wiki/ as the source of truth for up-to-date Minecraft information.

Minecraft version information can be found at: https://launchermeta.mojang.com/mc/game/version_manifest.json

## Task Context

1. The repository root contains `TODO.md`, a list of unchecked feature bullets.
2. Every UI component and helper must ship with **Vitest + React-Testing-Library tests** and keep total coverage ≥ 90 %.

## Glossary of Definitions

- The Project Manager is the view in which the user can view and manage projects, the front page of the app.
- The Editor is the view where the user edits a project.
  - The Asset Selector is the part of the Editor that lets you pick an asset from vanilla Minecraft to add to your project
  - The Asset Browser is the part of the Editor where you manage the assets in your project
  - The Texture Lab is the part of the Editor where you can make quick edits to your textures
