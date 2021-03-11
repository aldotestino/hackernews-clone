import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { PubSub } from 'apollo-server';

const APP_SECRET = 'GraphQL-is-aw3some';

interface Payload {
  userId: number
}

interface Context {
  prisma: PrismaClient
  pubsub: PubSub
  userId: number | null
}

type ResolverFunc<T> = (parent: T, args: T, context: Context) => any;

function getTokenPayLoad(token: string): Payload {
  return jwt.verify(token, APP_SECRET) as Payload;
}

function getUserId(req: Request | null, authToken?: string): number {
  if(req) {
    const authHeader = req.headers?.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        throw new Error('No token found');
      }
      const { userId } = getTokenPayLoad(token);
      return userId;
    }
  } else if(authToken) {
    const { userId } = getTokenPayLoad(authToken);
    return userId;
  }
  throw new Error('Not authenticated');
}

export {
  APP_SECRET,
  getUserId,
  ResolverFunc
};
