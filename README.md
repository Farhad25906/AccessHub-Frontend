# AccessHub - Frontend 🛡️🖌️

Premium, permission-driven Role-Based Access Control (RBAC) dashboard built with Next.js 14.

## 🔗 Repository & Live Demo
- **GitHub Repository**: [https://github.com/Farhad25906/AccessHub-Frontend](https://github.com/Farhad25906/AccessHub-Frontend)
- **Live Demo (Vercel)**: [https://access-hub-frontend.vercel.app/](https://access-hub-frontend.vercel.app/)

## 🚀 Technologies
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Premium Light Theme - White, Orange, Black)
- **State Management**: Redux Toolkit & RTK Query
- **Authentication**: JWT & Cookie-based (HttpOnly)
- **Animations**: Framer Motion (Glassmorphism & Smooth Transitions)
- **Icons**: Lucide React

## ✨ Key Features
- **Dynamic Permission-Driven UI**: Components and pages automatically hide/disable based on "Permission Atoms," regardless of the user's role label.
- **Admin Management Console**: Dedicated UI for real-time user creation, role assignment, and granular permission editing.
- **Premium Design Language**: High-contrast, accessibility-first theme using curated orange accents (`#F26522`).
- **Standardized UI System**: All primary actions and buttons follow a strict "Orange-500 Rounded-10px" styling for consistent brand identity.
- **Role-Agnostic Middleware**: Server-side middleware protects routes based on dynamic permission sets stored in secure cookies.
- **Audit Visualization**: Live stream of system activity and permission change history.

## 🛠️ Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Farhad25906/AccessHub-Frontend.git
   cd AccessHub-Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL="https://access-hub-backend.vercel.app/api"
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

## 🏗️ Project Architecture
- **`/app`**: Next.js 14 app router for file-based navigation and route guards.
- **`/redux`**: Centralized store and RTK Query API definitions for seamless backend synchronization.
- **`/components/ui`**: Atomic UI components (Modals, Buttons, Cards) following the Orange-Black design system.
- **`/components/layout`**: Persistent sidebar and header with real-time profile management.

---
Developed by [Farhad](https://github.com/Farhad25906)
