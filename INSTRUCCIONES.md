# 🚀 INSTRUCCIONES RÁPIDAS - TodoBalon Auth

## 🧪 **PRUEBA LOCAL (Desarrollo):**

### **1. Abrir la página:**
```
Abrir: auth.html en tu navegador
```

### **2. Datos de prueba (ya configurados):**
- **🔐 Contraseña Admin:** `admin123`
- **🎫 Códigos de autorización:** `TB123456`, `TB789012`, `TB345678`, `TBDEMO01`  
- **🔑 Usuario demo:** `DEMO2025` (ya registrado)

### **3. Probar como ADMIN:**
1. Click en **"Panel Admin"**
2. Contraseña: `admin123`
3. Se genera un nuevo código (ej: `TB7X9K2L`)

### **4. Probar REGISTRO:**
1. Click en pestaña **"Registrarse"**
2. Nombre: `Tu Nombre`
3. Código de autorización: `TB123456` (o cualquiera de la lista)
4. Te da un código de acceso único

### **5. Probar LOGIN:**
1. Pestaña **"Iniciar Sesión"**
2. Código de acceso: `DEMO2025` (demo) o el que recibiste
3. Te lleva a index.html

---

## 🌐 **CONFIGURACIÓN NETLIFY (Producción):**

### **1. En tu dashboard de Netlify:**
1. Sitio → **Site Settings** → **Environment variables**
2. **Add variable** (3 veces):

### **2. Variables requeridas:**

**Variable 1:**
- Key: `ADMIN_PASSWORD`  
- Value: `MiPasswordSeguro123!`

**Variable 2:**
- Key: `VALID_AUTH_CODES`
- Value: `TB123456,TB789012,TB345678,TBABCDEF`

**Variable 3:**
- Key: `REGISTERED_USERS`
- Value: `{}`

### **3. Deploy y usar:**
- Deploy tu sitio
- Ve a `tu-sitio.netlify.app/auth.html`
- Usa la contraseña que configuraste

---

## 🎮 **COMANDOS DE DEBUG (Solo local):**

Abre la consola del navegador (F12) y escribe:

```javascript
// Ver estado del sistema
authDebug.status()

// Resetear todo
authDebug.reset()

// Agregar usuario manual
authDebug.addUser("CODIGO123", "Nombre Usuario")

// Agregar código de autorización
authDebug.addAuthCode("TBNUEVO1")
```

---

## ✅ **FLUJO COMPLETO:**

1. **Admin:** Genera código (`TB123456`) → Lo comparte
2. **Usuario:** Se registra con `TB123456` → Recibe `XYZ789` 
3. **Usuario:** Hace login con `XYZ789` → Accede a canales
4. **Sesión:** Válida por 24 horas automáticamente

¡Listo! 🎉
