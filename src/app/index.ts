import express, { Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { Post } from './post';
import { mutations } from './post/muations';

export async function initServer() {
    const app = express();

    app.use(express.json())
    const graphqlServer = new ApolloServer({
        typeDefs: `
            ${Post.types}

            type Query {
               ${Post.queries}
            }

            type Mutation {
                ${Post.mutations}
            }
        `,
        resolvers: {
            Query: {
               ...Post.resolvers.queries
            },
            Mutation: {
                ...Post.resolvers.mutations
            }
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
