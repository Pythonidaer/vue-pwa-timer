# Deployment Guide for Vue PWA Timer

## Step 1: Push to GitHub

1. **Add all files to git:**
   ```bash
   git add .
   ```

2. **Commit your changes:**
   ```bash
   git commit -m "Initial commit: Vue PWA Timer app"
   ```

3. **Push to GitHub:**
   ```bash
   git push origin main
   ```

   If you haven't set up the remote yet:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/vue-pwa-timer.git
   git push -u origin main
   ```

## Step 2: Set Up GitHub Pages

1. **Go to your GitHub repository** (e.g., `https://github.com/YOUR_USERNAME/vue-pwa-timer`)

2. **Click on "Settings"** (top menu)

3. **Scroll down to "Pages"** (left sidebar)

4. **Under "Source"**, select:
   - **Branch:** `gh-pages`
   - **Folder:** `/ (root)`

5. **Click "Save"**

6. **Create a GitHub Actions workflow** to automatically build and deploy:

   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: "pages"
     cancel-in-progress: false

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
         - run: npm ci
         - run: npm run build
         - uses: actions/upload-pages-artifact@v3
           with:
             path: dist

     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       needs: build
       steps:
         - id: deployment
           uses: actions/deploy-pages@v4
   ```

## Step 3: Build and Test Locally

1. **Build the production version:**
   ```bash
   npm run build
   ```

2. **Preview the build locally:**
   ```bash
   npm run preview
   ```

   This will start a local server (usually at `http://localhost:4173`)

3. **Test the PWA features:**
   - Open the preview URL in Chrome/Edge
   - Open DevTools (F12)
   - Go to "Application" tab
   - Check "Manifest" section
   - Check "Service Workers" section
   - Try "Install" button in the address bar

## Step 4: Create PWA Icons (if needed)

If you don't have PWA icons yet, you can create them:

1. **Create 192x192 and 512x512 PNG icons**
   - Use any image editor or online tool
   - Save as `public/pwa-192x192.png` and `public/pwa-512x512.png`

2. **Or use a placeholder for now:**
   - The app will work without them, but won't be installable as a PWA

## Step 5: After First Deployment

1. **Wait for GitHub Actions to complete** (check the "Actions" tab in your repo)

2. **Your app will be available at:**
   ```
   https://YOUR_USERNAME.github.io/vue-pwa-timer/
   ```

3. **Test the PWA:**
   - Visit the URL
   - Open DevTools → Application → Manifest
   - Check for any errors
   - Try installing the app (install button in address bar)

## Step 6: Testing Checklist

- [ ] Timer starts/stops correctly
- [ ] Timer can be paused
- [ ] Timer can be reset
- [ ] Save button works
- [ ] Notes input appears and works
- [ ] Saved times appear in drawer
- [ ] Drawer opens/closes
- [ ] Export functionality works
- [ ] Delete functionality works
- [ ] PWA installs correctly
- [ ] App works offline (after first load)
- [ ] App looks correct on mobile devices

## Troubleshooting

**If GitHub Pages shows 404:**
- Make sure the `base` path in `vite.config.ts` matches your repo name
- Check that the `gh-pages` branch was created
- Wait a few minutes for GitHub to propagate changes

**If PWA doesn't install:**
- Make sure you're using HTTPS (GitHub Pages provides this)
- Check browser console for errors
- Verify manifest.json is accessible
- Check that service worker is registered

**If icons don't show:**
- Verify icon files exist in `public/` folder
- Check icon paths in `vite.config.ts`
- Clear browser cache and reload

