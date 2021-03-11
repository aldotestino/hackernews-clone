import { ApolloServer, PubSub } from 'apollo-server';
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getUserId } from './utils';
import { resolvers } from './resolvers';

const prisma = new PrismaClient({
  errorFormat: 'minimal'
});
const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs: readFileSync(join(__dirname, 'schema.graphql'), 'utf-8'),
  resolvers,
  context: ({ req, connection }) => ({
    ...req,
    prisma,
    pubsub,
    userId: req && req.headers.authorization ? getUserId(req) : 
      connection && connection.context.headers.authorization ? getUserId(connection.context) : null
  }),
  subscriptions: {
    onConnect: (connectionParams: any) => {
      return {
        headers: {
          authorization: connectionParams.Authorization
        }
      };
    }
  }
});

server.listen().then(({ url }) => console.log(`Server running on ${url}`));
