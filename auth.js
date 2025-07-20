function switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    
    if (tab === 'user') {
        document.querySelector('.auth-tab:first-child').classList.add('active');
        document.getElementById('userTab').classList.add('active');
    } else {
        document.querySelector('.auth-tab:last-child').classList.add('active');
        document.getElementById('adminTab').classList.add('active');
    }
    
    document.getElementById('alertContainer').innerHTML = '';
}

async function userLogin(event) {
    event.preventDefault();
    const code = document.getElementById('userCode').value;
    
    if (!code) return;
    
    try {
        const response = await fetch('https://todobalon-backend.onrender.com/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessCode: code })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            localStorage.setItem('todobalon_token', data.token);
            localStorage.setItem('todobalon_user', JSON.stringify(data.user));
            showAlert('success', ' Acceso autorizado. Redirigiendo...');
            setTimeout(() => window.location.href = 'index.html', 1500);
        } else {
            showAlert('error', ' ' + data.message);
        }
    } catch (error) {
        showAlert('error', ' Error de conexión. Intenta nuevamente.');
    }
}

async function adminLogin(event) {
    event.preventDefault();
    const password = document.getElementById('adminPassword').value;
    
    if (!password) return;
    
    try {
        const response = await fetch('https://todobalon-backend.onrender.com/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessCode: password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success && data.user.role === 'admin') {
            localStorage.setItem('todobalon_token', data.token);
            localStorage.setItem('todobalon_user', JSON.stringify(data.user));
            showAlert('success', ' Bienvenido Administrador. Redirigiendo...');
            setTimeout(() => window.location.href = 'index.html', 1500);
        } else {
            showAlert('error', ' Contraseña de administrador incorrecta.');
        }
    } catch (error) {
        showAlert('error', ' Error de conexión. Intenta nuevamente.');
    }
}

function showAlert(type, message) {
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    document.getElementById('alertContainer').innerHTML = 
        '<div class="alert ' + alertClass + '">' + message + '</div>';
}
