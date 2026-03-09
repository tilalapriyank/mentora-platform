# API Reference

Base URL: `http://localhost:3000` (or your `PORT`).

Protected routes require the header: `Authorization: Bearer <token>`.

---

## Table of contents

1. [Authentication](#authentication)
2. [Students](#students-parent-only)
3. [Lessons](#lessons-mentor-only)
4. [Bookings](#bookings-parent-only)
5. [Sessions](#sessions-mentor-only)
6. [Join session](#join-session-parent-only)
7. [LLM](#llm)
8. [Errors](#errors)

---

## Authentication

### POST /auth/signup

Register a new user. Only **PARENT** and **MENTOR** roles are allowed; students are created by parents.

**Request body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string (min 6 characters)",
  "role": "PARENT | MENTOR"
}
```

**Response (201):** `{ "token": "string" }`  
**Errors:** 400 — missing fields, invalid role, password too short, or email already registered.

---

### POST /auth/login

**Request body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):** `{ "token": "string" }`  
**Errors:** 400 — invalid credentials or missing email/password.

---

### GET /auth/me

**Auth:** Required (JWT).

**Response (200):** Current user object (id, name, email, role). Password is never returned.

---

## Students (Parent only)

### POST /students

**Auth:** Required (JWT, role PARENT).

**Request body:** `{ "name": "string" }`

**Response (201):** Created student (id, name, parentId, createdAt, updatedAt).  
**Errors:** 400 — name missing or invalid.

---

### GET /students

**Auth:** Required (JWT, role PARENT).

**Response (200):** Array of students belonging to the current parent.

---

## Lessons (Mentor only)

### POST /lessons

**Auth:** Required (JWT, role MENTOR). `mentorId` is set from the token.

**Request body:**

```json
{
  "title": "string",
  "description": "string"
}
```

**Response (201):** Created lesson (id, title, description, mentorId, timestamps).  
**Errors:** 400 — title or description missing/invalid.

---

### GET /lessons/:id/sessions

**Auth:** Required (JWT).

**Response (200):** Array of sessions for the lesson, ordered by date.  
**Errors:** 400 — invalid lesson id.

---

## Bookings (Parent only)

### POST /bookings

**Auth:** Required (JWT, role PARENT). The student must belong to the current parent.

**Request body:**

```json
{
  "studentId": "uuid",
  "lessonId": "uuid"
}
```

**Response (201):** Created booking (id, studentId, lessonId, timestamps).  
**Errors:** 400 — missing or invalid ids; 403 — student not owned by parent; 404 — lesson not found; 409 — student already booked on this lesson.

---

## Sessions (Mentor only)

### POST /sessions

**Auth:** Required (JWT, role MENTOR). The lesson must belong to the current mentor.

**Request body:**

```json
{
  "lessonId": "uuid",
  "date": "ISO 8601 date string",
  "topic": "string",
  "summary": "string (optional)"
}
```

**Response (201):** Created session (id, lessonId, date, topic, summary, timestamps).  
**Errors:** 400 — invalid input (e.g. missing lessonId/topic, invalid date); 403 — lesson not found or not your lesson.

---

## Join session (Parent only)

### POST /sessions/:id/join

Record that a student has joined a session. The student must be booked on the lesson that the session belongs to. Only the parent of that student can call this.

**Auth:** Required (JWT, role PARENT).

**URL:** `:id` — session UUID.

**Request body:**

```json
{
  "studentId": "uuid"
}
```

**Response (201):** Created join record (id, sessionId, studentId, joinedAt).  
**Errors:** 400 — missing or invalid session id / studentId; 403 — student not owned by parent, or student not booked on this lesson; 404 — session not found; 409 — student has already joined this session.

---

## LLM

### POST /llm/summarize

Summarize the given text using the configured LLM (e.g. Gemini). Returns 3–6 bullet points, under ~120 words. No authentication required; rate limited per IP.

**Request body:** `{ "text": "string" }`

**Validation:**

| Condition | Status | Message |
|-----------|--------|---------|
| text missing, null, or not a string | 400 | Text is required / Text must be a string |
| text empty or whitespace only | 400 | Text cannot be empty |
| text length < 50 characters | 400 | Text too short (minimum 50 characters) |
| text length > 10,000 characters | 413 | Text too long (maximum 10000 characters) |

**Rate limit:** 10 requests per minute per IP (configurable via env).

**Response (200):**

```json
{
  "summary": "• First point\n• Second point\n• ...",
  "model": "gemini-1.5-flash"
}
```

**Errors:** 502 — summarization failed; 429 — rate limit exceeded.

---

## Errors

All error responses use a single object with an `error` message:

```json
{
  "error": "Human-readable message"
}
```

**Common status codes:**

| Code | Meaning |
|------|---------|
| 400 | Bad request — validation failed or invalid input |
| 401 | Unauthorized — missing or invalid JWT |
| 403 | Forbidden — valid JWT but not allowed (e.g. wrong role or resource) |
| 404 | Not found — resource does not exist |
| 409 | Conflict — duplicate (e.g. already booked, already joined) |
| 413 | Payload too large — e.g. text over limit for summarize |
| 429 | Too many requests — rate limit exceeded |
| 500 / 502 | Server / upstream (LLM) error |
