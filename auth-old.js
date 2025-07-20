// Sistema de Autenticación TodoBalon
class AuthSystem {
    constructor() {
        this.apiUrl = this.getApiUrl();
        this.init();
    }
    
    getApiUrl() {
        // Detectar si estamos en desarrollo local o producción
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            console.log('🏠 Modo desarrollo local - usando auth-local.js');
            return 'local'; // Marcador para usar sistema local
        } else {
            console.log('🌐 Modo producción - usando Netlify Functions');
            return `${window.location.origin}/.netlify/functions`;
        }
    }
    
    init() {
        // Verificar si ya está autenticado
        const session = localStorage.getItem('todobalon_session');
        if (session && this.isValidSession(session)) {
            this.redirectToApp();
        }
    }
    
    isValidSession(session) {
        try {
            const data = JSON.parse(session);
            const now = new Date().getTime();
            return data.expires > now;
        } catch {
            return false;
        }
    }
    
    redirectToApp() {
        window.location.href = 'index.html';
    }
    
    async makeRequest(endpoint, data) {
        // Si estamos en modo local, intentar usar el sistema local primero
        if (this.apiUrl === 'local' && window.localAuth) {
            console.log('🏠 Usando sistema local para:', endpoint);
            return window.localAuth.handleRequest(endpoint, data);
        }
        
        try {
            const response = await fetch(`${this.apiUrl}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Error en el servidor');
            }
            
            return result;
        } catch (error) {
            console.error('Error en la petición:', error);
            throw new Error('Error de conexión. Intente nuevamente.');
        }
    }
    
    async login(accessCode) {
        const result = await this.makeRequest('auth-login', { accessCode });
        
        if (result.success) {
            // Guardar sesión
            const sessionData = {
                user: result.user,
                accessCode: accessCode,
                expires: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 horas
            };
            
            localStorage.setItem('todobalon_session', JSON.stringify(sessionData));
            this.redirectToApp();
        } else {
            throw new Error(result.message || 'Código de acceso inválido');
        }
    }
    
    async register(name, email, authCode) {
        const result = await this.makeRequest('auth-register', {
            name,
            email,
            authCode
        });
        
        if (result.success) {
            return result;
        } else {
            throw new Error(result.message || 'Error en el registro');
        }
    }
    
    async generateCode(adminPassword) {
        const result = await this.makeRequest('auth-generate', { adminPassword });
        
        if (result.success) {
            return result.accessCode;
        } else {
            throw new Error(result.message || 'Error al generar código');
        }
    }
    
    logout() {
        localStorage.removeItem('todobalon_session');
        window.location.reload();
    }
}

// Instancia global
const auth = new AuthSystem();

// Funciones de la interfaz
function switchTab(tab) {
    // Actualizar pestañas
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    document.querySelector(`[onclick="switchTab('${tab}')"]`).classList.add('active');
    document.getElementById(`${tab}Form`).classList.add('active');
    
    // Limpiar mensajes
    hideMessages();
}

function showMessage(message, type = 'error') {
    hideMessages();
    
    const element = document.getElementById(`${type}Message`);
    element.textContent = message;
    element.style.display = 'block';
    
    // Auto-hide después de 5 segundos
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

function hideMessages() {
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
}

function setButtonLoading(buttonId, loading = true) {
    const button = document.getElementById(buttonId);
    const originalText = button.textContent;
    
    if (loading) {
        button.disabled = true;
        button.innerHTML = '<span class="loading"></span>Procesando...';
        button.dataset.originalText = originalText;
    } else {
        button.disabled = false;
        button.textContent = button.dataset.originalText || originalText;
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const accessCode = document.getElementById('loginCode').value.trim();
    
    if (!accessCode) {
        showMessage('Por favor ingrese su código de acceso');
        return;
    }
    
    setButtonLoading('loginButton', true);
    
    try {
        await auth.login(accessCode);
    } catch (error) {
        showMessage(error.message);
        setButtonLoading('loginButton', false);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const authCode = document.getElementById('registerCode').value.trim();
    
    if (!name || !authCode) {
        showMessage('Por favor complete todos los campos requeridos');
        return;
    }
    
    setButtonLoading('registerButton', true);
    
    try {
        const result = await auth.register(name, email, authCode);
        showMessage('¡Registro exitoso! Su código de acceso es: ' + result.accessCode, 'success');
        
        // Limpiar formulario
        document.getElementById('registerName').value = '';
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerCode').value = '';
        
        // Cambiar a tab de login después de 3 segundos
        setTimeout(() => {
            switchTab('login');
            document.getElementById('loginCode').value = result.accessCode;
        }, 3000);
        
    } catch (error) {
        showMessage(error.message);
    }
    
    setButtonLoading('registerButton', false);
}

async function showAdminPanel() {
    const password = prompt('Ingrese la contraseña de administrador:');
    
    if (!password) return;
    
    try {
        const accessCode = await auth.generateCode(password);
        
        // Mostrar código generado
        const codeDisplay = `
            <div style="background: rgba(39, 174, 96, 0.2); padding: 20px; border-radius: 10px; margin-top: 20px;">
                <h3 style="color: #27ae60; margin: 0 0 10px 0;">✅ Código Generado:</h3>
                <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; font-family: monospace; font-size: 18px; color: #ffffff; text-align: center; letter-spacing: 2px;">
                    ${accessCode}
                </div>
                <p style="color: rgba(255,255,255,0.7); margin: 10px 0 0 0; font-size: 12px;">
                    Comparte este código con los usuarios autorizados
                </p>
                <button onclick="copyToClipboard('${accessCode}')" style="width: 100%; margin-top: 10px; padding: 8px; background: rgba(52, 152, 219, 0.8); border: none; border-radius: 6px; color: white; cursor: pointer;">
                    📋 Copiar Código
                </button>
            </div>
        `;
        
        document.querySelector('.auth-box').insertAdjacentHTML('beforeend', codeDisplay);
        
    } catch (error) {
        showMessage('Error: ' + error.message);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showMessage('Código copiado al portapapeles', 'success');
    }).catch(() => {
        // Fallback para navegadores que no soporten clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showMessage('Código copiado al portapapeles', 'success');
    });
}

// Verificación de sesión para el index.html
function checkAuth() {
    const session = localStorage.getItem('todobalon_session');
    
    if (!session || !auth.isValidSession(session)) {
        window.location.href = 'auth.html';
        return false;
    }
    
    return true;
}

// Auto-logout cuando expire la sesión
function autoLogoutCheck() {
    setInterval(() => {
        const session = localStorage.getItem('todobalon_session');
        if (session && !auth.isValidSession(session)) {
            auth.logout();
        }
    }, 60000); // Verificar cada minuto
}

// Iniciar verificación automática si estamos en index.html
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', () => {
        if (checkAuth()) {
            autoLogoutCheck();
            
            // Agregar botón de logout al header
            const header = document.querySelector('header');
            if (header) {
                const session = JSON.parse(localStorage.getItem('todobalon_session'));
                const logoutBtn = document.createElement('button');
                logoutBtn.innerHTML = '🚪 Salir';
                logoutBtn.style.cssText = 'background: rgba(231, 76, 60, 0.8); border: none; padding: 8px 15px; border-radius: 6px; color: white; cursor: pointer; font-size: 12px;';
                logoutBtn.onclick = () => {
                    if (confirm('¿Está seguro que desea cerrar sesión?')) {
                        auth.logout();
                    }
                };
                header.appendChild(logoutBtn);
                
                // Mostrar usuario actual
                if (session.user) {
                    const userInfo = document.createElement('span');
                    userInfo.textContent = `👤 ${session.user.name}`;
                    userInfo.style.cssText = 'color: rgba(255,255,255,0.8); font-size: 12px; margin-right: 10px;';
                    header.appendChild(userInfo);
                }
            }
        }
    });
}
