# Development

Install dependencies and run:

```bash
npm i
npm run dev
```

On servers without a display you can run the headless variant which starts via `xvfb` and passes `--no-sandbox` so Electron can run as root:

```bash
npm run dev:headless
```

Run tests:

```bash
npm test
```

See `developer-handbook.md` for tips on extending the app.
