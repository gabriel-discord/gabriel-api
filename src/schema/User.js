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

  input UserSearch {
    username: String
    uuid: UUID
  }

  extend type Query {
    users(
      search: UserSearch
    ): [User!]!
  }
  # extend type Mutation {}
  # extend type Subscription {}
`;

const resolvers = {
  Query: {
    users: async (_, {search}, context) => {
      return await context.dataSources.User.users(search);
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
