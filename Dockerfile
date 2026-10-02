# ---- Stage 1: build the React (Vite) frontend ---------------------------------
FROM node:22-alpine AS frontend
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/ ./
# No VITE_API_BASE_URL -> the app calls the same origin at /api/v1 (served by Django below).
RUN npm run build

# ---- Stage 2: Django API + static serving of the built SPA ---------------------
FROM python:3.12-slim AS app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1
WORKDIR /app

COPY backend/requirements.txt ./
RUN pip install -r requirements.txt

COPY backend/ ./
COPY --from=frontend /frontend/dist ./frontend_dist
RUN DJANGO_SECRET_KEY=build-only-not-used-at-runtime python manage.py collectstatic --noinput \
 && useradd --create-home --uid 10001 app \
 && chown -R app:app /app
USER app

ENV PORT=8000
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD python -c "import os,urllib.request;urllib.request.urlopen('http://127.0.0.1:%s/healthz' % os.environ.get('PORT','8000'))" || exit 1

ENTRYPOINT ["sh", "./entrypoint.sh"]
CMD ["sh", "-c", "gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers ${WEB_CONCURRENCY:-3} --access-logfile -"]
