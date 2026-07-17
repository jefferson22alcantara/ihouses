# Ihouses

Real-time, event-driven SaaS that scrapes major Dutch housing sites (Pararius, Funda, Kamernet), alerts users on Telegram the moment a matching listing appears, and generates a personalized AI motivation letter in Dutch.

## Stack

- **Backend:** FastAPI (async), SQLAlchemy + `asyncpg`, Redis, Anthropic/OpenAI APIs — `app/`
- **Frontend:** Next.js (App Router) + Tailwind CSS, PWA — `web/`
- **Database:** PostgreSQL + Redis
- **Infra:** Terraform (Hetzner Cloud) — `terraform/`

## Prerequisites

- Python 3.12+
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16 and Redis 7 (only if running the backend without Docker)

## Running Locally (without Docker)

### Backend

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# edit .env: point DATABASE_URL/REDIS_URL at your local Postgres/Redis instances,
# and fill in TELEGRAM_BOT_TOKEN / ANTHROPIC_API_KEY / OPENAI_API_KEY as needed

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API is available at `http://localhost:8000`, with a health check at `http://localhost:8000/health`.

### Frontend

```bash
cd web
npm install
cp .env .env.local   # or configure DATABASE_URL yourself for Prisma
npm run dev
```

The app is available at `http://localhost:3000`.

## Running with Docker

The root `docker-compose.yml` runs the backend API, Postgres, and Redis together.

```bash
cp .env.example .env
# fill in TELEGRAM_BOT_TOKEN / ANTHROPIC_API_KEY / OPENAI_API_KEY as needed

docker compose up --build
```

This starts:

- `web` — FastAPI app on `http://localhost:8000`
- `db` — PostgreSQL on `localhost:5432`
- `redis` — Redis on `localhost:6379`

Stop everything with:

```bash
docker compose down
```

To also remove the Postgres data volume:

```bash
docker compose down -v
```

The Next.js frontend (`web/`) is not part of `docker-compose.yml` yet and should be run separately with `npm run dev` as described above.
