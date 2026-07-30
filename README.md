# StartupManager API

A backend REST API designed to help startup founders and development teams manage startups, members, and tasks through a structured and secure platform.

## Overview

StartupManager API allows startup owners to create startups, invite team members, assign tasks, and manage collaboration through role-based access control.

The project was built as a portfolio backend project to demonstrate real-world backend engineering concepts including REST API development, authentication, authorization, relational database design, layered architecture, and automated testing.

## Project Goals

The goal of this project was to build a realistic backend system while practicing:

- Designing scalable REST APIs
- Building secure authentication flows
- Managing relational database relationships
- Implementing authorization rules
- Structuring backend applications using layered architecture
- Writing integration tests for API behavior

---

# Features

## Authentication

- User registration and login
- JWT-based authentication
- Access token and refresh token system
- Secure password hashing using bcrypt
- Refresh token storage and invalidation
- Protected API routes using JWT middleware

## Startup Management

- Create startups
- Retrieve user's startups
- View startup information
- Delete startups
- Leave startups

## Team Management

- Search users by username or display name
- Invite users to startups
- Accept or decline startup invitations
- View startup members
- Remove members from startups
- Update member roles

## Task Management

- Create tasks
- Update tasks
- Delete tasks
- Assign tasks to startup members
- Retrieve startup tasks
- Retrieve individual task details

## Role-Based Access Control

StartupManager uses role-based authorization for controlling user permissions inside startups.

Each startup member has a role:

### Owner

Owners have full control over the startup.

Permissions include:

- Create, update, and delete tasks
- Invite members
- Remove members
- Update member roles
- Delete the startup

### Admin

Admins can manage startup tasks.

Permissions include:

- Create tasks
- Update tasks

### Worker

Workers have limited access.

Permissions include:

- View startup members
- View startup tasks

---

# Tech Stack

## Backend

- Node.js v22.19.0
- Express.js
- JavaScript

## Database

- PostgreSQL 18

## Testing

- Jest
- Supertest

## Libraries

- bcrypt
- dotenv
- uuid
- jsonwebtoken

---

# Architecture

StartupManager follows a layered architecture pattern to separate application responsibilities and improve maintainability.

Project structure:

```text
src/
├── controllers
├── services
├── repositories
├── routes
├── middlewares
├── guards
├── database
├── migrations
└── utils
```

## Request Lifecycle

The application follows this request flow:

```
Client Request
        |
        v
Middleware
        |
        v
Controller
        |
        v
Service Layer
        |
        v
Repository Layer
        |
        v
Database
```

### Responsibilities

### Middleware

Handles request-level concerns:

- Authentication checks
- Request validation
- Permission checks

### Controllers

Responsible for:

- Receiving HTTP requests
- Calling application logic
- Returning HTTP responses

### Services

Contains business logic and application rules.

Examples:

- Startup membership rules
- Task assignment rules
- Role validation

### Repositories

Responsible for database communication and data access.

This separation keeps business logic independent from database implementation details.

---

# Database Design

StartupManager uses PostgreSQL with relational database modeling.

Main tables:

- users
- startups
- startup_users
- tasks
- invites
- user_refresh_tokens

## Relationships

Users and startups have a many-to-many relationship.

A user can belong to multiple startups:

```
User
 |
 |---- Startup A
 |
 |---- Startup B
```

A startup can contain multiple users:

```
Startup
 |
 |---- User A
 |
 |---- User B
```

This relationship is managed through the `startup_users` table, which stores:

- User membership
- Startup membership
- User role

Tasks belong to startups and can optionally be assigned to startup members.

The database uses:

- Foreign keys
- Unique constraints
- PostgreSQL enums

to maintain data integrity.

---

# Authentication System

StartupManager implements JWT authentication using access and refresh tokens.

Authentication flow:

```
User Login
    |
    v
Validate Credentials
    |
    v
Generate Access Token
    |
    v
Generate Refresh Token
    |
    v
Store Refresh Token
```

## Security Practices

Implemented:

- Password hashing using bcrypt
- Environment-based secret management
- JWT protected routes
- Refresh token persistence
- Input validation

Environment secrets are stored using `.env` configuration.

---

# API Overview

All protected endpoints require:

```
Authorization: Bearer <access_token>
```

---

## Authentication

| Method | Endpoint        | Description                             |
| ------ | --------------- | --------------------------------------- |
| POST   | `/auth/signup`  | Register a new user                     |
| POST   | `/auth/login`   | Authenticate user and receive tokens    |
| POST   | `/auth/refresh` | Generate a new access token             |
| GET    | `/profile`      | Retrieve authenticated user information |
| POST   | `/auth/logout`  | Logout and invalidate refresh token     |

---

## Startup Management

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| GET    | `/startups`          | Retrieve user's startups |
| POST   | `/startup`           | Create a new startup     |
| GET    | `/startup/:id`       | Retrieve startup details |
| DELETE | `/startup/:id`       | Delete startup           |
| POST   | `/startup/leave/:id` | Leave startup            |

---

## Invitation Management

| Method | Endpoint                               | Description               |
| ------ | -------------------------------------- | ------------------------- |
| GET    | `/invites`                             | Retrieve user invitations |
| POST   | `/invites/:id/accept`                  | Accept invitation         |
| POST   | `/invites/:id/decline`                 | Decline invitation        |
| POST   | `/startup/:startupid/users/:id/invite` | Invite user to startup    |

---

## Member Management

| Method | Endpoint                              | Description              |
| ------ | ------------------------------------- | ------------------------ |
| GET    | `/users`                              | Search users             |
| GET    | `/startup/:id/members`                | Retrieve startup members |
| GET    | `/startup/:id/members/:memberid`      | Retrieve specific member |
| PATCH  | `/startup/:id/members/:memberid/role` | Update member role       |
| DELETE | `/startup/:id/members/:memberid/kick` | Remove member            |

---

## Task Management

| Method | Endpoint                        | Description            |
| ------ | ------------------------------- | ---------------------- |
| POST   | `/startup/:id/tasks`            | Create task            |
| GET    | `/startup/:id/tasks`            | Retrieve startup tasks |
| GET    | `/startup/:startupid/tasks/:id` | Retrieve specific task |
| PATCH  | `/startup/:startupid/tasks/:id` | Update task            |
| DELETE | `/startup/:startupid/tasks/:id` | Delete task            |

---

# Testing

The project uses Jest and Supertest for API integration testing.

Current test status:

```
Test Suites: 16 total
Tests:       133 total

Passed: 129
Failed: 4
```

The current test suite focuses mainly on integration testing of API behavior.

Future improvements:

- Increase test coverage
- Add more unit tests
- Add automated testing in CI/CD pipeline

---

# Installation

## Requirements

- Node.js v22+
- PostgreSQL 18+

## Clone Repository

```bash
git clone <repository-url>
```

## Install Dependencies

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```env
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret

DATABASE_USER=your_database_user
DATABASE_PASSWORD=your_database_password
DATABASE_NAME=startup_manager
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5433
```

## Run Application

```bash
npm run dev
```

---

# Future Improvements

Planned improvements:

- API rate limiting
- Advanced permission management system
- Task prioritization and sorting
- Meeting management
- Code review workflows
- More comprehensive automated testing

---

# Project Status

StartupManager API is currently under active development.

The project is being developed as a backend engineering portfolio project focused on building production-style APIs and improving backend engineering skills.
