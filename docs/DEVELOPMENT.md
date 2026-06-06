# TrainHere Development

## Prerequisites

* Java 17
* Node.js
* npm

## Backend

Start the local database from the repository root:

```bash
docker compose up -d postgres
```

From the `backend` folder:

```bash
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

To also load local seed data, run the backend with the `local` profile:

```powershell
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"
```

Health check:

```text
GET http://localhost:8080/api/health
```

Default local database settings:

```text
URL: jdbc:postgresql://localhost:5432/trainhere
Username: trainhere
Password: trainhere
```

You can override them with:

```text
TRAINHERE_DB_URL
TRAINHERE_DB_USERNAME
TRAINHERE_DB_PASSWORD
```

## Frontend

From the `frontend` folder:

```bash
npm install
npm run dev
```

The Vite dev server usually starts at:

```text
http://localhost:5173
```

## Phase 0 Verification

Phase 0 is considered complete when:

* The backend starts successfully.
* `GET /api/health` returns `status: ok`.
* The frontend starts successfully.
* The first screen renders TrainHere content instead of template content.

## Phase 1 Verification

Phase 1 database setup is considered complete when:

* `docker compose up -d postgres` starts PostgreSQL with PostGIS.
* The backend starts and Flyway applies `db/migration` successfully.
* Running with the `local` profile also loads `db/seed/local`.
* Backend tests pass without requiring a live database.
