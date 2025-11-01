'use client';

import { UserButton } from '@clerk/nextjs';
import CreatePost from './CreatePost';
import PostsFeed from './PostsFeed';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">Home</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Logout</span>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Posts Recents</h2>
          
          {/* Create Post Section */}
          <div className="mb-8">
            <CreatePost />
          </div>
          
          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PostsFeed />
          </div>
        </div>
      </main>
    </div>
  );
}