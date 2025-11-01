'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_POST, CREATE_COMMENT } from '../lib/graphql/queries';
import { LoaderCircle } from 'lucide-react';
import { timeAgo } from '../utils/timeAgo';

interface PostViewProps {
  postId: string;
  onClose: () => void;
}

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

interface GetPostData {
  getPost: Post;
}

export default function PostView({ postId, onClose }: PostViewProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (input: string | number | Date | null | undefined) => {
    if (!input) return 'Invalid Date';

    let date: Date;
    if (input instanceof Date) {
      date = input;
    } else if (typeof input === 'number') {
      // Detect seconds vs milliseconds
      date = new Date(input < 1e12 ? input * 1000 : input);
    } else if (typeof input === 'string') {
      // If string is purely digits, treat as timestamp (ms or s)
      if (/^\d+$/.test(input)) {
        const num = Number(input);
        date = new Date(num < 1e12 ? num * 1000 : num);
      } else {
        date = new Date(input);
      }
    } else {
      return 'Invalid Date';
    }

    if (isNaN(date.getTime())) return 'Invalid Date';

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const { data, loading, error } = useQuery<GetPostData>(GET_POST, {
    variables: { postId },
    skip: !postId,
  });

  const [createComment] = useMutation(CREATE_COMMENT, {
    refetchQueries: [{ query: GET_POST, variables: { postId } }],
    onCompleted: () => {
      setNewComment('');
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error('Error creating comment:', error);
      setIsSubmitting(false);
    },
  });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createComment({
        variables: {
          postId,
          body: newComment.trim(),
        },
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
        <div className="text-center py-8 flex items-center justify-center">
          <LoaderCircle className="animate-spin h-6 w-6 text-blue-500" />
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
        <div className="text-center py-8 text-red-500">Error loading post: {error.message}</div>
      </div>
    </div>
  );

  const post: Post | null = data?.getPost || null;

  if (!post) return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
        <div className="text-center py-8">Post not found</div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">Post</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Post Content */}
        <div className="mb-6">
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
            <span className="flex items-center space-x-1">
              <span>❤️</span>
              <span>{post.likeCount} likes</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>💬</span>
              <span>{post.commentCount} Comments</span>
            </span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-4 text-black">Comments</h3>
          
          {/* Comments List */}
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600 text-xs font-medium">
                        {comment.username.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm text-gray-900">{comment.username}</span>
                        <span className="text-xs text-gray-500">{timeAgo(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.body}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
            )}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              rows={3}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}