# 🚀 Task Manager - Full Stack Application

A modern task management application built with **Next.js** (frontend) and **Node.js/Express** (backend).  
Users can register, log in, and manage their tasks with full CRUD operations, search, filter, and pagination.

---

## ✨ Features

- 🔐 **Authentication** – Register, login, and logout using JWT (access + refresh tokens)
- 📋 **Task Management** – Create, read, update, delete, and toggle task status
- 🔍 **Search & Filter** – Search tasks by title and filter by status (all / pending / done)
- 📄 **Pagination** – Load tasks in batches using "Load More"
- 🎨 **Responsive UI** – Works on mobile, tablet, and desktop
- 🔄 **Token Refresh** – Auto refresh expired access tokens
- 🗄️ **Database** – SQLite (development) / PostgreSQL (production) with Prisma

---

## 🛠️ Tech Stack

### Frontend
- Next.js (App Router) + TypeScript  
- React Hooks  
- CSS Modules  
- Custom Toast Notifications  

### Backend
- Node.js + Express + TypeScript  
- Prisma ORM  
- SQLite / PostgreSQL  
- JWT Authentication  
- bcrypt (password hashing)  
- zod (validation)  

---

## 📁 Project Structure

```
task-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── dev.db
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   └── tasks.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── utils/
│   │   │   └── validation.ts
│   │   └── types/
│   │       └── express.d.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── login/
    │   ├── register/
    │   └── dashboard/
    ├── components/
    ├── services/
    ├── styles/
    ├── next.config.js
    ├── package.json
    └── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Git

---

### 1️⃣ Clone Repository
```bash
git clone https://github.com/RohanKumar-3/Task-Web-Application.git
cd Task-Web-Application
```

---

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_access_secret_key"
JWT_REFRESH_SECRET="your_refresh_secret_key"
```

Run migration:
```bash
npx prisma migrate dev --name init
```

Start backend:
```bash
npm run dev
```

Backend runs on:  
👉 http://localhost:5000

---

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on:  
👉 http://localhost:3000

---

## 🔑 Environment Variables

### Backend

| Variable | Description |
|----------|------------|
| PORT | Backend port |
| DATABASE_URL | Database connection |
| JWT_SECRET | Access token secret |
| JWT_REFRESH_SECRET | Refresh token secret |

---

## 📚 API Documentation

### Auth Endpoints

| Method | Endpoint | Description |
|--------|---------|------------|
| POST | /auth/register | Register user |
| POST | /auth/login | Login |
| POST | /auth/refresh | Refresh token |
| POST | /auth/logout | Logout |

---

### Task Endpoints (Require Token)

| Method | Endpoint | Description |
|--------|---------|------------|
| GET | /tasks | Get all tasks |
| GET | /tasks/:id | Get single task |
| POST | /tasks | Create task |
| PATCH | /tasks/:id | Update task |
| DELETE | /tasks/:id | Delete task |
| PATCH | /tasks/:id/toggle | Toggle status |

---

## 🔐 Authentication

All protected routes require:

```
Authorization: Bearer <accessToken>
```

---

## 🌟 Future Improvements

- Add due dates & reminders  
- Drag-and-drop tasks  
- Dark mode  
- Notifications  

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first.

---

## 📄 License

This project is open-source and free to use.
