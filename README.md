# Task Tracker App

A modern, full-stack task management application built with React.js and Node.js. Features a clean, responsive UI with real-time updates and comprehensive CRUD operations.

![Task Tracker Demo](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success)

## 🚀 Features

### Core Functionality
- ✅ **Create Tasks** - Add new tasks with validation
- ✅ **Read Tasks** - View all tasks with filtering options
- ✅ **Update Tasks** - Edit task titles inline
- ✅ **Delete Tasks** - Remove tasks with confirmation modal
- ✅ **Toggle Completion** - Mark tasks as complete/incomplete

### Enhanced Features
- 🎨 **Modern UI/UX** - Clean, professional design with animations
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- ⚡ **Real-time Updates** - Instant UI updates without page refresh
- 🔍 **Smart Filtering** - Filter by All, Pending, or Completed tasks
- 📊 **Progress Tracking** - Visual progress bar and statistics
- ⏰ **Timestamps** - Track creation and modification times
- 🛡️ **Error Handling** - Comprehensive error states and user feedback
- 🎯 **Form Validation** - Client-side validation with helpful messages
- 🎭 **Loading States** - Smooth loading indicators for all operations
- 🎪 **Animations** - Subtle animations for enhanced user experience

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern functional components with hooks
- **Vite** - Fast build tool and development server
- **CSS3** - Custom styling with CSS variables and animations
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas account** (free) - [Sign up here](https://www.mongodb.com/atlas)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/task-tracker-app.git
cd task-tracker-app
```

### 2. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your MongoDB connection string
# MONGODB_URI=your_mongodb_atlas_connection_string
# PORT=3001

# Start the server
npm start
```

The backend will run on `http://localhost:3001`

### 3. Frontend Setup
```bash
# Open new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5174`

### 4. Access the Application
Open your browser and navigate to `http://localhost:5174`

## 🌐 API Endpoints

The backend provides the following RESTful API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Retrieve all tasks |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update an existing task |
| DELETE | `/api/tasks/:id` | Delete a task |

### API Request/Response Examples

#### Create Task
```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project documentation"
}
```

#### Update Task
```bash
PUT /api/tasks/670123456789abcdef012345
Content-Type: application/json

{
  "title": "Updated task title",
  "completed": true
}
```

## 📁 Project Structure

```
task-tracker-app/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── ProgressBar.jsx
│   │   ├── hooks/         # Custom React hooks
│   │   │   └── useTasks.js
│   │   ├── services/      # API service layer
│   │   │   └── api.js
│   │   ├── App.jsx        # Main application component
│   │   └── main.jsx       # Application entry point
│   ├── package.json
│   └── vite.config.js
├── server/                # Node.js backend
│   ├── config/           # Database configuration
│   │   └── db.js
│   ├── controllers/      # Route controllers
│   │   └── taskController.js
│   ├── middleware/       # Custom middleware
│   │   └── corsHandler.js
│   ├── models/           # Database models
│   │   └── Task.js
│   ├── routes/           # API routes
│   │   └── tasks.js
│   ├── .env              # Environment variables
│   ├── package.json
│   └── server.js         # Server entry point
└── README.md
```

## 🧪 Testing

### Running Tests
```bash
# Frontend tests
cd client
npm test

# Backend tests (if implemented)
cd server
npm test
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tasktracker?retryWrites=true&w=majority

# Server
PORT=3001
NODE_ENV=development
```

### Frontend Configuration

The frontend automatically connects to the backend on `http://localhost:3001`. Update `src/services/api.js` if you need to change the backend URL.

## 🚀 Deployment

### Backend Deployment (Railway/Heroku/Vercel)
1. Set environment variables in your hosting platform
2. Deploy the `server` directory
3. Update the database connection string for production

### Frontend Deployment (Netlify/Vercel)
1. Build the production version: `npm run build`
2. Deploy the `client/dist` directory
3. Update API base URL in `src/services/api.js`

## 🎯 Key Features Demonstrated

### Frontend Excellence
- **Modern React Patterns** - Functional components, custom hooks, proper state management
- **Responsive Design** - Mobile-first approach with CSS Grid and Flexbox
- **User Experience** - Loading states, error handling, form validation
- **Performance** - Optimized re-renders, efficient state updates
- **Accessibility** - Semantic HTML, keyboard navigation, screen reader friendly

### Backend Excellence
- **RESTful API Design** - Clean, consistent endpoint structure
- **Error Handling** - Comprehensive error responses and validation
- **Database Integration** - Proper MongoDB/Mongoose usage
- **Security** - CORS configuration, input validation
- **Scalability** - Modular architecture, separation of concerns

### Code Quality
- **Clean Architecture** - Separation of concerns, reusable components
- **Consistent Naming** - Clear, descriptive variable and function names
- **Documentation** - Comprehensive comments and README
- **Error Boundaries** - Graceful error handling throughout the app

## 🔄 Development Workflow

### Adding New Features
1. Create feature branch: `git checkout -b feature/new-feature`
2. Implement changes
3. Test thoroughly
4. Update documentation
5. Create pull request

### Code Style
- Use ES6+ features
- Follow React best practices
- Implement proper error handling
- Write descriptive commit messages

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check MongoDB connection string in `.env`
- Ensure MongoDB Atlas allows connections from your IP
- Verify all environment variables are set

**Frontend can't connect to backend:**
- Ensure backend is running on port 3001
- Check CORS configuration
- Verify API base URL in `src/services/api.js`

**Database connection issues:**
- Verify MongoDB Atlas credentials
- Check network access in MongoDB Atlas
- Ensure connection string format is correct

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Abby Areddy**
- Portfolio: [Your Portfolio URL]
- LinkedIn: [Your LinkedIn URL]
- Email: [Your Email]

---

Built with ❤️ using React.js and Node.js
