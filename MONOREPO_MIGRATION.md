# Monorepo Migration Summary

This document summarizes the migration from a single PWA app to a monorepo structure.

## What Changed

### Repository Structure

**Before:**
```
vue-pwa-timer/
├── src/
├── public/
├── package.json
└── ...
```

**After:**
```
vue-pwa-timer/
├── apps/
│   ├── web/          # PWA + PiP app (existing codebase)
│   ├── desktop/      # Tauri desktop app (setup pending)
│   └── site/         # Marketing site (setup pending)
├── package.json      # Root workspace config
└── README.md         # Updated for monorepo
```

### Key Changes

1. **Moved existing codebase** to `apps/web/`
2. **Created root `package.json`** with workspace configuration
3. **Updated package names** to use `@timer/*` namespace
4. **Created placeholder structures** for `apps/desktop` and `apps/site`
5. **Updated documentation** to reflect monorepo structure

## Next Steps

### 1. Set Up Tauri Desktop App

Navigate to `apps/desktop` and initialize Tauri:

```bash
cd apps/desktop
npm create tauri-app@latest
```

Choose:
- Framework: Vue
- UI Template: Vue
- Package Manager: npm

Then copy shared components from `apps/web/src` to `apps/desktop/src`.

### 2. Set Up Marketing Site

Navigate to `apps/site` and choose a framework:

**Option A: Vite + Vue** (matches web app)
```bash
cd apps/site
npm create vite@latest . -- --template vue-ts
```

**Option B: Next.js**
```bash
cd apps/site
npx create-next-app@latest .
```

**Option C: Astro**
```bash
cd apps/site
npm create astro@latest .
```

### 3. Update GitHub Actions

If you have existing GitHub Actions workflows, update paths:
- Build command: `npm run build:web` (instead of `npm run build`)
- Build output: `apps/web/dist` (instead of `dist`)

### 4. Test Everything

```bash
# From root
npm install              # Install all dependencies
npm run dev:web         # Test web app
npm run build:web       # Test web build
npm run test:web        # Test web tests
```

## Benefits of Monorepo

1. **Single Source of Truth**: Shared timer logic and UI components
2. **Consistent Experience**: Same UI/UX across web and desktop
3. **Easier Maintenance**: One repo for all platforms
4. **User Choice**: Users can choose PWA or desktop app
5. **Future-Proof**: Easy to add more platforms (mobile, etc.)

## Workspace Scripts

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
npm run install:all    # Install all dependencies
npm run clean          # Clean all node_modules and dist
```

## File Locations

- **Web app config**: `apps/web/vite.config.ts`
- **Web app source**: `apps/web/src/`
- **Web deployment**: `apps/web/DEPLOYMENT.md`
- **Desktop setup**: `apps/desktop/README.md`
- **Site setup**: `apps/site/README.md`

## Notes

- The web app's base path (`/vue-pwa-timer/`) remains unchanged
- All existing functionality is preserved in `apps/web`
- Dependencies are managed at the workspace level
- Each app can have its own `node_modules` if needed

