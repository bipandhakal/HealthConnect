# HealthConnect - Community Health Services Booking System

A full-stack web application for booking community health service appointments.

## Tech Stack

- **Frontend**: React.js (Vite)
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
healthconnect/
├── client/          React frontend (port 5173)
└── server/          Express backend (port 5001)
```

## Setup and Installation

### Requirements

- Node.js v18 or later
- MongoDB (local installation or MongoDB Atlas free account)

---

### Step 1 — Set up the Database

**Option A — MongoDB Atlas (recommended, free cloud database)**

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new free cluster
3. Click "Connect" and choose "Connect your application"
4. Copy the connection string (looks like `mongodb+srv://username:password@cluster.mongodb.net/`)

**Option B — Local MongoDB**

Install MongoDB locally and use: `mongodb://localhost:27017/healthconnect`

---

### Step 2 — Set up the Backend

```bash
cd server
npm install
```

Open `server/.env` and update the MONGO_URI with your connection string:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/healthconnect
JWT_SECRET=healthconnect_jwt_secret_key_2026
PORT=5001
```

Start the backend server:

```bash
npm run dev
```

The server will run on **http://localhost:5001**

---

### Step 3 — Set up the Frontend

Open a new terminal window:

```bash
cd client
npm install
npm run dev
```

Open your browser at **http://localhost:5173**

---

## Default Admin Account

An admin account is automatically created when the server starts for the first time.

| Field    | Value                        |
|----------|------------------------------|
| Email    | admin@gmail.com      |
| Password | Admin@123                    |
| Role     | admin                        |

Log in with these credentials to access the Admin Dashboard.

---

## Features

- User registration and login with JWT authentication
- Role-based access control (patient / admin)
- Strong password validation (uppercase, lowercase, number, special character)
- Book appointments with service, doctor, date, and time selection
- View and cancel appointments (patient)
- Admin dashboard with appointment statistics
- Admin can view full appointment details including patient notes
- Admin can confirm, cancel, or delete appointments
- Admin can book appointments on behalf of patients
- Filter appointments by status
- Responsive design for desktop and mobile

## API Endpoints

| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| POST | /api/auth/register | Register a new user | Public |
| POST | /api/auth/login | Login | Public |
| GET | /api/auth/users | Get all patients | Admin |
| GET | /api/appointments | Get appointments | Private |
| POST | /api/appointments | Create appointment | Private |
| PUT | /api/appointments/:id | Update appointment | Private |
| DELETE | /api/appointments/:id | Delete appointment | Private |
