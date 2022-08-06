const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Status implements nodeInterface {
    id: ID!
    activity: Activity!
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
    getActivity(
      id: Int!
    ): Activity!
  }
  # extend type Mutation {}
  # extend type Subscription {}
`;

const resolvers = {
  Query: {
    getActivity: async (_, args, context) => {
      return await context.dataSources.Activity.getActivity(args);
    },
  },
  // Mutation: {},
  // Subscription: {},
};

module.exports = {
  typeDefs,
  resolvers,
};
