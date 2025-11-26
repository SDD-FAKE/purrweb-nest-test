###### [Switch to Russian](https://github.com/SDD-FAKE/purrweb-nest-test/README-RU.md)

# Nest.js Test Project

<hr />

## Environment and Technology Stack 🧰 

**Application**
- Nest.js: 11.0.12  
- TypeScript: 5.7.3  

**Database**
- PostgreSQL 15  

**ORM**
- Prisma ORM 6.19.0  

**Containerization**
- Docker 28.1.1  
- Docker Compose 2.35.1  

<hr />

## 📄 Table of contents

- [Environment and Technology Stack](#environment-and-technology-stack-)
- [.env configuration](#env-configuration-)
- [Running the project](#running-the-project-)
  - [Using Docker Compose](#using-docker-compose)
  - [Without Docker](#without-docker)
- [Swagger](#swagger-)
- [Available commands](#available-commands-)
- [FAQ](#faq-)
- [Links and resources](#links-and-resources-)

<hr />

## .env Configuration 🔧 

### Database (For Docker)

```bash
DB_USER=postgres #Database user
DB_PASSWORD=postgres #Database password
DB_NAME=purrweb #Database name
```

### Application mode

```bash
NODE_ENV=development #Application work mode
```

Modes:
- `development` — debug logs, auto-restart, Swagger enabled. 
- `production` — compiled build, Swagger disabled

### Application port

```bash
PORT=3000 #Also using in Docker
```

### Cookie domain (for refresh token)

```bash
COOKIE_DOMAIN=localhost #It is used to install refresh tokens and operate the refresh tokens endpoint
```

### Database URL (For Prisma)

```bash
DATABASE_URL=postgresql://postgres:postgres@nest-test-db:5432/purrweb #Url for migrations, seeds and prisma client work
```

### JWT settings

```bash
JWT_SECRET=your-secret-key #Secret key for JWT tokens
JWT_ACCESS_TOKEN_TTL=2h #The validity period during which the access token is valid
JWT_REFRESH_TOKEN_TTL=7d #The validity period during which the refresh token is valid
```

### Swagger Theme

```bash
SWAGGER_THEME=dark #Theme for Swagger UI
```

Supported themes:
classic, dark-monokai, dark, dracula, feeling-blue, flattop, gruvbox, material, monokai, muted, newspaper, nord-dark, one-dark, outline.

<hr />

## Running the Project 🚀 

### Using Docker Compose

Run and attach (foreground):

```bash
make up
# equivalent: docker compose up
```

Run in background (detached):

```bash
make up-d
# equivalent: docker compose up -d
```

### Without Docker

Generate Prisma client:

```bash
npx prisma generate
```

Apply migrations to the database:

```bash
npx prisma migrate deploy
```

Run in development mode:

```bash
npm run start:dev
```

<hr />

## Swagger 📗

To enable Swagger, the MODE_ENV variable must be set to `development`.  
Swagger is available at the `/docs` route.

<hr />

## Available commands 🔨 

Below are the commands and their descriptions. Use the code blocks to copy them quickly.

- **Start (foreground)**

```bash
make up
# Starts containers with `docker compose up` (attached)
```

- **Start (detached/background)**

```bash
make up-d
# Starts containers with `docker compose up -d`
```

- **Restart containers**

```bash
make restart
# Convenience: docker compose down && docker compose up
```

- **Running unit tests**
```bash
npm unit-test
# Runs: docker compose run --rm app npm run test
```

- **Logs**

```bash
make logs-error # Track the error log
# Runs: docker exec -it nest-app tail -f /app/logs/error.log
```

```bash
make export-logs # Copies logs from the container to the directory./exported-logs/
# Runs: 
#  @echo "Exporting logs to ./exported-logs/..."
#  @mkdir -p ./exported-logs
#  @docker cp nest-app:/app/logs/. ./exported-logs/ 2>/dev/null || echo "Container not running or no logs yet"
#  @ls -la ./exported-logs/
```

- **Seed database (in-container)**

```bash
make seed
# Runs: docker compose run --rm app npx prisma db seed
```

- **Seed database (host/local)**

```bash
npx prisma db seed
```

- **Generate Prisma client**

```bash
npx prisma generate
```

- **Apply migrations**

```bash
npx prisma migrate deploy
```

- **Start app locally (dev)**

```bash
npm run start:dev
```

<hr />

## FAQ ❓ 

### Why is GET /:id not protected?

The test task requires checking permissions for **modifying or deleting** entities.
To fully isolate data between users, a "workspace/team" entity would be needed — this is out of scope for the test task.

### Why doesn't the refresh token endpoint work in Swagger?

Swagger UI **cannot send httpOnly cookies**, so the `refresh_token` cookie cannot be submitted via the Swagger interface.  
Use an external client (postman, insomnia or curl e.g.) to test refresh flows that rely on httpOnly cookies.

<hr />

## Links and Resources 🔗 

Database diagram:
- [dbdocs](https://dbdocs.io/danilove.sergey2016/purrweb-nest-test?view=relationships): https://dbdocs.io/danilove.sergey2016/purrweb-nest-test?view=relationships
- [PDF/PNG export](https://github.com/SDD-FAKE/purrweb-nest-test/diagrams): https://github.com/SDD-FAKE/purrweb-nest-test/diagrams