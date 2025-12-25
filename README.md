# TaskFlow - Task Management Platform

A full-stack web application for managing tasks and projects with secure authentication and real-time updates.

## 🚀 Features

- **User Authentication**: Secure login with OpenID Connect
- **Task Management**: Create, edit, delete, and track tasks with filters
- **Dashboard Analytics**: Real-time statistics and progress tracking
- **Admin Panel**: User management and role assignment
- **Responsive Design**: Optimized for desktop and mobile devices

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui components
- TanStack Query for data fetching
- React Hook Form + Zod validation
- Wouter for routing

**Backend:**
- Node.js + Express + TypeScript
- PostgreSQL with Drizzle ORM
- OpenID Connect authentication
- Session management with PostgreSQL storage
- RESTful API design

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd taskflow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret_key
   REPL_ID=your_replit_app_id
   REPLIT_DOMAINS=your_domain.replit.app
   ```

4. **Set up the database:**
   ```bash
   npm run db:push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`


🖥️ How to View the Project:

Since this is a local development version, follow these steps to see it in action:

Clone the repository.

Run npm install.

Run npm run dev.

Open http://localhost:5000 in your browser.

Note: Use the "Sign In" button to enter the dashboard instantly via Guest Mode.

## 📂 Project Structure

```
taskflow/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utility functions
├── server/              # Express backend
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database operations
│   └── replitAuth.ts    # Authentication logic
├── shared/              # Shared types and schemas
│   └── schema.ts        # Database schema and types
└── package.json         # Dependencies and scripts
```

## 🔌 API Endpoints

### Authentication
- `GET /api/auth/user` - Get current user
- `GET /api/login` - Initiate login flow
- `GET /api/logout` - Logout user

### Tasks
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Projects
- `GET /api/projects` - Get user projects
- `POST /api/projects` - Create new project

### Statistics
- `GET /api/stats` - Get task statistics

### Admin (Admin role required)
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role

## 🗄️ Database Schema

### Users Table
- `id` - Primary key (string)
- `email` - User email (unique)
- `firstName` - User first name
- `lastName` - User last name
- `role` - User role (user/admin)
- `profileImageUrl` - Profile image URL

### Tasks Table
- `id` - Primary key (serial)
- `title` - Task title
- `description` - Task description
- `status` - Task status (planned/in_progress/completed)
- `priority` - Task priority (low/medium/high/urgent)
- `dueDate` - Due date
- `projectId` - Associated project ID
- `assigneeId` - Assigned user ID
- `createdById` - Creator user ID

### Projects Table
- `id` - Primary key (serial)
- `name` - Project name
- `description` - Project description
- `ownerId` - Project owner ID

## 🚀 Deployment

This application is configured for deployment on Replit. To deploy:

1. Push your code to a Git repository
2. Import the repository into Replit
3. Configure environment variables in Replit Secrets
4. Use Replit's deployment feature to go live

## 🛡️ Security Features

- Secure session management with PostgreSQL storage
- CSRF protection
- Input validation with Zod schemas
- Role-based access control
- Secure authentication with OpenID Connect

## 📱 Responsive Design

- Mobile-first approach
- Touch-friendly interface
- Optimized for various screen sizes
- Progressive enhancement

## 🔧 Development Scripts

- `npm run dev` - Start development server
- `npm run db:push` - Push database schema changes
- `npm run build` - Build for production

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or support, please create an issue in the repository.
