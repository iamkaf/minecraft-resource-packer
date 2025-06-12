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

## Proxy configuration

The development server honors the standard `HTTP_PROXY`, `HTTPS_PROXY`, and
`NO_PROXY` environment variables via the `global-agent` library. Configure these
variables if your network requires a proxy.

## Required packages

Some system packages must be installed for headless development and RPM creation:

- `xvfb`
- `dbus` (or `dbus-x11`)
- `rpmbuild`

`xvfb` and `dbus` enable the headless `npm run dev:headless` workflow. `rpmbuild` is used when packaging the app as an RPM.

Run tests:

```bash
npm test
```

See `developer-handbook.md` for tips on extending the app.
