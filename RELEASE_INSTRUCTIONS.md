# GitHub Release Setup Instructions

## Step 1: Create the Release

1. Go to: https://github.com/Pythonidaer/vue-pwa-timer/releases/new
2. **Tag**: `v0.1.0` (must match the version in `tauri.conf.json`)
3. **Release title**: `v0.1.0 - First Release`
4. **Description**: Copy the contents from `RELEASE_NOTES_v0.1.0.md`

## Step 2: Upload Build Artifacts

### macOS
Upload the DMG file:
```
apps/desktop/src-tauri/target/release/bundle/dmg/Timer_0.1.0_aarch64.dmg
```

**Note**: If you also built for Intel Mac, upload:
```
apps/desktop/src-tauri/target/release/bundle/dmg/Timer_0.1.0_x64.dmg
```

### Windows
If you built for Windows, upload:
```
apps/desktop/src-tauri/target/release/bundle/msi/Timer_0.1.0_x64.msi
```
OR
```
apps/desktop/src-tauri/target/release/bundle/nsis/Timer_0.1.0_x64-setup.exe
```

### Linux
If you built for Linux, upload:
```
apps/desktop/src-tauri/target/release/bundle/appimage/Timer_0.1.0_amd64.AppImage
```

## Step 3: Publish the Release

1. Click "Publish release"
2. The download buttons on the marketing site will automatically work!

## Step 4: Test Downloads

1. Visit your marketing site: https://Pythonidaer.github.io/vue-pwa-timer/site/
2. Click the download buttons
3. Verify they download the correct files from GitHub Releases

## Building for Other Platforms

### Windows (from macOS/Linux)
```bash
cd apps/desktop
npm run build
# Windows builds require cross-compilation or a Windows machine
```

### Linux (from macOS/Windows)
```bash
cd apps/desktop
npm run build
# Linux builds may require Docker or a Linux machine
```

### All Platforms (recommended)
Use GitHub Actions to build for all platforms automatically. See Tauri documentation for CI/CD setup.

## Current Build Status

✅ **macOS (Apple Silicon)**: Built and ready
- File: `Timer_0.1.0_aarch64.dmg`
- Location: `apps/desktop/src-tauri/target/release/bundle/dmg/`

⚠️ **Windows**: Not built yet (requires Windows or cross-compilation)
⚠️ **Linux**: Not built yet (requires Linux or Docker)

## Next Steps After Release

1. Test the macOS download
2. Build Windows/Linux versions if needed
3. Update the release with additional platform files
4. Set up GitHub Actions for automated builds (optional)

