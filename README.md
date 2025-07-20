# TodoBalon Frontend

Frontend para sistema de streaming TodoBalon.

## Despliegue en Render

1. **Conecta tu repositorio GitHub a Render**
2. **Tipo de servicio:** Static Site
3. **Build Command:** (vacío)
4. **Publish Directory:** `.` (punto)
5. **Auto-Deploy:** Yes

## URL del Backend

El frontend está configurado para usar:
`https://todobalon-backend.onrender.com/api`

## Credenciales de Admin

- Contraseña: `admin123`

## Flujo de Usuario

1. **Admin:** Ingresa `admin123` → Accede a generar códigos
2. **Usuario:** Ingresa código generado → Accede a canales
3. **Simple y directo**

## Archivos principales

- `auth-final.html` - Página de login única
- `index.html` - Página de canales con panel admin integrado
- `canal.css` - Estilos dark mode
- `canal.js` - Funcionalidad de canales
