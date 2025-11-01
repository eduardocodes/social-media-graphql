'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_POST, CREATE_COMMENT } from '../lib/graphql/queries';

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

  const formatDate = (dateString: string | Date | number) => {
    if (!dateString) return 'invalid date';
    
    const date = typeof dateString === 'object' && dateString instanceof Date 
      ? dateString 
      : new Date(dateString);
    
    if (isNaN(date.getTime())) return 'invalid date';

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;

    const hours = Math.floor(diffInMinutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;

    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? 's' : ''} ago`;
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="text-center py-8">Loading post...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="text-center py-8 text-red-500">Error loading post: {error.message}</div>
      </div>
    </div>
  );

  const post: Post | null = data?.getPost || null;

  if (!post) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="text-center py-8">Post not found</div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Post</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
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
              <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
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
          <h3 className="font-semibold mb-4">Comments</h3>
          
          {/* Comments List */}
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">{comment.username}</span>
                    <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.body}</p>
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
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}