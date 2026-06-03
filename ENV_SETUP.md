# Environment Setup Guide

This guide explains how to configure environment variables for the Mood Tracker app.

## Overview

The application uses environment variables to manage configuration, API keys, and sensitive data. Environment variables are loaded using `react-native-dotenv` or `expo-constants` patterns.

## Setup Steps

### 1. Create Environment File

Copy the example environment file to create your local configuration:

```bash
cp .env.example .env
```

### 2. Configure Variables

Edit the `.env` file to add your specific values. The file should never be committed to version control (it's in `.gitignore`).

### 3. TypeScript Configuration

Ensure your `tsconfig.json` includes environment variable paths:

```json
{
  "extends": "expo/tsconfig.base",
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".env.ts"
  ]
}
```

### 4. Restart Development Server

After creating or modifying `.env`, restart your development server:

```bash
npm start
```

## Available Environment Variables

### Notification Configuration

```bash
# Expo Notifications API (for production push notifications)
EXPO_NOTIFICATIONS_API_KEY=your_notifications_api_key
EXPO_NOTIFICATIONS_AUTH_TOKEN=your_auth_token
```

### Backend Configuration (Future)

```bash
# API endpoints
API_BASE_URL=https://api.example.com
API_TIMEOUT=30000

# Authentication
AUTH_TOKEN_SECRET=your_secret_key
```

### Feature Flags

```bash
# Enable/disable features
ENABLE_ANALYTICS=true
ENABLE_CRASH_REPORTING=true
ENABLE_BETA_FEATURES=false
```

### Development Settings

```bash
# Development mode
DEV_MODE=true

# Debug settings
DEBUG_LOGGING=true
VERBOSE_LOGGING=false
```

## Usage in Code

### Using react-native-dotenv

```typescript
import { EXPO_NOTIFICATIONS_API_KEY, API_BASE_URL } from '@env';

export const setupNotifications = async () => {
  const apiKey = EXPO_NOTIFICATIONS_API_KEY;
  // Use API key for configuration
};
```

### Using expo-constants

```typescript
import Constants from 'expo-constants';

const expoConfig = Constants.expoConfig;
const extraConfig = expoConfig?.extra || {};

const notificationsEnabled = extraConfig.notificationsEnabled;
```

## App Configuration

Environment variables can also be loaded via `app.config.ts`:

```typescript
import 'dotenv/config';

export default {
  name: 'Mood Tracker',
  version: '1.0.0',
  extra: {
    apiUrl: process.env.API_BASE_URL,
    notificationsEnabled: process.env.ENABLE_ANALYTICS === 'true',
  },
};
```

## Security Best Practices

### 1. Never Commit `.env` Files
The `.env` file is included in `.gitignore` to prevent accidental commits.

### 2. Use Different Environments
Maintain separate environment files for different stages:
- `.env` - Local development
- `.env.staging` - Staging environment
- `.env.production` - Production environment

### 3. Use Secret Managers
For production, consider using:
- **Expo Secrets**: `eas secret:push`
- **Environment Variables**: Store in deployment platform
- **Secret Management Services**: AWS Secrets Manager, Azure Key Vault

### 4. Rotate Keys Regularly
- Update API keys periodically
- Use short-lived tokens when possible
- Implement key rotation strategies

## Testing with Environment Variables

### Local Development
```bash
# Test with development variables
npm start

# Test with staging variables
cp .env.staging .env
npm start
```

### CI/CD Integration
Configure environment variables in your CI/CD pipeline:

```yaml
# Example GitHub Actions
env:
  API_BASE_URL: ${{ secrets.API_BASE_URL }}
  EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

## Common Issues

### Variables Not Loading
1. Restart the development server after modifying `.env`
2. Check variable names match exactly (case-sensitive)
3. Verify no trailing spaces in variable values
4. Ensure `.env` is in the project root

### TypeScript Errors
1. Create type definitions for environment variables
2. Add to `tsconfig.json` include paths
3. Restart TypeScript server

### Platform-Specific Variables
```bash
# iOS specific
IOS_BUNDLE_ID=com.moodtracker.app

# Web specific
WEB_URL=https://moodtracker.example.com

# Windows specific
WINDOWS_APP_ID=com.moodtracker.windows
```

## Example .env File

```bash
# Notification Configuration
EXPO_NOTIFICATIONS_API_KEY=your_api_key_here
EXPO_NOTIFICATIONS_AUTH_TOKEN=your_auth_token_here

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_CRASH_REPORTING=true
ENABLE_BETA_FEATURES=false

# Development Settings
DEV_MODE=true
DEBUG_LOGGING=true
VERBOSE_LOGGING=false

# API Configuration (Future)
API_BASE_URL=https://api.moodtracker.com
API_TIMEOUT=30000

# Authentication (Future)
AUTH_TOKEN_SECRET=your_secret_key_here
```

## Next Steps

1. Copy `.env.example` to `.env`
2. Add your specific values to `.env`
3. Restart development server
4. Test that variables load correctly
5. Commit `.env.example` (not `.env`)

For more information, see:
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [react-native-dotenv Documentation](https://github.com/goatandsheep/react-native-dotenv)