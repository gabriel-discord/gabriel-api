const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Session implements nodeInterface {
    id: ID!
    uuid: UUID!
    user: User!
    game: Game!
    start: DateTime!
    end: DateTime!
    events: [StatusEvent!]!
  }

  extend type Query {
    sessions(
      from: DateTime,
      to: DateTime,
    ): [Session!]!
  }
  # extend type Mutation {}
  # extend type Subscription {}
`;

const resolvers = {
  Query: {
    sessions: async (_, args, context) => {
      return await context.dataSources.Session.sessions(args);
    },
  },

  Session: {
    user: async (session, args, context) => {
      return (await context.dataSources.User.users({uuid: session.user}))[0];
    },
    game: async (session, args, context) => {
      return (await context.dataSources.Game.games({uuid: session.game}))[0];
    },
    events: async (session, args, context) => {
      return session.events.map(context.dataSources.StatusEvent.transformStatusEvent);
    },
  },
  // Mutation: {},
  // Subscription: {},
};

module.exports = {
  id: 'Session',
  typeDefs,
  resolvers,
};
