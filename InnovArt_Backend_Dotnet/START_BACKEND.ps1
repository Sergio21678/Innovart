# Script para iniciar el backend de InnovArt
# Uso: .\START_BACKEND.ps1

Write-Host "🚀 Iniciando InnovArt Backend..." -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "InnovArt.Backend.csproj")) {
    Write-Host "❌ Error: Este script debe ejecutarse desde el directorio InnovArt_Backend_Dotnet" -ForegroundColor Red
    exit 1
}

# Verificar que .NET esté instalado
$dotnetVersion = dotnet --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: .NET SDK no está instalado o no está en el PATH" -ForegroundColor Red
    exit 1
}

Write-Host "✅ .NET SDK encontrado: $dotnetVersion" -ForegroundColor Green
Write-Host ""

# Verificar si el puerto 5000 está en uso
$portInUse = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️  Advertencia: El puerto 5000 está en uso" -ForegroundColor Yellow
    Write-Host "   Si el backend ya está corriendo, puedes detenerlo con Ctrl+C" -ForegroundColor Yellow
    Write-Host ""
    $response = Read-Host "¿Deseas continuar de todos modos? (S/N)"
    if ($response -ne "S" -and $response -ne "s") {
        exit 0
    }
}

Write-Host "📦 Restaurando dependencias..." -ForegroundColor Cyan
dotnet restore
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al restaurar dependencias" -ForegroundColor Red
    exit 1
}

Write-Host "🔨 Compilando proyecto..." -ForegroundColor Cyan
dotnet build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al compilar el proyecto" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Compilación exitosa!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Iniciando servidor en http://localhost:5000" -ForegroundColor Cyan
Write-Host "📚 Swagger UI disponible en http://localhost:5000/swagger" -ForegroundColor Cyan
Write-Host "❤️  Health Check disponible en http://localhost:5000/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

# Iniciar el servidor
dotnet run --urls "http://localhost:5000"

