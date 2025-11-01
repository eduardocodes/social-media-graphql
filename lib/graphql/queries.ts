import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      id
      body
      username
      createdAt
      likeCount
      commentCount
      user {
        id
        username
        email
      }
      likes {
        id
        username
        createdAt
      }
      comments {
        id
        body
        username
        createdAt
      }
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($body: String!) {
    createPost(body: $body) {
      id
      body
      username
      createdAt
      likeCount
      commentCount
      user {
        id
        username
        email
      }
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likeCount
      likes {
        id
        username
        createdAt
      }
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      commentCount
      comments {
        id
        body
        username
        createdAt
      }
    }
  }
`;

export const NEW_POST_SUBSCRIPTION = gql`
  subscription NewPost {
    newPost {
      id
      body
      username
      createdAt
      likeCount
      commentCount
      user {
        id
        username
        email
      }
      likes {
        id
        username
        createdAt
      }
      comments {
        id
        body
        username
        createdAt
      }
    }
  }
`;