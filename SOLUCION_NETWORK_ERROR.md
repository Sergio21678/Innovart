# Solución: Network Error - Frontend no puede conectar con Backend

## 🔴 Problema
El frontend muestra "AxiosError: Network Error" o "Error al cargar artesanos. Verifica que el backend esté corriendo."

## ✅ Solución Paso a Paso

### 1. Verificar que el Backend esté corriendo

Abre una terminal y ejecuta:

```powershell
cd InnovArt_Backend_Dotnet
dotnet run --urls "http://localhost:5000"
```

**Deberías ver:**
```
Now listening on: http://localhost:5000
```

Si ves esto, el backend está corriendo correctamente.

### 2. Verificar que el Backend responda

Abre tu navegador y ve a:
- **Swagger UI:** `http://localhost:5000/swagger`
- **Health Check:** `http://localhost:5000/api/health`

Si puedes ver Swagger o el health check responde, el backend está funcionando.

### 3. Verificar la configuración del Frontend

Asegúrate de que el archivo `.env.local` existe en `InnovArt-Frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Si no existe, créalo:**
```powershell
cd InnovArt-Frontend
echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > .env.local
```

### 4. Reiniciar el Frontend

Después de crear/modificar `.env.local`, **reinicia el servidor de desarrollo:**

```powershell
# Presiona Ctrl+C para detener el servidor
# Luego inicia de nuevo:
npm run dev
```

### 5. Verificar en el Navegador

1. Abre DevTools (F12)
2. Ve a la pestaña **Network**
3. Intenta cargar una página que haga llamadas a la API
4. Verifica que las requests vayan a `http://localhost:5000/api/...`

## 🔍 Verificaciones Adicionales

### Verificar que no haya conflictos de puerto

Si el puerto 5000 está ocupado, puedes cambiar el puerto del backend:

```powershell
dotnet run --urls "http://localhost:5001"
```

Y actualiza `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Verificar CORS

El backend está configurado para permitir todas las conexiones en desarrollo (cuando no hay `FRONTEND_URL` configurado). Si aún hay problemas de CORS:

1. Verifica que el backend esté usando `AllowAll` CORS policy
2. Revisa la consola del navegador para ver errores específicos de CORS

### Verificar Firewall/Antivirus

A veces el firewall o antivirus bloquea las conexiones localhost. Verifica que:
- Windows Firewall permita conexiones en el puerto 5000
- Tu antivirus no esté bloqueando Node.js o .NET

## 📝 Checklist Rápido

- [ ] Backend corriendo en `http://localhost:5000`
- [ ] Puedo acceder a `http://localhost:5000/swagger`
- [ ] Existe archivo `.env.local` en `InnovArt-Frontend/`
- [ ] `.env.local` contiene `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
- [ ] Frontend reiniciado después de crear/modificar `.env.local`
- [ ] No hay errores en la consola del navegador (F12)
- [ ] Las requests en Network tab van a `http://localhost:5000/api/...`

## 🚨 Si el problema persiste

1. **Verifica los logs del backend** - Deberías ver las requests llegando
2. **Verifica la consola del navegador** - Busca errores específicos
3. **Prueba hacer una request manual:**
   ```javascript
   // En la consola del navegador (F12)
   fetch('http://localhost:5000/api/health')
     .then(r => r.json())
     .then(console.log)
   ```

Si esto funciona, el problema está en la configuración del frontend.
Si no funciona, el problema está en el backend o la red.

## 💡 Comandos Útiles

### Ver qué está usando el puerto 5000:
```powershell
netstat -ano | findstr :5000
```

### Detener todos los procesos dotnet:
```powershell
Get-Process dotnet | Stop-Process -Force
```

### Verificar que el backend esté escuchando:
```powershell
Test-NetConnection -ComputerName localhost -Port 5000
```

