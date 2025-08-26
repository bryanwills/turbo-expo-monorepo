# Authentication System

## Overview
This mobile app now features a modern, beautiful authentication system with the following features:

- **Light/Dark/System Theme Toggle**: Users can choose between light, dark, or system theme
- **Theme Persistence**: Theme selection is saved to device storage and remembered across app launches
- **Modern UI Design**: Clean, card-based design with proper shadows and spacing
- **Social Login Placeholders**: UI ready for Google, Facebook, and GitHub integration
- **Email Authentication**: Full email/password signup and signin functionality
- **Smart Mode Switching**: Automatically switches to signin mode after successful signup

## Features

### Theme System
- **ThemeProvider**: Context-based theme management
- **AsyncStorage**: Theme preferences are persisted to device storage
- **Dynamic UI**: All components automatically adapt to light/dark themes
- **System Theme**: Automatically follows device theme when set to "system"

### Authentication Flow
1. **Default Mode**: App starts in signup mode for new users
2. **Smart Switching**: After successful signup, automatically switches to signin mode
3. **Session Detection**: Checks if user has signed up before and adjusts mode accordingly
4. **Form Validation**: Ensures all required fields are filled before submission

### UI Components
- **AuthScreen**: Main authentication component with social and email options
- **ThemeToggle**: Three-button toggle for light/dark/system themes
- **Responsive Design**: Adapts to different screen sizes and orientations
- **Keyboard Handling**: Proper keyboard avoidance for form inputs

## File Structure

```
apps/mobile/
├── components/
│   ├── auth/
│   │   └── auth-screen.tsx      # Main authentication screen
│   └── ui/
│       └── theme-toggle.tsx     # Theme toggle component
├── lib/
│   └── theme/
│       └── theme-context.tsx    # Theme context and provider
├── app/
│   ├── _layout.tsx              # Root layout with theme provider
│   └── index.tsx                # Main page using auth screen
└── AUTH_README.md               # This documentation
```

## Usage

### Theme Toggle
The theme toggle is positioned in the upper right corner and allows users to switch between:
- ☀️ Light theme
- 🌙 Dark theme
- ⚙️ System theme (follows device setting)

### Authentication
Users can:
1. **Sign Up**: Create new account with name, email, and password
2. **Sign In**: Access existing account with email and password
3. **Social Login**: See social login options (currently showing "Coming Soon" alerts)

## Technical Details

### Dependencies
- `@react-native-async-storage/async-storage`: Theme persistence
- `better-auth`: Authentication backend
- `expo-router`: Navigation
- `react-native`: Core React Native components

### Theme Implementation
- Uses React Context for global theme state
- AsyncStorage for persistence across app launches
- Dynamic styling based on `isDark` boolean
- Automatic system theme detection

### Future Enhancements
- **Social Login Integration**: Implement actual Google, Facebook, and GitHub OAuth
- **Biometric Authentication**: Add fingerprint/face ID support
- **Two-Factor Authentication**: Enhanced security options
- **Password Reset**: Email-based password recovery

## Notes
- Social login buttons currently show "Coming Soon" alerts
- Theme toggle is positioned absolutely in the upper right corner
- All colors and styles automatically adapt to light/dark themes
- Form validation ensures data integrity before submission
