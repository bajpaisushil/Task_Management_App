# Task Management Application

A full-stack application for managing tasks with user authentication, built with React, Express.js, TypeScript, and PostgreSQL.

## Features

- **User Authentication**: Secure login and registration system using JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Responsive UI**: Modern interface built with React
- **Dockerized**: Easy deployment with Docker and docker-compose
- **API Documentation**: Swagger documentation for all endpoints

![Screenshot 2025-04-05 221139](https://github.com/user-attachments/assets/d18d444f-17ea-408a-8506-88612740c720)

![Screenshot 2025-04-05 221133](https://github.com/user-attachments/assets/9f290bd8-374b-4977-b1bb-9cf7ae60774b)

![Screenshot 2025-04-05 221123](https://github.com/user-attachments/assets/a587baaa-baa9-4249-b1f6-8a28c850f47a)


## Tech Stack

### Frontend:
- React (Vite)
- Redux Toolkit for state management
- Axios for API requests
- TailwindCSS for styling

### Backend:
- Express.js with TypeScript
- Prisma ORM for database access
- JWT for authentication
- Swagger UI for API documentation

### Database:
- PostgreSQL

## Prerequisites

- Docker and Docker Compose (version 1.29.0 or higher recommended)
- Node.js (for local development only)
- Git

## Getting Started with Docker (Recommended)

### 1. Clone the repository

```bash
git clone <repository-url>
cd task-management-app
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=taskdb

# Backend
DATABASE_URL=postgresql://postgres:password@postgres:5432/taskdb
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret
PORT=5000

# Frontend
VITE_API_URL=http://localhost:5000/api
```

> **Important**: For production environments, use strong, unique passwords and secrets!

### 3. Docker Setup

#### Check Docker installation:

```bash
docker --version
docker-compose --version
```

### 4. Build and Start the Docker Services

For the first run (or after making changes to Dockerfiles):

```bash
docker-compose build
```

Start all services:

```bash
docker-compose up
```

To run in detached mode (background):

```bash
docker-compose up -d
```

### 5. Verify Services

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Swagger Documentation: http://localhost:5000/api-docs


#### Restart services:
```bash
docker-compose restart

# Restart specific service
docker-compose restart backend
```

#### Stop services:
```bash
docker-compose stop
```

#### Remove containers (preserves volumes):
```bash
docker-compose down
```

#### Remove containers and volumes (complete cleanup):
```bash
docker-compose down -v
```

#### View running containers:
```bash
docker-compose ps
```

## Local Development Setup

### Backend Setup:

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file with the following variables:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/taskdb
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret
PORT=5000
```

Run the development server:
```bash
npm run dev
```

### Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file with the following variables:
```
VITE_API_URL=http://localhost:5000/api
```

Run the development server:
```bash
npm run dev
```

## API Reference

The API provides the following endpoints:

### Authentication

**POST /api/auth/login**: Authenticate user and receive JWT token
- Request Body: `{ "email": "user@example.com", "password": "password" }`
- Response: `{ "token": "jwt_token", "refreshToken": "refresh_token", "user": {...} }`

**POST /api/auth/register**: Register a new user
- Request Body: `{ "username": "user", "email": "user@example.com", "password": "password" }`
- Response: `{ "id": 1, "username": "user", "email": "user@example.com" }`

### Tasks

All task endpoints require authentication via JWT token in the Authorization header.

**GET /api/tasks**: Get all tasks for the authenticated user
- Response: `[{ "id": 1, "title": "Task title", "description": "Task description", "status": "TODO", "userId": 1 }, ...]`

**POST /api/tasks**: Create a new task
- Request Body: `{ "title": "Task title", "description": "Task description", "status": "TODO" }`
- Response: `{ "id": 1, "title": "Task title", "description": "Task description", "status": "TODO", "userId": 1 }`

**PUT /api/tasks/{id}**: Update an existing task
- Request Body: `{ "title": "Updated title", "description": "Updated description", "status": "IN_PROGRESS" }`
- Response: `{ "id": 1, "title": "Updated title", "description": "Updated description", "status": "IN_PROGRESS", "userId": 1 }`

**DELETE /api/tasks/{id}**: Delete a task
- Response: `{ "message": "Task deleted successfully" }`

For detailed API documentation, visit the Swagger UI at http://localhost:5000/api-docs when the application is running.

## Project Structure

```
task-management-app/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── index.ts         # Entry point
│   │   ├── middleware/      # Auth middleware
│   │   ├── routes/          # API routes
│   │   └── prisma/          # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store
│   │   └── App.tsx          # Main app component
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
└── docker-compose.yml       # Docker compose configuration
```

## Docker Services

The application consists of three Docker services:

- **frontend**: React application served on port 5173
- **backend**: Express.js API running on port 5000
- **postgres**: PostgreSQL database service

## Development

### Database Migrations

To apply Prisma migrations:
```bash
cd backend
npx prisma migrate dev
```

### Adding New Dependencies

To add new dependencies during development:
```bash
# Backend
cd backend
npm install package-name

# Frontend
cd frontend
npm install package-name
```

After adding dependencies, rebuild the Docker images:
```bash
docker-compose build
docker-compose up
```

## Production Deployment Considerations

For production deployment, consider the following:

1. Use environment-specific `.env` files or environment variables
2. Configure proper resource limits in Docker Compose
3. Implement health checks for container orchestration
4. Set up proper logging and monitoring
5. Configure HTTPS with appropriate certificates
6. Implement database backups
