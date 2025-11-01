import { GraphQLError } from 'graphql';
import { auth } from '@clerk/nextjs/server';
import User from '../../models/User';
import Post from '../../models/Post';
import connectDB from '../mongodb';
import { pubsub, SUBSCRIPTION_EVENTS } from '../pubsub';

interface Context {
  req: any;
}

export const resolvers = {
  Query: {
    async getPosts() {
      try {
        await connectDB();
        const posts = await Post.find()
          .sort({ createdAt: -1 })
          .populate('user');
        return posts;
      } catch (err) {
        throw new Error('Error fetching posts');
      }
    },

    async getPost(_: any, { postId }: { postId: string }) {
      try {
        await connectDB();
        const post = await Post.findById(postId).populate('user');
        if (!post) {
          throw new Error('Post not found');
        }
        return post;
      } catch (err) {
        throw new Error('Error fetching post');
      }
    },

    async getUser(_: any, { userId }: { userId: string }) {
      try {
        await connectDB();
        const user = await User.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      } catch (err) {
        throw new Error('Error fetching user');
      }
    },

    async getUserByClerkId(_: any, { clerkId }: { clerkId: string }) {
      try {
        await connectDB();
        const user = await User.findOne({ clerkId });
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      } catch (err) {
        throw new Error('Error fetching user');
      }
    }
  },

  Mutation: {
    async register(_: any, { registerInput }: { registerInput: { username: string; email: string } }, context: Context) {
      const { userId } = await auth();
      
      if (!userId) {
        throw new GraphQLError('You must be logged in to register', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      try {
        await connectDB();
        
        // Check if user already exists
        const existingUser = await User.findOne({ clerkId: userId });
        if (existingUser) {
          throw new GraphQLError('User already registered', {
            extensions: { code: 'BAD_USER_INPUT' }
          });
        }

        // Check if username is taken
        const existingUsername = await User.findOne({ username: registerInput.username });
        if (existingUsername) {
          throw new GraphQLError('Username is already taken', {
            extensions: { code: 'BAD_USER_INPUT' }
          });
        }

        // Create new user
        const newUser = new User({
          clerkId: userId,
          username: registerInput.username,
          email: registerInput.email
        });

        const user = await newUser.save();
        return user;
      } catch (err: any) {
        throw new Error(err.message || 'Error creating user');
      }
    },

    async createPost(_: any, { body }: { body: string }, context: Context) {
      const { userId } = await auth();
      
      if (!userId) {
        throw new GraphQLError('You must be logged in to create a post', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      try {
        await connectDB();
        
        // Find user by clerkId
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
          throw new Error('User not found. Please register first.');
        }

        const newPost = new Post({
          body,
          username: user.username,
          user: user._id
        });

        const post = await newPost.save();
        const populatedPost = await Post.findById(post._id).populate('user');
        
        // Publish the new post to subscribers
        pubsub.publish(SUBSCRIPTION_EVENTS.POST_ADDED, {
          newPost: populatedPost
        });
        
        return populatedPost;
      } catch (err: any) {
        throw new Error(err.message || 'Error creating post');
      }
    },

    async deletePost(_: any, { postId }: { postId: string }, context: Context) {
      const { userId } = await auth();
      
      if (!userId) {
        throw new GraphQLError('You must be logged in to delete a post', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      try {
        await connectDB();
        
        const post = await Post.findById(postId);
        if (!post) {
          throw new Error('Post not found');
        }

        // Find user by clerkId
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
          throw new Error('User not found');
        }

        // Check if user owns the post
        if (post.user.toString() !== user._id.toString()) {
          throw new GraphQLError('You can only delete your own posts', {
            extensions: { code: 'FORBIDDEN' }
          });
        }

        await Post.findByIdAndDelete(postId);
        
        // Publish the post deletion to subscribers
        pubsub.publish(SUBSCRIPTION_EVENTS.POST_DELETED, {
          postDeleted: postId
        });
        
        return 'Post deleted successfully';
      } catch (err: any) {
        throw new Error(err.message || 'Error deleting post');
      }
    },

    async createComment(_: any, { postId, body }: { postId: string; body: string }, context: Context) {
      const { userId } = await auth();
      
      if (!userId) {
        throw new GraphQLError('You must be logged in to comment', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      try {
        await connectDB();
        
        // Find user by clerkId
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
          throw new Error('User not found. Please register first.');
        }

        const post = await Post.findById(postId);
        if (!post) {
          throw new Error('Post not found');
        }

        post.comments.unshift({
          body,
          username: user.username,
          createdAt: new Date()
        } as any);

        await post.save();
        const updatedPost = await Post.findById(postId).populate('user');
        
        // Publish the comment addition to subscribers
        pubsub.publish(SUBSCRIPTION_EVENTS.COMMENT_ADDED, {
          commentAdded: updatedPost
        });
        
        return updatedPost;
      } catch (err: any) {
        throw new Error(err.message || 'Error creating comment');
      }
    },

    async deleteComment(_: any, { postId, commentId }: { postId: string; commentId: string }, context: Context) {
      const { userId } = await auth();
      
      if (!userId) {
        throw new GraphQLError('You must be logged in to delete a comment', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      try {
        await connectDB();
        
        // Find user by clerkId
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
          throw new Error('User not found');
        }

        const post = await Post.findById(postId);
        if (!post) {
          throw new Error('Post not found');
        }

        const commentIndex = post.comments.findIndex((c: any) => c.id === commentId);
        if (commentIndex === -1) {
          throw new Error('Comment not found');
        }

        // Check if user owns the comment
        if (post.comments[commentIndex].username !== user.username) {
          throw new GraphQLError('You can only delete your own comments', {
            extensions: { code: 'FORBIDDEN' }
          });
        }

        post.comments.splice(commentIndex, 1);
        await post.save();
        return await Post.findById(postId).populate('user');
      } catch (err: any) {
        throw new Error(err.message || 'Error deleting comment');
      }
    },

    async likePost(_: any, { postId }: { postId: string }, context: Context) {
      const { userId } = await auth();
      
      if (!userId) {
        throw new GraphQLError('You must be logged in to like a post', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      try {
        await connectDB();
        
        // Find user by clerkId
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
          throw new Error('User not found. Please register first.');
        }

        const post = await Post.findById(postId);
        if (!post) {
          throw new Error('Post not found');
        }

        // Check if user already liked the post
        const likeIndex = post.likes.findIndex((like: any) => like.username === user.username);
        
        if (likeIndex === -1) {
          // Add like
          post.likes.push({
            username: user.username,
            createdAt: new Date()
          } as any);
        } else {
          // Remove like
          post.likes.splice(likeIndex, 1);
        }

        await post.save();
        const updatedPost = await Post.findById(postId).populate('user');
        
        // Publish the post like/unlike to subscribers
        pubsub.publish(SUBSCRIPTION_EVENTS.POST_LIKED, {
          postLiked: updatedPost
        });
        
        return updatedPost;
      } catch (err: any) {
        throw new Error(err.message || 'Error liking post');
      }
    }
  },

  Subscription: {
    newPost: {
      subscribe: () => pubsub.asyncIterableIterator([SUBSCRIPTION_EVENTS.POST_ADDED])
    }
  }
};