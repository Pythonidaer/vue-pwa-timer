# Desktop App (Tauri)

Native desktop timer widget built with Tauri 2 and Vue 3.

## Prerequisites

Before you can build or run the desktop app, you need to install Rust:

### macOS/Linux
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Windows
Download and run [rustup-init.exe](https://rustup.rs/)

After installation, restart your terminal or run:
```bash
source $HOME/.cargo/env
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create app icons:**
   Place icon files in `src-tauri/icons/`:
   - `32x32.png`
   - `128x128.png`
   - `128x128@2x.png`
   - `icon.icns` (macOS)
   - `icon.ico` (Windows)

   You can use the icons from `apps/web/public/` as a starting point.

## Development

Run the app in development mode:

```bash
npm run dev
```

This will:
- Start the Vite dev server
- Compile the Rust backend
- Launch the desktop window

## Building

Build the app for your current platform:

```bash
npm run build
```

This generates installers in `src-tauri/target/release/bundle/`:
- **macOS**: `.app` and `.dmg`
- **Windows**: `.msi` and `.exe`
- **Linux**: `AppImage` and `.deb`

## Features

- **Dynamic Window Sizing:**
  - Collapsed: 320x80 (timer only)
  - Expanded: 320x260 (with notes drawer)
- **Always On Top:** Window stays above other applications
- **No Decorations:** Clean, borderless window
- **Transparent Background:** Matches the web app design

## Window Controls

The app uses Tauri's window API to:
- Resize dynamically when drawer opens/closes
- Stay always on top
- Skip taskbar (optional, configured in `tauri.conf.json`)

## Code Signing

For distribution, you'll need to set up code signing:

- **macOS**: Apple Developer Program ($99/year)
- **Windows**: Code signing certificate
- **Linux**: Optional (AppImage doesn't require signing)

See the main README for more details on distribution.
