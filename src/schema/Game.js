const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Game implements nodeInterface {
    id: ID!
    uuid: UUID!
    name: String!
    aliases: [String!]!
  }

  extend type Query {
    getGame(
      id: Int!
    ): Game!
  }
  # extend type Mutation {}
  # extend type Subscription {}
`;

const resolvers = {
  Query: {
    getGame: async (_, args, context) => {
      return await context.dataSources.Game.getGame(args);
    },
  },
  // Mutation: {},
  // Subscription: {},
};

module.exports = {
  id: 'Game',
  typeDefs,
  resolvers,
};
