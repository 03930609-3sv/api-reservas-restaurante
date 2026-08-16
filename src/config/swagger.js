const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Restaurante - Sistema de Reservaciones 🍽️',
            version: '1.0.0',
            description: 'Documentación interactiva de la API con autenticación JWT, roles y gestión de mesas.',
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Servidor Local' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{ bearerAuth: [] }],
        paths: {
            '/api/auth/register': {
                post: {
                    tags: ['Autenticación'],
                    summary: 'Registrar un nuevo cliente',
                    requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { nombre: { type: 'string', example: 'Juan Perez' }, email: { type: 'string', example: 'juan@email.com' }, password: { type: 'string', example: '123456' } } } } } },
                    responses: { 201: { description: 'Usuario creado exitosamente' } }
                }
            },
            '/api/auth/login': {
                post: {
                    tags: ['Autenticación'],
                    summary: 'Iniciar sesión (Devuelve Token JWT)',
                    requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string', example: 'juan@email.com' }, password: { type: 'string', example: '123456' } } } } } },
                    responses: { 200: { description: 'Login exitoso, devuelve token' } }
                }
            },
            '/api/mesas': {
                get: {
                    tags: ['Mesas'],
                    summary: 'Listar todas las mesas activas (Público)',
                    responses: { 200: { description: 'Lista de mesas devuelta' } }
                }
            },
            '/api/reservaciones': {
                post: {
                    tags: ['Reservaciones'],
                    summary: 'Crear una reservación (Requiere Token de Cliente)',
                    requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { mesa_id: { type: 'integer', example: 1 }, fecha: { type: 'string', example: '2024-12-01' }, hora: { type: 'string', example: '19:00:00' }, numero_comensales: { type: 'integer', example: 2 } } } } } },
                    responses: { 201: { description: 'Reservación creada' }, 400: { description: 'La mesa ya está ocupada' } }
                }
            }
        }
    },
    apis: [], // Como definimos todo arriba, esto queda vacío
};

module.exports = swaggerJSDoc(swaggerOptions);