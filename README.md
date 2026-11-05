# TEDxCIT 2027 Web Application

Full-stack application for **TEDxCIT 2027** featuring a modern React frontend and a Node.js + Express backend.

---

## 📁 Project Architecture & Folder Structure

```text
TEDxCIT2027/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                              # Database connection / config
│   │   ├── controllers/
│   │   │   ├── speakerRegistrationController.js   # Handles speaker nominations
│   │   │   ├── studentSpeakerRegistrationController.js # Handles student applications
│   │   │   └── delegateRegistrationController.js  # Handles delegate registrations
│   │   ├── middleware/
│   │   │   └── errorHandler.js                    # 404 and global error handlers
│   │   ├── models/
│   │   │   └── store.js                           # In-memory store / Schema definition
│   │   ├── routes/
│   │   │   ├── speakerRoutes.js                   # /api/speakers routes
│   │   │   ├── studentSpeakerRoutes.js            # /api/student-speakers routes
│   │   │   ├── delegateRoutes.js                  # /api/delegates routes
│   │   │   └── index.js                           # API route aggregator
│   │   └── server.js                              # Express app entry point
│   ├── .env.example                               # Environment template
│   ├── .env                                       # Local environment variables
│   └── package.json                               # Backend dependencies & scripts
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/                                # Static images & icons
│   │   ├── components/
│   │   │   ├── Navbar.jsx                         # Main Navigation (Home, Speakers, Organizers ONLY)
│   │   │   └── Footer.jsx                         # Footer with official TEDx disclaimer
│   │   ├── pages/
│   │   │   ├── Home.jsx                           # Landing page
│   │   │   ├── Speakers.jsx                       # Speakers catalog with category filtering
│   │   │   ├── Organizers.jsx                     # Organizing committee & crew
│   │   │   ├── SpeakerRegistration.jsx            # Unlisted Speaker Registration
│   │   │   ├── StudentSpeakerReg.jsx              # Unlisted Student Speaker Registration
│   │   │   ├── DelegateRegistration.jsx           # Unlisted Delegate Registration
│   │   │   └── NotFound.jsx                       # 404 error page
│   │   ├── services/
│   │   │   └── api.js                             # API service layer connecting to Express
│   │   ├── App.jsx                                # Router configuration & page layout
│   │   ├── index.css                              # TEDx dark-mode design system
│   │   └── main.jsx                               # React root renderer
│   ├── index.html                                 # HTML template
│   ├── vite.config.js                             # Vite bundler configuration
│   └── package.json                               # Frontend dependencies & scripts
│
├── .gitignore
├── package.json                                   # Monorepo / workspace helper scripts
└── README.md
```

---

## 🧭 Page Routes & Navigation Rules

### In Public Navbar:
- **Home**: `/`
- **Speakers**: `/speakers`
- **Organizers**: `/organizers`

### Hidden from Navbar (Direct Access Only):
- **Speaker Registration**: `/register/speaker` (or `/speaker-registration`)
- **Student Speaker Registration**: `/register/student-speaker` (or `/student-speaker-reg`)
- **Delegate Registration**: `/register/delegate` (or `/delegate-registration`)

---

## 🚀 Getting Started

### 1. Run the Backend (Express API)
```bash
cd backend
npm install
npm run dev
```
*API will run at:* `http://localhost:5000`

### 2. Run the Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Frontend will run at:* `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend status check |
| `POST` | `/api/speakers/register` | Submit speaker nomination |
| `GET` | `/api/speakers` | Get all speaker submissions |
| `POST` | `/api/student-speakers/register` | Submit student speaker application |
| `GET` | `/api/student-speakers` | Get all student speaker submissions |
| `POST` | `/api/delegates/register` | Submit delegate pass registration |
| `GET` | `/api/delegates` | Get all delegate registrations |

