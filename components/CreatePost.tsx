'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_POST, GET_POSTS } from '../lib/graphql/queries';
import { LoaderCircle } from 'lucide-react';

const MAX_POST_LENGTH = 1000;

export default function CreatePost() {
  const [postBody, setPostBody] = useState('');
  const [clientError, setClientError] = useState('');
  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    refetchQueries: [{ query: GET_POSTS }],
    onCompleted: () => {
      setPostBody('');
      setClientError('');
    },
    onError: (error: any) => {
      console.error('Error creating post:', error);
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPostBody(value);
    
    // Clear client error when user starts typing within limit
    if (value.length <= MAX_POST_LENGTH) {
      setClientError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!postBody.trim()) {
      setClientError('Post cannot be empty.');
      return;
    }
    
    if (postBody.length > MAX_POST_LENGTH) {
      setClientError(`Post must be ${MAX_POST_LENGTH} characters or less. Current length: ${postBody.length}`);
      return;
    }

    setClientError('');

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

  // Helper function to get user-friendly error message
  const getErrorMessage = () => {
    if (clientError) return clientError;
    if (error) {
      // Check if it's a validation error
      if (error.message.includes('maxlength') || error.message.includes('longer than the maximum allowed length')) {
        return `Post must be ${MAX_POST_LENGTH} characters or less.`;
      }
      return error.message;
    }
    return '';
  };

  const remainingChars = MAX_POST_LENGTH - postBody.length;
  const isOverLimit = postBody.length > MAX_POST_LENGTH;

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
            onChange={handleInputChange}
            placeholder="What's on your mind?"
            className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:border-transparent text-gray-900 ${
              isOverLimit 
                ? 'border-red-400 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            rows={3}
            required
            disabled={loading}
          />
          <div className="flex justify-between items-center mt-2">
            <div className={`text-sm ${isOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
              {remainingChars >= 0 
                ? `${remainingChars} characters remaining` 
                : `${Math.abs(remainingChars)} characters over limit`
              }
            </div>
            <div className="text-xs text-gray-400">
              {postBody.length}/{MAX_POST_LENGTH}
            </div>
          </div>
        </div>
        
        {getErrorMessage() && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {getErrorMessage()}
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!postBody.trim() || loading || isOverLimit}
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