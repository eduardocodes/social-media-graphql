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

export { handler as GET, handler as POST };