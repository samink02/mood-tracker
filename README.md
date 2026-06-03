# Mood Tracker - Journaling & Mood Tracking App

A comprehensive cross-platform journaling and mood-tracking application built with React Native + Expo, targeting iOS and Windows desktop.

## 🚀 Tech Stack

- **React Native**: Cross-platform mobile development framework
- **Expo**: Development and production platform for React Native apps
- **TypeScript**: Type-safe JavaScript for better code quality and developer experience
- **Zustand**: Lightweight state management library
- **AsyncStorage**: Local data persistence
- **Victory Native**: Charting library for data visualization
- **React Navigation**: Navigation between screens
- **Expo Notifications**: Daily reminder notifications

## Why Expo?

Expo was chosen for this project because it provides:

1. **Fast Iteration**: Quick development cycle with hot reloading and instant preview
2. **Managed Builds**: Automated build pipelines for iOS and Android
3. **Web Support**: Built-in web compilation for desktop wrapper (Electron/Tauri)
4. **Access to Native APIs**: Easy integration with device features like notifications
5. **Over-the-Air Updates**: Push updates without App Store review
6. **Development Tools**: Rich suite of debugging and testing tools

## 📋 Prerequisites

### Core Requirements
- **Node.js**: v18 or higher
- **npm**: v9 or higher (or yarn/pnpm)
- **Expo CLI**: `npm install -g expo-cli`

### iOS Development
- **macOS**: Required for iOS development
- **Xcode**: Latest version from the App Store
- **CocoaPods**: `sudo gem install cocoapods`
- **iOS Simulator**: Included with Xcode

### Windows Desktop (Electron Wrapper)
- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Electron**: Added as dev dependency

## 🛠️ Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/samink02/mood-tracker.git
cd mood-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env to add your API keys or other environment variables
```

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed environment configuration.

### 4. Run the App

#### Development (iOS)
```bash
# Start the Expo development server
npm start

# Or directly run on iOS simulator
npm run ios
```

#### Development (Web/Desktop)
```bash
# Run in web browser (for Electron wrapper)
npm run web
```

#### Development (Android)
```bash
# Run on Android emulator or device
npm run android
```

## 📱 Build & Deployment

### iOS Build
```bash
# Using EAS (Expo Application Services) - Recommended
npm run build:ios

# Using local Xcode
npx expo run:ios
```

See [DEPLOYMENT_IOS.md](./docs/DEPLOYMENT_IOS.md) for detailed iOS deployment instructions.

### Windows Desktop (Electron)
```bash
# Build web bundle
npm run build:web

# Run Electron in development mode
npm run electron:dev

# Package for Windows
npm run electron:build
```

See [docs/DEPLOYMENT_WINDOWS.md](./docs/DEPLOYMENT_WINDOWS.md) for detailed Windows deployment instructions.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test --watch

# Run tests with coverage
npm test --coverage
```

## 🔧 Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator/device
- `npm run web` - Run in web browser
- `npm test` - Run Jest tests
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run build:web` - Build web bundle for Electron
- `npm run electron:dev` - Run Electron in development mode

## 📁 Project Structure

```
mood-tracker/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Screen components
│   ├── navigation/       # Navigation configuration
│   ├── hooks/            # Custom React hooks
│   ├── models/           # TypeScript interfaces and types
│   ├── services/         # API and data services
│   ├── state/            # State management (Zustand stores)
│   ├── utils/            # Utility functions
│   ├── tests/            # Test files
│   └── config/           # Configuration files
├── docs/                 # Documentation
├── electron/             # Electron configuration for Windows
├── assets/               # Images, fonts, and other assets
└── App.tsx              # Main app entry point
```

## 🏗️ Architecture

This application uses a clean, modular architecture:

- **State Management**: Zustand with AsyncStorage persistence
- **Navigation**: React Navigation with tabs and stack
- **Component Structure**: Reusable, type-safe components
- **Data Layer**: Separated models and utilities
- **Testing**: Jest with React Native Testing Library

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed architecture documentation.

## 📊 Features

### Daily Journal
- Track overall mood with emoji indicators
- Log sleep patterns (bedtime, wake time, total hours)
- Record activities with duration and exhaustion levels
- Track meals, drinks, and snacks with calorie counting
- Multi-select emotions from comprehensive emotion list

### Trends & Analytics
- Visual charts for mood trends over time
- Sleep pattern analysis
- Activity and calorie tracking visualization
- Weekly GAD-7 and PHQ-9 mental health assessments

### To-Do List
- Persistent to-dos that roll over day-to-day
- Status tracking (not started, in progress, ongoing, on hold, done)
- Task management with descriptions

### Notifications
- Configurable daily reminder notifications
- Choose morning and/or evening reminder times
- Local notification scheduling

### Weekly Check-in
- GAD-7 anxiety screening questionnaire
- PHQ-9 depression screening questionnaire
- Weekly score tracking and trends
- Professional disclaimer included

## 🔐 Environment Variables

The app supports environment variables via `.env` file. Available variables include:

- Notification configuration
- API keys for future backend integration
- Feature flags

See [ENV_SETUP.md](./ENV_SETUP.md) for complete configuration guide.

## 📄 License

This project is licensed under the terms specified in the [LICENSE](./LICENSE) file.

## 🤝 Contributing

See [docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md) for contribution guidelines.

## ⚠️ Medical Disclaimer

The GAD-7 and PHQ-9 questionnaires included in this app are screening tools only and are not a substitute for professional diagnosis or treatment. Always consult with a qualified healthcare provider for mental health concerns.

## 📞 Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Built with ❤️ using React Native + Expo**