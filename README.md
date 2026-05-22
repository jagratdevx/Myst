# Myst — The Premium Student Operating System

**Myst** is a high-performance, offline-first productivity ecosystem designed specifically for the modern student. It consolidates academic organization, deep work tools, financial tracking, and performance analytics into a single, minimalist, premium interface.

![Myst Banner](https://via.placeholder.com/1000x400/081120/5EEBFF?text=MYST+STUDENT+OS)

## 🚀 Key Features

### 📚 Study Library (Native PDF System)
*   **Integrated Reading**: High-performance native PDF viewing using `react-native-pdf`.
*   **Subject-Wise Organization**: Categorize study materials by academic subject.
*   **Real-time Tracking**: Page progress tracking (Page X of Y) and "Last Opened" metadata.

### ⏱️ Deep Focus Engine
*   **Pomodoro Timer**: Customizable study/break intervals.
*   **Offline Ambient Soundscapes**: High-quality local audio including Calming Rain, Forest Birds, Cafe Ambience, and Deep White Noise.
*   **Kinetic Breathing Orb**: A visual breathing guide to induce a state of "flow."

### 📅 Study Planner
*   **Dynamic Calendar**: A responsive horizontal calendar with week-by-week navigation.
*   **Task Management**: Subject-linked assignments with priority levels and deadline tracking.

### 💰 Finance Vault
*   **Student Budgeting**: Track allowances and expenses with automated category breakdown.
*   **Savings Insights**: Real-time balance calculation and savings rate percentages.

### 📊 Academic Insights
*   **Subject Mastery**: A visual heatmap mapping your progress across all your selected subjects.
*   **Focus Distribution**: Weekly analytics showing your peak productivity hours.
*   **Efficiency Rating**: Data-driven feedback on your task completion habits.

---

## ✨ Premium Experience & UI

*   **Tactile Layer**: Integrated haptic feedback (`expo-haptics`) for every interaction.
*   **Kinetic Motion**: Fluid, spring-loaded transitions and staggered list animations.
*   **High Contrast Mode**: Dedicated accessibility theme for maximum legibility.
*   **Hardware Optimized**: Built to run at a fluid 60fps even on budget Android devices.
*   **Notch-Safe**: Global layout intelligence that automatically adjusts for camera notches and Dynamic Islands.

---

## 🛠️ Tech Stack

*   **Framework**: [React Native](https://reactnative.dev/) (Expo SDK 51)
*   **Language**: TypeScript
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
*   **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
*   **Icons**: [Lucide React Native](https://lucide.dev/)
*   **Storage**: [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) (100% Local/Private)
*   **Native Modules**: Expo AV, React Native PDF, Expo Haptics, Expo Sharing.

---

## 📦 Getting Started

### Prerequisites
*   Node.js (LTS)
*   Expo Go (for basic preview) or **Development Build** (for full native features)

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/jagratdevx/Myst.git
    cd Myst
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npx expo start
    ```

### Building for Android (APK)
```bash
eas build -p android --profile preview
```

---

## 🔒 Privacy
Myst is **100% offline-first**. No data ever leaves your device. We do not use trackers, cloud syncing, or third-party analytics. Your academic life belongs to you.

---

## 🛠️ Build History & Troubleshooting

During the development of Myst, we encountered several common React Native build challenges. If you run into these again, here are the documented solutions:

### 1. `processReleaseResources` (AAPT/Resource Errors)
*   **Cause**: Android's resource linker is extremely strict about filenames (no hyphens, no uppercase) and requires explicit resource definitions for splash screens.
*   **Solution**: 
    *   Ensure all asset filenames are lowercase with underscores (`_`).
    *   Use `app.json` for splash configuration rather than manually creating XML drawable files.
    *   If errors persist, run `npx expo prebuild --clean` to regenerate the Android directory.

### 2. `createBundleReleaseJsAndAssets` (Babel/PostCSS Conflict)
*   **Cause**: Incompatibility between NativeWind/PostCSS and the production Babel transpiler.
*   **Solution**: Ensure `postcss` is on the latest version and the Babel config is using the updated NativeWind preset. Always perform a deep clean if bundling fails: `rm -rf .expo node_modules && npm install`.

### 3. "Cannot find module react-native-worklets/plugin"
*   **Cause**: Mismatched versions between `react-native-reanimated` and its worklet dependencies.
*   **Solution**: Install `react-native-worklets-core` explicitly and ensure `reanimated` is at the stable version compatible with your Expo SDK.

### 4. "Unable to resolve module ../Utilities/Platform"
*   **Cause**: Corrupted `node_modules` or broken symlinks during native dependency installation.
*   **Solution**: Perform a hard reset of dependencies: `rm -rf node_modules package-lock.json && npm install`.

