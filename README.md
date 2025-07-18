# Task Tracker App

A modern full-stack task management application demonstrating best practices in React.js frontend development and Node.js backend API design. This project serves as an excellent learning resource for developers wanting to understand modern web development patterns, authentication flows, and database integration.

## 🚀 Features

### Core Functionality
- **Task Management**: Complete CRUD operations (Create, Read, Update, Delete)
- **User Authentication**: Secure JWT-based registration and login system
- **Data Isolation**: Each user sees only their own tasks
- **Real-time Updates**: Instant UI feedback for all operations
- **Form Validation**: Both client-side and server-side validation
- **Error Handling**: Comprehensive error handling with user-friendly messages

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Loading States**: Visual feedback during API operations
- **Professional UI**: Corporate-inspired design with dark mode support
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Toast Notifications**: Non-intrusive success and error messages

### Developer Experience
- **Modern Stack**: Latest versions of React, Node.js, and MongoDB
- **Code Quality**: ESLint configuration with best practices
- **Testing**: Comprehensive unit and integration tests
- **Documentation**: Extensively commented code for educational purposes

## 🛠 Tech Stack

### Frontend Architecture
- **React.js 19.1.0**: Latest React with functional components, hooks, and concurrent features
- **Vite 7.0.4**: Lightning-fast build tool with Hot Module Replacement (HMR)
- **Axios 1.10.0**: Promise-based HTTP client for API communication
- **CSS3 & Custom Properties**: Modern CSS with CSS variables for theming
- **React Testing Library**: Component testing focused on user behavior

### Backend Architecture  
- **Node.js with Express 5.1.0**: RESTful API server with latest Express features
- **MongoDB 6.17.0 with Mongoose 8.16.3**: NoSQL database with elegant object modeling
- **JWT Authentication**: Stateless authentication using JSON Web Tokens
- **bcryptjs**: Secure password hashing with salt rounds
- **CORS**: Cross-Origin Resource Sharing for secure frontend-backend communication

### Development Tools
- **ESLint**: Code linting with React-specific rules
- **Jest & Vitest**: Testing frameworks for backend and frontend
- **Nodemon**: Auto-restart development server on file changes
- **Environment Variables**: Secure configuration management

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js (v18 or higher)**: JavaScript runtime for running the backend server
- **npm**: Package manager (comes with Node.js)
- **MongoDB**: Database server (local installation or MongoDB Atlas account)
- **Git**: Version control system for cloning the repository

## 🚀 Installation and Setup

### 1. Clone the Repository
```bash
# Clone the project from GitHub
git clone https://github.com/yourusername/task-tracker-app.git

# Navigate to the project directory
cd task-tracker-app
```

### 2. Backend Setup
```bash
# Navigate to server directory
cd server

# Install server dependencies
npm install

# Create environment file (copy example and modify)
cp .env.example .env

# Edit .env file with your MongoDB connection string
# Example: MONGO_URI=mongodb://localhost:27017/tasktracker
# Example: JWT_SECRET=your-super-secret-jwt-key

# Start the backend server
npm run dev  # For development with auto-restart
# OR
npm start    # For production
```

### 3. Frontend Setup
```bash
# Navigate to client directory (in a new terminal)
cd client

# Install client dependencies
npm install

# Create environment file for API URL
echo "VITE_API_URL=http://localhost:3001" > .env

# Start the development server
npm run dev
```

### 4. Access the Application
- **Frontend Development Server**: http://localhost:5173
- **Backend API Server**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api-docs (if implemented)

### 5. Production Deployment
This application is deployed and accessible at:
- **Website**: [task-tracker-app-eta-red.vercel.app](https://task-tracker-app-eta-red.vercel.app)
- **Backend API**: [https://task-tracker-app-backend.onrender.com](https://task-tracker-app-backend.onrender.com)

**Note**: The application uses a shared MongoDB database for easy testing. No additional database setup is required for the demo.

## 📡 API Endpoints

### Authentication Routes
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/auth/register` | Register new user | `{name, email, password}` | JWT token + user info |
| POST | `/auth/login` | Login existing user | `{email, password}` | JWT token + user info |
| POST | `/auth/logout` | Logout user | None | Success message |
| GET | `/auth/me` | Get current user info | None (requires JWT) | User profile data |

### Task Management Routes
| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| GET | `/tasks` | Get all user tasks | ✅ Yes | None |
| POST | `/tasks` | Create new task | ✅ Yes | `{title, description?}` |
| GET | `/tasks/:id` | Get specific task | ✅ Yes | None |
| PUT | `/tasks/:id` | Update existing task | ✅ Yes | `{title?, description?, completed?}` |
| DELETE | `/tasks/:id` | Delete task | ✅ Yes | None |

### Request Headers
All authenticated routes require:
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

### Response Format
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## 🧪 Testing

### Frontend Testing
```bash
cd client

# Run all tests once
npm run test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with interactive UI
npm run test:ui

# Generate code coverage report
npm run test:coverage
```

### Backend Testing
```bash
cd server

# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Generate code coverage report
npm run test:coverage
```

### Test Structure
- **Frontend**: Component tests using React Testing Library and Vitest
- **Backend**: API endpoint tests using Jest and Supertest
- **Coverage**: Both frontend and backend maintain >80% test coverage
- **Mocking**: Database and external dependencies are properly mocked

## 📁 Project Structure

```
task-tracker-app/
├── 📁 client/                 # React frontend application
│   ├── 📁 public/            # Static assets (images, icons)
│   ├── 📁 src/
│   │   ├── 📁 components/    # Reusable UI components
│   │   │   ├── TaskForm.jsx  # Form for creating/editing tasks
│   │   │   ├── TaskList.jsx  # List container for tasks
│   │   │   ├── TaskItem.jsx  # Individual task display
│   │   │   ├── LoginForm.jsx # User authentication form
│   │   │   ├── Modal.jsx     # Reusable modal component
│   │   │   └── ...           # Other UI components
│   │   ├── 📁 hooks/         # Custom React hooks
│   │   │   └── useTasks.js   # Task management logic
│   │   ├── 📁 services/      # API communication
│   │   │   └── api.js        # Axios HTTP client setup
│   │   ├── 📁 utils/         # Utility functions
│   │   │   └── validation.js # Input validation helpers
│   │   ├── 📁 test/          # Test configuration
│   │   │   └── setup.js      # Test environment setup
│   │   ├── App.jsx           # Main application component
│   │   ├── main.jsx          # React application entry point
│   │   ├── index.css         # Global styles and CSS variables
│   │   └── App.css           # Component-specific styles
│   ├── vite.config.js        # Vite build configuration
│   ├── eslint.config.js      # ESLint code quality rules
│   └── package.json          # Frontend dependencies & scripts
├── 📁 server/                # Node.js backend API
│   ├── 📁 controllers/       # Business logic handlers
│   │   └── taskController.js # Task CRUD operations
│   ├── 📁 models/           # Database schemas
│   │   ├── User.js          # User model with password hashing
│   │   └── Task.js          # Task model with validation
│   ├── 📁 routes/           # API endpoint definitions
│   │   ├── auth.js          # Authentication routes
│   │   └── tasks.js         # Task management routes
│   ├── 📁 middleware/       # Express middleware
│   │   ├── auth.js          # JWT authentication middleware
│   │   └── corsHandler.js   # CORS configuration
│   ├── 📁 utils/            # Utility functions
│   │   └── jwt.js           # JWT token generation/verification
│   ├── 📁 config/           # Configuration files
│   │   └── db.js            # MongoDB connection setup
│   ├── 📁 tests/            # Backend testing
│   │   ├── setup.js         # Test environment configuration
│   │   └── tasks.test.js    # API endpoint tests
│   ├── server.js            # Express server entry point
│   ├── jest.config.json     # Jest testing configuration
│   └── package.json         # Backend dependencies & scripts
├── .env.example             # Environment variables template
├── README.md                # Project documentation
└── package.json             # Root package configuration
```

### Key Directories Explained

- **`client/src/components/`**: Modular React components for UI elements
- **`client/src/hooks/`**: Custom hooks for state management and side effects
- **`client/src/services/`**: API layer for backend communication
- **`server/controllers/`**: Business logic separated from routing
- **`server/models/`**: Database schemas with validation and relationships
- **`server/middleware/`**: Reusable middleware for authentication, CORS, etc.

## 🔑 Key Implementation Details

### Authentication & Security
- **JWT-Based Authentication**: Stateless authentication using JSON Web Tokens for scalability
- **Password Security**: bcryptjs with salt rounds for secure password hashing
- **Protected Routes**: Middleware-based route protection ensuring only authenticated users access their data
- **Data Isolation**: Database queries filtered by user ID to prevent data leakage
- **CORS Configuration**: Properly configured Cross-Origin Resource Sharing for frontend-backend communication
- **Environment Variables**: Sensitive data stored securely in environment variables

### Frontend Architecture
- **Component-Based Design**: Modular React components following single responsibility principle
- **Custom Hooks**: Reusable state logic with `useTasks` hook for task management
- **API Layer**: Centralized Axios configuration with automatic token attachment
- **Error Boundaries**: Graceful error handling to prevent application crashes
- **Loading States**: User feedback during asynchronous operations
- **Form Validation**: Real-time validation with user-friendly error messages

### Backend Architecture
- **RESTful API Design**: Standard HTTP methods and status codes following REST principles
- **Middleware Pipeline**: Layered middleware for authentication, CORS, and error handling
- **Database Modeling**: Mongoose schemas with validation and relationships
- **Error Handling**: Consistent error responses with appropriate HTTP status codes
- **Input Validation**: Server-side validation to ensure data integrity
- **Database Optimization**: Efficient queries with proper indexing

### Development Best Practices
- **Code Documentation**: Extensive comments explaining concepts for educational purposes
- **Testing Strategy**: Unit and integration tests for both frontend and backend
- **Code Quality**: ESLint configuration enforcing consistent code style
- **Git Workflow**: Structured commit messages and branch management
- **Performance**: Optimized build process with code splitting and tree shaking
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML

### Database Design
```javascript
// User Schema
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed with bcrypt),
  createdAt: Date,
  updatedAt: Date
}

// Task Schema
{
  _id: ObjectId,
  title: String (required, max 40 chars),
  description: String (optional, max 500 chars),
  completed: Boolean (default: false),
  userId: ObjectId (references User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Getting Started for Developers

### Understanding the Codebase
This project is extensively documented with beginner-friendly comments throughout the codebase. Each file includes:
- **Purpose explanations**: What the file does and why it exists
- **Code walkthroughs**: Step-by-step explanations of complex logic
- **Best practices**: Why certain approaches were chosen
- **Learning resources**: Links to documentation and further reading

### Development Workflow
1. **Start with the README**: Understanding the project structure and setup
2. **Explore the Backend**: Begin with `server/server.js` to understand the API structure
3. **Examine the Models**: Look at `server/models/` to understand data structure
4. **Study the Frontend**: Start with `client/src/App.jsx` for the main application flow
5. **Review Components**: Examine individual components to understand React patterns
6. **Run Tests**: Use the test suites to understand expected behavior

### Common Development Tasks
```bash
# Add a new API endpoint
# 1. Create route handler in server/controllers/
# 2. Add route definition in server/routes/
# 3. Update frontend API service in client/src/services/api.js
# 4. Write tests for the new functionality

# Add a new React component
# 1. Create component file in client/src/components/
# 2. Add comprehensive comments explaining the component's purpose
# 3. Include PropTypes or TypeScript types for props
# 4. Write unit tests in client/src/components/__tests__/

# Database changes
# 1. Update Mongoose models in server/models/
# 2. Run database migrations if needed
# 3. Update API controllers to handle new fields
# 4. Update frontend components to display new data
```

### Learning Resources
- **React Documentation**: [reactjs.org](https://reactjs.org)
- **Node.js Guide**: [nodejs.org](https://nodejs.org)
- **MongoDB Tutorial**: [mongodb.com/docs](https://docs.mongodb.com)
- **JWT Authentication**: [jwt.io](https://jwt.io)
- **Testing with Jest**: [jestjs.io](https://jestjs.io)

---

## 👨‍💻 Author

**Built by Abhikya Reddy Ananth (ABBY)**

This project serves as both a functional task management application and an educational resource for developers learning modern web development practices. The codebase is designed to be approachable for beginners while demonstrating professional-level patterns and best practices.

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📞 Support

If you have any questions or need help understanding any part of the code, please feel free to:
- Open an issue on GitHub
- Contact the author directly
- Check the extensive inline documentation throughout the codebase

