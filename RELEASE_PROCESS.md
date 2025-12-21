# Release Process

This document explains how to create a new release with builds for all platforms.

## Overview

The GitHub Actions workflow (`build-release.yml`) automatically builds for all platforms when you push a version tag. The workflow:

1. Builds for macOS (Apple Silicon and Intel)
2. Builds for Windows
3. Builds for Linux
4. Creates a GitHub Release with all artifacts
5. Uploads the artifacts to the release

## Steps to Create a Release

### 1. Update Version

Update the version in `apps/desktop/src-tauri/tauri.conf.json`:

```json
{
  "version": "0.1.0",  // Update this
  ...
}
```

### 2. Update Downloads Component (if version changed)

If the version number changes, update `apps/site/src/components/Downloads.vue`:

```typescript
const version = 'v0.1.0'  // Update this to match your release
```

### 3. Create Release Notes

Create or update `RELEASE_NOTES_v0.1.0.md` (replace `0.1.0` with your version) with:
- Features
- Installation instructions
- Known issues
- Links

### 4. Commit and Push Changes

```bash
git add .
git commit -m "Prepare v0.1.0 release"
git push
```

### 5. Create and Push Tag

```bash
git tag v0.1.0
git push origin v0.1.0
```

**OR** use GitHub's web interface:
1. Go to Releases → Draft a new release
2. Choose "Create new tag: v0.1.0"
3. The workflow will automatically build and attach artifacts

### 6. Wait for Build

The GitHub Actions workflow will:
- Build all platforms (takes ~15-30 minutes)
- Create the release automatically
- Attach all build artifacts
- Use the release notes from `RELEASE_NOTES_v0.1.0.md`

### 7. Verify Release

1. Go to https://github.com/Pythonidaer/vue-pwa-timer/releases
2. Verify all artifacts are attached:
   - `Timer_0.1.0_aarch64.dmg` (macOS Apple Silicon)
   - `Timer_0.1.0_x64.dmg` (macOS Intel)
   - `Timer_0.1.0_x64-setup.exe` (Windows)
   - `Timer_0.1.0_amd64.AppImage` (Linux)
3. Test download links on the marketing site

## Manual Release (Alternative)

If you need to manually trigger a build:

1. Go to Actions → Build Release
2. Click "Run workflow"
3. Enter the version tag (e.g., `v0.1.0`)
4. Click "Run workflow"

**Note:** Manual runs won't automatically create a release. You'll need to manually create the release and upload the artifacts.

## File Naming Convention

The workflow generates files with this pattern:
- macOS: `Timer_{VERSION}_aarch64.dmg` and `Timer_{VERSION}_x64.dmg`
- Windows: `Timer_{VERSION}_x64-setup.exe`
- Linux: `Timer_{VERSION}_amd64.AppImage`

The Downloads component expects these exact names. If you change the naming, update `Downloads.vue` accordingly.

## Troubleshooting

### Build Fails

1. Check the Actions tab for error messages
2. Verify all dependencies are in `package.json`
3. For macOS: Ensure `MACOS_SIGNING_IDENTITY` secret is set (optional, but needed for signing)

### Missing Artifacts

1. Check that all build jobs completed successfully
2. Verify bundle paths in the workflow match Tauri's output
3. Check the "List artifacts" step output in the release job

### Downloads Component Not Working

1. Verify the version in `Downloads.vue` matches the release tag
2. Check that file names in the release match the URLs in the component
3. Ensure the GitHub repository name is correct

## macOS Code Signing

For macOS builds to be properly signed, you need to:

1. Set the `MACOS_SIGNING_IDENTITY` secret in GitHub:
   - Go to Settings → Secrets and variables → Actions
   - Add secret: `MACOS_SIGNING_IDENTITY`
   - Value: `Developer ID Application: Jonathan M Hammond (GW487VFKLS)`

**Note:** Code signing works, but notarization is still required to remove Gatekeeper warnings for internet downloads. Notarization requires additional setup (App Store Connect API key or Apple ID credentials).

