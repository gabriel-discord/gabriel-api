const { Db, Collection } = require('mongodb');

class Activity {
  constructor(config) {
    this.mongo = config.MongoDB;
  }

  async initialize({ context }) {
    this.context = context;
    await this.mongo.client.connect();

    this.db = new Db(this.mongo.client, this.mongo.dbName);
    this.collection = new Collection(this.db, 'activity');
  }

  async getActivity({ id }) {
    return this.transformActivity(id);
  }

  async getActivityById(id) {
    return this.transformActivity(id);
  }

  transformActivity(activity) {
    return {
      id: this.context.utils.generateId('Activity', activity),
    };
  }
}

module.exports = Activity;
