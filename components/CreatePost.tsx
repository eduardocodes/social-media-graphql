'use client';

import { useState } from 'react';

export default function CreatePost() {
  const [postBody, setPostBody] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Temporarily just clear the form
    console.log('Post submitted:', postBody);
    setPostBody('');
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
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!postBody.trim()}
            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Postar!
          </button>
        </div>
      </form>
    </div>
  );
}