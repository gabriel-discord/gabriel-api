const { Db, Collection } = require("mongodb");

class Session {
  constructor(config) {
    this.mongo = config.MongoDB;
    this.transformSession = this.transformSession.bind(this);
  }

  async initialize({ context }) {
    this.context = context;
    await this.mongo.client.connect();

    this.db = new Db(this.mongo.client, this.mongo.dbName);
    this.collection = new Collection(this.db, "session");
  }

  async sessions({ from, to }) {
    const findArgs = {};
    if (from) {
      findArgs.start = findArgs.start ?? {};
      findArgs.start.$gte = new Date(from);
    }
    if (to) {
      findArgs.start = findArgs.start ?? {};
      findArgs.start.$lte = new Date(to);
    }

    const docs = await this.collection.find(findArgs).toArray();
    return docs.map(this.transformSession);
  }

  async getSessionById(id) {
    return this.transformSession(id);
  }

  transformSession(session) {
    return {
      id: this.context.utils.generateId("Session", session._id),
      ...session,
    };
  }
}

module.exports = Session;
