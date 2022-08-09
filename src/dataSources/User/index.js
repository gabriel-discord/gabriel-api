const { MongoDataSource } = require('apollo-datasource-mongodb');

class User extends MongoDataSource {
  constructor(config) {
    super(config.MongoDB.client.db().collection(config.MongoDB.userCollection));
    this.transformUser = this.transformUser.bind(this);
  }

  async initialize({ context }) {
    super.initialize();
    this.context = context;
  }

  async users(args = {}) {
    const docs = await this.findByFields(args);
    if (docs.length) return docs.map(this.transformUser);

    const aliasDocs = await this.findByFields({aliases: [args.username]});
    return aliasDocs.map(this.transformUser);
  }

  transformUser(user) {
    if (!user) return null;

    return {
      id: this.context.utils.generateId('User', user.uuid),
      ...user,
    };
  }
}

module.exports = User;
