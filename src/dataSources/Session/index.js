const { Db, Collection } = require('mongodb');

class Session {
  constructor(config) {
    this.mongo = config.MongoDB;
    this.transformSession = this.transformSession.bind(this);
  }

  async initialize({ context }) {
    this.context = context;
    await this.mongo.client.connect();

    this.db = new Db(this.mongo.client, this.mongo.dbName);
    this.collection = new Collection(this.db, 'session');
  }

  async sessions({ ids }) {
    if (ids.length > 0) {
      // TODO: an exercise for the reader
    }
    const docs = await this.collection.find().toArray();
    return docs.map(this.transformSession);
  }

  async getSessionById(id) {
    return this.transformSession(id);
  }

  transformSession(session) {
    return {
      id: this.context.utils.generateId('Session', session._id),
      ...session,
    };
  }
}

module.exports = Session;
