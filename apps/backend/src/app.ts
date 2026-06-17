import cors from 'cors';
import express from 'express';

import { getCardsPageFromQuery } from './cards.js';
import { AuthError, authenticateRequest, type AuthenticatedUser } from './auth/logto.js';
import type { PrismaClient } from '../generated/prisma/client.js';

export const getHealthPayload = () => ({
  ok: true,
  service: 'backend',
  timestamp: new Date().toISOString()
});

export const getHelloPayload = () => ({
  message: 'Hello from Express'
});

export const getMePayload = (user: AuthenticatedUser) => user;

export const createApp = (prisma: PrismaClient) => {
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
    void getCardsPageFromQuery(request.query, prisma)
      .then((payload) => response.json(payload))
      .catch(next);
  });

  app.get('/api/me', (request, response, next) => {
    void authenticateRequest(prisma, request)
      .then((user) => response.json(getMePayload(user)))
      .catch((error: unknown) => {
        if (error instanceof AuthError) {
          response.status(error.statusCode).json({
            error: error.message
          });
          return;
        }

        next(error);
      });
  });

  return app;
};
