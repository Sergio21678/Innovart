# Script para iniciar el frontend de InnovArt
# Uso: .\START_FRONTEND.ps1

Write-Host "🚀 Iniciando InnovArt Frontend..." -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Este script debe ejecutarse desde el directorio InnovArt-Frontend" -ForegroundColor Red
    exit 1
}

# Verificar que Node.js esté instalado
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Node.js no está instalado o no está en el PATH" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Verificar que existe .env.local
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  Advertencia: No se encontró .env.local" -ForegroundColor Yellow
    Write-Host "   Creando archivo .env.local con configuración por defecto..." -ForegroundColor Yellow
    
    $envContent = "NEXT_PUBLIC_API_URL=http://localhost:5000/api"
    Set-Content -Path ".env.local" -Value $envContent
    
    Write-Host "✅ Archivo .env.local creado" -ForegroundColor Green
    Write-Host ""
}

# Leer la configuración de API_URL
$envContent = Get-Content ".env.local" -ErrorAction SilentlyContinue
$apiUrl = ($envContent | Select-String "NEXT_PUBLIC_API_URL").ToString().Split("=")[1].Trim()
Write-Host "🔗 API URL configurada: $apiUrl" -ForegroundColor Cyan
Write-Host ""

# Verificar que node_modules exista
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Iniciando servidor de desarrollo..." -ForegroundColor Cyan
Write-Host "   Frontend disponible en http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Backend esperado en $apiUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  Asegúrate de que el backend esté corriendo!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

# Iniciar el servidor de desarrollo
npm run dev

