const { MongoDataSource } = require('apollo-datasource-mongodb');

class Game extends MongoDataSource {
  constructor(config) {
    super(config.MongoDB.client.db().collection(config.MongoDB.gameCollection));
    this.transformGame = this.transformGame.bind(this);
  }

  async initialize({ context }) {
    super.initialize();
    this.context = context;
  }

  async games(args = {}) {
    const docs = await this.findByFields(args);
    return docs.map(this.transformGame);
  }

  transformGame(game) {
    if (!game) return null;

    return {
      id: this.context.utils.generateId('Game', game.uuid),
      ...game,
    };
  }
}

module.exports = Game;
