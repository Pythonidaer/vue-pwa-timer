# Desktop App (Tauri)

This is the Tauri desktop application for the Timer widget.

## Setup

To initialize Tauri, run:

```bash
npm create tauri-app@latest
```

Follow the prompts and select:
- **Framework**: Vue
- **UI Template**: Vue
- **Package Manager**: npm

Then copy the shared timer logic from `apps/web/src` to this app.

## Features

- Native desktop window with exact sizing control
- Collapsed: 320x80 (timer only)
- Expanded: 320x260 (with notes drawer)
- Code signing support (macOS, Windows)
- Auto-update capability

## Development

```bash
# From root
npm run dev:desktop

# Or from this directory
npm run dev
```

## Building

```bash
# From root
npm run build:desktop

# Or from this directory
npm run build
```

This will generate platform-specific installers:
- macOS: `.app` / `.dmg`
- Windows: `.msi` / `.exe`
- Linux: `AppImage` / `.deb`

## Distribution

Upload installers to GitHub Releases. The marketing site (`apps/site`) will link to these releases.

