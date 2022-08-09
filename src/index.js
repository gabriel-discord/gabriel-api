const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const compression = require('compression');
const utils = require('./lib/utils');
const config = require('./config');
const { MongoClient } = require('mongodb');

try {
  config.MongoDB.client = new MongoClient(`${config.MongoDB.url}/${config.MongoDB.dbName}`)
  config.MongoDB.client.connect();
} catch (error) {
  throw new Error(`Error connecting to MongoDB @ ${config.MongoDB.url}`);
}

const dataSources = require('./dataSources')(config);
const schema = require('./schema').executableSchema(config);
const server = new ApolloServer({
  schema,
  dataSources,
  context: (context) => ({
    ...context,
    utils,
  }),
  playground: {
    endpoint: '/graphql',
  },
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
});

const app = express();
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT ?? 3000;
const expressServer = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

(async () => {
  await server.start();
  await server.applyMiddleware({
    app,
  });
})();

module.exports = {
  apollo: server,
  expressServer,
};
