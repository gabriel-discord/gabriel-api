const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User implements nodeInterface {
    id: ID!
    discordId: String!
    username: String!
    discriminator: Int!
    displayName: String!
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
  id: 'User',
  typeDefs,
  resolvers,
};
