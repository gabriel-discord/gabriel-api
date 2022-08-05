const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Activity implements nodeInterface {
    id: ID!
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
