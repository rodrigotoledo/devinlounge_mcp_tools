# React Native Setup Guide — Expo & Native Options

Configuration for React Native development using Expo (recommended) or native CLI.

---

## 📱 When to Use What

| Approach | Use Case | Setup Time | Deployment |
|----------|----------|-----------|-----------|
| **Expo** | MVP, rapid dev, easy testing | 5 min | EAS Build (cloud) or Expo Go |
| **React Native CLI** | Production app, native modules needed | 30 min | Xcode/Android Studio |
| **Expo + Prebuild** | Most projects (hybrid) | 15 min | Both cloud & native |

**Recommendation:** Start with Expo. Migrate to native when you hit Expo's limitations (uncommon).

---

## 🚀 Expo Setup (Recommended)

### Installation

```bash
# Global CLI (on host, not Docker)
npm install --global expo-cli

# Or use npx (no global install needed)
npx expo --version
```

### Create New Project

```bash
npx create-expo-app@latest expo-mobile --template

# Or with Typescript + Expo Router
npx create-expo-app@latest expo-mobile --template
# Then upgrade to Router

cd expo-mobile
npm install expo-router expo-constants
```

### Project Structure

```
expo-mobile/
├── app/                       # Expo Router pages/screens
│   ├── _layout.tsx           # Root layout
│   ├── index.tsx             # Home screen
│   └── settings.tsx          # Settings screen
├── components/
│   ├── navigation/           # Navigation components
│   ├── common/               # Reusable UI
│   └── screens/              # Screen-specific components
├── hooks/
│   ├── useAuth.ts
│   ├── useQuery.ts
│   └── useTheme.ts
├── lib/
│   ├── api.ts                # API client (axios/fetch)
│   ├── storage.ts            # AsyncStorage wrapper
│   └── colors.ts             # Color constants
├── constants/
│   └── theme.ts              # Design tokens
├── app.json                   # Expo config
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── .env.example
├── .env.local                # Local overrides (git-ignored)
└── spec/                     # Jest tests
    ├── components.test.tsx
    ├── hooks.test.ts
    └── __snapshots__/
```

### `app.json` (Expo Config)

```json
{
  "expo": {
    "name": "Your App",
    "slug": "your-app",
    "version": "1.0.0",
    "assetBundlePatterns": ["**/*"],
    "plugins": [
      "expo-font",
      "expo-router"
    ],
    "ios": {
      "supportsTabletMode": true,
      "bundleIdentifier": "com.yourcompany.yourapp"
    },
    "android": {
      "package": "com.yourcompany.yourapp",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png"
      }
    }
  }
}
```

### Environment Variables

Create `.env.example`:

```
# API
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_API_TIMEOUT=10000

# Feature flags
EXPO_PUBLIC_DEBUG=false
EXPO_PUBLIC_ENV=development
```

Load with `expo-constants`:

```typescript
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3001';
```

---

## 📦 Essential Packages

### Navigation & Routing

```bash
npm install expo-router expo-constants
# or
npm install react-navigation react-native-screens react-native-safe-area-context
```

### UI & Styling

```bash
npm install nativewind tailwindcss
npm install react-native-svg react-native-svg-transformer
```

### State Management

```bash
npm install zustand        # Lightweight state (recommended)
# or
npm install jotai          # Atomic state
# or
npm install @react-navigation/redux  # Redux integration
```

### Data Fetching

```bash
npm install axios          # HTTP client
# or
npm install @react-query/react-query  # Data fetching
# or
npm install swr            # Simpler alternative
```

### Storage

```bash
npm install @react-native-async-storage/async-storage
npm install expo-secure-store  # Secure credential storage
```

### Forms

```bash
npm install react-hook-form
npm install zod            # Schema validation
```

### Testing

```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
npm install --save-dev jest-expo  # Expo-specific Jest config
```

### Full `package.json` Example

```json
{
  "name": "expo-mobile",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "start:clear": "expo start --clear",
    "start:tunnel": "expo start --tunnel",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "eject": "expo prebuild",
    "build:web": "expo export:web",
    "test": "jest",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "expo": "~50.0.0",
    "expo-router": "^2.0.0",
    "expo-constants": "^15.0.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "react-native-screens": "~3.28.0",
    "react-native-safe-area-context": "4.8.2",
    "nativewind": "^2.0.0",
    "zustand": "^4.0.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.0.0",
    "zod": "^3.22.0",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "expo-secure-store": "^13.0.0",
    "react-native-svg": "^14.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-native": "^0.73.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "jest": "^29.0.0",
    "@testing-library/react-native": "^12.0.0",
    "@testing-library/jest-native": "^5.4.0",
    "jest-expo": "~50.0.0"
  }
}
```

---

## 🎨 Tailwind CSS Setup for React Native

### Install Dependencies

```bash
npm install nativewind tailwindcss
```

### `tailwind.config.js`

```javascript
module.exports = {
  content: ['./app/**/*.tsx', './components/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
};
```

### Usage in Components

```typescript
import { View, Text } from 'react-native';
import { useColorScheme } from 'nativewind';

export default function Screen() {
  const { colorScheme } = useColorScheme();

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-950">
      <Text className="text-lg font-bold text-neutral-900 dark:text-white">
        Welcome
      </Text>
    </View>
  );
}
```

---

## 🔧 Development Workflow

### Start Development Server

```bash
cd expo-mobile

# Terminal 1: Start Expo dev server
npm start
# or
npx expo start

# Then choose:
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Press 'w' for web
# Or scan QR code with Expo Go app on phone
```

### Type Checking

```bash
npm run typecheck
```

### Testing

```bash
npm run test                # Run all tests
npm run test -- --watch    # Watch mode
npm run test -- --coverage # With coverage
```

### Building

```bash
# For Expo Go (development)
npm start

# Web export (static site)
npm run build:web

# Native build (production)
eas build
# or
expo prebuild && xcode-build (macOS)
```

---

## 🚀 Expo Go vs EAS Build

### Expo Go (Development)

```bash
# Run app locally in Expo Go app (phone/emulator)
npm start
# Scan QR code with phone or press 'a'/'i'

# Limitations:
# - No native modules (without Expo modules)
# - Connection required to dev server
# - Only for development
```

### EAS Build (Production)

```bash
# Requires account at https://expo.dev

# First time setup
eas build --platform ios --profile preview
eas build --platform android --profile preview

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## 📋 React Native CLI (Non-Expo)

If you need native modules or fine control:

```bash
npx react-native init MobileApp --template react-native-typescript-template

cd MobileApp

# Install pods (macOS only)
cd ios && pod install && cd ..

# Start development
npm run android    # Android emulator
npm run ios        # iOS simulator
npm start          # JavaScript bundler
```

Structure is similar but:
- No Expo Go
- Need Xcode + Android Studio
- More complex build process
- Access to all native APIs

---

## 🐛 Common Issues & Fixes

### "Cannot find module 'expo-router'"

```bash
npm install expo-router expo-constants
```

### "Expo CLI not found"

```bash
npm install --global expo-cli
# or use npx instead of npm start
npx expo start
```

### Tailwind classes not working

```bash
npm install nativewind tailwindcss
# Rebuild: expo start --clear
```

### Tests failing

```bash
npm install jest-expo
npm install --save-dev @testing-library/react-native @testing-library/jest-native
```

### Hot reload not working

```bash
npm start -- --clear
# or restart emulator
```

---

## 📝 Best Practices

1. **Use Expo Router for navigation** — Better than manual React Navigation setup
2. **Prefer TypeScript** — Catch errors early
3. **Use Zustand for state** — Lighter than Redux for most apps
4. **Separate concerns:** Components, hooks, lib, constants
5. **Test components** with React Native Testing Library
6. **Use async-storage** for small data; SQLite for larger datasets
7. **Remember iOS app bundles** — Don't include large files
8. **Use EAS Build** for production (not local Xcode)
9. **Profile with Expo Orbit** — Monitor performance
10. **Keep dependencies minimal** — Each package increases bundle size

---

## 🔗 References

- **Expo Docs:** https://docs.expo.dev/
- **Expo Router:** https://docs.expo.dev/routing/introduction/
- **React Native Docs:** https://reactnative.dev/
- **NativeWind:** https://www.nativewind.dev/
- **EAS Build:** https://docs.expo.dev/build/introduction/

