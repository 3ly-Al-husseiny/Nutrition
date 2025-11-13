# Challenges Module

A comprehensive Angular-based web application for tracking personal health challenges and building healthy habits. Users can join challenges, track daily progress, earn badges, and visualize their health journey through interactive charts.

![Angular](https://img.shields.io/badge/Angular-18.x-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development Server](#development-server)
- [Build](#build)
- [Usage Guide](#usage-guide)
- [Architecture](#architecture)
- [Components](#components)
- [Services](#services)
- [Data Models](#data-models)
- [Contributing](#contributing)

---

## Features

### Features Implemented
- ✅ 12 health challenges (nutrition, fitness, mental health)
- ✅ Challenge join/leave functionality
- ✅ Daily progress tracking with mark as done
- ✅ Points system with automatic awarding
- ✅ Badge system (Bronze: 3, Silver: 6, Gold: 9)
- ✅ Progress dashboard with Chart.js visualizations
- ✅ Data export and reset functionality
- ✅ Daily reminder notifications
- ✅ Confetti celebrations
- ✅ Responsive design (mobile/tablet/desktop)

### Core Functionality
- **12 Health Challenges**: 
  - Drink 8 Glasses of Water (7 days, 50 pts)
  - No Junk Food (7 days, 60 pts)
  - No Sugar Week (7 days, 70 pts)
  - Cut Down on Soda (10 days, 55 pts)
  - No Caffeine After 5 PM (7 days, 45 pts)
  - No Smoking (7 days, 80 pts)
  - 10,000 Steps per Day (7 days, 60 pts)
  - 30-Day Push-Up (30 days, 100 pts)
  - Stretch for 10 Minutes (7 days, 45 pts)
  - Digital-Free Before Bed (7 days, 50 pts)
  - Meditate for 15 Minutes (7 days, 55 pts)
  - Sleep 8 Hours Every Night (7 days, 60 pts)

### Challenge Management
- ✅ Join and leave challenges
- ✅ Daily progress tracking with "Mark as Done"
- ✅ View detailed challenge timeline
- ✅ Real-time progress calculation
- ✅ Points system with automatic awarding

### Badge System
- 🥉 **Bronze Badge**: 3 completed challenges
- 🥈 **Silver Badge**: 6 completed challenges
- 🥇 **Gold Badge**: 9 completed challenges
- Dynamic badge calculation on challenge completion/removal

### Progress Dashboard
- 📊 **Statistics Cards**: Total points, active challenges, completed challenges
- 📈 **Visual Analytics**:
  - Pie Chart: Completed vs In Progress challenges
  - Line Chart: Points accumulation over time
  - Bar Chart: Progress percentage per challenge
- 🏅 Badge display with earned achievements
- 📋 Active challenges list with progress bars

### User Experience
- 🎉 Confetti celebrations on challenge completion
- 🎆 Fireworks animation when earning badges
- 🔔 Daily reminder notifications (session-based, rotating messages)
- 💾 Data export (JSON backup)
- 🔄 Data reset functionality
- 📱 Fully responsive design (mobile, tablet, desktop)

---

## Tech Stack

### Frontend Framework
- **Angular 18.x** (Standalone Components)
- **TypeScript 5.x**
- **RxJS** for reactive programming

### UI Libraries
- **Chart.js 4.x** - Data visualization
- **SweetAlert2** - Beautiful alerts and notifications
- **Canvas Confetti** - Celebration animations

### Styling
- **CSS3** with CSS Variables
- Custom gradient themes
- Responsive design with media queries

### Data Persistence
- **LocalStorage API** - User data and progress
- **SessionStorage API** - Daily reminders

### Development Tools
- **Angular CLI** - Project scaffolding and build
- **TypeScript Compiler** - Type checking
- **Git** - Version control

---

## Project Structure
```
health-challenges-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── header/
│   │   │   │   ├── header.component.ts
│   │   │   │   ├── header.component.html
│   │   │   │   └── header.component.css
│   │   │   ├── challenges-list/
│   │   │   │   ├── challenges-list.component.ts
│   │   │   │   ├── challenges-list.component.html
│   │   │   │   └── challenges-list.component.css
│   │   │   ├── challenge-details/
│   │   │   │   ├── challenge-details.component.ts
│   │   │   │   ├── challenge-details.component.html
│   │   │   │   └── challenge-details.component.css
│   │   │   └── progress/
│   │   │       ├── progress.component.ts
│   │   │       ├── progress.component.html
│   │   │       └── progress.component.css
│   │   ├── models/
│   │   │   ├── challenge.model.ts
│   │   │   └── user.model.ts
│   │   ├── services/
│   │   │   ├── storage.service.ts
│   │   │   ├── challenge.service.ts
│   │   │   ├── notification.service.ts
│   │   │   └── reminder.service.ts
│   │   ├── data/
│   │   │   └── challenges.data.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   ├── app.routes.ts
│   │   └── app.config.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── .editorconfig
├── .gitignore
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
└── README.md
```

---

## Installation

### Prerequisites
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **Angular CLI** (v18.x)
```bash
# Install Angular CLI globally (if not installed)
npm install -g @angular/cli

# Verify installation
ng version
```

### Setup

1. **Clone the repository**
```bash
   git clone https://github.com/3ly-Al-husseiny/Nutrition.git
   cd health-challenges-app
```

2. **Install dependencies**
```bash
   npm install
```

3. **Verify installation**
```bash
   # Check if all dependencies are installed
   npm list sweetalert2 chart.js canvas-confetti
```

---

## Development Server
```bash
# Start development server
ng serve

# Server will run at http://localhost:4200
# The application will automatically reload on file changes
```

### Development Commands
```bash
# Run with custom port
ng serve --port 4300

# Run with open browser automatically
ng serve --open

# Run with production configuration
ng serve --configuration production
```

---

## Build
```bash
# Build for production
ng build

# Build output will be in dist/ directory
# Files are optimized and minified
```

### Build Options
```bash
# Build with custom output path
ng build --output-path=custom-dist

# Build with base href
ng build --base-href=/health-challenges/

# Build with source maps
ng build --source-map
```

---

## Usage Guide

### Getting Started

1. **Launch the Application**
   - Navigate to `http://localhost:4200`
   - You'll see the Challenges page with all available challenges

2. **Join a Challenge**
   - Click "Join Challenge" on any challenge card
   - Challenge moves to "My Active Challenges" section
   - Success notification appears

3. **Track Daily Progress**
   - Click "View Progress" on an active challenge
   - See daily timeline with all challenge days
   - Click "Mark as Done" to complete a day
   - Progress bar and percentage update automatically

4. **Complete a Challenge**
   - Mark all days as done
   - Confetti celebration appears
   - Points are automatically awarded
   - Check if you earned a badge!

5. **View Progress Dashboard**
   - Click "My Progress" in navigation
   - See statistics: total points, active/completed challenges
   - View badges you've earned
   - Analyze progress with interactive charts

6. **Manage Data**
   - **Export**: Download your progress as JSON backup
   - **Reset**: Clear all data and start fresh

### Daily Reminders

- Reminders appear once per browser session
- Only shown if you have active challenges
- 4 rotating motivational messages
- Appears 3 seconds after page load
- Toast notification in top-right corner

---

## Architecture

### Design Pattern: Service-Oriented Architecture
```
┌─────────────────────────────────────────────────┐
│              Components (UI Layer)              │
│  ┌─────────────┐  ┌──────────────┐  ┌────────┐  │
│  │ Challenges  │  │   Challenge  │  │Progress│  │
│  │    List     │  │   Details    │  │        │  │
│  └─────────────┘  └──────────────┘  └────────┘  │
└────────────────────┬────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────┐
│           Services (Business Logic)             │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │Challenge │  │ Storage  │  │Notification  │   │
│  │ Service  │  │ Service  │  │   Service    │   │
│  └──────────┘  └──────────┘  └──────────────┘   │
│  ┌──────────┐                                   │
│  │Reminder  │                                   │
│  │ Service  │                                   │
│  └──────────┘                                   │
└────────────────────┬────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────┐
│          Data Layer (Persistence)               │
│  ┌──────────────┐  ┌──────────────────────┐     │
│  │ LocalStorage │  │  SessionStorage      │     │
│  └──────────────┘  └──────────────────────┘     │
└─────────────────────────────────────────────────┘
```

### Rendering Strategy
- **Client-Side Rendering (CSR)** - No SSR/SSG
- All rendering happens in the browser
- Fast initial load with lazy-loaded routes

---

## Components

### HeaderComponent
- **Purpose**: Navigation header with responsive menu
- **Features**: 
  - Logo display
  - Navigation links (Challenges, My Progress)
  - Hamburger menu for mobile
  - Active route highlighting

### ChallengesListComponent
- **Purpose**: Display and manage challenges
- **Features**:
  - Grid layout for available challenges
  - Active challenges section with progress
  - Join challenge functionality
  - Daily reminder trigger

### ChallengeDetailsComponent
- **Purpose**: Detailed challenge view with progress tracking
- **Features**:
  - Challenge information display
  - Daily timeline with mark as done
  - Progress bar and statistics
  - Leave challenge functionality
  - Confetti/fireworks celebrations

### ProgressComponent
- **Purpose**: User progress dashboard
- **Features**:
  - Statistics cards (points, challenges)
  - Badge display
  - Interactive charts (Chart.js)
  - Active challenges list
  - Export/Reset functionality

---

## 🔧 Services

### StorageService
**Responsibility**: LocalStorage management
- Initialize default data structure
- CRUD operations for challenges and user data
- Badge calculation
- Data import/export

**Key Methods**:
- `getChallenges()`: Get all user challenges
- `addChallenge()`: Add new challenge
- `updateChallenge()`: Update challenge progress
- `deleteChallenge()`: Remove challenge
- `getUserData()`: Get user data (points, badges)
- `checkAndAwardBadges()`: Award badges based on completions

### ChallengeService
**Responsibility**: Business logic for challenges
- Challenge management (join, leave, complete)
- Progress calculations
- Badge recalculation on challenge removal

**Key Methods**:
- `getAvailableChallenges()`: Filter unjoined challenges
- `joinChallenge()`: Create UserChallenge
- `leaveChallenge()`: Remove and recalculate badges
- `markDayComplete()`: Update progress and award points
- `getChallengeStats()`: Calculate completion percentage

### NotificationService
**Responsibility**: SweetAlert2 wrapper
- Consistent styling for all alerts
- Specialized notifications (success, error, confirm)

**Key Methods**:
- `success()`: Show success message
- `error()`: Show error message
- `confirmDanger()`: Show destructive action confirmation
- `challengeCompleted()`: Special completion notification
- `showReminder()`: Display daily reminder toast

### ReminderService
**Responsibility**: Daily reminder notifications
- Session-based reminder display
- Rotating motivational messages
- LocalStorage for message index

**Key Methods**:
- `checkAndShowReminder()`: Check and display reminder once per session

---

## Data Models

### Challenge
```typescript
interface Challenge {
  id: number;
  title: string;
  icon: string;
  description: string;
  durationDays: number;
  points: number;
}
```

### UserChallenge
```typescript
interface UserChallenge extends Challenge {
  startedAt: string;
  progress: boolean[];
  joined: boolean;
  pointsEarned: number;
}
```

### UserData
```typescript
interface UserData {
  badges: string[];
  points: number;
  lastReminderShown: string | null;
}
```

### StorageData
```typescript
interface StorageData {
  challenges: UserChallenge[];
  user: UserData;
}
```

---

## License

This module is part of a team project.

---

## Acknowledgments

- Angular Team for the amazing framework
- Chart.js for beautiful data visualizations
- SweetAlert2 for elegant notifications
- Canvas Confetti for celebration effects

---

**Built with ❤️ using Angular**
