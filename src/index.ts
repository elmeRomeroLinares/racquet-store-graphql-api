import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { userResolver } from './resolvers/userResolver';
import dotenv from 'dotenv';
import express from 'express'
import { AppDataSource } from './data-source';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { categoryResolver } from './resolvers/categoryResolver';
import { productResolver } from './resolvers/productResolver';
import { cartResolver } from './resolvers/cartResolver';
import { orderResolver } from './resolvers/orderResolver';
import jwt from 'jsonwebtoken'

dotenv.config();

const typeDefs = loadSchemaSync('src/schema/schema.graphql', {
  loaders: [new GraphQLFileLoader()],
})

const getUserFromToken = (token: string) => {
  const SECRET_KEY = process.env.JWT_SECRET
  if (!SECRET_KEY) {
    throw new Error('Environment variable jwt_sectet is missing')
  }
  try {
    return jwt.verify(token, SECRET_KEY, { ignoreExpiration: false });
  } catch (e) {
    return null;
  }
};

AppDataSource.initialize().then(() => {
  const server = new ApolloServer({
    typeDefs,
    resolvers: [userResolver, categoryResolver, productResolver, cartResolver, orderResolver],
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      const user = getUserFromToken(token)
      return { user };
    }
  });

  server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
}).catch(error => console.log(error));
