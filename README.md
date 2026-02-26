# Knowledge Sharing Platform — Backend

A RESTful API backend for a knowledge-sharing platform built with **Node.js**, **Express**, and **MySQL** via **Sequelize ORM**. It handles user authentication (JWT), article CRUD, and AI-assisted content enhancement.

---

## 1️⃣ Approach

### Architecture Overview

The backend follows an **MVC (Model-View-Controller)** pattern with a clean separation of concerns:

```
Client Request
    └── Express Router (routes/)
            └── Middleware (auth)
                    └── Controller (controllers/)
                            └── Model (models/ via Sequelize)
                                    └── MySQL Database
```

- **Routes** — define endpoints and apply middleware (auth guard)
- **Controllers** — contain all business logic per resource
- **Models** — Sequelize model definitions with associations
- **Middleware** — JWT authentication guard
- **Services** — AI utility functions (pluggable; mocked for now)
- **Config** — Sequelize database connection

### Folder Structure

```
knowledge-sharing-backend/
├── config/
│   └── db.js                 # Sequelize connection setup
├── controllers/
│   ├── authController.js     # signup, login logic
│   └── articleController.js  # CRUD + myArticles
├── middleware/
│   └── auth.js               # JWT verification middleware
├── models/
│   ├── User.js               # User model (username, email, password)
│   └── Article.js            # Article model + belongsTo User
├── routes/
│   ├── authRoutes.js         # POST /api/auth/signup|login
│   ├── articleRoutes.js      # CRUD /api/articles
│   └── aiRoutes.js           # POST /api/ai/improve|summary
├── services/
│   └── aiService.js          # improveContent, generateSummary (mocked)
├── server.js                 # App entry point
├── .env                      # Environment variables (not committed)
└── package.json
```

### Key Design Decisions

- **JWT Authentication** — stateless, token-based auth with 7-day expiry stored client-side in `localStorage`
- **Sequelize `alter: true`** — tables auto-update to match model schema on each startup without data loss
- **Route ordering** — static routes (e.g., `/my`) are declared **before** dynamic routes (`/:id`) to prevent Express from treating path segments as IDs
- **bcryptjs** — passwords are hashed with a salt factor of 10 before storage
- **AI Services are mocked** — `improveContent` and `generateSummary` are pure functions, ready to be replaced with any LLM API (OpenAI, Gemini, etc.) without changing route or controller code
- **CORS configured** — `CLIENT_URL` env variable controls allowed origin for production safety

---

## 2️⃣ AI Usage

### Tools Used
- **Antigravity (Google DeepMind AI Coding Assistant)** — primary tool for code generation, debugging, and refactoring throughout development

### Where AI Helped

| Area | What AI Did |
|------|-------------|
| **Code generation** | Generated initial Express server boilerplate, Sequelize model definitions, JWT auth controller, and CRUD article controller |
| **API design** | Suggested RESTful route structure and middleware pattern for auth guards |
| **Refactoring** | Identified and fixed route ordering bug (`/my` before `/:id`), missing routes (`/api/ai/*`), and added proper error handlers |
| **SQL / ORM** | Generated Sequelize `findAll` queries with `where` clauses, `Op.like` for search/filter, and `include` for eager-loading author data |
| **Debugging** | Diagnosed 10 bugs across frontend-backend including field name mismatches, missing routes, and React compatibility issues |

### What Was Reviewed / Corrected Manually

- Verified JWT secret and expiry configuration in `.env`
- Confirmed authorization logic — only article authors can update/delete their own articles
- Reviewed `alter: true` implications (safe for dev, should use migrations in production)
- Validated Sequelize association (`User.hasMany` / `Article.belongsTo`) was correctly loaded on startup

> **Example:** "Used AI to generate Express route handlers and Sequelize queries, then manually reviewed authorization checks, error handling, and route ordering to ensure correctness."

---

## 3️⃣ Setup Instructions

### Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org))
- **MySQL** 8.0+ running locally or remotely
- **npm** (comes with Node.js)

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=knowledge_sharing
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:3000
```

> ⚠️ Create the database first: `CREATE DATABASE knowledge_sharing;` — Sequelize will create the tables automatically.

### Backend Setup

```bash
# 1. Clone the repo / navigate to folder
cd knowledge-sharing-backend

# 2. Install dependencies
npm install

# 3. Create and configure .env (see above)

# 4. Start the server (production)
npm start

# OR start with auto-reload (development)
npm run dev
```

The server starts at **http://localhost:5000**

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/articles` | ❌ | List articles (filterable) |
| GET | `/api/articles/:id` | ❌ | Get single article |
| GET | `/api/articles/my` | ✅ | Get logged-in user's articles |
| POST | `/api/articles` | ✅ | Create article |
| PUT | `/api/articles/:id` | ✅ | Update article (author only) |
| DELETE | `/api/articles/:id` | ✅ | Delete article (author only) |
| POST | `/api/ai/improve` | ✅ | AI-improve article content |
| POST | `/api/ai/summary` | ✅ | AI-generate article summary |

> ✅ = Requires `Authorization: Bearer <token>` header
