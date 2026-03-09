# Mentora Platform — Backend

A REST API backend for a mentorship platform where **parents**, **students**, and **mentors** interact. Parents create and manage students, mentors create lessons and sessions, and parents book students into lessons. Includes an LLM-powered text summarization endpoint.

---

## Features

- **Authentication** — JWT-based signup (parent/mentor only), login, and `/me` profile
- **Students** — Parents create and list students linked to their account
- **Lessons** — Mentors create lessons (title, description)
- **Bookings** — Parents assign their students to lessons
- **Sessions** — Mentors add sessions to their lessons; list sessions per lesson
- **LLM summarization** — `POST /llm/summarize` returns a short bullet-point summary (Google Gemini)

---

## Tech stack

| Layer        | Technology        |
|-------------|-------------------|
| Runtime     | Node.js 20+       |
| Framework   | Express           |
| Database    | PostgreSQL        |
| ORM         | Prisma 7         |
| Auth        | JWT + bcrypt      |
| LLM         | Google Gemini     |
| Language    | TypeScript (ESM)  |

---

## Prerequisites

- **Node.js** 20.x or 22.x (LTS recommended)
- **PostgreSQL** (local or hosted, e.g. [Neon](https://neon.tech))
- **npm** (or yarn / pnpm)

---

## Setup

### 1. Clone and install dependencies

```bash
git clone https://github.com/tilalapriyank/mentora-platform.git
cd mentora-platform
npm install
```

### 2. Environment variables

Copy the example file and edit `.env` with your values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (e.g. `postgresql://user:pass@host:5432/dbname?sslmode=require`) |
| `JWT_SECRET`   | Yes | Secret used to sign JWT tokens (use a long random string in production) |
| `GEMINI_API_KEY` | Yes | [Google AI Studio](https://aistudio.google.com/apikey) API key for `/llm/summarize` |
| `PORT`         | No  | Server port (default: `3000`) |
| `GEMINI_MODEL` | No  | Model name (default: `gemini-1.5-flash`) |
| `RATE_LIMIT_WINDOW_MS`   | No | Rate-limit window in ms (default: `60000`) |
| `RATE_LIMIT_SUMMARIZE_MAX` | No | Max requests per window for `/llm/summarize` (default: `10`) |

**Security:** Do not commit `.env` or expose API keys. `.env` is gitignored.

### 3. Database

Generate the Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Use a new database name in `DATABASE_URL` if you prefer; Prisma will create it when you run `migrate dev`. After any schema change, run both commands again so the client and database stay in sync.

### 4. Run the server

**Development (with auto-reload):**

```bash
npm run dev
```

**Production (after building):**

```bash
npm start
```

The API is available at `http://localhost:3000` (or your `PORT`).

---

## API overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST   | `/auth/signup`   | No  | Register (role: `PARENT` or `MENTOR`) |
| POST   | `/auth/login`    | No  | Login; returns JWT |
| GET    | `/auth/me`       | Yes | Current user profile |
| POST   | `/students`     | Parent | Create student |
| GET    | `/students`     | Parent | List my students |
| POST   | `/lessons`      | Mentor | Create lesson |
| GET    | `/lessons/:id/sessions` | Yes | List sessions for a lesson |
| POST   | `/bookings`     | Parent | Book a student into a lesson |
| POST   | `/sessions`     | Mentor | Create session for a lesson |
| POST   | `/sessions/:id/join` | Parent | Record student joining a session |
| POST   | `/llm/summarize`| No  | Summarize text (rate limited) |

Protected routes require header: `Authorization: Bearer <token>`.

Full request/response details: **[docs/API.md](docs/API.md)**.  
**Postman:** Import **[postman/Mentora-Platform-API.postman_collection.json](postman/Mentora-Platform-API.postman_collection.json)** to test all endpoints (see [postman/README.md](postman/README.md)).

---

## LLM summarization

### API key

1. Get an API key from [Google AI Studio](https://aistudio.google.com/apikey).
2. Add to `.env`: `GEMINI_API_KEY=your_key_here`
3. Optional: `GEMINI_MODEL=gemini-1.5-flash` (or another model name).

### Test with curl

```bash
curl -X POST http://localhost:3000/llm/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "Paste here a paragraph or longer text (at least 50 characters) that you want summarized into bullet points."}'
```

### Example response

```json
{
  "summary": "• First main point from the text.\n• Second main point.\n• Third point.\n• Optional fourth or fifth point.",
  "model": "gemini-1.5-flash"
}
```

### Limits and behaviour

- **Input:** `text` required; min 50 characters, max 10,000 characters. Returns `400` if missing/too short, `413` if too long.
- **Output:** 3–6 bullet points, total under ~120 words. No extra intro or conclusion.
- **Rate limit:** 10 requests per minute per IP (configurable via env).
- **Errors:** LLM or API failures return `502` with a generic message; invalid/missing API key can cause `500` at startup or `502` on first call.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with `tsx watch` |
| `npm start` | Start production server (`node dist/server.js`) |
| `npm test` | Run tests (placeholder) |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma migrate dev` | Apply migrations (dev) |

---

## Project structure

```
mentora-platform/
├── prisma/
│   ├── schema.prisma    # Data models and DB config
│   └── migrations/
├── src/
│   ├── config/          # Prisma, Gemini, rate limit
│   ├── middleware/      # Auth, role checks
│   ├── modules/
│   │   ├── auth/
│   │   ├── students/
│   │   ├── lessons/
│   │   ├── bookings/
│   │   ├── sessions/
│   │   └── llm/
│   ├── utils/           # Password, JWT
│   ├── app.ts           # Express app and routes
│   └── server.ts        # Entry point
├── docs/
│   └── API.md           # API reference
├── .env.example
├── package.json
├── prisma.config.ts
└── tsconfig.json
```