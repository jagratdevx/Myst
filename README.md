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

Designed with ❤️ for students.
**Myst Student OS**
