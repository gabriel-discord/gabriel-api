const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Session implements nodeInterface {
    id: ID!
    user: User!
    game: Game!
    start: DateTime!
    end: DateTime!
    events: [StatusEvent!]!
  }

  extend type Query {
    getSession(
      id: Int!
    ): Session!
  }
  # extend type Mutation {}
  # extend type Subscription {}
`;

const resolvers = {
  Query: {
    sessions: async (_, args, context) => {
      return await context.dataSources.Session.getSession(args);
    },
  },
  // Mutation: {},
  // Subscription: {},
};

module.exports = {
  typeDefs,
  resolvers,
};
