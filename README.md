# 🚗 Car Platform — MERN Stack (Express API + Next.js Web)

A full-stack car marketplace platform with authentication, role-based access, car listings, bookings, and dashboards.

Built with clean architecture principles and production-oriented structure.

---

## 🏗 Tech Stack

### Backend (API)
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Role-based authorization
- Middleware validation & error handling

### Frontend (Web)
- Next.js (App Router)
- TypeScript
- API integration layer
- Protected routes & role handling

---

## 📁 Monorepo Structure

car-platform/
│
├── server/              # Express API (Backend)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── config/
│
├── car-platform-web/    # Next.js Frontend
│   ├── src/app/
│   ├── src/components/
│   ├── src/lib/
│   └── src/styles/
│
└── .github/             # CI / templates (if configured)

---

## ✨ Features

- 🔐 Authentication (Register / Login)
- 🛡 Role-based access (Admin / Dealer / Buyer)
- 🚘 Car listings (public & dealer-managed)
- 📅 Booking system
- 🛠 Services management
- 📦 Upload handling
- ⚙ Structured middleware architecture
- 🧠 Clean controller/service separation

---

## 🚀 Getting Started (Local Development)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Basheerkattan-bsal/car-platform.git
cd car-platform

💻BACKEND SETUP

cd server
npm install
cp .env.example .env
npm run dev

📡 The API will run on

http://localhost:5050

🖥️ THE  FRONTEND SETUP

cd ../car-platform-web
npm install
cp .env.example .env.local
npm run dev

📡 The web app will run on 

http://localhost:3000

🔐 Environment Variables

server/.env

Create it from:

cp server/.env.example server/.env

Required variables:
	•	NODE_ENV — development or production
	•	PORT — API port (default: 5050)
	•	MONGO_URI — MongoDB connection string
	•	JWT_SECRET — Secret used to sign JWT tokens
	•	JWT_EXPIRES_IN — Token expiration (e.g. 7d)

car-platform-web/.env.local

Create it from:
cp car-platform-web/.env.example car-platform-web/.env.local

Example variable:

NEXT_PUBLIC_API_URL=http://localhost:5050/api



 Architecture Principles
	•	Modular controller-based backend structure
	•	Middleware-driven validation & security
	•	Separation of concerns (routes → controllers → utils)
	•	Token-based authentication (stateless)
	•	Role-based authorization
	•	Frontend API abstraction layer


Git Workflow
	•	main branch is always stable
	•	Features are developed in separate branches
Example:
git checkout -b feat/add-booking-validation
git commit -m "feat: add booking validation middleware"
git push -u origin feat/add-booking-validation
