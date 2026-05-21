# Myst Project Context (Updated)

## 1. Project Overview
- **App Purpose**: A premium Student Life Operating System focused on academic organization, PDF study material management, and productivity.
- **Target Users**: University and high-school students.
- **Philosophy**: Offline-first, privacy-focused, premium minimalist aesthetic, and high performance on all devices (especially low-end Android).
- **Brand Identity**: **Myst** (formerly NeuroNest).

## 2. Core Features
- **Dashboard**: Aggregated overview of productivity, library stats, and finance.
- **Onboarding**: 5-step personalized setup (Welcome, Profile, Subjects, Goals, Theme).
- **Library (PDF System)**: 
  - Subject-wise PDF organization and metadata tracking.
  - In-app PDF viewer (WebView) on iOS.
  - System-native document sharing fallback for Android.
- **Focus**: Pomodoro-style timer with integrated high-quality offline ambient sounds (Calming Rain, Forest Birds, Cafe Ambience, Deep White Noise), breathing animations, and streak tracking.
- **Planner**: Academic task manager with dynamic horizontal calendar, week-by-week navigation, and subject-specific filtering.
- **Finance**: Local expense tracker with transaction CRUD operations, automated analytics, and monthly budget tracking.
- **Analytics**: Data-driven insights using selected profile subjects, productivity trends, and focus distribution.

## 3. Architecture
- **Frontend**: React Native (Expo) + TypeScript + NativeWind.
- **Audio System**: Offline playback using `expo-av` with bundled assets.
- **State Management**: Zustand for global feature states (Feature-specific stores like `useProfileStore`, `useSettingsStore`).
- **Theme System**: Custom `ThemeProvider` with persistent Dark/Light mode preferences.
- **Data Layer**: Modular services (`src/services`) and storage modules (`src/services/*Storage.ts`).
- **Persistence**: 100% `AsyncStorage` with namespaced keys (e.g., `@myst_user_profile`, `@myst_settings`).

## 4. Design System
- **Style**: Minimal premium productivity UI, high background opacity (92-96%) for readability, floating rounded cards.
- **Dark Mode**: Deep blue aesthetic (#081120) with subtle cyan accents.
- **Light Mode**: Clean minimalist aesthetic (#F4F7FB) with soft neutral surfaces.
- **UI Components**: Native shadows/elevation for depth (avoiding heavy blur), smooth Reanimated transitions, and Lucide icons.

## 5. Technical Stack
- **Expo SDK 51**
- **React Native Reanimated v3**
- **Lucide React Native**
- **Zustand**
- **AsyncStorage**
- **NativeWind**
- **expo-document-picker** (PDF Import)
- **react-native-webview** (PDF Viewing)
- **expo-sharing** (Android PDF Fallback)

## 6. Development Guidelines
- **Modularity**: Maintain strict separation between UI components and backend services.
- **Offline First**: Zero dependency on external APIs; all data is local.
- **Performance**: Use `FlatList` and item-level memoization for smooth 60fps UI.
- **Responsiveness**: Use `useResponsive` hook for multi-device (Tablet/Phone) support.
- **Navigation**: Custom `TabNavigator` with enhanced icon contrast and active tab indicators.
