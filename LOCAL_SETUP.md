# Local setup

This guide starts the local services for the collaborative Markdown editor.

## Prerequisites

- Docker Desktop with Docker Compose
- Node.js and npm

## 1. Start the infrastructure

From the repository root, start PostgreSQL, pgAdmin, and MinIO:

```bash
docker compose up -d
```

The services use these local addresses:

| Service | Address |
| --- | --- |
| PostgreSQL | `localhost:5433` |
| pgAdmin | http://localhost:5050 |
| MinIO API | http://localhost:9000 |
| MinIO console | http://localhost:9001 |

## 2. Seed PostgreSQL

Run the seed scripts from the repository root:

```bash
docker exec -i postgres psql -U postgres -d postgres \
  < database/scripts/setup-users-table.sql

docker exec -i postgres psql -U postgres -d postgres \
  < database/scripts/setup-documents-table.sql
```

The scripts create the user and document tables, two sample users, and one
sample document. They are intended for an empty database; repeated execution
can produce duplicate-key errors.

## 3. Seed MinIO

Install the database utility dependencies and upload the sample Markdown file:

```bash
cd database
npm install
node scripts/setup-minio.js
cd ..
```

This creates the `markdown-files` bucket and uploads
`client-A-design-1.md`.

## 4. Start the backend

Install the backend dependencies:

```bash
cd backend
npm install
cd ..
```

The backend uses ES module imports. If the backend has not already been
updated for ES modules, add `"type": "module"` to `backend/package.json` and
change the first line of `backend/init-ws.js` to:

```js
import WebSocket from 'ws';
```

Start the backend and keep this terminal running:

```bash
node backend/index.js
```

It starts:

- Express file API on `http://localhost:8001`
- WebSocket relay on `ws://localhost:8000`

## 5. Start the frontend

In another terminal:

```bash
cd markdown-editor-frontend
npm install
npx prisma generate
npm run dev
```

Open http://localhost:3000.

The frontend `.env` file points to the local PostgreSQL, backend, and
WebSocket services. Restart the frontend after changing environment values.

## Sample login accounts

Both seeded accounts use the password `Password@1`:

| Email | Password |
| --- | --- |
| `admin@example.com` | `Password@1` |
| `you@example.com` | `Password@1` |

The sample document is owned by `admin@example.com` and is available to
`you@example.com` under **Shared with Me**.

## Stop the infrastructure

From the repository root:

```bash
docker compose down
```

Use `docker compose down -v` only when you intentionally want to remove the
persisted PostgreSQL, pgAdmin, and MinIO volumes.
