'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_POSTS, LIKE_POST, GET_USER_BY_CLERK_ID } from '../lib/graphql/queries';
import { timeAgo } from '../utils/timeAgo';
import { useUser } from '@clerk/nextjs';
import { LoaderCircle } from 'lucide-react';
import PostView from './PostView';

interface Post {
  id: string;
  body: string;
  username: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  user: {
    id: string;
    username: string;
    email: string;
  };
  likes: Array<{
    id: string;
    username: string;
    createdAt: string;
  }>;
  comments: Array<{
    id: string;
    body: string;
    username: string;
    createdAt: string;
  }>;
}

interface GetPostsData {
  getPosts: Post[];
}

interface GetUserByClerkIdData {
  getUserByClerkId: {
    id: string;
    clerkId: string;
    username: string;
    email: string;
    createdAt: string;
  };
}

export default function PostsFeed() {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const { user } = useUser();
  const { data, loading, error } = useQuery<GetPostsData>(GET_POSTS, {
    fetchPolicy: 'cache-and-network',
  });
  
  // Get the database user to ensure we have the correct username
  const { data: dbUserData } = useQuery<GetUserByClerkIdData>(GET_USER_BY_CLERK_ID, {
    variables: { clerkId: user?.id },
    skip: !user?.id
  });

  const [likePost] = useMutation(LIKE_POST, {
    refetchQueries: [{ query: GET_POSTS }],
    onError: (error: any) => {
      console.error('Error liking post:', error);
    }
  });

  const handleLike = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation(); // Prevent opening the post modal
    if (!user) return;
    
    try {
      await likePost({
        variables: { postId }
      });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (loading) return (
    <div className="text-center py-4 flex items-center justify-center">
      <LoaderCircle className="animate-spin h-6 w-6 text-blue-500" />
    </div>
  );
  if (error) return <div className="text-center py-4 text-red-500">Error loading posts: {error.message}</div>;

  const posts: Post[] = data?.getPosts || [];

  return (
    <>
      {posts.map((post) => {
        // Get the database username for comparison
        const dbUsername = dbUserData?.getUserByClerkId?.username;
        
        // Debug logging
        console.log('Debug - Clerk user object:', user);
        console.log('Debug - Clerk user username:', user?.username);
        console.log('Debug - Database user username:', dbUsername);
        console.log('Debug - Post likes:', post.likes);
        console.log('Debug - Post likes usernames:', post.likes.map(like => like.username));
        
        const isLiked = dbUsername && post.likes.some(like => like.username === dbUsername);
        console.log('Debug - isLiked result:', isLiked);
        
        return (
          <div 
            key={post.id} 
            className="bg-white rounded-lg border border-gray-200 p-4 h-64 w-full cursor-pointer hover:shadow-md transition-shadow flex flex-col"
            onClick={() => setSelectedPostId(post.id)}
          >
            <div className="flex items-center space-x-3 mb-3 flex-shrink-0">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-medium">
                  {post.user?.username ? post.user.username.split(' ').map(n => n[0]).join('') : post.username.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{post.user?.username || post.username}</h3>
                <p className="text-sm text-gray-500">{timeAgo(post.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex-1 mb-4 overflow-hidden">
              <p className="text-gray-800 line-clamp-4 text-sm leading-relaxed">
                {post.body}
              </p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500 flex-shrink-0">
              <button
                onClick={(e) => handleLike(e, post.id)}
                className={`flex items-center space-x-1 transition-colors cursor-pointer ${
                  isLiked ? 'text-red-600 hover:text-red-700' : 'text-gray-600 hover:text-red-500'
                }`}
                disabled={!user}
              >
                <span>{isLiked ? '❤️' : '🤍'}</span>
                <span className="text-sm">{post.likeCount}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors cursor-pointer">
                <span>💬</span>
                <span className="text-sm">{post.commentCount}</span>
              </button>
            </div>
          </div>
        );
      })}
      
      {selectedPostId && (
        <PostView 
          postId={selectedPostId} 
          onClose={() => setSelectedPostId(null)} 
        />
      )}
    </>
  );
}