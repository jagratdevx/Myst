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
  - Native, high-performance PDF viewing using `react-native-pdf`.
  - Subject-wise organization and real-time page tracking (Page X of Y).
  - Metadata tracking and subject-wise filtering.
- **Focus**: Pomodoro-style timer with integrated high-quality offline ambient sounds (Rain, Forest, Cafe, Noise), breathing animations, and streak tracking.
- **Planner**: Academic task manager with dynamic horizontal calendar, week-by-week navigation, and centered symmetrical header.
- **Settings**: Comprehensive Profile editing, High Contrast accessibility mode, and Study Library management.
- **UI Architecture**: Notch-safe global padding, centered typography, and keyboard-aware form layouts.

## 3. Architecture
- **Frontend**: React Native (Expo) + TypeScript + NativeWind.
- **PDF Engine**: Native rendering via `react-native-pdf`.
- **Audio System**: Offline playback using `expo-av`.
- **Theme System**: Custom `ThemeProvider` supporting Dark, Light, and High Contrast modes.
- **Data Layer**: Modular services and AsyncStorage persistence.

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
