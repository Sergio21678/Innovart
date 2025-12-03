# Script para configurar el archivo .env.local
# Uso: .\setup-env.ps1

Write-Host "🔧 Configurando variables de entorno para InnovArt Frontend..." -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Este script debe ejecutarse desde el directorio InnovArt-Frontend" -ForegroundColor Red
    exit 1
}

# Verificar si .env.local ya existe
if (Test-Path ".env.local") {
    Write-Host "⚠️  El archivo .env.local ya existe" -ForegroundColor Yellow
    $response = Read-Host "¿Deseas sobrescribirlo? (S/N)"
    if ($response -ne "S" -and $response -ne "s") {
        Write-Host "Operación cancelada." -ForegroundColor Yellow
        exit 0
    }
}

# Preguntar por el puerto del backend
Write-Host "¿En qué puerto está corriendo el backend?" -ForegroundColor Cyan
Write-Host "1. Puerto 5000 (por defecto)"
Write-Host "2. Puerto 5001"
Write-Host "3. Otro puerto (especificar)"
Write-Host ""
$opcion = Read-Host "Selecciona una opción (1-3)"

$puerto = "5000"
if ($opcion -eq "2") {
    $puerto = "5001"
} elseif ($opcion -eq "3") {
    $puerto = Read-Host "Ingresa el número de puerto"
}

$apiUrl = "http://localhost:$puerto/api"

# Crear el archivo .env.local
$envContent = "NEXT_PUBLIC_API_URL=$apiUrl"
Set-Content -Path ".env.local" -Value $envContent

Write-Host ""
Write-Host "✅ Archivo .env.local creado exitosamente!" -ForegroundColor Green
Write-Host "   Configuración: NEXT_PUBLIC_API_URL=$apiUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Próximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Asegúrate de que el backend esté corriendo en http://localhost:$puerto" -ForegroundColor White
Write-Host "   2. Reinicia el servidor de desarrollo del frontend (si está corriendo)" -ForegroundColor White
Write-Host "   3. Ejecuta: npm run dev" -ForegroundColor White
Write-Host ""

