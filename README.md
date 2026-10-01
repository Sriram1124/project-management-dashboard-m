# Project Management Dashboard - Local Setup Guide

Welcome to the project! This guide will walk you through setting up both the Node.js backend and the React/Vite frontend locally. This branch (`feature/forms-management`) contains the fully integrated Work Management and Form Management modules.

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
*   **Node.js** (v18 or higher recommended)
*   **Docker Desktop** (Required to run the PostgreSQL database locally)
*   **Git**

---

## 1. Clone & Switch Branch

First, clone the repository and switch to the correct branch containing the latest integration:

```bash
git clone https://github.com/Sriram1124/project-management-dashboard-m.git
cd project-management-dashboard-m
git checkout feature/forms-management
```

---

## 2. Backend Setup & Database

Open a new terminal window and navigate to the backend directory:

```bash
cd backend-node
```

### Install Dependencies
```bash
npm install
```

### Start the Database
Make sure Docker Desktop is running, then spin up the PostgreSQL container:
```bash
docker-compose up -d
```
*(Note: The database runs on port `5433` by default to avoid conflicts with other local Postgres instances).*

### Environment Variables
Check if you have a `.env` file in the `backend-node` folder. If not, create one with the following:
```env
PORT=3001
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/project_management?schema=public"
JWT_ACCESS_SECRET="your_access_secret_here"
JWT_REFRESH_SECRET="your_refresh_secret_here"
```

### Setup Database (Migrations & Prisma)
Run the following commands to apply the latest tables (including Forms and Work Management) and generate the Prisma client:
```bash
npx prisma migrate dev
npx prisma generate
```

*(Optional but recommended): If you need initial test data, run the seed script:*
```bash
npx prisma db seed
```

### Start the Backend Server
```bash
npm run dev
```
You should see `Server is running on port 3001`. Keep this terminal running!

---

## 3. Frontend Setup

Open a **second** terminal window and navigate to the frontend directory:

```bash
cd frontend
```

### Install Dependencies
```bash
npm install
```

### Environment Variables
Check your `frontend/.env` file. **Crucial Note:** Always use `127.0.0.1` instead of `localhost` to prevent Node.js IPv6 resolution errors (which cause silent API failures).

```env
VITE_API_URL=http://127.0.0.1:3001/api
```

### Start the Frontend Server
```bash
npm run dev
```
This will start the Vite development server (usually on `http://localhost:3000` or `http://localhost:5173`). 

---

## 4. You're Good to Go!

1. Open your browser and go to the frontend URL provided by Vite.
2. Log in using the seeded test accounts.
    *   **Manager:** `manager@dailoqa.com` / `password123`
    *   **Intern:** `intern@dailoqa.com` / `password123`
3. Check out the **Teams Channel** on the Manager dashboard to see the new Form Builder!
