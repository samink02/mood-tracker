# iOS Deployment Guide

## Prerequisites

- **Apple Developer Account**: Required for App Store distribution ($99/year)
- **Xcode 15+**: Installed on macOS
- **Expo CLI**: `npm install -g eas-cli`
- **EAS Project**: Linked to your Expo account

## Step 1: Configure EAS

### Install EAS CLI

```bash
npm install -g eas-cli
```

### Log in to Expo

```bash
eas login
```

### Create EAS Project

```bash
cd mood-tracker
eas build:configure
```

This generates `eas.json` with build profiles.

### eas.json Configuration

Create or update `eas.json`:

```json
{
  "cli": {
    "version": ">= 13.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

## Step 2: Build for iOS

### Development Build (Simulator)

```bash
eas build --platform ios --profile development
```

Install on simulator:

```bash
eas build:run --platform ios --latest
```

### Preview Build (Internal Testing)

```bash
eas build --platform ios --profile preview
```

### Production Build

```bash
eas build --platform ios --profile production
```

## Step 3: Test the Build

### On Simulator

```bash
# Download and install the build
eas build:run --platform ios --latest
```

### On Physical Device

1. Install the Expo Go app on your iPhone
2. For development builds, use the development client
3. Scan the QR code from `eas build:run` output

### Verify Key Features

- [ ] App launches without crashing
- [ ] Navigation between tabs works
- [ ] Journal entry creation and persistence
- [ ] Mood selector responds to taps
- [ ] Sleep card time entry works
- [ ] Emotion picker modal opens/closes
- [ ] Activity/meal CRUD operations
- [ ] To-do list add/complete/delete
- [ ] Weekly check-in questionnaire flow
- [ ] Charts display on Trends screen
- [ ] Notification permissions requested on first launch
- [ ] Settings persist across app restarts
- [ ] Data survives app kill and restart (AsyncStorage)

## Step 4: Submit to App Store

### Prepare App Store Metadata

Create `app-store-metadata.json` or use the EAS Submit web interface:

- **App Name**: Mood Tracker
- **Category**: Health & Fitness
- **Rating**: 4+ (no violence, no mature content)
- **Description**: A personal wellness journal with mood tracking, activity logging, and mental health screening tools.
- **Keywords**: journal, mood, tracker, wellness, mental health, anxiety, depression, GAD-7, PHQ-9
- **Support URL**: your support page
- **Privacy Policy URL**: your privacy policy

### Submit via EAS

```bash
eas submit --platform ios --profile production --latest
```

Or submit with automatic build:

```bash
eas build --platform ios --profile production --auto-submit
```

### App Store Review Notes

Include in review notes:
- This is a personal wellness tracking app
- All data is stored locally on the device
- The GAD-7 and PHQ-9 are validated screening tools, not diagnostic instruments
- A medical disclaimer is prominently displayed in the app

## Step 5: Post-Release

### Monitor for Issues

- Check Xcode Organizer for crash reports
- Monitor App Store Connect for user reviews
- Use `eas update` for over-the-air updates if needed

### OTA Updates (EAS Update)

For minor changes that don't require native code:

```bash
eas update --platform ios --message "Bug fix description"
```

## Troubleshooting

### Build Fails

1. Check `eas-build-local` for local reproduction
2. Verify all native dependencies are compatible with Expo SDK
3. Run `npx expo-doctor` to check dependency compatibility

### Push Notification Issues

- Ensure `aps-environment` is set to `production` for App Store builds
- Verify the notification entitlement is in your provisioning profile
- Test on a real device (simulators don't fully support push notifications)

### App Store Rejection

Common reasons:
- Missing privacy policy
- Medical disclaimer not prominent enough
- Mentioning "diagnosis" or "treatment" without proper disclaimers
- Missing App Tracking Transparency disclosure (if applicable)

## Environment Variables for Production

Set these in EAS Secrets:

```bash
eas secret:push --scope project --env EXPO_NOTIFICATIONS_API_KEY --value your-api-key
eas secret:push --scope project --env EAS_PROJECT_ID --value your-project-id
```
