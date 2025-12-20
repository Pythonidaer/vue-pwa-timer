# Marketing/Download Site

This is the marketing and download site for the Timer widget.

## Purpose

- Landing page with app description
- Download buttons for each platform (macOS, Windows, Linux)
- Links to GitHub Releases
- Optional: Documentation, screenshots, feature list

## Hosting Options

- **Netlify**: Easy deployment with GitHub integration
- **Vercel**: Fast deployment, great for static sites
- **GitHub Pages**: Free hosting for open source projects

## Setup

Choose your preferred framework:

### Option 1: Vite + Vue (matches web app)
```bash
npm create vite@latest . -- --template vue-ts
```

### Option 2: Next.js
```bash
npx create-next-app@latest .
```

### Option 3: Astro
```bash
npm create astro@latest .
```

## Download Links

Link to GitHub Releases:
- macOS: `https://github.com/YOUR_USERNAME/vue-pwa-timer/releases/latest/download/timer_0.1.0_x64.app.dmg`
- Windows: `https://github.com/YOUR_USERNAME/vue-pwa-timer/releases/latest/download/timer_0.1.0_x64_en-US.msi`
- Linux: `https://github.com/YOUR_USERNAME/vue-pwa-timer/releases/latest/download/timer_0.1.0_amd64.AppImage`

## Development

```bash
# From root
npm run dev:site

# Or from this directory
npm run dev
```

