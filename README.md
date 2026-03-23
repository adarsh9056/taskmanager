# TaskManager

TaskManager is a production-ready Task Manager web application built with React, Express, MongoDB, and JWT authentication. The repository is organized as a clean monorepo so you can develop locally, demo it to recruiters, and deploy the backend/frontend independently.

## Live Demo

- Frontend: [https://taskmanager-tau-brown.vercel.app](https://taskmanager-tau-brown.vercel.app)
- Backend API: [https://taskmanager-api-p6yy.onrender.com/api/health](https://taskmanager-api-p6yy.onrender.com/api/health)
- GitHub: [https://github.com/adarsh9056/taskmanager](https://github.com/adarsh9056/taskmanager)

## Project Snapshot

- Secure full-stack task manager with JWT access and refresh token authentication
- User-scoped task CRUD with filtering, search, sorting, and pagination
- React dashboard with protected routes, loading states, and toast notifications
- Deployed with Vercel, Render, and MongoDB Atlas

## Tech Stack

- Frontend: React + Vite + React Router + Axios
- Backend: Node.js + Express.js
- Database: MongoDB Atlas with Mongoose
- Authentication: JWT access + refresh tokens with rotation
- Security: bcrypt password hashing, Helmet, rate limiting, input validation, CORS allowlist
- Testing: Jest + Supertest + mongodb-memory-server
- Deployment: Render or Railway for API, Vercel for frontend

## Folder Structure

```text
.
├── backend
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   └── validate.js
│   ├── models
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── tests
│   │   ├── auth.test.js
│   │   ├── setup.js
│   │   └── task.test.js
│   ├── utils
│   │   ├── appError.js
│   │   ├── asyncHandler.js
│   │   └── tokens.js
│   └── validators
│       ├── authValidator.js
│       └── taskValidator.js
├── docs
│   └── postman
│       └── TaskManager.postman_collection.json
├── frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── src
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── api
│       │   └── axios.js
│       ├── components
│       │   ├── AuthLayout.jsx
│       │   ├── GuestRoute.jsx
│       │   ├── LoadingSpinner.jsx
│       │   ├── Navbar.jsx
│       │   ├── Pagination.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── StatsGrid.jsx
│       │   ├── TaskCard.jsx
│       │   ├── TaskFilters.jsx
│       │   ├── TaskFormModal.jsx
│       │   └── ToastViewport.jsx
│       ├── context
│       │   ├── AuthContext.jsx
│       │   └── ToastContext.jsx
│       ├── pages
│       │   ├── Dashboard.jsx
│       │   ├── Login.jsx
│       │   └── Register.jsx
│       └── utils
│           ├── http.js
│           ├── session.js
│           └── validation.js
└── README.md
```

## File Guide

### Backend

- `backend/app.js`: Express app setup with Helmet, CORS, rate limiting, JSON parsing, and route registration.
- `backend/server.js`: connects MongoDB and starts the API server with graceful shutdown handling.
- `backend/config/db.js`: central MongoDB connection helper.
- `backend/controllers/authController.js`: registration, login, refresh rotation, logout, and current-user endpoints.
- `backend/controllers/taskController.js`: task CRUD, pagination, searching, filtering, sorting, and dashboard stats.
- `backend/middleware/auth.js`: validates access tokens and attaches the authenticated user.
- `backend/middleware/validate.js`: converts `express-validator` errors into a clean API response.
- `backend/middleware/errorHandler.js`: normalizes runtime errors into consistent JSON.
- `backend/models/User.js`: user schema, bcrypt hashing hook, password comparison, refresh token storage.
- `backend/models/Task.js`: task schema with ownership, indexes, and overdue virtual.
- `backend/routes/*.js`: REST API route definitions wired to validation and controllers.
- `backend/validators/*.js`: request validation rules for auth and task endpoints.
- `backend/tests/*.test.js`: basic integration coverage for auth rotation and user-scoped task access.

### Frontend

- `frontend/src/api/axios.js`: Axios instance with access-token injection and refresh-token retry logic.
- `frontend/src/context/AuthContext.jsx`: global auth state, bootstrap session, login/register/logout helpers.
- `frontend/src/context/ToastContext.jsx`: lightweight toast notification system.
- `frontend/src/components/ProtectedRoute.jsx`: blocks unauthenticated access to the dashboard.
- `frontend/src/components/TaskFormModal.jsx`: create/edit modal with client-side validation.
- `frontend/src/pages/Login.jsx`: login page and validation flow.
- `frontend/src/pages/Register.jsx`: registration page and validation flow.
- `frontend/src/pages/Dashboard.jsx`: main authenticated UI with stats, filters, pagination, CRUD, and loading states.
- `frontend/src/index.css`: custom responsive styling for the full experience.

## Features Implemented

- User registration and login
- Access + refresh JWT tokens with refresh rotation
- Secure password hashing via `bcryptjs`
- Task CRUD with strict per-user ownership
- Search by title/description
- Filter by status and due date range
- Pagination and sorting
- Protected frontend routes
- Loading states and toast notifications
- Responsive UI
- Server-side validation and structured error handling
- Postman collection for API testing
- Basic automated tests

## Production URLs

| Surface | URL |
| --- | --- |
| Frontend | `https://taskmanager-tau-brown.vercel.app` |
| Backend | `https://taskmanager-api-p6yy.onrender.com` |
| Health Check | `https://taskmanager-api-p6yy.onrender.com/api/health` |
| Repository | `https://github.com/adarsh9056/taskmanager` |

## REST API

Base URL:

```text
http://localhost:5000/api/v1
```

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | No | Register a new user |
| `POST` | `/auth/login` | No | Login and receive token pair |
| `POST` | `/auth/refresh` | No | Rotate refresh token and issue a new access token |
| `POST` | `/auth/logout` | No | Invalidate a refresh token |
| `GET` | `/auth/me` | Yes | Fetch current authenticated user |
| `GET` | `/tasks` | Yes | List tasks with search/filter/pagination |
| `GET` | `/tasks/stats` | Yes | Fetch dashboard task counts |
| `GET` | `/tasks/:id` | Yes | Get a single owned task |
| `POST` | `/tasks` | Yes | Create a task |
| `PATCH` | `/tasks/:id` | Yes | Update an owned task |
| `DELETE` | `/tasks/:id` | Yes | Delete an owned task |

## Environment Variables

### Backend `.env`

Create `backend/.env` from the example:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
JWT_ACCESS_SECRET=replace-with-a-long-random-string
JWT_REFRESH_SECRET=replace-with-a-different-long-random-string
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Frontend `.env`

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## macOS Local Setup

### 1. Clone and move into the repo

```bash
git clone <your-github-repo-url> taskmanager
cd taskmanager
```

### 2. Configure the backend

```bash
cd backend
npm install
cp .env.example .env
open -a TextEdit .env
```

Paste your MongoDB Atlas URI and strong JWT secrets into `.env`, then start the API:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`.

### 3. Configure the frontend

Open a new terminal tab:

```bash
cd /path/to/taskmanager/frontend
npm install
cp .env.example .env
open -a TextEdit .env
```

Set:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start the frontend:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`.

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free cluster.
2. Create a database user in `Database Access`.
3. Add your IP in `Network Access`.
4. Click `Connect` > `Drivers` and copy the connection string.
5. Replace the URI in `backend/.env`.
6. For deployed apps, add `0.0.0.0/0` only if you understand the exposure and need broad access.

## Running Tests

Backend tests use Jest, Supertest, and an in-memory MongoDB instance:

```bash
cd backend
npm test
```

## Postman Testing

Import:

```text
docs/postman/TaskManager.postman_collection.json
```

Recommended collection variables:

- `baseUrl`: `http://localhost:5000/api/v1`
- `accessToken`: set after login/register
- `refreshToken`: set after login/register
- `taskId`: set after creating a task

## Deployment Guide

### Backend on Render

1. Push this repository to GitHub.
2. Sign in to [Render](https://render.com/).
3. Create a new `Web Service`.
4. Connect your GitHub repo.
5. Set the Root Directory to `backend`.
6. Build Command: `npm install`
7. Start Command: `npm start`
8. Add environment variables from `backend/.env.example`.
9. Set `CLIENT_URL` to your Vercel frontend domain.
10. Deploy and copy the generated backend URL, for example `https://taskmanager-api.onrender.com`.

### Backend on Railway

1. Sign in to [Railway](https://railway.app/).
2. Create a new project from GitHub repo.
3. Select this repository and set the service root to `backend`.
4. Add the same environment variables from `backend/.env.example`.
5. Railway will detect Node automatically.
6. Use `npm start` as the start command if Railway does not infer it.
7. Copy the deployed API URL after the service is live.

### Frontend on Vercel

1. Sign in to [Vercel](https://vercel.com/).
2. Import the same GitHub repository.
3. Set the Root Directory to `frontend`.
4. Framework Preset: `Vite`.
5. Add environment variable:

```env
VITE_API_URL=https://your-backend-domain/api/v1
```

6. Deploy the project.
7. Update the backend `CLIENT_URL` to the final Vercel URL if needed.
8. Redeploy the backend after updating CORS settings.

## Current Deployment Setup

- Frontend hosted on Vercel
- Backend hosted on Render
- Database hosted on MongoDB Atlas
- Render backend CORS origin set to `https://taskmanager-tau-brown.vercel.app`

## Production Notes

- Render free web services can spin down after inactivity, so the first request may take longer.
- Secrets should never be committed to Git. Use Render and Vercel environment variables only.
- If you rotate your MongoDB password or JWT secrets, update them in Render and redeploy the backend.

## How Frontend and Backend Connect

The frontend reads `VITE_API_URL` and points Axios to that API base URL. In production:

1. Deploy backend first.
2. Copy the public backend URL.
3. Set `VITE_API_URL=https://your-backend-domain/api/v1` in Vercel.
4. Set `CLIENT_URL=https://your-frontend-domain.vercel.app` in Render or Railway.
5. Redeploy both services if you change the environment variables.

## Recruiter-Ready Talking Points

- Secure token-based authentication with refresh token rotation
- Clean MVC Express architecture with per-user data isolation
- Scalable React dashboard with protected routing and async UX states
- Cloud-ready deployment flow using MongoDB Atlas, Render/Railway, and Vercel
- Automated API coverage for critical auth and authorization behavior
- Live portfolio deployment with a public GitHub repository and production frontend/backend URLs

## Suggested GitHub Workflow

```bash
git checkout -b codex/taskmanager-app
git add .
git commit -m "Build production-ready TaskManager full-stack app"
git push origin codex/taskmanager-app
```

## Next Improvements

- Move refresh tokens from local storage to secure HTTP-only cookies
- Add role-based access control for team workspaces
- Add drag-and-drop task boards
- Add CI with GitHub Actions
- Add frontend component tests with Vitest
