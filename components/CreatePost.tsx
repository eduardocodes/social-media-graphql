'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_POST, GET_POSTS } from '../lib/graphql/queries';

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
            Criar um Post
          </label>
          <textarea
            id="post-body"
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
            placeholder="O que você está pensando?"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            required
            disabled={loading}
          />
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Erro ao criar post: {error.message}
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!postBody.trim() || loading}
            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Postando...' : 'Postar!'}
          </button>
        </div>
      </form>
    </div>
  );
}