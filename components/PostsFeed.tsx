'use client';

import { useQuery } from '@apollo/client/react';
import { GET_POSTS } from '../lib/graphql/queries';

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

export default function PostsFeed() {
  const { data, loading, error } = useQuery(GET_POSTS);

  if (loading) return <div className="text-center py-4">Loading posts...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error loading posts: {error.message}</div>;

  const posts: Post[] = data?.getPosts || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'há poucos minutos';
    if (diffInHours < 24) return `há ${diffInHours} horas`;
    return `há ${Math.floor(diffInHours / 24)} dias`;
  };

  return (
    <>
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg border border-gray-200 p-4 h-fit">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm font-medium">
                {post.user?.username ? post.user.username.split(' ').map(n => n[0]).join('') : post.username.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{post.user?.username || post.username}</h3>
              <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          
          <p className="text-gray-800 mb-4">{post.body}</p>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <button className="flex items-center space-x-1 hover:text-red-500">
              <span>❤️</span>
              <span>{post.likeCount} likes</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-500">
              <span>💬</span>
              <span>{post.commentCount} Comentários</span>
            </button>
          </div>
        </div>
      ))}
    </>
  );
}