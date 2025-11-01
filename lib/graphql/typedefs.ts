import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    clerkId: String!
    username: String!
    email: String!
    createdAt: String!
  }

  type Comment {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }

  type Like {
    id: ID!
    username: String!
    createdAt: String!
  }

  type Post {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
    comments: [Comment!]!
    likes: [Like!]!
    likeCount: Int!
    commentCount: Int!
    user: User!
  }

  input RegisterInput {
    username: String!
    email: String!
  }

  type Query {
    getPosts: [Post!]!
    getPost(postId: ID!): Post
    getUser(userId: ID!): User
    getUserByClerkId(clerkId: String!): User
  }

  type Mutation {
    register(registerInput: RegisterInput!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }

  type Subscription {
    newPost: Post!
  }
`;