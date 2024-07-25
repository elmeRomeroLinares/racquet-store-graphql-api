import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { userResolver } from './resolvers/userResolver';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { categoryResolver } from './resolvers/categoryResolver';
import { productResolver } from './resolvers/productResolver';
import { cartResolver } from './resolvers/cartResolver';

dotenv.config();

const typeDefs = loadSchemaSync('src/schema/schema.graphql', {
  loaders: [new GraphQLFileLoader()]
})

AppDataSource.initialize().then(() => {
  const server = new ApolloServer({
    typeDefs,
    resolvers: [userResolver, categoryResolver, productResolver, cartResolver],
  });

  server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
}).catch(error => console.log(error));
