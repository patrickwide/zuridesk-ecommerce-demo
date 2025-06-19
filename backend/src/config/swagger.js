import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Zuridesk E-commerce API',
    version: '1.0.0',
    description: 'API documentation for Zuridesk E-commerce platform',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;