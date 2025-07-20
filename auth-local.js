// Sistema de Autenticación SIMPLE para desarrollo local
// Este archivo reemplaza las funciones serverless cuando desarrollas localmente

class LocalAuthSystem {
    constructor() {
        // Configuración local (cambiar según necesites)
        this.config = {
            adminPassword: 'admin123',
            validAuthCodes: ['TB123456', 'TB789012', 'TB345678', 'TBDEMO01'],
            registeredUsers: this.getRegisteredUsers()
        };
        
        console.log('🔧 Sistema de Auth Local Iniciado');
        console.log('📝 Códigos válidos:', this.config.validAuthCodes);
        console.log('👤 Usuarios registrados:', Object.keys(this.config.registeredUsers));
    }
    
    getRegisteredUsers() {
        // Obtener de localStorage o usar datos demo
        const stored = localStorage.getItem('todobalon_registered_users');
        return stored ? JSON.parse(stored) : {
            'DEMO2025': {
                name: 'Usuario Demo',
                email: 'demo@todobalon.com',
                active: true,
                registeredAt: new Date().toISOString()
            }
        };
    }
    
    saveRegisteredUsers() {
        localStorage.setItem('todobalon_registered_users', JSON.stringify(this.config.registeredUsers));
    }
    
    async login(accessCode) {
        console.log('🔓 Intentando login con:', accessCode);
        
        // Simular delay de red
        await this.delay(500);
        
        const user = this.config.registeredUsers[accessCode];
        
        if (!user || !user.active) {
            throw new Error('Código de acceso inválido o inactivo');
        }
        
        console.log('✅ Login exitoso:', user.name);
        return {
            success: true,
            user: {
                name: user.name,
                email: user.email,
                registeredAt: user.registeredAt
            }
        };
    }
    
    async register(name, email, authCode) {
        console.log('📝 Intentando registro:', { name, email, authCode });
        
        // Simular delay de red
        await this.delay(800);
        
        if (!this.config.validAuthCodes.includes(authCode)) {
            throw new Error('Código de autorización inválido');
        }
        
        // Generar código de acceso único
        const accessCode = this.generateAccessCode();
        
        // Verificar que no exista
        while (this.config.registeredUsers[accessCode]) {
            accessCode = this.generateAccessCode();
        }
        
        // Registrar usuario
        this.config.registeredUsers[accessCode] = {
            name: name.trim(),
            email: email?.trim() || '',
            active: true,
            registeredAt: new Date().toISOString()
        };
        
        // Guardar
        this.saveRegisteredUsers();
        
        console.log('✅ Usuario registrado:', accessCode);
        
        return {
            success: true,
            accessCode: accessCode,
            user: {
                name: name.trim(),
                email: email?.trim() || ''
            }
        };
    }
    
    async generateCode(adminPassword) {
        console.log('🔧 Intentando generar código admin');
        
        // Simular delay de red
        await this.delay(300);
        
        if (adminPassword !== this.config.adminPassword) {
            throw new Error('Contraseña de administrador incorrecta');
        }
        
        const newCode = this.generateAuthCode();
        
        // Agregar a códigos válidos
        this.config.validAuthCodes.push(newCode);
        
        console.log('🆕 Nuevo código generado:', newCode);
        console.log('📋 Códigos válidos actuales:', this.config.validAuthCodes);
        
        return newCode;
    }
    
    generateAccessCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    generateAuthCode() {
        const prefix = 'TB';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = prefix;
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Métodos para debugging
    showStatus() {
        console.log('📊 Estado del Sistema:');
        console.log('🔑 Contraseña Admin:', this.config.adminPassword);
        console.log('🎫 Códigos Auth válidos:', this.config.validAuthCodes);
        console.log('👥 Usuarios registrados:', this.config.registeredUsers);
    }
    
    reset() {
        localStorage.removeItem('todobalon_registered_users');
        localStorage.removeItem('todobalon_session');
        console.log('🔄 Sistema reseteado');
        window.location.reload();
    }
}

// Reemplazar sistema de auth si estamos en localhost
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🏠 Modo desarrollo local detectado');
    
    const localAuth = new LocalAuthSystem();
    
    // Reemplazar métodos del AuthSystem original
    if (window.auth) {
        window.auth.makeRequest = async (endpoint, data) => {
            switch (endpoint) {
                case 'auth-login':
                    return localAuth.login(data.accessCode);
                case 'auth-register':
                    return localAuth.register(data.name, data.email, data.authCode);
                case 'auth-generate':
                    return { success: true, accessCode: await localAuth.generateCode(data.adminPassword) };
                default:
                    throw new Error('Endpoint no encontrado');
            }
        };
    }
    
    // Funciones de debugging para la consola
    window.authDebug = {
        status: () => localAuth.showStatus(),
        reset: () => localAuth.reset(),
        addUser: (accessCode, name) => {
            localAuth.config.registeredUsers[accessCode] = {
                name: name,
                email: '',
                active: true,
                registeredAt: new Date().toISOString()
            };
            localAuth.saveRegisteredUsers();
            console.log('✅ Usuario agregado:', accessCode, name);
        },
        addAuthCode: (code) => {
            localAuth.config.validAuthCodes.push(code);
            console.log('✅ Código de auth agregado:', code);
        }
    };
    
    console.log('🛠️ Funciones de debug disponibles:');
    console.log('- authDebug.status() // Ver estado');
    console.log('- authDebug.reset() // Resetear todo');
    console.log('- authDebug.addUser("CODIGO123", "Nombre") // Agregar usuario');
    console.log('- authDebug.addAuthCode("TBNUEVO1") // Agregar código auth');
}

// Mostrar datos de prueba en la consola
if (window.location.pathname.includes('auth.html')) {
    console.log('🎮 DATOS DE PRUEBA:');
    console.log('🔐 Contraseña Admin: admin123');
    console.log('🎫 Códigos de autorización válidos: TB123456, TB789012, TB345678, TBDEMO01');
    console.log('🔑 Usuario demo: DEMO2025');
}
