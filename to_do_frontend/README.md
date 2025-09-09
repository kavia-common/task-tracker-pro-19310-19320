# Task Tracker – Next.js Frontend

This is the frontend for the Task Tracker application built with Next.js App Router.

## Prerequisites

- Node.js 18+
- A running backend (Django) serving the REST API.
- Set the environment variable for the backend base URL.

Create a `.env.local` in this folder and set:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

See `.env.example` for reference.

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Scripts

- `npm run dev` – start development server
- `npm run build` – production build
- `npm start` – run production build

## Features

- Authentication: login, registration, logout
- Tasks: list, create, update, delete, toggle completion, search
- Profile: view/update profile, change password
- Responsive UI with Tailwind CSS v4

## Configuration

- The frontend reads the backend base URL from `NEXT_PUBLIC_API_BASE_URL` at build/runtime.
- Auth tokens are stored in `localStorage` and sent via `Authorization: Token <token>`.

## Notes

- The provided backend OpenAPI spec requires a `profile/{id}/` path param for profile retrieval. The UI includes a field to input the user ID to load profile data.
- If your backend offers a “current user” endpoint (e.g., `/profile/me/`), you can update the profile page to auto-load without requiring ID input.
- Ensure CORS settings on the backend allow requests from the frontend origin.
