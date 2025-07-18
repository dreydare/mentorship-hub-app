# Mentorship Matching Platform

A full-stack web application for connecting mentors and mentees in an incubator/accelerator program. Built with React (frontend) and NestJS (backend).

## Features

### User Management
- **Three user roles**: Admin, Mentor, Mentee
- JWT-based authentication
- Role-based access control
- User profile management

### Core Functionality
- **Mentor Discovery**: Mentees can browse and filter mentors by skills and industry
- **Mentorship Requests**: Mentees send requests, mentors accept/reject
- **Availability Management**: Mentors set weekly availability slots
- **Session Booking**: Mentees book sessions with accepted mentors
- **Feedback System**: Post-session ratings and comments
- **Admin Dashboard**: User management, match oversight, statistics

## Tech Stack

### Backend
- NestJS (Node.js framework)
- PostgreSQL (Database)
- TypeORM (ORM)
- JWT (Authentication)
- Swagger (API Documentation)

### Frontend
- React 18 with TypeScript
- Vite (Build tool)
- Tailwind CSS (Styling)
- React Router v6 (Routing)
- React Query (Data fetching)
- Axios (HTTP client)

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Create PostgreSQL database:
```sql
CREATE DATABASE mentorship_platform;
CREATE USER mentorship_platform WITH PASSWORD 'mentorship_platform';
GRANT ALL PRIVILEGES ON DATABASE mentorship_platform TO mentorship_platform;
```

5. Start the backend:
```bash
npm run start:dev
```

Backend will be available at: `http://localhost:3100`
API Documentation: `http://localhost:3100/api`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Ensure VITE_API_URL points to your backend
```

4. Start the frontend:
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## API Endpoints Overview

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user

### Profiles
- `POST /profiles` - Create profile
- `GET /profiles/mentors` - Browse mentors
- `PUT /profiles/me` - Update profile

### Mentorship
- `POST /requests` - Send mentorship request
- `PUT /requests/:id` - Accept/reject request
- `POST /sessions` - Book session
- `PUT /sessions/:id/feedback` - Submit feedback

### Admin
- `GET /admin/users` - Manage users
- `POST /admin/assign-mentor` - Manual matching

## User Workflows

### For Mentees
1. Register and create profile
2. Browse available mentors
3. Send mentorship requests
4. Book sessions with accepted mentors
5. Provide feedback after sessions

### For Mentors
1. Register and create profile
2. Set weekly availability
3. Review incoming requests
4. Accept/reject mentees
5. Conduct sessions

### For Admins
1. View all users and sessions
2. Manually assign mentors
3. Monitor platform statistics
4. Manage user roles

## Project Structure

```
dare/
├── server/                 # Backend (NestJS)
│   ├── src/
│   │   ├── admin/         # Admin module
│   │   ├── auth/          # Authentication
│   │   ├── profiles/      # Profile management
│   │   ├── requests/      # Mentorship requests
│   │   ├── sessions/      # Session management
│   │   └── ...
│   └── README.md
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── features/      # Feature modules
│   │   ├── services/      # API services
│   │   └── ...
│   └── README.md
└── README.md              # This file
```

## Development

### Running Tests
```bash
# Backend tests
cd server && npm test

# Frontend tests
cd client && npm test
```

### Building for Production
```bash
# Backend
cd server && npm run build

# Frontend
cd client && npm run build
```

## License
MIT