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

  async sessions({ from, to }) {
    const findArgs = {
      start: {
        $gte: new Date(from ?? 0),
        $lte: new Date(to ?? Date.now()),
      }
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
