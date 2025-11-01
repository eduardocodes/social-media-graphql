'use client';

import { UserButton } from '@clerk/nextjs';
import CreatePost from './CreatePost';
import PostsFeed from './PostsFeed';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 2-Column Flex Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Create Post */}
          <div className="lg:w-1/3">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Create Post</h2>
            <CreatePost />
          </div>
          
          {/* Right Column: Posts Feed */}
          <div className="lg:w-2/3">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PostsFeed />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}