# Guía de Pruebas - InnovArt

## Pruebas Locales

### 1. Probar el Backend (.NET 9)

#### Requisitos previos
- .NET 9 SDK instalado
- SQLite (incluido) o PostgreSQL configurado

#### Pasos:

1. **Navegar al directorio del backend:**
   ```powershell
   cd InnovArt_Backend_Dotnet
   ```

2. **Restaurar dependencias:**
   ```powershell
   dotnet restore
   ```

3. **Ejecutar el backend:**
   ```powershell
   dotnet run
   ```

4. **Verificar que el servidor está corriendo:**
   - Deberías ver: `Now listening on: http://localhost:5000`
   - Abre en el navegador: `http://localhost:5000/swagger`
   - Deberías ver la interfaz de Swagger con todos los endpoints

#### Probar endpoints en Swagger:

1. **Health Check:**
   - GET `/api/health`
   - Debería retornar: `{ "status": "healthy" }`

2. **Registro de usuario:**
   - POST `/api/auth/register`
   - Body:
     ```json
     {
       "email": "test@example.com",
       "password": "password123",
       "name": "Usuario Test"
     }
     ```
   - Debería retornar: `201 Created` con los datos del usuario

3. **Login:**
   - POST `/api/auth/login`
   - Body:
     ```json
     {
       "email": "test@example.com",
       "password": "password123"
     }
     ```
   - Debería retornar: `200 OK` con `token` y `user`
   - **IMPORTANTE:** Copia el `token` para usarlo en otros endpoints

4. **Obtener usuario actual (requiere autenticación):**
   - GET `/api/users/me`
   - Click en "Authorize" (arriba a la derecha)
   - Ingresa: `Bearer {tu_token_aqui}`
   - Debería retornar: `200 OK` con los datos del usuario

5. **Listar productos:**
   - GET `/api/products`
   - Debería retornar: `200 OK` con array de productos

6. **Crear producto (requiere autenticación):**
   - POST `/api/products`
   - Body:
     ```json
     {
       "title": "Producto Test",
       "description": "Descripción del producto",
       "price": 100.50,
       "usuarioId": 1
     }
     ```
   - Debería retornar: `201 Created` con el producto creado

### 2. Probar el Frontend (Next.js)

#### Requisitos previos
- Node.js 18+ instalado
- Backend corriendo en `http://localhost:5000`

#### Pasos:

1. **Navegar al directorio del frontend:**
   ```powershell
   cd InnovArt-Frontend
   ```

2. **Instalar dependencias:**
   ```powershell
   npm install
   ```

3. **Crear archivo `.env.local`:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Ejecutar el frontend:**
   ```powershell
   npm run dev
   ```

5. **Abrir en el navegador:**
   - `http://localhost:3000`

#### Probar funcionalidades del frontend:

1. **Página principal:**
   - Debería cargar sin errores
   - Verificar que los productos destacados se muestran (si hay datos)

2. **Registro:**
   - Ir a `/usuarios` o `/login`
   - Completar el formulario de registro
   - Verificar que se crea el usuario y redirige a login

3. **Login:**
   - Ir a `/login`
   - Ingresar email y contraseña
   - Verificar que:
     - Se guarda el token en localStorage
     - Se guarda el usuario en localStorage
     - Redirige al perfil

4. **Navegación autenticada:**
   - Después de login, probar:
     - `/perfil` - Ver perfil del usuario
     - `/productos` - Listar productos
     - `/artesano-dashboard/productos` - Si eres artesano

5. **Consola del navegador:**
   - Abrir DevTools (F12)
   - Verificar que no hay errores en la consola
   - Verificar que las llamadas a la API se hacen correctamente en la pestaña Network

### 3. Verificar Conexión Backend-Frontend

#### En la consola del navegador (F12):

1. **Verificar que API_URL está configurado:**
   ```javascript
   // En la consola del navegador
   console.log(process.env.NEXT_PUBLIC_API_URL)
   // Debería mostrar: http://localhost:5000/api
   ```

2. **Verificar llamadas a la API:**
   - Pestaña Network en DevTools
   - Filtrar por "Fetch/XHR"
   - Realizar una acción (ej: login)
   - Verificar que las requests van a `http://localhost:5000/api/...`
   - Verificar que las respuestas son exitosas (200, 201, etc.)

3. **Verificar autenticación:**
   - Después de login, verificar que el token se envía en headers:
   - En Network, ver una request autenticada
   - Verificar que tiene header: `Authorization: Bearer {token}`

## Checklist de Pruebas

### Backend ✅
- [ ] Servidor inicia sin errores
- [ ] Swagger está accesible
- [ ] Health endpoint responde
- [ ] Registro de usuario funciona
- [ ] Login genera token JWT
- [ ] Endpoints protegidos requieren autenticación
- [ ] CRUD de productos funciona
- [ ] Validaciones funcionan (campos requeridos, etc.)
- [ ] Manejo de errores retorna mensajes apropiados

### Frontend ✅
- [ ] Aplicación carga sin errores
- [ ] No hay errores en consola del navegador
- [ ] API_URL está configurado correctamente
- [ ] Registro funciona y redirige
- [ ] Login funciona y guarda token
- [ ] Navegación autenticada funciona
- [ ] Las llamadas a la API se hacen correctamente
- [ ] Los datos se muestran correctamente
- [ ] El token se envía en requests autenticadas

### Integración ✅
- [ ] Frontend puede comunicarse con backend
- [ ] CORS está configurado correctamente
- [ ] Autenticación funciona end-to-end
- [ ] Los datos se persisten correctamente
- [ ] No hay errores de CORS en consola

## Solución de Problemas Comunes

### Backend no inicia
- Verificar que el puerto 5000 no esté en uso
- Verificar que .NET 9 SDK esté instalado: `dotnet --version`
- Revisar logs de error en la consola

### Frontend no se conecta al backend
- Verificar que el backend esté corriendo
- Verificar que `.env.local` tenga `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
- Reiniciar el servidor de desarrollo: `npm run dev`
- Verificar en Network tab que las requests van a la URL correcta

### Errores de CORS
- Verificar que `FRONTEND_URL` en backend incluya `http://localhost:3000`
- O verificar que `AllowAll` CORS policy esté activa en desarrollo

### Token no se envía
- Verificar que el token se guarda en localStorage después del login
- Verificar que las requests incluyen el header `Authorization: Bearer {token}`
- Verificar en Network tab que el header está presente

### 401 Unauthorized
- Verificar que el token sea válido (no expirado)
- Verificar que el token se envía correctamente
- Intentar hacer login nuevamente para obtener un token fresco

## Pruebas con Postman/Thunder Client

Si prefieres usar herramientas externas:

1. **Importar colección:**
   - Crear requests para cada endpoint
   - Configurar variable `base_url` = `http://localhost:5000/api`

2. **Autenticación:**
   - Hacer login primero
   - Copiar el token
   - Configurar en todas las requests:
     - Header: `Authorization`
     - Value: `Bearer {token}`

3. **Probar endpoints:**
   - GET `/api/products`
   - POST `/api/products` (con body)
   - GET `/api/users/me` (con auth)
   - etc.

## Próximos Pasos

Una vez que todo funcione localmente:
1. Revisar `README_DEPLOYMENT.md` para desplegar en Render
2. Probar en el ambiente de producción
3. Verificar que las variables de entorno estén configuradas correctamente

