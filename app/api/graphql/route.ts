import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '../../../lib/graphql/typedefs';
import { resolvers } from '../../../lib/graphql/resolvers';
import { NextRequest } from 'next/server';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
  includeStacktraceInErrorResponses: process.env.NODE_ENV !== 'production',
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => ({ req }),
});

// Wrap the handler to match App Router signature
async function GET(request: NextRequest, context: { params: Promise<{}> }) {
  return handler(request);
}

async function POST(request: NextRequest, context: { params: Promise<{}> }) {
  return handler(request);
}

export { GET, POST };