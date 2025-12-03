# Correcciones Aplicadas

## Problemas Corregidos

### 1. Error "Error al cargar productos" en todas las páginas
**Causa:** El frontend estaba esperando campos con nombres en español (`titulo`, `descripcion`, `precio`) pero el backend devuelve campos en inglés (`Title`, `Description`, `Price`).

**Solución:** 
- Agregado mapeo de campos en todas las páginas que consumen productos
- Mejorado el manejo de errores para mostrar mensajes más descriptivos
- Agregada verificación de que el backend esté corriendo

### 2. Footer duplicado
**Causa:** El footer estaba definido en múltiples páginas individuales.

**Solución:**
- Movido el footer al `layout.tsx` principal para que aparezca en todas las páginas
- Eliminados los footers duplicados de `page.tsx` y `contacto/page.tsx`

### 3. Creación de productos
**Causa:** El frontend enviaba campos incorrectos al backend.

**Solución:**
- Corregido el formato de datos enviados al crear productos
- Ahora envía: `{ title, description, price, usuarioId }` en lugar de FormData con campos incorrectos

## Archivos Modificados

1. `src/app/productos/page.tsx` - Mapeo de campos y corrección de creación
2. `src/app/galeria/page.tsx` - Mapeo de campos
3. `src/app/artesanos/page.tsx` - Mapeo de campos y manejo de roles
4. `src/app/productos/[id]/page.tsx` - Mapeo de campos en detalle
5. `src/app/layout.tsx` - Footer agregado
6. `src/app/page.tsx` - Footer duplicado eliminado
7. `src/app/contacto/page.tsx` - Footer duplicado eliminado

## Cómo Probar

1. **Asegúrate de que el backend esté corriendo:**
   ```powershell
   cd InnovArt_Backend_Dotnet
   dotnet run
   ```

2. **Inicia el frontend:**
   ```powershell
   cd InnovArt-Frontend
   npm run dev
   ```

3. **Verifica:**
   - Las páginas cargan sin el error "Error al cargar productos"
   - El footer aparece una sola vez al final de cada página
   - Puedes crear productos correctamente
   - Los productos se muestran correctamente

## Notas Importantes

- El backend debe estar corriendo en `http://localhost:5000`
- El frontend debe tener configurado `NEXT_PUBLIC_API_URL=http://localhost:5000/api` en `.env.local`
- Si aún ves errores, verifica la consola del navegador (F12) para más detalles

