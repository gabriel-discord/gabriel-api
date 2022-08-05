const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User implements nodeInterface {
    id: ID!
  }

  extend type Query {
    getUser(
      id: Int!
    ): User!
  }
  # extend type Mutation {}
  # extend type Subscription {}
`;

const resolvers = {
  Query: {
    getUser: async (_, args, context) => {
      return await context.dataSources.User.getUser(args);
    },
  },
  // Mutation: {},
  // Subscription: {},
};

module.exports = {
  typeDefs,
  resolvers,
};
