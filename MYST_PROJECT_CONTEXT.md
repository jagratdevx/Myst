# Myst Project Context (Updated)

## 1. Project Overview
- **App Purpose**: A premium Student Life Operating System focused on academic organization, PDF study material management, AI assistance, and productivity.
- **Target Users**: University and high-school students.
- **Philosophy**: Offline-first, privacy-focused, premium minimalist aesthetic, and high performance on all devices (especially low-end Android).
- **Brand Identity**: **Myst** (formerly NeuroNest).
- **Current Version**: v3.1-premium

## 2. Core Features
- **Dashboard**: Aggregated overview of productivity, XP/level, today's tasks, library stats, INR budget health, and quick actions (Study Plan, Focus, Planner).
- **Onboarding**: 6-step personalized setup (Welcome, Profile, Subjects, Goals, Monthly Student Budget, Theme).
- **Gamification**: XP system earned from focus sessions, task completion, test scores, PDF imports. Level progression (100→200→500 XP/level). 10 earnable badges.
- **Finance**: Local INR expense tracking with monthly budget, optional savings goal, spending percentage, savings percentage, and remaining balance.
- **Library (PDF System)**: Native, high-performance PDF viewing using `react-native-pdf`. Subject-wise organization and real-time page tracking. Generate flashcards from any PDF via AI.
- **Focus**: Pomodoro-style timer with integrated high-quality offline ambient sounds (Rain, Forest, Cafe, Noise), breathing animations, and streak tracking.
- **Planner**: Academic task manager with dynamic horizontal calendar, week-by-week navigation, and centered symmetrical header.
- **Test Scores**: Track total marks per subject vs achieved scores. Add/delete entries with a floating action button. Subject-select chips, overall total card with percentage, and recent entries list.
- **AI Chatbot (Myst AI)**: Groq-powered (llama-3.3-70b-versatile) study assistant with KaTeX math rendering, markdown formatting (bold, italic, code), encrypted chat history, and study plan generation with one-tap add-to-planner.
- **Flashcards**: Spaced-repetition (SM-2 algorithm) flashcard system with manual deck creation and AI-generated decks from PDFs. Two modes: Study (animated flip cards with Next) and Quiz (flip + rate Hard/Okay/Easy).
- **Navigation**: Left-sliding drawer menu with profile, XP bar, and all screens. Swipe gesture or hamburger button to open.
- **Settings**: Comprehensive Profile editing, High Contrast accessibility mode, Study Library management, Data Export, and Reset.

## 3. Architecture
- **Frontend**: React Native (Expo SDK 51) + TypeScript + NativeWind.
- **PDF Engine**: Native rendering via `react-native-pdf`.
- **Audio System**: Offline playback using `expo-av`.
- **Theme System**: Custom `ThemeProvider` supporting Dark, Light, and High Contrast modes.
- **Data Layer**: Modular services and AsyncStorage persistence.
- **Profile Budget Data**: `UserProfile` stores `monthlyBudget` and optional `savingsGoal` alongside name, grade, subjects, and goals.
- **Currency System**: `src/utils/currency.ts` provides reusable INR formatting and currency input parsing. All finance UI uses `₹` formatting via this utility.
- **Finance Analytics**: `financeAnalytics.getBudgetAnalytics()` derives remaining balance, expense totals, spending percentage, and savings percentage from transactions plus the profile budget.
- **AI Service**: `src/services/aiService.ts` uses `expo-constants` to read Groq API key from `.env` (via `app.config.js` `extra.groqApiKey`). Sends chat messages to `api.groq.com/openai/v1/chat/completions`.
- **Chat Store**: `useChatStore` encrypts chat history with AES (`crypto-js`) + `expo-secure-store`.
- **Markdown Rendering**: `MarkdownText` component renders **bold**, *italic*, `code`, code blocks natively. When math (`$...$`, `$$...$$`, `\(...\)`, `\[...\]`, `\begin{}...`) is detected, the entire message renders in a WebView with KaTeX for beautiful math + markdown formatting. Horizontal ScrollView for long equations.

## 4. Design System
- **Style**: Minimal premium productivity UI, high background opacity (92-96%) for readability, floating rounded cards.
- **Dark Mode**: Deep blue aesthetic (#081120) with subtle cyan accents.
- **Light Mode**: Clean minimalist aesthetic (#F4F7FB) with soft neutral surfaces.
- **UI Components**: GlassCard, GlowButton, GlassInput, GlassModal, AnimatedScreenWrapper, FloatingActionButton.
- **Animations**: Reanimated spring-loaded transitions, staggered list animations, fade-in-up card entrances.
- **Navigation**: Custom absolute-positioned tab bar with active indicator. Bottom: 24 (iOS) / 16 (Android), height 64. All content padded to stay above it.

## 5. Technical Stack
- **Expo SDK 51** (React Native 0.74.5)
- **React Native Reanimated v3**
- **Lucide React Native** (icons)
- **Zustand** (state management)
- **AsyncStorage** (persistence)
- **NativeWind / Tailwind CSS** (styling)
- **expo-document-picker** (PDF Import)
- **react-native-webview** (PDF Viewing + KaTeX math rendering)
- **react-native-pdf** (Native PDF display)
- **expo-sharing** (Android PDF Fallback)
- **expo-secure-store** + **crypto-js** (chat encryption)
- **Groq API** (AI backend, llama-3.3-70b-versatile)
- **KaTeX CDN** (LaTeX math rendering in WebView)

## 6. Known Issues & Recent Fixes
- **Infinite Re-mount Loop (Fixed)**: RootNavigator uses all-screens-always-defined approach. LoadingScreen navigates via `reset()` once when loading completes. No conditional screen rendering.
- **iOS Deployment Target (Xcode beta)**: iOS 27 SDK requires min deployment target 15.0. Updated `Podfile.properties.json`, `project.pbxproj`, and Podfile `post_install` hook patches all pod targets.
- **White Screen (Fixed)**: RootNavigator's dynamic screen list caused blank screen. Fixed by defining all screens unconditionally and navigating programmatically.
- **Flickering (Fixed)**: useEffect with object dependency caused continuous resets. Fixed with `useRef` flag in LoadingScreen to navigate exactly once.
- **Enter Dashboard (Fixed)**: OnboardingFinal now calls `navigation.reset()` to Main after `completeOnboarding()`.
- **FAB Hidden (Fixed)**: TestScoreScreen FAB positioned at `bottom: 110` to clear the tab bar. Chat input uses `paddingBottom: 100` + `keyboardVerticalOffset: 120`.
- **API Key (Fixed)**: Groq key moved to `.env` + `app.config.js` `extra.groqApiKey`. Read by `aiService.ts` via `Constants.expoConfig?.extra?.groqApiKey`.

## 7. Development Guidelines
- **Modularity**: Maintain strict separation between UI components and backend services.
- **Offline First**: Zero dependency on external APIs except Groq AI chat (optional).
- **Performance**: Use `FlatList` and item-level memoization for smooth 60fps UI.
- **Responsiveness**: Use `useResponsive` hook for multi-device (Tablet/Phone) support.
- **Navigation**: Custom `TabNavigator` with enhanced icon contrast and active tab indicators.
- **Versioning**: Version in `app.config.js` (`expo.version`). Displayed in Settings via `Constants.expoConfig.version`.
- **Secrets**: Never commit API keys. Use `.env` + `app.config.js` `extra` field + `expo-constants`.

## 8. Tabs (in order)
1. Dashboard — overview
2. Focus — pomodoro timer
3. Planner — task calendar
4. Chat — AI assistant (Myst AI)
5. Library — PDF study materials
6. Finance — budget tracking
7. TestScore — test score tracker
8. Settings — profile, appearance, data
