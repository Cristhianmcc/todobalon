// Función serverless para registro
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
        const { name, email, authCode } = JSON.parse(event.body);

        // Validar datos requeridos
        if (!name || !authCode) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: JSON.stringify({ 
                    success: false, 
                    message: 'Nombre y código de autorización requeridos' 
                })
            };
        }

        // Verificar código de autorización del admin
        const validAuthCodes = (process.env.VALID_AUTH_CODES || '').split(',');
        
        if (!validAuthCodes.includes(authCode)) {
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: JSON.stringify({ 
                    success: false, 
                    message: 'Código de autorización inválido' 
                })
            };
        }

        // Generar código de acceso único
        const accessCode = generateAccessCode();

        // Aquí normalmente guardarías en una base de datos
        // Para simplicidad, vamos a usar un webhook o servicio externo
        
        // Por ahora, simular registro exitoso
        // En producción, conectarías con Supabase, Airtable, o similar
        
        const userData = {
            name: name.trim(),
            email: email?.trim() || '',
            accessCode: accessCode,
            registeredAt: new Date().toISOString(),
            active: true
        };

        // TODO: Implementar guardado en base de datos real
        console.log('Usuario registrado:', userData);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({
                success: true,
                message: 'Registro exitoso',
                accessCode: accessCode,
                user: {
                    name: userData.name,
                    email: userData.email
                }
            })
        };

    } catch (error) {
        console.error('Error en auth-register:', error);
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

function generateAccessCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
}
