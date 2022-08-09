const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type StatusEvent implements nodeInterface {
    id: ID!
    uuid: UUID!
    start: DateTime!
    end: DateTime!
    state: DiscordState!
  }

  enum DiscordState {
    ACTIVE
    IDLE
    OFFLINE
    DO_NOT_DISTURB
  }

  extend type Query {
    getStatusEvent(
      id: Int!
    ): Session!
  }
  # extend type Mutation {}
  # extend type Subscription {}
`;

const resolvers = {
  Query: {
    getStatusEvent: async (_, args, context) => {
      return await context.dataSources.Session.getStatusEvent(args);
    },
  },
  // Mutation: {},
  // Subscription: {},
};

module.exports = {
  id: 'StatusEvent',
  typeDefs,
  resolvers,
};
