# Meridian — Academic Publishing & Research Platform (full stack)

React + Vite + TypeScript frontend (`frontend/`) and a Django REST Framework backend (`backend/`),
packaged as **one deployable container**: Django serves the REST API at `/api/v1/*` and the built
React app for every other URL.

```
frontend/   React SPA (your original project-1, wired to the real API)
backend/    Django 5.2 + DRF  (accounts, catalog, workflow, engagement apps)
Dockerfile  multi-stage: builds the SPA, then runs Django + gunicorn + WhiteNoise
docker-compose.yml   web + Postgres, one command
render.yaml          one-click Render blueprint (web + Postgres)
```

## 1. Run it (Docker — recommended)

```bash
cp .env.example .env        # optional for local use; edit secrets before deploying
docker compose up --build
# open http://localhost:8000
```

On first start the container migrates the database, creates the administrator from
`ADMIN_EMAIL` / `ADMIN_PASSWORD`, and (with `SEED_DEMO_DATA=true`) loads the sample catalog.
Set `SEED_DEMO_USERS=true` locally to also get demo accounts (below).

* Site: <http://localhost:8000> · API: <http://localhost:8000/api/v1/journals> · Health: `/healthz`
* Django admin (CMS for journals, articles, books, users…): <http://localhost:8000/django-admin/>
  (the SPA owns `/admin`, so Django's admin lives at `/django-admin/`)

### Demo accounts (only with `SEED_DEMO_USERS=true` or `python manage.py seed_demo --demo-users`)

Password for all: `Meridian#Demo2026` (override with `DEMO_PASSWORD`)

| Email | Role | Try |
|---|---|---|
| `author@meridian.test` | researcher + author | My submissions, new submission |
| `editor@meridian.test` | editor | Editorial queue, record decisions, publish |
| `reviewer@meridian.test` | reviewer | Accept / decline review invitations |
| `librarian@meridian.test` | librarian | Usage analytics, subscriptions |
| `admin@meridian.test` | admin | Users, roles, audit log |
| `researcher@meridian.test` | researcher | Bookmarks, alerts |

> Never enable demo users on a public deployment — the password is public.

## 2. Local development (no Docker)

```bash
# backend  (Python 3.12)
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env                        # Windows (macOS/Linux: cp). Contains DJANGO_DEBUG=true
python manage.py migrate
python manage.py seed_demo --demo-users
python manage.py runserver                    # http://localhost:8000

# frontend (Node 20+), second terminal
cd frontend
cp .env.example .env                          # VITE_API_BASE_URL=http://localhost:8000/api/v1
npm install
npm run dev                                   # http://localhost:5173
```

**Windows shortcut:** in `backend`, run `dev.bat` (creates `.env`, migrates, seeds demo data, starts the server).

Tests: `cd backend && python manage.py test` with `.env` in place (17 API tests).
Frontend: `npm run build` (type-check + bundle), `npm run lint`.

## 3. Deploy

The image only needs `DJANGO_SECRET_KEY`, a `DATABASE_URL` (Postgres) and the admin bootstrap vars.

**Render (easiest):** push this folder to a GitHub repo → *New → Blueprint* → pick the repo. `render.yaml`
creates the web service + Postgres and generates the secret key; you enter `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

**Railway / Fly.io / any Docker host:** deploy the root `Dockerfile`, attach Postgres, and set:

| Variable | Value |
|---|---|
| `DJANGO_SECRET_KEY` | long random string (`python -c "import secrets;print(secrets.token_urlsafe(50))"`) |
| `DATABASE_URL` | `postgres://user:pass@host:5432/db` |
| `DJANGO_ALLOWED_HOSTS` | your domain(s), comma separated |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | `https://your-domain` (needed for the Django admin over HTTPS) |
| `DJANGO_SECURE_SSL` | `true` once HTTPS is in front (redirect, secure cookies, HSTS) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | first administrator (created once, on startup) |
| `SEED_DEMO_DATA` | `true` for sample content, `false` for a clean install |

`PORT` is honoured automatically. Render/Railway hostnames are trusted automatically.
SQLite is used when `DATABASE_URL` is unset — fine for a demo, but the file is lost when a container is
replaced, so use Postgres for anything real.

**Frontend on a separate host** (e.g. GitHub Pages / Netlify + API elsewhere): build with
`VITE_API_BASE_URL=https://api.example.com/api/v1` (and `VITE_BASE=/project-1/` for GitHub Pages), and
set `DJANGO_CORS_ALLOWED_ORIGINS=https://your-frontend-origin` on the backend. Note the auth token lives in
`localStorage`, as in the original frontend design.

## 4. API reference (`/api/v1`, JSON, camelCase — matches the frontend types)

Auth header: `Authorization: Bearer <token>` (from login/register).

| Endpoint | Access | Notes |
|---|---|---|
| `POST /auth/register` · `POST /auth/login` · `GET /auth/me` · `POST /auth/logout` | public / user | register allows `researcher` or `author` only; auth endpoints are rate limited |
| `GET /search?q=&page=&pageSize=&contentType=&subject=&accessType=` | public | across articles, journals, books, case studies |
| `GET /journals`, `/journals/{id}` · `GET /articles?journalId=`, `/articles/{id}`, `/articles/{id}/related` | public | |
| `GET /books`, `/books/{id}` · `GET /case-studies`, `/case-studies/{id}` | public | |
| `GET/POST /submissions` (`?scope=mine`) · `GET /submissions/{id}` | author/researcher/editor/admin | editors/admins see the whole queue (drafts excluded) |
| `POST /editorial-decisions` | editor, admin | `accept · revise · reject · desk_reject · withdraw · publish`; validates transitions; `publish` creates the catalog article; notifies the author |
| `GET/POST /review-assignments` · `PATCH /review-assignments/{id}` | reviewer (own) / editor | assign reviewers by email; accept/decline/submit |
| `GET/POST /bookmarks` · `DELETE /bookmarks/{id}` | signed in | |
| `GET /alerts` · `PATCH /alerts/{id}` | signed in | |
| `GET /subscriptions` · `GET /admin/analytics` | librarian, admin | librarians see their own institution |
| `GET /admin/users` · `PATCH /admin/users/{id}` · `GET /admin/audit-logs` | admin | change roles/status; audit trail |

Errors always look like `{"detail": "human readable message"}`.

## 5. What changed in the frontend

* Sign-in / register now call the real API (they were mock sessions); a stored token is re-verified on
  page load so refreshing keeps you signed in.
* Submissions, editorial decisions (with a decision picker), review invitations (Accept/Decline),
  bookmarks (new “Save to reading list” button on articles), related articles and journal article lists use the API.
* Mock fallbacks now apply **only in `npm run dev` when the backend is unreachable**; production builds show real errors.
* `vite.config.ts` base is now `/` (configurable via `VITE_BASE`) so the app works when served by Django.
* Researchers may now open *My submissions* (the new-submission form already allowed them, but redirected afterwards).

## 6. Known limits (not built yet)

* No manuscript file upload or review-report form (reviewers can accept/decline; the “Write review” button is still a placeholder).
* No email delivery (notifications are in-app alerts only), no password reset flow, no saved-search alerts.
* Search is database-based (case-insensitive substring match), not OpenSearch as in the SRS; fine for thousands of records.
* The Docker image was written and its steps verified separately, but it was not built inside the authoring environment.
