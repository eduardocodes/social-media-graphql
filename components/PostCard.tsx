'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { LIKE_POST, CREATE_COMMENT, GET_POSTS } from '../lib/graphql/queries';
import { useUser } from '@clerk/nextjs';

interface Post {
  id: string;
  body: string;
  username: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  likes: Array<{
    id: string;
    username: string;
  }>;
  comments: Array<{
    id: string;
    body: string;
    username: string;
    createdAt: string;
  }>;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useUser();
  const [showComments, setShowComments] = useState(false);
  const [commentBody, setCommentBody] = useState('');
  
  const [likePost] = useMutation(LIKE_POST, {
    refetchQueries: [{ query: GET_POSTS }],
    onError: (error: any) => {
      console.error('Error liking post:', error);
    }
  });

  const [createComment] = useMutation(CREATE_COMMENT, {
    refetchQueries: [{ query: GET_POSTS }],
    onCompleted: () => {
      setCommentBody('');
    },
    onError: (error: any) => {
      console.error('Error creating comment:', error);
    }
  });

  const handleLike = async () => {
    if (!user) return;
    
    try {
      await likePost({
        variables: { postId: post.id }
      });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim() || !user) return;

    try {
      await createComment({
        variables: { 
          postId: post.id,
          body: commentBody.trim()
        }
      });
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isLiked = user && post.likes.some(like => like.username === user.username);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          {post.username.charAt(0).toUpperCase()}
        </div>
        <div className="ml-3">
          <p className="font-semibold text-gray-900">{post.username}</p>
          <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-800 leading-relaxed">{post.body}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
            isLiked 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          disabled={!user}
        >
          <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
          <span className="text-sm font-medium">{post.likeCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <span className="text-lg">💬</span>
          <span className="text-sm font-medium">{post.commentCount}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t pt-4">
          {/* Add Comment Form */}
          {user && (
            <form onSubmit={handleComment} className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  placeholder="Adicione um comentário..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!commentBody.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Enviar
                </button>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {comment.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <p className="font-semibold text-sm text-gray-900">{comment.username}</p>
                    <p className="text-sm text-gray-800">{comment.body}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(comment.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}