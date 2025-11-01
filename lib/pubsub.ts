import { PubSub } from 'graphql-subscriptions';

// Create a single PubSub instance to be shared across the application
export const pubsub = new PubSub();

// Define subscription event names as constants to avoid typos
export const SUBSCRIPTION_EVENTS = {
  POST_ADDED: 'POST_ADDED',
  POST_UPDATED: 'POST_UPDATED',
  POST_DELETED: 'POST_DELETED',
  COMMENT_ADDED: 'COMMENT_ADDED',
  POST_LIKED: 'POST_LIKED',
} as const;