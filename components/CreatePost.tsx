'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_POST, GET_POSTS } from '../lib/graphql/queries';
import { LoaderCircle } from 'lucide-react';

export default function CreatePost() {
  const [postBody, setPostBody] = useState('');
  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    refetchQueries: [{ query: GET_POSTS }],
    onCompleted: () => {
      setPostBody('');
    },
    onError: (error: any) => {
      console.error('Error creating post:', error);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postBody.trim()) return;

    try {
      await createPost({
        variables: {
          body: postBody.trim()
        }
      });
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="post-body" className="block text-sm font-medium text-gray-700 mb-2">
            Create a Post
          </label>
          <textarea
            id="post-body"
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            rows={3}
            required
            disabled={loading}
          />
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Error creating post: {error.message}
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!postBody.trim() || loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <LoaderCircle className="animate-spin h-5 w-5" />
              </div>
            ) : (
              'Post!'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}