const crypto = require('crypto');
const _ = require('lodash');
const { MongoClient, Db, Collection } = require('mongodb');

module.exports = Object.freeze({
  paginateResults({
    after: cursor,
    pageSize = 20,
    results,
    getCursor = (item) => item?.id ?? item?.cursor ?? null,
  }) {
    const records = (() => {
      if (pageSize < 1) return [];
      if (!cursor) return results.slice(0, pageSize);

      const cursorIndex = results.findIndex((item) => {
        const itemCursor = getCursor(item);
        return itemCursor ? cursor === itemCursor : false;
      });

      return cursorIndex >= 0 ?
        cursorIndex === results.length - 1 ?
          [] :
          results.slice(
            cursorIndex + 1,
            Math.min(results.length, cursorIndex + 1 + pageSize),
          ) :
        results.slice(0, pageSize);
    })();

    return {
      nodes: records,
      cursor: records.length ?
        getCursor(records[records.length - 1]) :
        null,
      hasMore: records.length ?
        getCursor(records[records.length - 1]) !==
        getCursor(results[results.length - 1]) :
        false,
    };
  },
  generateId(...args) {
    return args.length === 1 ?
      crypto.createHash('md5').update(JSON.stringify(args[0], Object.keys(args[0]).sort())).digest('hex') :
      Buffer.from(args.join(':')).toString('base64');
  },
  resolveId(globalId) {
    const [type, id, data] = Buffer.from(globalId, 'base64').toString('ascii').split(':');
    return { type, id, data };
  },
  cacheKeyFn(key) {
    let result;
    if (typeof key === 'object') {
      result = Object.keys(key).sort().map((k) => k + ':' + key[k]).join('-');
    } else {
      result = String(key);
    }
    return result;
  },
  createMongoClient(mongoUrl) {
    return new MongoClient(mongoUrl);
  },
  async getCollectionObject(config, collectionName) {
    await config.client.connect();
    const db = new Db(config.client, config.dbName);
    return new Collection(db, collectionName);
  },
});
