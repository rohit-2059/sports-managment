# Sports Management System

A full-stack web application for managing sports tournaments, teams, matches, and player statistics. The platform supports multiple user roles (Super Admin, Coach, Player), secure authentication, and modern UI/UX for both admin and team management workflows.

## Features
- User authentication (login/register for players, coaches, super admins)
- Team creation, player roster management (add/edit/remove, registered & unregistered players)
- Tournament and match scheduling
- Player statistics tracking
- Role-based dashboards (Super Admin, Coach, Player)
- Modern React frontend with animated UI and responsive design
- RESTful Express backend with MongoDB

## Directory Structure

```
├── backend/
│   ├── config/           # Database and app config
│   ├── controllers/      # Express route handlers
│   ├── middleware/       # Auth, logging, error handling
│   ├── models/           # Mongoose schemas (User, Team, Match, etc.)
│   ├── routes/           # API endpoints (auth, teams, matches, etc.)
│   ├── index.js          # Main Express app entry
│   ├── seedSuperAdmin.js # Script to seed a super admin user
│   └── ...
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # React components (Dashboards, Modals, etc.)
│   │   ├── assets/       # Images, icons
│   │   ├── App.jsx       # Main app component
│   │   └── ...
│   ├── index.html        # App entry point
│   ├── package.json      # Frontend dependencies
│   └── ...
├── MATCH_SCHEDULING_IMPLEMENTATION.md # Design notes
└── ...
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/rohit-2059/sports-managment.git
cd sports-managment
```

### 2. Backend Setup
```bash
cd backend
npm install
# Configure MongoDB URI in config/database.js or via environment variables
npm run dev   # or: node index.js
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
# App runs at http://localhost:5173 (default Vite port)
```

### 4. Seed a Super Admin (optional)
```bash
cd backend
node seedSuperAdmin.js
# Check the script for default credentials
```

### 5. Access the App
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Common Commands
- **Backend**
  - `npm run dev` — start Express server with nodemon
  
- **Frontend**
  - `npm run dev` — start Vite dev server

## Notes
- All protected API routes require a valid JWT in the `Authorization` header.
- For E2E testing, see TestSprite or Postman instructions in the project documentation.

---

For more details, see the code and markdown docs in the repo.
