const { Db, Collection } = require('mongodb');

class User {
  constructor(config) {
    this.mongo = config.MongoDB;
  }

  async initialize({ context }) {
    this.context = context;
    await this.mongo.client.connect();

    this.db = new Db(this.mongo.client, this.mongo.dbName);
    this.collection = new Collection(this.db, this.mongo.userCollection);
  }

  async getUser({ id }) {
    return this.transformUser(id);
  }

  async getUserById(id) {
    return this.transformUser(id);
  }

  transformUser(user) {
    return {
      id: this.context.utils.generateId('User', user),
    };
  }
}

module.exports = User;
