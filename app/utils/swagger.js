const swaggerDefinition = {
  swagger: '2.0',
  info: {
    description: 'Express JS server to handle Android image & Firestore API requests',
    version: '1.0.0',
    title: 'LAMBI-API',
    contact: {
      email: 'andhika.rahmanu@mail.ugm.ac.id',
    },
  },
  tags: [
    {
      name: 'admins',
      description: 'Admin tools for development and troubleshooting',
    },
    {
      name: 'developers',
      description: 'Operations available Android developers',
    },
  ],
  host: 'backend-service-1-dot-fashap.et.r.appspot.com',
  basePath: '/api',
  schemes: ['https'],
  paths: {
    '/': {
      get: {
        tags: ['developers'],
        summary: 'Welcome Message',
        description: 'Endpoint to get a welcome message from Lambi API',
        responses: {
          '200': {
            description: 'Successful response',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Welcome to Lambi API',
                },
              },
            },
          },
        },
      },
    },
    // Add other paths here if needed
  },
};

// ... rest of the code remains the same
