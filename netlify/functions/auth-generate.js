// Función serverless para generar códigos de autorización (solo admin)
exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ error: 'Método no permitido' })
        };
    }

    try {
        const { adminPassword } = JSON.parse(event.body);

        // Verificar contraseña de admin
        const correctPassword = process.env.ADMIN_PASSWORD || 'admin123';
        
        if (adminPassword !== correctPassword) {
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: JSON.stringify({ 
                    success: false, 
                    message: 'Contraseña de administrador incorrecta' 
                })
            };
        }

        // Generar nuevo código de autorización
        const authCode = generateAuthCode();

        // Aquí guardarías el código en la base de datos o variable de entorno
        // Por ahora lo retornamos para que el admin lo use manualmente
        
        console.log('Código de autorización generado:', authCode);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({
                success: true,
                accessCode: authCode,
                message: 'Código de autorización generado exitosamente',
                instructions: 'Comparte este código con los usuarios que quieras autorizar'
            })
        };

    } catch (error) {
        console.error('Error en auth-generate:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ 
                success: false, 
                message: 'Error interno del servidor' 
            })
        };
    }
};

function generateAuthCode() {
    const prefix = 'TB'; // TodoBalon
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = prefix;
    
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
}
