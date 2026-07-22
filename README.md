# Myst — The Premium Student Operating System

**Myst** is a high-performance, offline-first productivity ecosystem designed specifically for the modern student. It consolidates academic organization, deep work tools, financial tracking, test score analytics, and an AI-powered assistant into a single, minimalist, premium interface.

## 🚀 Key Features

### 🏆 Gamification & XP
*   **Level System**: Earn XP from focus sessions, tasks, test scores, and PDF imports.
*   **Badges**: 10 unlockable achievements (Task Master, Scholar, Bookworm, etc.).
*   **Dashboard XP Card**: Level progress bar and badge showcase.

### 🧪 Test Score Tracker
*   **Subject-Wise Totals**: Track total marks achieved vs total marks per subject.
*   **Overall Performance**: Aggregate score across all tests with percentage.
*   **Quick Entry**: Add scores with subject suggestions from your profile.
*   **Delete & Review**: Remove entries and view recent activity.

### 🤖 Myst AI Assistant (Groq-Powered)
*   **LLM-Powered Chat**: Ask study questions, get explanations, and receive academic guidance.
*   **Study Plan Generator**: AI creates personalized study plans that can be added to your Planner with one tap.
*   **Full App Context**: AI knows your tasks, test scores, focus stats, and finances.
*   **LaTeX Rendering**: Mathematical expressions render beautifully via KaTeX with horizontal scroll for long equations.
*   **Markdown Formatting**: Bold, italic, code blocks — all rendered natively.

### 📚 Study Library (Native PDF System)
*   **Integrated Reading**: High-performance native PDF viewing using `react-native-pdf`.
*   **Subject-Wise Organization**: Categorize study materials by academic subject.
*   **Real-time Tracking**: Page progress tracking (Page X of Y) and "Last Opened" metadata.
*   **AI Flashcards**: Generate a flashcard deck from any PDF with one tap — AI extracts key concepts.

### 🃏 Flashcard System
*   **Spaced Repetition**: SM-2 algorithm schedules reviews for optimal memory retention.
*   **Two Study Modes**: Study (animated flip cards + next button) and Quiz (flip + rate Hard/Okay/Easy).
*   **AI-Generated Decks**: Create decks from PDFs or topics via Groq AI.
*   **Manual Cards**: Create custom decks with front/back/hints.

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

---

## ✨ Premium Experience & UI

*   **Drawer Navigation**: Left-sliding drawer with profile, XP bar, and all screens. Swipe gesture or hamburger button.
*   **Tactile Layer**: Integrated haptic feedback (`expo-haptics`) for every interaction.
*   **Kinetic Motion**: Fluid, spring-loaded transitions, staggered list animations, and 3D card flips.
*   **High Contrast Mode**: Dedicated accessibility theme for maximum legibility.
*   **Hardware Optimized**: Built to run at a fluid 60fps even on budget Android devices.
*   **Notch-Safe**: Global layout intelligence that automatically adjusts for camera notches and Dynamic Islands.
*   **Glassmorphism Design**: Frosted glass cards, glow buttons, and gradient backgrounds throughout.

---

## 🛠️ Tech Stack

*   **Framework**: [React Native](https://reactnative.dev/) (Expo SDK 51)
*   **Language**: TypeScript
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
*   **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
*   **Icons**: [Lucide React Native](https://lucide.dev/)
*   **Math Rendering**: [KaTeX](https://katex.org/) via WebView
*   **AI Backend**: [Groq](https://groq.com/) (llama-3.3-70b-versatile)
*   **Storage**: [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) (100% Local/Private)
*   **Native Modules**: Expo AV, React Native PDF, Expo Haptics, Expo Sharing, React Native WebView.

---

## 📦 Getting Started

### Prerequisites
*   Node.js (LTS)
*   Expo CLI
*   Xcode (for iOS builds)

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
3.  Create a `.env` file with your Groq API key (key is embedded into the app binary at build time via `app.config.js`):
    ```bash
    echo "GROQ_API_KEY=your_key_here" > .env
    ```
4.  Start the development server:
    ```bash
    npx expo start
    ```

### Building for iOS (Release)
```bash
cd ios
xcodebuild -workspace Myst.xcworkspace -scheme Myst -sdk iphonesimulator -configuration Release -derivedDataPath /tmp/MystBuild build
xcrun simctl install <device-udid> /tmp/MystBuild/Build/Products/Release-iphonesimulator/Myst.app
xcrun simctl launch <device-udid> com.jagrat.devx.myst
```

---

## 🔒 Privacy
Myst is **100% offline-first**. No data ever leaves your device unless you explicitly use the AI Chat feature (which sends messages to Groq's API). We do not use trackers, cloud syncing, or third-party analytics. Your academic life belongs to you.

---

## 👥 Credits

Built with ❤️ by **Jagrat** and **Nilabh**.

**Myst Student OS** — v3.1-premium
