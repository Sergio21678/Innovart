Deploy instructions for Render

1) Recommended DB in Render: create a Postgres database (Managed Postgres) in Render dashboard.
2) In Render web service settings, set an environment variable `CONNECTION_STRING` to the Postgres connection string provided by Render, e.g.: `Host=<host>;Port=5432;Database=<db>;Username=<user>;Password=<pass>`
3) Build command: `dotnet publish -c Release -o ./publish`
4) Start command: `dotnet InnovArt.Backend.dll` (adjust working dir to `publish` folder)

Notes:
- The project auto-detects Postgres vs SQLite based on the `CONNECTION_STRING` content.
- For a simple/testing deployment you may use the default SQLite database (not recommended in Render production since filesystem is ephemeral).
- Set `EnableSwagger=false` in env vars for production if you want to hide Swagger UI.

JWT / Auth:
- Set an environment variable `JWT_SECRET` in Render to a secure random value (e.g. 32+ chars). The backend will use this value to sign JWT tokens.

EF Migrations and deployment notes:
- Recommended: use Render Managed Postgres and provide its connection string as `CONNECTION_STRING` env var.
- Create EF Core migrations locally with `dotnet ef migrations add Initial` and apply them with `dotnet ef database update` (or let the app create tables with EnsureCreated for simple cases).

CORS / Frontend origin:
- For production, set an environment variable `FRONTEND_URL` in Render with your frontend origin (example: `https://your-frontend.onrender.com`). The API will use it to restrict CORS. If not set, `AllowAll` will be used (development only).

EF Migrations helper script:
- There's a helper script `scripts\create_migrations.ps1` that runs `dotnet ef` commands for creating and applying migrations on Windows PowerShell.

Example `render.yaml` (included in repo): `render.yaml`.

Example `render.yaml` (web service + postgres):

services:
  - type: web
    name: innovart-backend
    env: dotnet
    buildCommand: dotnet publish -c Release -o ./publish
    startCommand: dotnet InnovArt.Backend.dll
    plan: starter
    envVars:
      - key: ENABLE_SWAGGER
        value: "true"
  - type: postgres
    name: innovart-db
    plan: starter

After creating Postgres, copy the connection string into the web service env var `CONNECTION_STRING`.
