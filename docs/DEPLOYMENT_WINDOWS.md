# Windows Desktop Deployment Guide

## Overview

The Mood Tracker desktop app for Windows is built by wrapping the Expo web export in an Electron shell. This approach leverages the same React Native codebase used for iOS, compiled to web via Metro, then packaged as a native Windows application.

## Prerequisites

- **Node.js 20+**: Required for Electron and build tools
- **npm**: Package manager (comes with Node.js)
- **Windows 10/11**: Target OS (builds must be created on Windows for NSIS installer)
- **Electron Builder**: Handles packaging and installer creation

## Step 1: Build the Expo Web Bundle

First, export the app as a static web bundle:

```bash
cd mood-tracker
npx expo export --platform web
```

This creates a `dist/` directory containing:

- `index.html` - Entry point
- `bundle.js` - Compiled JavaScript
- `assets/` - Static assets

Verify the build works locally:

```bash
npx serve dist
```

Open http://localhost:3000 in a browser to verify the app renders correctly.

## Step 2: Install Electron Dependencies

```bash
cd electron
npm install
```

This installs `electron` and `electron-builder` as defined in `electron/package.json`.

## Step 3: Development Mode

Run the Electron app pointing at the Expo dev server:

```bash
# Terminal 1: Start Expo dev server
cd mood-tracker
npx expo start --web

# Terminal 2: Start Electron
cd electron
NODE_ENV=development EXPO_DEV_SERVER_URL=http://localhost:8081 npm start
```

Or use the combined script from the root package.json:

```bash
npm run electron:dev
```

## Step 4: Build Windows Installer

### From the electron directory:

```bash
cd electron
npm run build:win
```

This uses `electron-builder` to create:

1. **NSIS Installer** (`MoodTracker-Setup-1.0.0.exe`)
   - Standard Windows installer with install directory selection
   - Desktop and Start Menu shortcuts
   - Uninstaller included

2. **Portable** (`MoodTracker-1.0.0.exe`)
   - Single-file portable executable
   - No installation required
   - Can be run from any location

### Output Location

Built installers are placed in:

```
dist-electron/
├── MoodTracker-Setup-1.0.0.exe    # NSIS installer
├── MoodTracker-1.0.0.exe          # Portable version
└── win-unpacked/                   # Unpacked application directory
```

## Step 5: Code Signing (Recommended for Distribution)

### Obtain a Code Signing Certificate

1. Purchase a Windows code signing certificate from a trusted CA:
   - DigiCert
   - Sectigo (formerly Comodo)
   - GlobalSign

2. Certificate types:
   - **OV (Organization Validation)**: Standard, ~$100-200/year
   - **EV (Extended Validation)**: Higher trust, immediate SmartScreen bypass, ~$300-500/year

### Configure Signing

Add to `electron/package.json` under the `build.win` section:

```json
{
  "build": {
    "win": {
      "certificateFile": "path/to/certificate.pfx",
      "certificatePassword": "your-password",
      "signingHashAlgorithms": ["sha256"],
      "rfc3161TimeStampServer": "http://timestamp.digicert.com"
    }
  }
}
```

Or use environment variables:

```bash
CSC_LINK=path/to/certificate.pfx
CSC_KEY_PASSWORD=your-password
npm run build:win
```

### SmartScreen Warnings

Unsigned or newly signed apps may trigger Windows SmartScreen warnings. Options:

1. **EV Certificate**: Immediate bypass (recommended for commercial distribution)
2. **Build reputation**: Let the app build download reputation over time
3. **Submission to Microsoft**: Submit to Windows Defender for analysis

## Step 6: Auto-Update Configuration (Optional)

To enable automatic updates, integrate `electron-updater`:

### Install

```bash
cd electron
npm install electron-updater
```

### Update main.js

Add update checking logic:

```javascript
const { autoUpdater } = require('electron-updater');

app.whenReady().then(() => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on('update-downloaded', () => {
  mainWindow?.webContents.send('update-available');
});
```

### Host Updates

Options for hosting updates:
- **GitHub Releases**: Free, integrated with your repo
- **S3 Bucket**: Scalable, pay-per-download
- **Custom server**: Full control

### Configure update source

Add to `electron/package.json`:

```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "samink02",
      "repo": "mood-tracker"
    }
  }
}
```

## Step 7: Distribution

### Direct Download

Host the installer on:
- GitHub Releases page
- Your website
- Cloud storage (S3, Azure Blob, etc.)

### Microsoft Store (Optional)

For Microsoft Store distribution:

1. **Reserve app name** in Partner Center
2. **Convert to MSIX**:
   ```bash
   electron-builder --win msix
   ```
3. **Submit** through Partner Center

Requirements:
- Microsoft Developer Account ($19 one-time)
- App passes Windows App Certification Kit tests

## Troubleshooting

### Build Fails with "Cannot find module"

Ensure `npm install` was run in both the root and `electron/` directories.

### Blank Window on Launch

- Verify `dist/index.html` exists after `expo export`
- Check file paths in `electron/main.js` are relative to the correct directory
- Try loading from dev server first to isolate the issue

### App Crashes on Start

- Open DevTools (F12) to check console errors
- Verify `contextIsolation: true` and `nodeIntegration: false`
- Check for incompatible native modules

### Notifications Not Working on Desktop

- Web notifications require user permission
- Check browser notification settings in the web view
- Consider using `electron-daily-notifications` for native Windows notifications

### Performance Issues

- Enable hardware acceleration: `app.commandLine.appendSwitch('enable-gpu')`
- Disable unnecessary features: `app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')`
- Consider lazy loading for chart components

## Architecture Diagram

```
┌─────────────────────────────────┐
│        Windows OS               │
│  ┌───────────────────────────┐  │
│  │   Electron Main Process   │  │
│  │  (main.js, Node.js)      │  │
│  │                           │  │
│  │  ┌─────────────────────┐  │  │
│  │  │  BrowserWindow      │  │  │
│  │  │  (Chromium)         │  │  │
│  │  │                     │  │  │
│  │  │  ┌───────────────┐  │  │  │
│  │  │  │  Expo Web     │  │  │  │
│  │  │  │  Build (dist/)│  │  │  │
│  │  │  │               │  │  │  │
│  │  │  │ React Native  │  │  │  │
│  │  │  │ Components    │  │  │  │
│  │  │  │               │  │  │  │
│  │  │  │ Zustand Stores│  │  │  │
│  │  │  │ (localStorage)│  │  │  │
│  │  │  └───────────────┘  │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```
