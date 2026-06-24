# Task Manager App

A full-stack Task Manager application built using the MERN stack. The app allows users to register, log in, create tasks, update tasks, delete tasks, filter tasks, and manage their personal task list securely.

## Live Demo

Frontend Live Link:  
https://your-frontend-link.vercel.app

Backend API Link:  
https://your-backend-link.onrender.com/api

Replace the above links with your actual Vercel and Render deployment URLs.

---

## Tech Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token Authentication
- bcrypt.js
- dotenv
- CORS

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## Features

- User registration and login
- JWT-based authentication
- Protected routes
- Create new tasks
- View all user-specific tasks
- Edit existing tasks
- Delete tasks
- Mark tasks as completed
- Filter tasks by status and priority
- Search tasks by title
- Responsive user interface

---

## Project Structure

```bash
task-manager-app/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── .env
│
└── README.md
