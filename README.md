# Enterprise Task & Project Management Portal

A full-stack web application for teams to manage projects, tasks, progress, and real-time collaboration—featuring admin and employee roles, built with **Next.js, shadcn/ui, Tailwind CSS, Redux Toolkit, Node.js, Express, and MongoDB**.

---

## Features

- **User Authentication:** Register/login (JWT). Role-based: Admin and Employee.
- **Admin Capabilities:**
  - Manage (create/view/update/delete) projects.
  - Add/remove employees from projects.
  - View and manage all users and tasks.
  - Dashboard analytics (charts for tasks/projects).
- **Employee Capabilities:**
  - View projects assigned by admin.
  - Create/view/update/delete their own tasks per project.
  - Visual progress for tasks (status, prioritization, deadlines).
- **Communication:**
  - Real-time project chat (Socket.io).
  - Message history with sender and timestamp.
- **UI/UX:**
  - Responsive, modern interface with shadcn/ui + Tailwind CSS.
  - State management with Redux Toolkit.
  - Charts/graphs with Recharts.
- **Backend:**
  - Secure REST API with Express.
  - MongoDB with Mongoose (relations: User ↔ Project ↔ Task).
  - JWT auth, file upload support, email (optional).

---

## Tech Stack

| Layer      | Technology                   |
|------------|-----------------------------|
| Frontend   | Next.js (App Router), shadcn/ui, Tailwind CSS, Redux Toolkit |
| Backend    | Node.js, Express.js         |
| Database   | MongoDB + Mongoose          |
| Auth       | JWT, role-based             |
| Real-time  | Socket.io                   |

---

## Setup & Installation

### 1. **Clone the repository**

```bash
git clone <repo-url>
cd <repo-folder>
```

### 2. **Backend Setup**

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and secrets

npm install
npm run dev
```

Key .env variables:
```
PORT=5000
MONGODB_URL=mongodb://localhost:27017/your-db
ACCESSTOKENSECRET=YourAccessSecret
REFRESHTOKENSECRET=YourRefreshSecret
```

Start at: [http://localhost:5000](http://localhost:5000)

### 3. **Frontend Setup**

```bash
cd ../client
cp .env.example .env.local
# Edit .env.local if needed

npm install
npm run dev
```

Key .env.local variables:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

Start at: [http://localhost:3000](http://localhost:3000)

---

## Folder Structure

```
client/
  app/
    (auth)/login/page.tsx
    (auth)/register/page.tsx
    (dashboard)/admin/...
    (dashboard)/employee/...
    layout.tsx
  components/
  lib/
  public/

server/
  controllers/
  models/
  routes/
  middleware/
  utils/
  server.js
  .env
```

---

## Usage

- **Sign up as Admin/Employee**
- **Admin Dashboard:**
  - Create/manage projects and users
  - Assign employees to projects
  - View overall analytics and project chat
- **Employee Dashboard:**
  - View assigned projects and tasks
  - Create/update own tasks
  - Chat in project channels

---

## Development Scripts

```bash
# Client
cd client
npm run dev         # Start Next.js app

# Server
cd server
npm run dev         # Start Node API server
```

---

## Important Endpoints (Backend)

| Method | Endpoint                | Role      | Description                       |
|--------|-------------------------|-----------|-----------------------------------|
| POST   | /api/v1/auth/register   | Any       | Register a new user               |
| POST   | /api/v1/auth/login      | Any       | Login (get JWT)                   |
| GET    | /api/v1/user            | Admin     | List all users                    |
| POST   | /api/v1/project         | Admin     | Create project                    |
| GET    | /api/v1/project         | Admin     | List all projects                 |
| GET    | /api/v1/project/user    | Employee  | List assigned projects            |
| POST   | /api/v1/task            | Employee  | Create task                       |
| PATCH  | /api/v1/task/:id        | Employee  | Update task                       |
| DELETE | /api/v1/task/:id        | Employee  | Delete task                       |
| GET    | /api/v1/message/:projectId | Any    | Project chat messages             |

---

## Screenshots

> _(Add screenshots of dashboard, tasks, chat here if available)_

---

## Credits

- [shadcn/ui](https://ui.shadcn.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Socket.io](https://socket.io/)

---

## License

MIT
'''

with open('README.md', 'w', encoding='utf-8') as f:
    f.write(readme_content)
'README.md created successfully.'
