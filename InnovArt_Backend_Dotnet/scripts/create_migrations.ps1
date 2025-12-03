# PowerShell helper to create and apply EF Core migrations locally
# Usage (PowerShell):
# 1) Install dotnet-ef tool if you don't have it: dotnet tool install --global dotnet-ef
# 2) Create a migration: .\create_migrations.ps1 -Name Initial
# 3) Apply migrations: .\create_migrations.ps1 -Apply

param(
    [string]$Name = "Initial",
    [switch]$Apply
)

Write-Output "Working directory: $PWD"

if (-not (Get-Command dotnet-ef -ErrorAction SilentlyContinue)) {
    Write-Output "dotnet-ef not found. Install with: dotnet tool install --global dotnet-ef"
    return
}

if ($Apply) {
    dotnet ef database update --project ..\InnovArt.Backend.csproj --startup-project ..\InnovArt.Backend.csproj
} else {
    dotnet ef migrations add $Name --project ..\InnovArt.Backend.csproj --startup-project ..\InnovArt.Backend.csproj
}
