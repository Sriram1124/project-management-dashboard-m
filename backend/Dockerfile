# ── Base image ────────────────────────────────────────────────────────────────
FROM python:3.12-slim

# Set working directory inside the container
WORKDIR /app

# Prevents Python from writing .pyc files and enables unbuffered stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# ── System dependencies ───────────────────────────────────────────────────────
# libpq-dev is required by psycopg2 at build time on slim images
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libpq-dev \
        gcc \
    && rm -rf /var/lib/apt/lists/*

# ── Python dependencies ───────────────────────────────────────────────────────
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# ── Application source ────────────────────────────────────────────────────────
# In development the source is bind-mounted (see docker-compose.yml),
# so this COPY is primarily used for production-style builds.
COPY . .

# ── Runtime ───────────────────────────────────────────────────────────────────
EXPOSE 8000

# The docker-compose.yml overrides this command with --reload for development
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
