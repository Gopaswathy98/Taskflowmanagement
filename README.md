🚀 **Taskflow Management**

A modern, full-stack task management application designed to streamline workflows, track project progress, and boost productivity. Built with a focus on performance, scalability, and a clean user experience.

🌟 Key Features

Interactive Kanban Board: Drag-and-drop tasks between columns (Pending, Ongoing, Done).

Real-time Updates: Stay synced with your team using live status updates.

Task Prioritization: Categorize tasks by high, medium, or low priority.

User Authentication: Secure login and registration system with JWT.

Responsive Design: Optimized for desktop, tablet, and mobile viewing.

Dark Mode Support: Seamlessly switch between light and dark themes.

🛠️ Tech Stack

Frontend
React 18 (Vite)

Tailwind CSS (Styling)

Wouter (Lightweight Routing)

Lucide React (Iconography)

Backend
Node.js & Express

TypeScript

PostgreSQL (with Drizzle ORM)

Zod (Validation)

🚀 Getting Started

Follow these steps to get a local copy up and running.

Prerequisites
Node.js (v18 or higher)

npm or yarn

PostgreSQL instance

Installation
Clone the repository:

Bash

git clone https://github.com/Gopaswathy98/Taskflowmanagement.git
cd Taskflowmanagement
Install Root Dependencies:

Bash

npm install
Setup Environment Variables: Create a .env file in the root directory and add:

Code snippet

DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
Run Database Migrations:

Bash

npm run db:push
Start Development Server:

Bash

npm run dev
Your app will be running at http://localhost:5000.

📁 Project Structure

Plaintext

├── client/                # React frontend (Vite)
│   ├── src/               # UI components and logic
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── routes.ts          # API endpoints
│   ├── auth.ts            # Authentication logic
│   └── storage.ts         # Database interface
├── shared/                # Shared Types/Zod Schemas
└── dist/                  # Production build output

🌐 Deployment

The project is configured for easy deployment on Render.

Frontend: Deployed as a Static Site from the client folder.

Backend: Deployed as a Web Service running the Express server.

Database: Hosted PostgreSQL instance.

🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License

Distributed under the MIT License. See LICENSE for more information.
