<div align="center">

# 🖥️ Tutor Booking Platform — Server

### *Powerful. Secure. Scalable.*

The backend REST API server for the **Tutor Booking Platform** — handling authentication, data management, bookings, and business logic with a production-ready architecture.

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Better Auth](https://img.shields.io/badge/Better--Auth-Enabled-6366f1?style=for-the-badge)](https://better-auth.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Secure session-based auth powered by Better Auth |
| 🗄️ **Database ORM** | Prisma ORM for type-safe, efficient database queries |
| 📧 **Email Verification** | Automated email verification on user registration |
| 🌐 **CORS Configured** | Separate origins for local dev and production |
| 🔒 **Environment Security** | Secrets managed via `.env`, never exposed |
| ⚡ **RESTful API** | Clean versioned API structure at `/api/v1` |

---

## 🛠️ Tech Stack

```
🧩 Runtime        →  Node.js (v20+)
🚀 Framework      →  Express.js
🗄️  ORM            →  Prisma
🔐 Auth           →  Better Auth
📧 Email          →  Nodemailer (Gmail App Password)
🌐 CORS           →  cors package
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the server directory and configure the following:

```env
# ─── Database ────────────────────────────────────────
DATABASE_URL='your_database_connection_string_here'

# ─── Server ──────────────────────────────────────────
PORT=5000

# ─── Authentication (Better Auth) ────────────────────
BETTER_AUTH_SECRET=your_strong_secret_key_here
BETTER_AUTH_URL=http://localhost:5000

# ─── CORS — Allowed Client Origins ───────────────────
APP_URL=http://localhost:3000
PROD_APP_URL=https://your-production-client.vercel.app

# ─── Email Verification (Gmail) ──────────────────────
APP_USER=your_gmail_address@gmail.com
APP_PASS=your_gmail_app_password_here
```

> ⚠️ **Never commit your `.env` file.** Make sure `.env` is listed in your `.gitignore`.

> 💡 **Gmail App Password:** Go to your Google Account → Security → 2-Step Verification → App Passwords to generate one.

> 💡 **Better Auth Secret:** Generate a strong secret using `openssl rand -base64 32` in your terminal.

---

## 🚀 Getting Started

**1. Clone the repository**
```bash
git clone https://github.com/Afnansayed/tutor-management.git
```

**2. Navigate into the project**
```bash
cd tutor-management
```

**3. Install dependencies**
```bash
npm install
```

**4. Set up environment variables**
```bash
cp .env.example .env
# Then fill in your actual values in .env
```

**5. Run Prisma migrations**
```bash
npx prisma migrate dev
# or push schema directly
npx prisma db push
```

**6. Start the development server**
```bash
npm run dev
```

🌐 The server will be running at [http://localhost:5000](http://localhost:5000)

---

## 📂 Project Structure

```
tutor-booking-server/
│
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 modules/       # Feature modules (user, tutor, booking, etc.)
│   │   ├── 📁 middlewares/   # Auth guards, error handlers, validators
│   │   └── 📁 routes/        # Centralized API route definitions
│   │
│   ├── 📁 lib/               # Auth config, Prisma client, helpers
│   └── app.ts                # Express app setup & CORS configuration
│
├── 📁 prisma/
│   └── schema.prisma         # Database schema definition
│
├── .env                      # Environment variables (not committed)
├── .env.example              # Template for environment variables
└── package.json
```

---

## 🌐 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/tutors` | Get all tutors |
| `GET` | `/api/v1/categories` | Get all subject categories |
| `GET` | `/api/v1/bookings` | Get all bookings |
| `POST` | `/api/v1/bookings` | Create a new booking |
| `GET` | `/api/v1/analytics` | Get dashboard analytics |
| `POST` | `/auth/sign-up` | Register a new user |
| `POST` | `/auth/sign-in` | Login user |

> 📘 Full API documentation coming soon.

---

## 🗄️ Database Setup

This project uses **Prisma ORM**. After setting your `DATABASE_URL` in `.env`:

```bash
# Generate Prisma client
npx prisma generate

# Apply migrations to the database
npx prisma migrate dev --name init

# Open Prisma Studio (visual DB browser)
npx prisma studio
```

---

## 🚢 Deployment

Recommended platforms for deploying the server:

- **[Railway](https://railway.app)** — One-click Node.js + PostgreSQL deployment
- **[Render](https://render.com)** — Free tier available for Express apps
- **[Vercel](https://vercel.com)** — Serverless deployment option

Make sure to add all your environment variables in the platform's dashboard before deploying.

---

## 🔗 Related

- 🖥️ **Frontend Repository** → [tutor-booking-frontend](https://github.com/Afnansayed/tutorflow-client.git)
- 🌐 **Live Client App** → [tutor-management-live](https://tutor-management-client-two.vercel.app)

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. **Fork** this repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a **Pull Request**

---



<div align="center">

⭐ If this project helped you, please give it a star!

</div>
