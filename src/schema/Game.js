const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Game implements nodeInterface {
    id: ID!
    uuid: UUID!
    name: String!
    aliases: [String!]!
  }

  input GameSearch {
    name: String
    uuid: UUID
  }

  extend type Query {
    games(
      search: GameSearch
    ): [Game!]!
  }
  # extend type Mutation {}
  # extend type Subscription {}
`;

const resolvers = {
  Query: {
    games: async (_, {search}, context) => {
      return await context.dataSources.Game.games(search);
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
