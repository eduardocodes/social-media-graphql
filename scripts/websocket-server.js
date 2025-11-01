const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/use/ws');
const { execute, subscribe } = require('graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');

// Import GraphQL schema and resolvers
const { typeDefs } = require('../lib/graphql/typedefs');
const { resolvers } = require('../lib/graphql/resolvers');

// Create executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Create HTTP server
const server = createServer();

// Create WebSocket server
const wsServer = new WebSocketServer({
  server,
  path: '/graphql',
});

// Use the WebSocket server for GraphQL subscriptions
const serverCleanup = useServer(
  {
    schema,
    execute,
    subscribe,
    context: async (ctx, msg, args) => {
      // You can add authentication logic here if needed
      return {
        req: ctx.extra?.request,
      };
    },
  },
  wsServer
);

const PORT = process.env.WS_PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 WebSocket server ready at ws://localhost:${PORT}/graphql`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  serverCleanup.dispose();
  server.close();
});

module.exports = { server, wsServer, serverCleanup };