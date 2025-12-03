# Configuración Inicial del Frontend

## ⚠️ IMPORTANTE: Configurar Variables de Entorno

Antes de ejecutar el frontend, **debes crear el archivo `.env.local`**:

### Opción 1: Crear manualmente

1. Crea un archivo llamado `.env.local` en la carpeta `InnovArt-Frontend/`
2. Agrega el siguiente contenido:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Opción 2: Usar PowerShell

```powershell
cd InnovArt-Frontend
Copy-Item .env.example .env.local
```

O si no existe `.env.example`:

```powershell
cd InnovArt-Frontend
echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > .env.local
```

## 🚀 Inicio Rápido

### 1. Asegúrate de que el Backend esté corriendo

En una terminal:
```powershell
cd InnovArt_Backend_Dotnet
dotnet run --urls "http://localhost:5000"
```

Deberías ver: `Now listening on: http://localhost:5000`

### 2. Inicia el Frontend

En otra terminal:
```powershell
cd InnovArt-Frontend
npm install  # Solo la primera vez
npm run dev
```

### 3. Verifica

- Frontend: `http://localhost:3000`
- Backend Swagger: `http://localhost:5000/swagger`
- Backend Health: `http://localhost:5000/api/health`

## 🔧 Solución de Problemas

### Error: "Network Error" o "Error al cargar..."

1. **Verifica que el backend esté corriendo:**
   - Abre `http://localhost:5000/swagger` en tu navegador
   - Si no carga, el backend no está corriendo

2. **Verifica el archivo `.env.local`:**
   - Debe existir en `InnovArt-Frontend/.env.local`
   - Debe contener: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
   - **Importante:** Reinicia el servidor de desarrollo después de crear/modificar este archivo

3. **Verifica el puerto:**
   - Si el backend está en otro puerto (ej: 5001), actualiza `.env.local`:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:5001/api
     ```

### El frontend no detecta cambios en `.env.local`

- **Reinicia el servidor de desarrollo** (Ctrl+C y luego `npm run dev`)
- Next.js solo lee variables de entorno al iniciar

## 📝 Notas

- El archivo `.env.local` está en `.gitignore` y no se sube al repositorio
- Para producción, configura las variables de entorno en Render/Vercel
- El archivo `.env.example` es solo una plantilla de referencia

