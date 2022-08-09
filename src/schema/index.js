const fs = require('fs');
const path = require('path');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { gql } = require('apollo-server-express');
const { resolveId } = require('../lib/utils');
const BASE = __dirname;

const typeDefs = [gql`
  scalar DateTime
  scalar UUID

  interface nodeInterface {
    id: ID!
  }

  # type Mutation

  type Query {
    node(id: ID!): nodeInterface
  }
  # type Subscription
`];

const resolvers = [{
  Query: {
    node: async (_, args, context) => {
      const { type, id, data } = resolveId(args.id);
      switch (type) {
        case 'Session':
          return (await context.dataSources.Session.getSessions({uuid: id}))?.[0];
        case 'Game':
          return (await context.dataSources.Game.getGames({uuid: id}))?.[0];
        case 'User':
          return (await context.dataSources.User.getUsers({uuid: id}))?.[0];
      }
    },
  },
  nodeInterface: {
    __resolveType: (node) => resolveId(node.id).type,
  },
}];

function importSchema(dirName, config, schema) {
  return fs.readdirSync(dirName, { withFileTypes: true })
    .reduce((schema, dirent) => {
      const location = path.join(dirName, dirent.name);
      if (dirent.isDirectory()) {
        schema = importSchema(location, config, schema);
      } else if (location != __filename) {
        const module = require(location);
        console.log(`Importing GQL module ${module.id} from ${location.replace(`${BASE}/`, '')} `);

        module?.typeDefs && schema.typeDefs.push(module.typeDefs);
        module?.resolvers && schema.resolvers.push(module.resolvers);
      }
      return schema;
    }, schema);
}

module.exports = {
  resolvers,
  executableSchema: (config) => {
    let schema = importSchema(__dirname, config, {
      typeDefs,
      resolvers,
    });
    return makeExecutableSchema(schema);
  },
};
