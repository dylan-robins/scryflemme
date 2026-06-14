import cors from 'cors';
import express from 'express';

export const getHealthPayload = () => ({
  ok: true,
  service: 'backend',
  timestamp: new Date().toISOString()
});

export const getHelloPayload = () => ({
  message: 'Hello from Express'
});

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_request, response) => {
    response.json(getHealthPayload());
  });

  app.get('/api/hello', (_request, response) => {
    response.json(getHelloPayload());
  });

  return app;
};
