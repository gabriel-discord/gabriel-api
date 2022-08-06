const { Db, Collection } = require('mongodb');

class Session {
  constructor(config) {
    this.mongo = config.MongoDB;
  }

  async initialize({ context }) {
    this.context = context;
    await this.mongo.client.connect();

    this.db = new Db(this.mongo.client, this.mongo.dbName);
    this.collection = new Collection(this.db, 'session');
  }

  async getSession({ id }) {
    return this.transformSession(id);
  }

  async getSessionById(id) {
    return this.transformSession(id);
  }

  transformSession(session) {
    return {
      id: this.context.utils.generateId('Session', session),
    };
  }
}

module.exports = Session;
