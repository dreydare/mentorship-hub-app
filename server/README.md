# Mentorship Matching Platform - Backend

## Overview
NestJS backend API for the Mentorship Matching Platform, providing endpoints for user authentication, profile management, mentor-mentee matching, session scheduling, and admin functionality.

## Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

## Setup

### 1. Environment Configuration
Copy `.env.example` to `.env` and update with your configuration:

```bash
cp .env.example .env
```

### 2. Database Setup
Create a PostgreSQL database:

```sql
CREATE DATABASE mentorship_platform;
CREATE USER mentorship_platform WITH PASSWORD 'mentorship_platform';
GRANT ALL PRIVILEGES ON DATABASE mentorship_platform TO mentorship_platform;
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Migrations (if using)
```bash
npm run migration:run
```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## API Documentation
Swagger documentation is available at: `http://localhost:3100/api`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - Logout user

### User Management
- `GET /users/me` - Get current user profile
- `GET /users/:id` - Get user by ID

### Profile Management
- `POST /profiles` - Create user profile
- `GET /profiles/me` - Get current user profile
- `PUT /profiles/me` - Update current user profile
- `GET /profiles/mentors` - Get mentors with filters
- `GET /profiles/:userId` - Get profile by user ID

### Mentorship Requests
- `POST /requests` - Create mentorship request (Mentee)
- `GET /requests/sent` - Get sent requests (Mentee)
- `GET /requests/received` - Get received requests (Mentor)
- `PUT /requests/:id` - Accept/Reject request (Mentor)
- `GET /requests/accepted` - Get accepted mentorships

### Availability
- `POST /availability` - Create availability slot (Mentor)
- `GET /availability` - Get my availability (Mentor)
- `GET /availability/mentor/:mentorId` - Get mentor availability
- `PUT /availability/:id` - Update availability (Mentor)
- `DELETE /availability/:id` - Delete availability (Mentor)

### Sessions
- `POST /sessions` - Schedule session (Mentee)
- `GET /sessions/mentor` - Get mentor sessions
- `GET /sessions/mentee` - Get mentee sessions
- `PUT /sessions/:id/feedback` - Submit feedback

### Admin
- `GET /admin/users` - Get all users
- `PUT /admin/users/:id/role` - Update user role
- `GET /admin/matches` - Get all matches
- `GET /admin/sessions` - Get all sessions
- `POST /admin/assign-mentor` - Manually assign mentor
- `GET /admin/dashboard-stats` - Get dashboard statistics

## User Roles
- **Admin**: Full system access
- **Mentor**: Can set availability, manage requests
- **Mentee**: Can browse mentors, send requests, book sessions

## Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure
```
src/
├── admin/           # Admin module
├── auth/            # Authentication module
├── availability/    # Availability management
├── common/          # Shared resources (guards, decorators, etc.)
├── config/          # Configuration files
├── database/        # Database entities
├── profiles/        # Profile management
├── requests/        # Mentorship requests
├── sessions/        # Session management
├── users/           # User management
├── app.module.ts    # Main application module
└── main.ts          # Application entry point
```