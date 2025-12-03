# Guía de Despliegue en Render

## Configuración del Backend

### Variables de Entorno Requeridas

1. **CONNECTION_STRING**: Cadena de conexión a PostgreSQL
   - Se obtiene automáticamente del servicio de PostgreSQL en Render
   - Formato: `Host=...;Port=5432;Database=...;Username=...;Password=...`

2. **JWT_SECRET**: Secreto para firmar tokens JWT
   - Debe ser una cadena aleatoria segura (mínimo 32 caracteres)
   - Ejemplo: `openssl rand -base64 32`

3. **FRONTEND_URL**: URL del frontend desplegado
   - Ejemplo: `https://innovart-frontend.onrender.com`
   - Se usa para configurar CORS

4. **ENABLE_SWAGGER** (opcional): Habilitar/deshabilitar Swagger UI
   - Valores: `true` o `false`
   - Por defecto: `true`

### Pasos para Desplegar

1. **Crear el servicio de PostgreSQL en Render**
   - Ir a Dashboard > New > PostgreSQL
   - Seleccionar plan (Free para desarrollo)
   - Copiar la cadena de conexión interna

2. **Crear el servicio Web en Render**
   - Ir a Dashboard > New > Web Service
   - Conectar el repositorio de GitHub
   - Configurar:
     - **Environment**: `dotnet`
     - **Build Command**: `dotnet publish -c Release -o ./publish`
     - **Start Command**: `cd ./publish && dotnet InnovArt.Backend.dll`
     - **Root Directory**: `InnovArt_Backend_Dotnet` (si el repo está en la raíz)

3. **Configurar Variables de Entorno**
   - En el servicio Web, ir a Environment
   - Agregar:
     - `CONNECTION_STRING`: (copiar del servicio PostgreSQL)
     - `JWT_SECRET`: (generar un valor seguro)
     - `FRONTEND_URL`: (URL del frontend)
     - `ENABLE_SWAGGER`: `true` o `false`

4. **Aplicar Migraciones**
   - El código usa `EnsureCreated()` que crea las tablas automáticamente
   - Para migraciones más controladas, usar EF Core migrations:
     ```bash
     dotnet ef migrations add InitialCreate
     dotnet ef database update
     ```

## Configuración del Frontend

### Variables de Entorno

1. **NEXT_PUBLIC_API_URL**: URL del backend desplegado
   - Ejemplo: `https://innovart-backend.onrender.com/api`
   - Se configura en Render como variable de entorno

### Pasos para Desplegar

1. **Crear el servicio Web en Render**
   - Ir a Dashboard > New > Web Service
   - Conectar el repositorio de GitHub
   - Configurar:
     - **Environment**: `node`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Root Directory**: `InnovArt-Frontend` (si el repo está en la raíz)

2. **Configurar Variables de Entorno**
   - Agregar:
     - `NEXT_PUBLIC_API_URL`: URL del backend (ej: `https://innovart-backend.onrender.com/api`)

## Verificación Post-Despliegue

1. **Backend**
   - Verificar que Swagger esté accesible: `https://tu-backend.onrender.com/swagger`
   - Probar endpoint de health: `https://tu-backend.onrender.com/api/health`
   - Verificar logs en Render Dashboard

2. **Frontend**
   - Verificar que la página carga correctamente
   - Probar login/registro
   - Verificar que las llamadas al API funcionan

## Solución de Problemas

### Backend no inicia
- Verificar que `CONNECTION_STRING` esté configurada correctamente
- Revisar logs en Render Dashboard
- Verificar que el build command se ejecute correctamente

### CORS errors
- Verificar que `FRONTEND_URL` esté configurada correctamente en el backend
- Asegurarse de que la URL del frontend coincida exactamente (incluyendo protocolo)

### Base de datos
- Verificar que el servicio PostgreSQL esté activo
- Revisar que `CONNECTION_STRING` use la conexión interna de Render
- Verificar que las tablas se hayan creado (revisar logs)

## Notas Importantes

- El plan Free de Render puede tener limitaciones de tiempo de inactividad
- Para producción, considerar planes de pago para mejor rendimiento
- Mantener `JWT_SECRET` seguro y no compartirlo públicamente
- En producción, considerar deshabilitar Swagger (`ENABLE_SWAGGER=false`)

