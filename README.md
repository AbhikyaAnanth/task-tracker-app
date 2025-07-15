# Task Tracker App

A full-stack task management application built with React.js and Node.js. Users can create, read, update, and delete tasks with user authentication and data isolation.

## Features

- View a list of tasks
- Add new tasks with form validation
- Edit existing tasks
- Delete tasks with confirmation
- User registration and authentication
- User-specific data (each user sees only their own tasks)
- Responsive design for desktop and mobile
- Loading states and error handling

## Tech Stack

**Frontend:**
- React.js with functional components and hooks
- Vite for build tooling
- Axios for API requests
- CSS3 for styling

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose
- JWT-based authentication
- RESTful API design

## Prerequisites

- Node.js (v18 or higher)

## Installation and Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/task-tracker-app.git
cd task-tracker-app
```

### 2. Backend Setup
```bash
cd server
npm install
node server.js
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### 5. Deployed demo access  (with Vercel and Render): 
- Website URL : task-tracker-app-eta-red.vercel.app
- Backend URL : https://task-tracker-app-backend.onrender.com

**Note:** The app is pre-configured with a shared MongoDB database for easy testing. No additional database setup required.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks for authenticated user |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update an existing task |
| DELETE | `/tasks/:id` | Delete a task |
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/logout` | Logout user |
| GET | `/auth/me` | Get current user info |

## Testing

```bash
# Frontend tests
cd client
npm run test

# Backend tests
cd server
npm run test
```

## Project Structure

```
task-tracker-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── App.jsx
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route handlers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── utils/              # JWT utilities
│   └── server.js
└── README.md
```

## Key Implementation Details

**Authentication:**
- JWT-based authentication with user registration/login
- Protected routes requiring JWT tokens
- User-specific data isolation
- Stateless authentication for better scalability

**Validation:**
- Frontend form validation for required fields
- Backend input validation and error handling
- Proper error messages and user feedback

**Database:**
- MongoDB with Mongoose ODM
- User and Task models with proper relationships
- Database indexing for performance

**Security:**
- JWT tokens for secure authentication
- Password hashing with bcrypt
- CORS configuration for cross-origin requests
- Protected API endpoints

**Code Quality:**
- Reusable React components and custom hooks
- Clean separation of concerns
- Consistent naming conventions
- Comprehensive error handling

Built by Abhikya Reddy Ananth ( ABBY )

