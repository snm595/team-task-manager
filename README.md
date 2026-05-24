# Team Task Manager

A full-stack web application for managing team projects and tasks with role-based access control.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS v4
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas + Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **HTTP Client:** Axios
- **Routing:** React Router DOM
- **State Management:** Context API

## Features

- 🔐 **Authentication** - Signup, Login, JWT-based auth, auto-login persistence
- 👥 **Role-Based Access** - Admin and Member roles with different permissions
- 📁 **Project Management** - Create projects, add members (Admin)
- ✅ **Task Management** - Create, assign, update status, delete tasks
- 📊 **Dashboard** - Stats overview (total, completed, pending, overdue tasks)
- 📱 **Responsive UI** - Works on desktop, tablet, and mobile

## Role Permissions

| Action | Admin | Member |
|--------|-------|--------|
| Create Project | ✅ | ❌ |
| Add Members | ✅ | ❌ |
| Create Task | ✅ | ❌ |
| Assign Task | ✅ | ❌ |
| Delete Task/Project | ✅ | ❌ |
| View Assigned Tasks | ✅ | ✅ |
| Update Task Status | ✅ | ✅ (own tasks) |
| View Dashboard | ✅ | ✅ |

## Project Structure

```
TeamTask/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── layouts/
│   │   │   └── AppLayout.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── CreateProject.jsx
│   │   │   ├── Tasks.jsx
│   │   │   └── CreateTask.jsx
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── endpoints.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account (free tier works)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd TeamTask
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/team-task-manager?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```bash
cp .env.example .env
```

The default `.env` should work for local development:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Register a new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Projects
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/projects` | Get all projects | Private |
| POST | `/api/projects` | Create a project | Admin |
| PUT | `/api/projects/:id` | Update a project | Admin |
| DELETE | `/api/projects/:id` | Delete a project | Admin |
| GET | `/api/projects/members` | Get all users | Admin |

### Tasks
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tasks` | Get tasks | Private |
| POST | `/api/tasks` | Create a task | Admin |
| PUT | `/api/tasks/:id` | Update a task | Admin |
| DELETE | `/api/tasks/:id` | Delete a task | Admin |
| PATCH | `/api/tasks/:id/status` | Update task status | Private |

### Dashboard
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/dashboard/stats` | Get dashboard stats | Private |

## Railway Deployment

### Backend Deployment

1. Push your code to GitHub
2. Go to [Railway](https://railway.app) and create a new project
3. Connect your GitHub repository
4. Select the `backend` directory as the root
5. Add environment variables:
   - `MONGO_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - A strong secret key
   - `PORT` - Railway sets this automatically
6. Railway will auto-detect Node.js and deploy

### Frontend Deployment

1. In Railway, add another service from the same repo
2. Select the `frontend` directory as the root
3. Add build settings:
   - Build Command: `npm run build`
   - Start Command: `npx serve dist -s`
4. Add environment variable:
   - `VITE_API_URL` - Your deployed backend URL + `/api`
5. Install serve: Add `"serve": "^14.0.0"` to dependencies, or use Railway's static site hosting

### Alternative: Deploy frontend as static site

```bash
cd frontend
npm run build
```

Upload the `dist` folder to any static hosting (Vercel, Netlify, etc.) and set `VITE_API_URL` to your backend URL.

## Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | JWT signing secret | mysecretkey123 |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000/api |

## License

MIT
