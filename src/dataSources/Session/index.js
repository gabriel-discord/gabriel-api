const { MongoDataSource } = require('apollo-datasource-mongodb');

class Session extends MongoDataSource {
  constructor(config) {
    super(config.MongoDB.client.db().collection(config.MongoDB.sessionCollection));
    this.transformSession = this.transformSession.bind(this);
  }

  async initialize({ context }) {
    super.initialize();
    this.context = context;
  }

  async sessions({ from, to, game: _game, user: _user }) {
    const game = (await this.context.dataSources.Game.games(_game))?.[0];
    const user = (await this.context.dataSources.User.users(_user))?.[0];

    // Return no results if provided game/user does not exist
    if ((_game && !game) || (_user && !user)) return [];

    const findArgs = {
      start: {
        $gte: new Date(from ?? 0),
        $lte: new Date(to ?? Date.now()),
      },
      ...(_game && game && {game: game.uuid}),
      ...(_user && user && {user: user.uuid}),
    };

    const docs = await this.collection.find(findArgs).sort({ start: 1 }).toArray();
    return docs.map(this.transformSession);
  }

  transformSession(session) {
    return {
      id: this.context.utils.generateId("Session", session.uuid),
      ...session,
    };
  }
}

module.exports = Session;
