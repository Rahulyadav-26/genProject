<div align="center">

# Interview Master

A full-stack web application for AI-powered interview preparation, built with React and Express.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](https://opensource.org/licenses/ISC)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Authentication Flow](#authentication-flow)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Interview Master** is a full-stack interview preparation platform that leverages AI to help users practice and improve their interview skills. The application provides a secure authentication system with JWT-based session management and a modern React frontend powered by Vite.

---

## Features

- **User Authentication** — Secure registration, login, and logout with hashed passwords (bcrypt) and HTTP-only cookie-based JWT sessions.
- **Protected Routes** — Client-side route guards ensuring only authenticated users can access core application features.
- **Token Blacklisting** — Server-side token invalidation on logout to prevent session reuse.
- **Interview Reports** — Data model for persisting job descriptions and resumes for AI-driven interview analysis.
- **Session Persistence** — Automatic session restoration on page reload via the `/get-me` endpoint.
- **Feature-Based Architecture** — Modular frontend organized by domain features for scalability and maintainability.

---

## Tech Stack

### Frontend

| Technology     | Purpose                    |
| -------------- | -------------------------- |
| React 19       | UI component library       |
| React Router 7 | Client-side routing        |
| Vite 8         | Build tool & dev server    |
| Axios          | HTTP client                |
| Sass           | Stylesheet preprocessing   |
| ESLint         | Code quality & linting     |

### Backend

| Technology   | Purpose                           |
| ------------ | --------------------------------- |
| Express 5    | HTTP server framework             |
| Mongoose 9   | MongoDB ODM                       |
| bcryptjs     | Password hashing                  |
| jsonwebtoken | JWT generation & verification     |
| cookie-parser| Cookie parsing middleware          |
| cors         | Cross-origin resource sharing     |
| dotenv       | Environment variable management   |

### Infrastructure

| Service       | Purpose          |
| ------------- | ---------------- |
| MongoDB Atlas | Cloud database   |
| Node.js 18+  | Runtime          |

---

## Architecture

```
┌─────────────────────┐         ┌──────────────────────────┐
│                     │  HTTP   │                          │
│   React Frontend    │◄───────►│   Express API Server     │
│   (Vite · :5173)    │  JSON   │   (:3000)                │
│                     │         │                          │
│  ┌───────────────┐  │         │  ┌────────────────────┐  │
│  │ Auth Context   │  │         │  │ Auth Controller    │  │
│  │ useAuth Hook   │  │         │  │ Auth Middleware     │  │
│  │ Protected HoC  │  │         │  │ Auth Routes        │  │
│  └───────────────┘  │         │  └────────────────────┘  │
│                     │         │            │             │
│  ┌───────────────┐  │         │  ┌─────────▼──────────┐  │
│  │ Auth Pages     │  │         │  │  Mongoose Models   │  │
│  │ (Login/Reg)    │  │         │  │  (User, Blacklist, │  │
│  └───────────────┘  │         │  │   InterviewReport)  │  │
│                     │         │  └─────────┬──────────┘  │
└─────────────────────┘         │            │             │
                                └────────────┼─────────────┘
                                             │
                                   ┌─────────▼──────────┐
                                   │   MongoDB Atlas     │
                                   │   (Cloud DB)        │
                                   └────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x — [Download](https://nodejs.org/)
- **npm** ≥ 9.x (ships with Node.js)
- **MongoDB** — A running MongoDB instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/genproject.git
cd genproject

# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

### Environment Variables

Create a `.env` file in the `Backend/` directory with the following variables:

```env
# Server
PORT=3000

# Database
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# Authentication
JWT_SECRET=<your-256-bit-secret>
```

> [!CAUTION]
> **Never commit `.env` files to version control.** The `.gitignore` is pre-configured to exclude them. Generate a strong `JWT_SECRET` using:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### Running Locally

Open two terminal sessions:

**Terminal 1 — Backend:**

```bash
cd Backend
npm run dev
```

The API server will start on `http://localhost:3000`.

**Terminal 2 — Frontend:**

```bash
cd Frontend
npm run dev
```

The dev server will start on `http://localhost:5173`.

---

## Project Structure

```
genproject/
├── Backend/
│   ├── server.js                          # Entry point — bootstraps DB & HTTP server
│   ├── package.json
│   └── src/
│       ├── app.js                         # Express app configuration & middleware
│       ├── config/
│       │   └── db.js                      # MongoDB connection handler
│       ├── controllers/
│       │   └── auth.controller.js         # Auth business logic (register/login/logout/me)
│       ├── middlewares/
│       │   └── auth.middleware.js          # JWT verification & token blacklist check
│       ├── models/
│       │   ├── user.model.js              # User schema (username, email, password)
│       │   ├── blacklist.model.js          # Blacklisted JWT tokens
│       │   └── interviewReport.model.js   # Interview report schema
│       └── routes/
│           └── auth.routes.js             # Auth endpoint definitions
│
├── Frontend/
│   ├── index.html                         # HTML entry point
│   ├── vite.config.js                     # Vite build configuration
│   ├── eslint.config.js                   # ESLint configuration
│   ├── package.json
│   └── src/
│       ├── main.jsx                       # React DOM render entry
│       ├── App.jsx                        # Root component with providers
│       ├── app.routes.jsx                 # Route definitions
│       ├── style.scss                     # Global styles
│       ├── styles/                        # Additional stylesheets
│       └── features/
│           ├── auth/
│           │   ├── auth.context.jsx       # React context for auth state
│           │   ├── auth.form.scss         # Auth form styles
│           │   ├── components/
│           │   │   └── Protected.jsx      # Route guard HOC
│           │   ├── hooks/
│           │   │   └── useAuth.js         # Auth operations hook
│           │   ├── pages/
│           │   │   ├── Login.jsx          # Login page
│           │   │   └── Register.jsx       # Registration page
│           │   └── services/
│           │       └── auth.api.js        # Axios API client for auth
│           └── ai/                        # AI interview features (planned)
│
└── .gitignore
```

---

## API Reference

All endpoints are prefixed with `/api`.

### Authentication

| Method | Endpoint            | Auth Required | Description                          |
| ------ | ------------------- | :-----------: | ------------------------------------ |
| POST   | `/api/auth/register`| No            | Register a new user account          |
| POST   | `/api/auth/login`   | No            | Authenticate and receive a JWT token |
| GET    | `/api/auth/logout`  | No            | Invalidate the current session token |
| GET    | `/api/auth/get-me`  | Yes           | Retrieve the authenticated user      |

### `POST /api/auth/register`

**Request Body:**

```json
{
  "username": "string (required, unique)",
  "email": "string (required, unique)",
  "password": "string (required)"
}
```

**Success Response:** `201 Created`

```json
{
  "message": "User created successfully",
  "user": {
    "id": "ObjectId",
    "username": "string",
    "email": "string"
  }
}
```

### `POST /api/auth/login`

**Request Body:**

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response:** `200 OK`

```json
{
  "message": "User logged in successfully",
  "user": {
    "id": "ObjectId",
    "username": "string",
    "email": "string"
  }
}
```

### `GET /api/auth/get-me`

**Headers:** Requires `token` cookie (set automatically on login/register).

**Success Response:** `200 OK`

```json
{
  "message": "User found successfully",
  "user": {
    "id": "ObjectId",
    "username": "string",
    "email": "string"
  }
}
```

### Error Responses

| Status Code | Description                    |
| :---------: | ------------------------------ |
| `400`       | Validation error / Bad request |
| `401`       | Unauthorized / Invalid token   |

---

## Authentication Flow

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│  Client  │                    │  Server  │                    │    DB    │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │  POST /api/auth/register      │                               │
     │  {username, email, password}  │                               │
     │──────────────────────────────►│                               │
     │                               │  Check duplicate user         │
     │                               │──────────────────────────────►│
     │                               │◄──────────────────────────────│
     │                               │  Hash password (bcrypt)       │
     │                               │  Create user record           │
     │                               │──────────────────────────────►│
     │                               │◄──────────────────────────────│
     │                               │  Sign JWT (24h expiry)        │
     │  Set-Cookie: token=<jwt>      │                               │
     │◄──────────────────────────────│                               │
     │                               │                               │
     │  GET /api/auth/get-me         │                               │
     │  Cookie: token=<jwt>          │                               │
     │──────────────────────────────►│                               │
     │                               │  Verify JWT                   │
     │                               │  Check token blacklist        │
     │                               │──────────────────────────────►│
     │                               │◄──────────────────────────────│
     │  200 { user }                 │                               │
     │◄──────────────────────────────│                               │
     │                               │                               │
     │  GET /api/auth/logout         │                               │
     │  Cookie: token=<jwt>          │                               │
     │──────────────────────────────►│                               │
     │                               │  Blacklist token              │
     │                               │──────────────────────────────►│
     │                               │  Clear cookie                 │
     │  Set-Cookie: token= (cleared) │                               │
     │◄──────────────────────────────│                               │
     ▼                               ▼                               ▼
```

---

## Contributing

Contributions are welcome. Please follow these guidelines:

1. **Fork** the repository and create a feature branch from `main`.
2. **Follow** the existing code style and project structure conventions.
3. **Write** clear, descriptive commit messages following [Conventional Commits](https://www.conventionalcommits.org/).
4. **Test** your changes thoroughly before submitting a pull request.
5. **Open** a pull request with a clear description of the changes and their motivation.

### Development Guidelines

- Backend follows the **MVC pattern** with controllers, models, and routes separated by concern.
- Frontend uses a **feature-based architecture** — group related components, hooks, services, and pages by domain.
- All API calls should go through service files in `features/<feature>/services/`.
- Shared state is managed via React Context with custom hooks.

---

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

---

<div align="center">

**Built with ❤️ for interview preparation**


</div>
