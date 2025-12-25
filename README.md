🚀 TaskFlow - Task Management Platform

A high-performance, full-stack web application designed for managing tasks and projects with real-time analytics and a responsive UI.

📸 Project Preview
(Tip: Drag and drop your Dashboard screenshot here!)

✨ Features
Interactive Dashboard: Real-time statistics and progress tracking for all projects.

Task Management: Full CRUD (Create, Read, Update, Delete) capabilities with status and priority filtering.

Mock Authentication: Seamless "Guest Mode" for instant project evaluation.

Admin Panel: User management and role assignment functionality.

Responsive Design: Fully optimized for mobile, tablet, and desktop views.

🛠️ Tech Stack
Frontend
React 18 + TypeScript: Type-safe UI components.

Tailwind CSS + shadcn/ui: Modern styling and accessible component library.

TanStack Query: Efficient server-state management and data fetching.

Wouter: Lightweight routing.

Backend & Storage
Node.js + Express: Robust backend API.

Storage Architecture: Designed for PostgreSQL with Drizzle ORM.

Local Implementation: Uses a Custom In-Memory Storage Provider for easy local evaluation without external database dependencies.

Authentication: Integrated Mock Auth System providing an immediate "Guest" experience.

Development Highlight: I implemented a custom storage interface that allows the application to switch between a live PostgreSQL database and an In-Memory store. This ensures the project is portable and easy to review while maintaining a production-ready schema.

🖥️ Quick Start (Local View)
Follow these steps to run the project on your machine:

Clone the repository:

Bash

git clone <your-repo-url>
cd Taskflowmanagement
Install dependencies:

Bash

npm install
Environment Setup: Create a .env file in the root directory and add:

Plaintext

SESSION_SECRET=local_development_secret_123
REPLIT_DOMAINS=localhost:5000
Start the server:

Bash

npm run dev
Access the App: Open http://localhost:5000. Click "Sign In" to be automatically logged in as a Guest.

📂 Project Structure
Plaintext

├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Dashboard, Tasks, and Admin views
├── server/              # Express backend
│   ├── storage.ts       # Interface & MemStorage implementation
│   ├── replitAuth.ts    # Mock Auth logic
├── shared/              # Shared Zod schemas & TypeScript types
🛡️ Security & Performance
Input Validation: Strict schema validation using Zod.

Role-Based Access: Protected routes based on user roles (Admin/User).

Optimistic Updates: UI stays fast by updating tasks locally before the server responds.

📄 License
This project is open-source and available under the MIT License.
