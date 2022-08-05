require('dotenv').config();

const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
};

if (process.env.MONGODB_CONNECTION_URI && process.env.MONGODB_DATABASE) {
  config.MongoDB = {
    url: process.env.MONGODB_CONNECTION_URI,
    dbName: process.env.MONGODB_DATABASE,
    activityCollection: process.env.ACTIVITY_COLLECTION ?? 'activity',
    userCollection: process.env.USER_COLLECTION ?? 'user',
    gameCollection: process.env.GAME_COLLECTION ?? 'game',
  };
} else {
  throw new Error('No MongoDB URL/Database provided');
}

module.exports = config;
