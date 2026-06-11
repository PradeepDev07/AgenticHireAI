# AI Recruitment Organization

Spec-driven multi-agent recruitment MVP using Next.js, Express, MongoDB, Qdrant, and deterministic AI workflow stubs.

## Structure

- `client/` contains the Next.js app.
- `server/` contains the Express API, agents, workflows, models, and logs.
- `specs/` contains all business rules, workflow order, prompts, email templates, retry policy, and RAG settings.

## Local Development

```bash
docker compose up -d
npm --prefix server install
npm --prefix client install
npm --prefix server run dev
npm --prefix client run dev
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:5000`

## Required Env

Copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env.local`.
