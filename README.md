# Intern Hub Workspace (Dailoqa)

## Backend Setup (Node.js)

1. Navigate to the backend directory:
   ```bash
   cd backend-node
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup PostgreSQL:
   Ensure your local PostgreSQL server is running and you have a database named `project_management`.
4. Environment Variables:
   Copy `.env.example` to `.env` and update the `DATABASE_URL` with your postgres credentials.
5. Run Prisma migrations and seed the database:
   ```bash
   npx prisma migrate dev
   npm run prisma db seed
   ```
   *(Note: The seed script will populate development users, roles, and permissions).*
6. Start the server:
   ```bash
   npx tsx src/server.ts
   ```

## Frontend Setup (Unified Manager/Intern Portal)

1. Navigate to the unified manager application:
   ```bash
   cd manager
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```

## Authentication & Users
The frontend defaults to the new `/login` component when unauthenticated.
Role-based routing automatically occurs after login.

**Development Credentials:**
- Manager: `manager@dailoqa.com` / `password123`
- Intern: `intern@dailoqa.com` / `password123`

## Endpoints
- `POST /api/auth/login` (Expects email/password, returns tokens + user)
- `POST /api/auth/refresh` (Uses cookies to rotate refresh tokens)
- `POST /api/auth/logout` (Revokes session)
- `GET /api/auth/me` (Returns hydrated user role/permissions)

## Permissions Configuration
The RBAC configuration establishes strict mapping:
- `MANAGER` Role includes: `PROJECT_CREATE`, `TASK_ASSIGN`, `EVALUATION_UPDATE`, etc.
- `INTERN` Role includes: `PROJECT_READ`, `TASK_UPDATE`, `FORM_SUBMIT`.
