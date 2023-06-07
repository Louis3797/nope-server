import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nope Server REST API Docs',
      version: '1.0.0',
      description: 'Nope Server Docs',
      contact: {
        name: 'Louis-Kaan Ay',
        url: 'https://github.com/Louis3797/nope-server',
        email: ''
      }
    },
    schemes: ['http', 'https'],
    servers: [
      {
        url: 'https://nope-server.azurewebsites.net',
        description: 'Production server'
      },
      { url: 'http://localhost:4040', description: 'For development only' }
    ]
  },
  apis: [
    path.resolve(__dirname, '../../src/routes/*.route.ts'),
    path.resolve(__dirname, '../../dist/routes/*.route.js')
  ],
  components: {
    securitySchemas: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
