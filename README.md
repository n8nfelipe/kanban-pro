# Kanban Pro — Intelligent Workflow OS

> A next-generation, full-stack Kanban board built for high-performance engineering teams. Real-time persistent state, premium glassmorphism UI, and a powerful task management engine backed by PostgreSQL.

![Kanban Pro Screenshot](./screenshot.png)

---

## ✨ Features

- **🎨 Premium UI** — Glassmorphism design with aurora animated background, neon accents, and micro-animations.
- **🗄️ Real Data Persistence** — Fully integrated with **PostgreSQL** via **Prisma ORM** for persistent storage.
- **🔄 Fluid Drag & Drop** — Instant card movement across columns with background sync to the database.
- **⚡ Real-time Ready** — WebSocket architecture enabled for live multi-user collaboration (Socket.io).
- **📊 Advanced Tasks** — Priority levels (Low to Urgent), Start/Due dates, and assignee management.
- **🏷️ Multi-Workspace** — Support for distinct organizational spaces (Engineering, Marketing, Design).
- **🌙 Deep Dark Theme** — Purpose-built dark mode optimized for focused deep work.

---

## 🖥️ Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| **Frontend** | Next.js 15 (App Router), TypeScript |
| **State**    | Zustand (Global State Management)   |
| **Backend**  | Node.js, Express, TypeScript        |
| **Database** | PostgreSQL + Prisma ORM             |
| **Realtime** | Socket.io                           |
| **Dev Tools**| Docker + Docker Compose             |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Docker (for the database)

### 1. Environment Setup

```bash
cp .env.example .env
# Ensure DATABASE_URL is correct in both root and backend/.env
```

### 2. Launching the Database

The easiest way to start the database is via Docker:

```bash
docker compose up -d postgres redis
```

### 3. Initialize the Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma db push   # Sync schema to the DB
node prisma/seed.js  # Populate initial mock data
npm run dev
```

### 4. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```
kanban-pro/
├── frontend/               # Next.js App
│   └── src/
│       ├── components/     # UI Components (Glassmorphism)
│       ├── store/          # Zustand Store (API Sync)
│       └── services/       # Axios API client
│
├── backend/                # Express API
│   └── src/
│       ├── routes/         # Auth, boards, cards
│       ├── middleware/      # JWT auth guard
│       └── prisma/         # DB schema & migrations
│
├── docker-compose.yml
└── screenshot.png
```

---

## 🎨 Design System

The UI uses a curated dark palette with neon accents:

| Token          | Value       | Usage                |
|----------------|-------------|----------------------|
| `--neon-blue`  | `#38bdf8`   | Primary / To Do      |
| `--neon-purple`| `#a78bfa`   | In Progress          |
| `--neon-green` | `#34d399`   | Done / Online status |
| `--neon-rose`  | `#f472b6`   | Urgent / Alerts      |
| `--neon-amber` | `#fbbf24`   | High priority        |
| `--bg-base`    | `#030508`   | Page background      |

Fonts: **Inter** (UI) · **Outfit** (headings) · **JetBrains Mono** (code/badges)

---

## 🐳 Docker Services

```yaml
services:
  postgres:   # PostgreSQL 15
  backend:    # Express API on :4000
  frontend:   # Next.js on :3000
```

---

## 📄 License

MIT — feel free to use, modify and distribute.
