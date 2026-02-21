# Prosnokorta - Web Frontend

## 📌 Project Overview
The web frontend for **Prosnokorta** is a modern, responsive interface built with **Next.js 15**, **Tailwind CSS**, and **Shadcn UI**. It serves as the primary portal for both students and administrators to manage and participate in the Online Quiz Management System.

**Live Demo:** [https://prosnokorta-beta.vercel.app/](https://prosnokorta-beta.vercel.app/)

---

## 🚀 Key Features
- **Student Dashboard**: Browse subjects, view available quizzes with duration info, and attempt them in a timed environment.
- **Admin Dashboard**: Comprehensive management of subjects, quizzes, and MCQ questions.
- **Real-time Results**: Instant feedback and score calculation upon quiz submission.
- **Theme Support**: Seamless switching between light and dark modes.
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile browsers.

---

## 🛠 Tech Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI)
- **Theming**: `next-themes`
- **Notifications**: `sonner`
- **Icons**: [Lucide React](https://lucide.dev/)
- **API Client**: [Axios](https://axios-http.com/)
- **State Management**: React Hooks (State, Effect, Context)

---

## 🏗 Project Architecture
The project follows a modular, feature-based directory structure for maximum maintainability:

- `src/app/`: File-system based routing and layouts.
- `src/components/`: Reusable, atomic UI components (Buttons, Inputs, Dialogs).
- `src/features/`: Complex, business-specific components (e.g., Admin tables, Quiz flow).
- `src/hooks/`: Custom React hooks for logic reuse.
- `src/lib/`: Utility functions and centralized API configuration.
- `src/types/`: Shared TypeScript interfaces and types.

---

## 👤 User Roles & Dashboards

### 🎓 Student Dashboard
- **Subject Catalog**: View list of subjects like Math, Physics, ICT.
- **Quiz Portal**: Select and start quizzes.
- **Performance History**: (Planned) View previous results and performance charts.

### 🛠 Admin Dashboard
- **Content Management**: Create, update, and delete subjects and quizzes.
- **Question Bank**: Manage MCQs with options and correct answers.
- **Result Monitoring**: Monitor student participation and scores.

---

## 📡 API Integration
The frontend communicates with the [Prosnokorta Backend](https://github.com/FardinMahadi/Prosnokorta-API).

### Environment Configuration
Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_API_URL=https://quizmaster-backend-t7pf.onrender.com/api/v1
```

---

## ⚙️ Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Run Development Server**:
   ```bash
   npm run dev
   ```
3. **Open Browser**:
   Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔗 Related Repositories
- **Backend (Spring Boot):** [Prosnokorta-API](https://github.com/FardinMahadi/Prosnokorta-API)
- **Mobile App (React Native):** [Prosnokorta-Mobile](https://github.com/FardinMahadi/Prosnokorta-Mobile)

---

## 👥 Team
- **Mahadi Hasan Fardin** (@FardinMahadi) — *Team Leader*
- **Department**: ICT, Comilla University