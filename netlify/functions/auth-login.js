// Función serverless para login
exports.handler = async (event, context) => {
    // Solo permitir POST
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
        const { accessCode } = JSON.parse(event.body);

        // Validar código de acceso
        if (!accessCode) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: JSON.stringify({ 
                    success: false, 
                    message: 'Código de acceso requerido' 
                })
            };
        }

        // Obtener usuarios registrados desde variables de entorno
        // En Netlify puedes configurar esto en Site Settings > Environment Variables
        const registeredUsers = JSON.parse(process.env.REGISTERED_USERS || '{}');

        // Verificar si el código existe y está activo
        const user = registeredUsers[accessCode];
        
        if (!user || !user.active) {
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: JSON.stringify({ 
                    success: false, 
                    message: 'Código de acceso inválido o inactivo' 
                })
            };
        }

        // Login exitoso
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({
                success: true,
                user: {
                    name: user.name,
                    email: user.email,
                    registeredAt: user.registeredAt
                }
            })
        };

    } catch (error) {
        console.error('Error en auth-login:', error);
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
