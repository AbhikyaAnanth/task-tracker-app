# Task Tracker API Documentation

## Base URL
```
http://localhost:3001/api
```

## Endpoints

### GET /tasks
Retrieve all tasks.

**Response:**
```json
[
  {
    "_id": "670123456789abcdef012345",
    "title": "Complete project documentation",
    "completed": false,
    "createdAt": "2025-01-13T10:30:00.000Z",
    "updatedAt": "2025-01-13T10:30:00.000Z"
  }
]
```

### POST /tasks
Create a new task.

**Request Body:**
```json
{
  "title": "Task title (required, 2-200 characters)"
}
```

**Response:**
```json
{
  "_id": "670123456789abcdef012345",
  "title": "Complete project documentation",
  "completed": false,
  "createdAt": "2025-01-13T10:30:00.000Z",
  "updatedAt": "2025-01-13T10:30:00.000Z"
}
```

### PUT /tasks/:id
Update an existing task.

**Request Body:**
```json
{
  "title": "Updated task title (optional)",
  "completed": true
}
```

**Response:**
```json
{
  "_id": "670123456789abcdef012345",
  "title": "Updated task title",
  "completed": true,
  "createdAt": "2025-01-13T10:30:00.000Z",
  "updatedAt": "2025-01-13T10:35:00.000Z"
}
```

### DELETE /tasks/:id
Delete a task.

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Task title is required"
}
```

### 404 Not Found
```json
{
  "error": "Task not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Validation Rules

### Task Title
- **Required**: Yes
- **Min Length**: 2 characters
- **Max Length**: 200 characters
- **Type**: String

### Task Completed
- **Required**: No (defaults to false)
- **Type**: Boolean

## Rate Limiting
Currently no rate limiting is implemented, but it can be added using middleware like `express-rate-limit`.

## Authentication
Currently no authentication is required. For production use, consider implementing JWT or session-based authentication.

## CORS
CORS is configured to allow requests from the frontend development server (`http://localhost:5174`). In production, update the CORS configuration to match your frontend domain.
