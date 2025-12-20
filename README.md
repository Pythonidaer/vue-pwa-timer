# Vue PWA Timer - Monorepo

A sleek, minimalist timer application available as both a Progressive Web App (PWA) and a native desktop application. Features a retro LCD-style display with arcade-inspired 3D buttons, Picture-in-Picture support, and persistent saved times with notes.

## Repository Structure

This is a monorepo containing three applications:

- **`apps/web`** - PWA + Picture-in-Picture version (browser-based)
- **`apps/desktop`** - Tauri desktop application (native window control)
- **`apps/site`** - Marketing/download website (optional)

## Quick Start

### Install Dependencies

From the root directory:

```bash
npm install
```

This will install dependencies for all workspaces.

### Development

Run any app in development mode:

```bash
# PWA (browser)
npm run dev:web

# Desktop (Tauri - after setup)
npm run dev:desktop

# Marketing site (after setup)
npm run dev:site
```

### Building

Build any app for production:

```bash
# PWA
npm run build:web

# Desktop
npm run build:desktop

# Marketing site
npm run build:site
```

## Applications

### 🌐 Web App (`apps/web`)

The Progressive Web App version with Picture-in-Picture support.

**Features:**
- ⏱️ Digital timer with LCD-style display (DSEG font)
- 🎮 Arcade-inspired 3D circular buttons
- 💾 Save timer states with optional notes
- 📱 PWA support (installable, offline-capable)
- 🪟 Picture-in-Picture mode for always-on-top floating window
- 📤 Export saved times as JSON

**Deployment:** GitHub Pages (see `apps/web/DEPLOYMENT.md`)

### 🖥️ Desktop App (`apps/desktop`)

Native desktop application built with Tauri.

**Features:**
- Native window with exact sizing control
- Collapsed: 320x80 (timer only)
- Expanded: 320x260 (with notes drawer)
- Code signing support (macOS, Windows)
- Auto-update capability

**Status:** Setup pending - see `apps/desktop/README.md` for initialization instructions.

### 🌍 Marketing Site (`apps/site`)

Landing page and download hub.

**Features:**
- Download buttons for each platform
- Links to GitHub Releases
- App description and screenshots

**Status:** Setup pending - see `apps/site/README.md` for setup options.

## User Choice

Users can choose their preferred experience:

- **"Use in browser"** → PWA (`apps/web`)
- **"Install desktop app"** → Tauri (`apps/desktop`)

Both share the same timer logic and UI components, ensuring consistency across platforms.

## Technology Stack

- **Vue 3** - Progressive framework
- **TypeScript** - Type safety
- **Pinia** - State management
- **Vite** - Build tool
- **Tauri 2** - Desktop framework (desktop app)
- **DSEG Font** - LCD-style display
- **PrimeIcons** - Icon library

## Development

### Prerequisites

- Node.js `^20.19.0 || >=22.12.0`
- npm (comes with Node.js)

### Workspace Scripts

All scripts can be run from the root:

```bash
# Development
npm run dev:web
npm run dev:desktop
npm run dev:site

# Building
npm run build:web
npm run build:desktop
npm run build:site

# Testing
npm run test:web

# Utilities
npm run install:all  # Install all dependencies
npm run clean        # Clean all node_modules and dist folders
```

### Running Scripts in Workspaces

You can also run scripts directly in each workspace:

```bash
cd apps/web
npm run dev
```

## Project Status

- ✅ **Web App**: Fully functional PWA with PiP support
- 🚧 **Desktop App**: Structure ready, Tauri setup pending
- 🚧 **Marketing Site**: Structure ready, framework setup pending

## License

See [LICENSE](apps/web/LICENSE) file.

## Inspiration & Resources

### Design Inspiration
- **Realistic Alarm Clock Design**: [Elenorra SmartWake Mirror Alarm Clock](https://elenorra.com/products/smartwake-elektronische-spiegelwekker-met-alarmfunctie?currency=USD&country=US&variant=44704398737583)
- **Arcade Button Styling**: [CodePen - Arcade Button](https://codepen.io/reulison/pen/WNNVPZq)

### Technologies & Libraries
- **Vue.js**: [Vue 3 Documentation](https://vuejs.org/guide/essentials/application.html)
- **DSEG Font**: [GitHub - keshikan/DSEG](https://github.com/keshikan/DSEG)
- **PrimeIcons**: [PrimeVue Icons](https://primevue.org/icons/)
- **Tauri**: [Tauri Getting Started Guide](https://tauri.app/start/)
