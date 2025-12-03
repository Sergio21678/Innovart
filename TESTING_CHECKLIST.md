# ✅ Checklist de Pruebas - InnovArt

## 🚀 Inicio Rápido

### Backend
```powershell
cd InnovArt_Backend_Dotnet
dotnet restore
dotnet run
```
✅ Verificar: `http://localhost:5000/swagger` se abre

### Frontend
```powershell
cd InnovArt-Frontend
npm install
# Crear .env.local con: NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev
```
✅ Verificar: `http://localhost:3000` se abre

---

## 📋 Pruebas Backend

### 1. Health Check
- [ ] GET `http://localhost:5000/api/health`
- [ ] Respuesta: `{"status":"healthy"}`

### 2. Swagger UI
- [ ] Abrir `http://localhost:5000/swagger`
- [ ] Ver todos los endpoints listados
- [ ] Probar "Try it out" en cualquier endpoint

### 3. Registro de Usuario
- [ ] POST `/api/auth/register`
- [ ] Body: `{"email":"test@test.com","password":"test123","name":"Test User"}`
- [ ] Respuesta: `201 Created` con datos del usuario

### 4. Login
- [ ] POST `/api/auth/login`
- [ ] Body: `{"email":"test@test.com","password":"test123"}`
- [ ] Respuesta: `200 OK` con `token` y `user`
- [ ] **Copiar el token para siguientes pruebas**

### 5. Obtener Usuario Actual (Autenticado)
- [ ] En Swagger, click en "Authorize" (🔒 arriba)
- [ ] Ingresar: `Bearer {token_copiado}`
- [ ] GET `/api/users/me`
- [ ] Respuesta: `200 OK` con datos del usuario

### 6. Listar Productos
- [ ] GET `/api/products`
- [ ] Respuesta: `200 OK` con array de productos

### 7. Crear Producto (Autenticado)
- [ ] POST `/api/products`
- [ ] Body: `{"title":"Test Product","description":"Test","price":100,"usuarioId":1}`
- [ ] Respuesta: `201 Created` con producto creado

### 8. Validaciones
- [ ] Intentar crear producto sin título → `400 Bad Request`
- [ ] Intentar login con credenciales incorrectas → `401 Unauthorized`
- [ ] Intentar acceder a endpoint protegido sin token → `401 Unauthorized`

---

## 📋 Pruebas Frontend

### 1. Carga Inicial
- [ ] Abrir `http://localhost:3000`
- [ ] Página carga sin errores
- [ ] Abrir DevTools (F12) → Console
- [ ] **No debe haber errores en rojo**

### 2. Verificar Configuración API
- [ ] En DevTools Console, ejecutar:
  ```javascript
  // Verificar que API_URL está configurado
  fetch('/api/health').then(r => r.json()).then(console.log)
  ```
- [ ] O verificar en Network tab que las requests van a `http://localhost:5000/api`

### 3. Registro
- [ ] Ir a `/usuarios` o `/login`
- [ ] Completar formulario de registro
- [ ] Click en "Crear cuenta"
- [ ] Verificar mensaje de éxito
- [ ] Verificar redirección a login

### 4. Login
- [ ] Ir a `/login`
- [ ] Ingresar email y contraseña del usuario creado
- [ ] Click en "Iniciar sesión"
- [ ] Verificar:
  - [ ] Redirección a `/perfil`
  - [ ] En DevTools → Application → Local Storage
  - [ ] Existe `token` y `user`
  - [ ] El valor de `user` es un JSON válido

### 5. Navegación Autenticada
- [ ] Después de login, probar:
  - [ ] `/perfil` - Muestra perfil del usuario
  - [ ] `/productos` - Lista productos
  - [ ] `/artesano-dashboard/productos` - Si eres artesano
  - [ ] `/admin/dashboard` - Si eres admin

### 6. Llamadas a la API
- [ ] Abrir DevTools → Network tab
- [ ] Filtrar por "Fetch/XHR"
- [ ] Navegar por la aplicación
- [ ] Verificar que:
  - [ ] Las requests van a `http://localhost:5000/api/...`
  - [ ] Las requests autenticadas tienen header `Authorization: Bearer {token}`
  - [ ] Las respuestas son exitosas (200, 201, etc.)

### 7. Funcionalidades Específicas
- [ ] **Productos:**
  - [ ] Ver lista de productos en `/productos`
  - [ ] Ver detalle de producto en `/productos/[id]`
  
- [ ] **Perfil:**
  - [ ] Ver perfil en `/perfil`
  - [ ] Editar perfil en `/perfil/editar`
  
- [ ] **Dashboard Artesano:**
  - [ ] Ver dashboard en `/artesano-dashboard/dashboard`
  - [ ] Gestionar productos en `/artesano-dashboard/productos`
  - [ ] Ver pedidos en `/artesano-dashboard/pedidos`

---

## 🔗 Pruebas de Integración

### 1. Flujo Completo de Registro y Login
- [ ] Registrar nuevo usuario desde frontend
- [ ] Hacer login con ese usuario
- [ ] Verificar que el token funciona
- [ ] Navegar a páginas protegidas

### 2. Crear y Listar Productos
- [ ] Login como artesano
- [ ] Crear producto desde `/artesano-dashboard/productos`
- [ ] Verificar que aparece en `/productos`
- [ ] Ver detalle del producto

### 3. Autenticación Persistente
- [ ] Hacer login
- [ ] Cerrar y abrir el navegador
- [ ] Verificar que sigue autenticado (si el token no expiró)
- [ ] O verificar que redirige a login si el token expiró

### 4. Manejo de Errores
- [ ] Intentar login con credenciales incorrectas
- [ ] Verificar que muestra mensaje de error
- [ ] Intentar acceder a página protegida sin login
- [ ] Verificar que redirige a login

---

## 🐛 Verificación de Errores Comunes

### Backend
- [ ] No hay errores en la consola al iniciar
- [ ] Swagger carga correctamente
- [ ] Los endpoints responden (no 500 Internal Server Error)
- [ ] Los logs muestran información útil

### Frontend
- [ ] No hay errores en Console (F12)
- [ ] No hay errores de CORS
- [ ] No hay errores 404 (páginas no encontradas)
- [ ] Las imágenes y recursos cargan correctamente

### Integración
- [ ] No hay errores de CORS en Network tab
- [ ] Las requests tienen el formato correcto
- [ ] Las respuestas se procesan correctamente
- [ ] El token se envía en todas las requests autenticadas

---

## ✅ Criterios de Éxito

### Todo funciona correctamente si:
1. ✅ Backend inicia sin errores
2. ✅ Frontend carga sin errores
3. ✅ Puedes registrar un usuario
4. ✅ Puedes hacer login
5. ✅ Puedes acceder a páginas protegidas
6. ✅ Puedes crear/listar productos
7. ✅ No hay errores en consola del navegador
8. ✅ Las llamadas a la API funcionan correctamente
9. ✅ El token se guarda y se envía correctamente
10. ✅ La navegación funciona sin problemas

---

## 📝 Notas

- Si algo no funciona, revisar los logs en:
  - **Backend:** Consola donde ejecutaste `dotnet run`
  - **Frontend:** DevTools Console (F12)
  - **Network:** DevTools Network tab para ver requests/responses

- Para más detalles, ver `InnovArt_Backend_Dotnet/README_TESTING.md`

