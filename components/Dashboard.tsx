'use client';

import { UserButton } from '@clerk/nextjs';
import CreatePost from './CreatePost';
import PostsFeed from './PostsFeed';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto">
        {/* 2-Column Flex Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Create Post */}
          <div className="lg:w-1/3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">Create Post</h2>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
              <CreatePost />
            </div>
          </div>
          
          {/* Right Column: Posts Feed */}
          <div className="lg:w-2/3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">Recent Posts</h2>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-2" style={{scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6'}}>
                <PostsFeed />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}