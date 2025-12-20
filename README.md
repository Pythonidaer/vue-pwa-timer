# Vue PWA Timer

A sleek, minimalist timer application built with Vue 3, TypeScript, and PWA capabilities. Features a retro LCD-style display with arcade-inspired 3D buttons, Picture-in-Picture support, and persistent saved times with notes.

## Features

- ⏱️ Digital timer with LCD-style display (DSEG font)
- 🎮 Arcade-inspired 3D circular buttons
- 💾 Save timer states with optional notes
- 📱 Progressive Web App (PWA) support
- 🪟 Picture-in-Picture mode for always-on-top floating window
- 💾 Persistent storage using localStorage
- 📤 Export saved times as JSON
- 🎨 Sleek, dark-themed UI

## Inspiration & Resources

### Design Inspiration
- **Realistic Alarm Clock Design**: [Elenorra SmartWake Mirror Alarm Clock](https://elenorra.com/products/smartwake-elektronische-spiegelwekker-met-alarmfunctie?currency=USD&country=US&variant=44704398737583) - Inspiration for the sleek, minimalist timer interface
- **Arcade Button Styling**: [CodePen - Arcade Button](https://codepen.io/reulison/pen/WNNVPZq) - Inspiration for the 3D circular button design

### Technologies & Libraries
- **Vue.js**: [Vue 3 Documentation](https://vuejs.org/guide/essentials/application.html) - Core framework
- **DSEG Font**: [GitHub - keshikan/DSEG](https://github.com/keshikan/DSEG) - LCD-style display font for timer numbers
- **PrimeIcons**: [PrimeVue Icons](https://primevue.org/icons/) - Icon library for UI elements

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Future Updates

### Tauri Desktop Application

The next major milestone is to recreate this application as a legitimate desktop application using [Tauri](https://tauri.app/start/). This will provide:

- **Native Desktop Experience**: True desktop application with system integration
- **Code Signing**: Proper app signing to avoid insecure/unsigned warnings
- **App Store Distribution**: Ability to distribute through official app stores
- **Better Performance**: Native performance with smaller bundle sizes
- **Cross-Platform**: Support for Windows, macOS, and Linux

The migration to Tauri will involve:
1. Setting up Tauri project structure
2. Configuring code signing certificates
3. Navigating the App Developer process for each platform:
   - **macOS**: Apple Developer Program for code signing and notarization
   - **Windows**: Code signing certificate for Windows Store or direct distribution
   - **Linux**: AppImage, Snap, or Flatpak packaging
4. Implementing native features (system tray, notifications, etc.)
5. Building and distributing signed releases

For more information on getting started with Tauri, visit: [Tauri Getting Started Guide](https://tauri.app/start/)
