Backend / Frontend Integration (Local)

This file explains how to run and integrate the .NET backend with the Next.js frontend for local development.

Prerequisites
- .NET 9 SDK
- Node.js + npm (for frontend)
- Optional: `dotnet-ef` tool (for migrations)

Run backend locally

From `InnovArt_Backend_Dotnet`:

```powershell
dotnet restore
dotnet build
dotnet run --urls "http://localhost:5000;https://localhost:5001"
```

The API will be available at `http://localhost:5000` and Swagger at `http://localhost:5000/swagger`.

Run frontend locally

From `InnovArt-Frontend`:

```powershell
npm install
npm run dev
```

The frontend reads the backend base URL from `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000/api` for local). Make sure `InnovArt-Frontend/src/services/api.ts` points to `http://localhost:5000/api` when developing locally.

Database / EF Core migrations

We use SQLite for local development. To create and apply migrations:

```powershell
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate
dotnet ef database update
```

Environment variables (recommended)
- `JWT_SECRET` - secret used to sign JWT tokens (change in production)
- `FRONTEND_URL` - set to the frontend origin for strict CORS in production
- `CONNECTION_STRING` - optional: set a Postgres connection string in production; defaults to local SQLite `Data Source=innovart.db`.

Notes
- For production, use PostgreSQL on Render and set `CONNECTION_STRING` accordingly.
- Ensure `FRONTEND_URL` is set in production to lock CORS.
