import cors from 'cors';
import express from 'express';

import { getCardsPageFromQuery } from './cards.js';

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

  app.get('/api/cards', (request, response, next) => {
    void getCardsPageFromQuery(request.query)
      .then((payload) => response.json(payload))
      .catch(next);
  });

  return app;
};
