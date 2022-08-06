const { Db, Collection } = require('mongodb');

class Game {
  constructor(config) {
    this.mongo = config.MongoDB;
  }

  async initialize({ context }) {
    this.context = context;
    await this.mongo.client.connect();

    this.db = new Db(this.mongo.client, this.mongo.dbName);
    this.collection = new Collection(this.db, 'game');
  }

  async getGame({ id }) {
    return this.transformGame(id);
  }

  async getGameById(id) {
    return this.transformGame(id);
  }

  transformGame(game) {
    return {
      id: this.context.utils.generateId('Game', game),
    };
  }
}

module.exports = Game;
