# TrainHere Development

## Prerequisites

* Java 17
* Node.js
* npm

## Backend

From the `backend` folder:

```bash
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

Health check:

```text
GET http://localhost:8080/api/health
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
