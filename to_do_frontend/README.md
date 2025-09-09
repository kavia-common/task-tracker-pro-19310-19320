# Task Tracker Frontend (Next.js)

A modern Next.js (App Router) frontend for a to-do application featuring:
- Authentication (login and signup)
- CRUD operations on to-dos
- Protected routes
- Clean and responsive UI (Tailwind CSS v4)
- API integration with a backend (mock fallback included)

## Quick start

1) Install dependencies:
```bash
npm install
```

2) Configure environment:
- Copy `.env.example` to `.env.local` and set:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```
If you omit `NEXT_PUBLIC_API_BASE_URL`, the UI runs with a mock API for local demo.

3) Run the dev server:
```bash
npm run dev
```
Visit http://localhost:3000

## Structure

- `src/app/` — App Router pages (landing, auth pages, todos)
- `src/components/` — Reusable UI components (NavBar, TodoList, etc.)
- `src/contexts/AuthContext.tsx` — Client-side auth state (user + tokens)
- `src/lib/apiClient.ts` — API client; calls backend or uses an in-memory mock
- `src/lib/types.ts` — Shared TypeScript types

## Backend integration

The API client expects typical REST endpoints:
- `POST /auth/login` → `{ user, tokens }`
- `POST /auth/signup` → `{ user, tokens }`
- `GET /auth/me` → `user`
- `GET /todos` → `Todo[]`
- `POST /todos` → `Todo`
- `PATCH /todos/:id` → `Todo`
- `DELETE /todos/:id` → `204 No Content`

Set `NEXT_PUBLIC_API_BASE_URL` to point to your backend (e.g., `http://localhost:8000`). The client automatically attaches `Authorization: Bearer <token>` when available.

## Notes

- This project exports static build by default (`next.config.ts` has `output: "export"`). If you need server-side features, remove that flag.
- Public functions are marked with a "PUBLIC_INTERFACE" comment and include docstrings in code comments where applicable.

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build
- `npm start` — Start production server (after build)
- `npm run lint` — Lint

## License

MIT
