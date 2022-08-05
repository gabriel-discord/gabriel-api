const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const utils = require('./lib/utils');
const config = require('./config');

try {
  config.MongoDB.client = utils.createMongoClient(config.MongoDB.url);
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
