import express, { Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { Post } from './post';

export async function initServer() {
    const app = express();

    const graphqlServer = new ApolloServer({
        typeDefs: `
            ${Post.types}

            type Query {
               ${Post.queries}
            }
        `,
        resolvers: {
            Query: {
               ...Post.resolvers.queries
            },
        },
    });

    await graphqlServer.start();

    // GraphQL Middleware
    app.use(
        '/graphql',
        expressMiddleware(graphqlServer)
    );
    

    return app;
}
