'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_POSTS } from '../lib/graphql/queries';
import PostView from './PostView';
import { LoaderCircle } from 'lucide-react';
import { timeAgo } from '../utils/timeAgo';

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

export default function PostsFeed() {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const { data, loading, error } = useQuery<GetPostsData>(GET_POSTS);

  if (loading) return (
    <div className="text-center py-4 flex items-center justify-center">
      <LoaderCircle className="animate-spin h-6 w-6 text-blue-500" />
    </div>
  );
  if (error) return <div className="text-center py-4 text-red-500">Error loading posts: {error.message}</div>;

  const posts: Post[] = data?.getPosts || [];

  return (
    <>
      {posts.map((post) => (
        <div 
          key={post.id} 
          className="bg-white rounded-lg border border-gray-200 p-4 h-fit cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setSelectedPostId(post.id)}
        >
          <div className="flex items-center space-x-3 mb-3">
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
          
          <p className="text-gray-800 mb-4">{post.body}</p>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <button className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors cursor-pointer">
              <span>❤️</span>
              <span className="text-sm">{post.likeCount}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors cursor-pointer">
              <span>💬</span>
              <span className="text-sm">{post.commentCount}</span>
            </button>
          </div>
        </div>
      ))}
      
      {selectedPostId && (
        <PostView 
          postId={selectedPostId} 
          onClose={() => setSelectedPostId(null)} 
        />
      )}
    </>
  );
}