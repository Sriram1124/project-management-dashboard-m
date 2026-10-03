# 🚀 MVP Setup & Run Guide (Mentor & Teammate Ready)

This guide provides step-by-step instructions for running the **Project Management & Work Management MVP** on either **Windows (PowerShell / Docker Desktop)** or **macOS (Terminal / Apple Silicon or Intel)**.

---

## ⚡ 1. 5-Minute Quick Start

If you already have **Docker Desktop** running and **Git** installed:

### Step 1: Clone & Enter Directory
```bash
git clone <repository-url>
cd project-management-dashboard-m
```

### Step 2: Switch to Stable MVP Branch
```bash
git checkout feature/work-management
```

### Step 3: Create Environment Configuration
- **macOS / Linux:**
  ```bash
  cp .env.example .env
  ```
- **Windows (PowerShell):**
  ```powershell
  Copy-Item .env.example .env
  ```

### Step 4: Start PostgreSQL & Backend Containers
```bash
docker compose up -d --build
```
> Wait ~10 seconds for the PostgreSQL database health check to turn green and for the Node backend to initialize.

### Step 5: Run Database Migrations & Seed Default Accounts
- **macOS / Linux / Windows:**
  ```bash
  docker compose exec backend npx prisma migrate deploy
  docker compose exec backend npm run seed
  ```

### Step 6: Start Frontend Development Server
- **Option A: In Docker (Platform-Independent, No Node.js required on host):**
  - **macOS / Linux:**
    ```bash
    docker run --rm -it -v "$(pwd)/frontend:/app" -w /app -p 3000:3000 node:20-bookworm-slim sh -c "npm install && npm run dev -- --host 0.0.0.0"
    ```
  - **Windows (PowerShell):**
    ```powershell
    docker run --rm -it -v "${PWD}/frontend:/app" -w /app -p 3000:3000 node:20-bookworm-slim sh -c "npm install && npm run dev -- --host 0.0.0.0"
    ```
- **Option B: Locally (If Node.js v18+ / v20+ is installed on host):**
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

### Step 7: Open the Application
Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)** (or `http://localhost:5173` depending on terminal output)

Log in with:
* **Manager:** `manager@dailoqa.com` / `password123`
* **Intern:** `intern@dailoqa.com` / `password123`

---

## 📋 2. Prerequisites & System Requirements

| Tool | Minimum Version | Windows Note | macOS Note |
|---|---|---|---|
| **Docker Desktop** | 4.25+ | Ensure WSL 2 backend is enabled | Native Apple Silicon / Intel support |
| **Git** | 2.30+ | Git for Windows (Git Bash / PowerShell) | Xcode Command Line Tools or brew git |
| **Browser** | Chrome, Edge, Safari, Firefox | Any modern Chromium or WebKit browser | Any modern Chromium or WebKit browser |
| **Node.js** *(Optional)* | Node 20 LTS (npm 10+) | Only required if running frontend outside Docker | Only required if running frontend outside Docker |

---

## ⚙️ 3. Environment Variables Reference

The system relies on a single root `.env` file that configures Docker Compose, PostgreSQL, and the Express backend:

| Variable | Default Value | Description |
|---|---|---|
| `POSTGRES_USER` | `pms_user` | PostgreSQL superuser username |
| `POSTGRES_PASSWORD` | `changeme` | PostgreSQL password |
| `POSTGRES_DB` | `pms_db` | Primary PostgreSQL database name |
| `DATABASE_URL` | `postgresql://pms_user:changeme@postgres:5432/pms_db` | Connection string used by Prisma inside Docker network |
| `PORT` | `3001` | Express REST API port |
| `JWT_ACCESS_SECRET` | `your_jwt_access_secret_here` | HMAC secret for signing 15-minute access JWTs |
| `JWT_REFRESH_SECRET` | `your_jwt_refresh_secret_here` | HMAC secret for signing 7-day refresh JWTs |
| `ACCESS_TOKEN_EXPIRY` | `15m` | Lifetime of access token before refresh rotation |
| `REFRESH_TOKEN_EXPIRY`| `7d` | Lifetime of refresh token session |
| `NODE_ENV` | `development` | Environment mode (`development` / `production`) |

*(Optional frontend variable: `VITE_API_URL` defaults to `http://localhost:3001/api`).*

---

## 🔄 4. Everyday Commands (Daily Workflow)

### Starting the Stack
- **macOS / Linux:**
  ```bash
  docker compose up -d
  ```
- **Windows (PowerShell):**
  ```powershell
  docker compose up -d
  ```

### Stopping the Stack
- **Graceful Stop (Preserves Database Data):**
  ```bash
  docker compose down
  ```
- **Full Clean (Deletes Containers, Networks & Volumes):**
  ```bash
  docker compose down -v
  ```

### Viewing Real-time Logs
- **All Services:**
  ```bash
  docker compose logs -f
  ```
- **Backend Only:**
  ```bash
  docker compose logs -f backend
  ```
- **Database Only:**
  ```bash
  docker compose logs -f postgres
  ```

### Restarting a Single Service
```bash
docker compose restart backend
```

---

## 🗄️ 5. Database Operations & Diagnostics

All database operations run through the `backend` or `postgres` containers:

### 1. Check Container & Service Health
```bash
docker compose ps
```
Both `pms_postgres` and `pms_backend` should report status `running` / `healthy`.

### 2. View Applied Prisma Migrations
```bash
docker compose exec backend npx prisma migrate status
```

### 3. Open Interactive PostgreSQL Shell (`psql`)
```bash
docker compose exec postgres psql -U pms_user -d pms_db
```
*Common commands inside psql:*
- `\dt` — List all tables
- `SELECT id, name, email FROM users;` — View users
- `SELECT id, title, type, status, project_id FROM work_items;` — View work items
- `\q` — Exit psql

### 4. Re-seed Database
If you need to reset the default users and permissions:
```bash
docker compose exec backend npm run seed
```

### 5. Launch Prisma Studio (Visual DB GUI)
```bash
docker compose exec -d backend npx prisma studio --port 5555 --hostname 0.0.0.0
```
Open **`http://localhost:5555`** in your browser.

---

## 🧪 6. 20-Point MVP Functional Verification Checklist

Run through this test sequence to verify both Project Management V1 and Work Management V1:

### Authentication & RBAC
- [ ] **1. Manager Login:** Navigate to `http://localhost:3000/login`. Log in with `manager@dailoqa.com` / `password123`. Redirects to `/manager`.
- [ ] **2. Intern Login:** Open an Incognito/Private window. Log in with `intern@dailoqa.com` / `password123`. Redirects to `/intern`.
- [ ] **3. Access Control:** As an Intern, attempting to browse to `/manager` is redirected to `/login` or blocked.
- [ ] **4. Logout Flow:** Clicking the profile/logout button clears the JWT tokens and redirects to `/login`.

### Project Management V1
- [ ] **5. Create Project:** As Manager, navigate to **Projects** → click "+ New Project". Enter Name and Description. Click Create. Project appears in the list.
- [ ] **6. Assign Member:** Open the project workspace → go to **Team / Members** → Add `Test Intern` (`intern@dailoqa.com`).
- [ ] **7. Intern Project Visibility:** In the Intern session, click **My Projects**. The newly assigned project is visible.
- [ ] **8. Upload Document:** In Manager project view, go to **Project Documents** → Upload a PDF or PNG. Verify document card appears.
- [ ] **9. Download Document:** Click Download on the uploaded document. The exact binary file is downloaded.
- [ ] **10. Delete Document:** Click Delete on the document card. Document is removed from database and disk.

### Work Management V1 (Project WorkItems)
- [ ] **11. Create Epic:** In Project Workspace → **Work Items / Board**, click "+ Add Work Item". Select type `EPIC`. Save. Epic appears on the board.
- [ ] **12. Create Story:** Click "+ Add Work Item". Select type `STORY`, set parent to the Epic created above. Save succeeds.
- [ ] **13. Hierarchy Validation (Negative Test):** Attempt to create a `SUBTASK` with no parent or with an Epic parent. System rejects it with validation error ("SUBTASK must have a parent of type TASK").
- [ ] **14. Create Task & Subtask:** Create a `TASK` under the Story. Then create a `SUBTASK` under the Task. Both render correctly in hierarchy.
- [ ] **15. Status Drag-and-Drop / Update:** Move a Task from `TODO` to `IN_PROGRESS` or `COMPLETED`. Status persists after page refresh.
- [ ] **16. Safe Deletion Rule:** Attempt to delete the parent Story while it still has children Tasks. System blocks deletion ("Cannot delete work item with child items. Please reassign or delete children first.").

### Work Management V1 (Personal Tasks & My Tasks)
- [ ] **17. Manager My Tasks:** In Manager portal, click **My Tasks** in the sidebar. Personal tasks and tasks assigned to the manager are displayed.
- [ ] **18. Intern My Tasks:** In Intern portal, click **My Tasks**. Personal tasks and tasks assigned to the intern are displayed.
- [ ] **19. Create Personal Task:** In My Tasks, click "+ Personal Task". Fill in Title, Description, Priority, Due Date. Task appears under Personal section.
- [ ] **20. Delete Personal Task:** Click delete on the personal task you created. Task is successfully removed and disappears from UI and database.

---

## 🛠️ 7. Troubleshooting & Common Pitfalls

### Issue 1: `bind: address already in use` (Port 5432 or Port 3001)
* **Cause:** A local PostgreSQL or Node process is already running on the host machine.
* **Resolution (macOS):**
  ```bash
  lsof -i :5432
  kill -9 <PID>
  lsof -i :3001
  kill -9 <PID>
  ```
* **Resolution (Windows PowerShell):**
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 5432).OwningProcess | Stop-Process -Force
  Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force
  ```
  *Alternatively, edit `.env` and change `PORT=3002` or expose postgres on `"5433:5432"` in `docker-compose.yml`.*

### Issue 2: Docker Desktop is paused or not running
* **Symptom:** `Error response from daemon: Docker Desktop is manually paused` or `connect ECONNREFUSED /var/run/docker.sock`.
* **Resolution:** Open Docker Desktop application, check the bottom-left whale icon. If paused, click the **Unpause / Resume** button.

### Issue 3: Windows PowerShell Execution Policy (`npm` or scripts blocked)
* **Symptom:** `File ... cannot be loaded because running scripts is disabled on this system.`
* **Resolution (run once in PowerShell as Administrator):**
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```

### Issue 4: Windows Line Endings (`CRLF` vs `LF`) in Shell Scripts
* **Symptom:** Container exits with `\r: command not found`.
* **Resolution:** Ensure Git preserves LF checkout:
  ```powershell
  git config --global core.autocrlf input
  ```

### Issue 5: Prisma Migration Error (`P1001: Can't reach database server`)
* **Resolution:** Wait 10 seconds for the database to complete initial startup. Verify health:
  ```bash
  docker compose ps
  ```
  If `pms_postgres` is restarting, view logs:
  ```bash
  docker compose logs postgres
  ```

### Issue 6: Frontend can't connect to backend (`Failed to fetch`)
* **Resolution:**
  1. Verify backend container is running: `docker compose ps`
  2. Verify backend endpoint responds: Open `http://localhost:3001/api/projects` in your browser. (It should return `{"error":"Unauthorized"}` or a 401 JSON, confirming Express is active).
  3. Clear browser cache or test in Incognito mode to clear expired access tokens.
