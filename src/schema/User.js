const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User implements nodeInterface {
    id: ID!
    uuid: UUID!
    discordId: String!
    username: String!
    displayName: String!
    aliases: [String!]!
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
