# GS1 Data Room (Frontend)

React frontend for the GS1 full-stack test task: a Data Room with folders, PDF uploads, auth, and sharing.

The API is provided by the NestJS backend in the sibling repo [`GS1-full-stack-be`](../GS1-full-stack-be).

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Redux Toolkit** (RTK Query) for server state
- **React Router** for navigation
- **Tailwind CSS** + **shadcn/ui**
- **Backend:** NestJS, Prisma, Supabase (see backend README)

## AI tools

For this test task:

- **ChatGPT** — used to create and refine the task steps / requirements
- **Cursor** — used to implement the coding steps in this repository (and the backend repo)

## Prerequisites

- Node.js 20+ and npm
- A Supabase project (PostgreSQL, Auth, Storage)
- Backend repo cloned next to this one:

```
Documents/
├── GS1-full-stack/      ← this repo (frontend)
└── GS1-full-stack-be/   ← backend API
```

## Getting started

### 1. Backend

```bash
cd ../GS1-full-stack-be
npm install
cp .env.example .env
```

Fill in `.env` with your Supabase credentials (see [backend README](../GS1-full-stack-be/README.md)).

Run migrations and start the API:

```bash
npm run prisma:migrate
npm run start:dev
```

The backend runs at **http://localhost:3000**.

### 2. Frontend

In a second terminal:

```bash
cd GS1-full-stack
npm install
cp .env.example .env
```

Default `.env`:

```env
VITE_API_BASE_URL=/api
```

Vite proxies `/api/*` to `http://localhost:3000` (see `vite.config.ts`), so you usually do not need to change this for local development.

Start the dev server:

```bash
npm start
```

Open **http://localhost:5173** (or the port Vite prints if 5173 is busy).

### 3. Use the app

1. Sign up or log in at `/signup` or `/login`
2. Open **Data Room** at `/data-room`
3. Create a root folder, open it, then upload PDF files
4. Use share actions for public links or email invites

Both backend and frontend must be running for the app to work.

## Deploying to Vercel

### Backend

Set Supabase and database env vars from `.env.example` in the Vercel project settings.

### Frontend

Set this **before build** (Vite bakes env vars in at build time):

```env
VITE_API_BASE_URL=https://gs-1-full-stack-be.vercel.app
```

Use your real backend URL. The default `/api` only works locally with the Vite dev proxy.

`/auth/me` requires `Authorization: Bearer <access_token>`. Opening that URL in the browser tab will always return `Missing or invalid authorization header` — that endpoint is for the app to call after login, not for direct visits.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Vite dev server |
| `npm run build` | Typecheck and production build |
| `npm run lint` | Run Oxlint |
| `npm run preview` | Preview production build |

## Backend API

See [GS1-full-stack-be/README.md](../GS1-full-stack-be/README.md) for routes, data model, and sharing rules.
