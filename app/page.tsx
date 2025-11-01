'use client';

import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';

export default function Home() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <SignedOut>
          {/* Content for signed-out users */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Welcome to Social Media GraphQL
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A modern social media platform built with Next.js, GraphQL, Apollo Client, and MongoDB. 
              Connect with friends, share your thoughts, and explore real-time conversations.
            </p>
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Get Started
              </h2>
              <p className="text-gray-600 mb-6">
                Sign in to start connecting with others and sharing your experiences.
              </p>
              <SignInButton mode="modal">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors">
                  Sign In to Continue
                </button>
              </SignInButton>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          {/* Content for signed-in users */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {user?.firstName || 'there'}! 👋
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              You're successfully authenticated with Clerk. Ready to build something amazing?
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  🚀 Next Steps
                </h3>
                <ul className="text-left text-gray-600 space-y-2">
                  <li>• Set up GraphQL API endpoints</li>
                  <li>• Configure Apollo Client</li>
                  <li>• Design your data models</li>
                  <li>• Build real-time subscriptions</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  🔐 Authentication Ready
                </h3>
                <ul className="text-left text-gray-600 space-y-2">
                  <li>• User authentication ✅</li>
                  <li>• Protected routes ✅</li>
                  <li>• User management ✅</li>
                  <li>• Session handling ✅</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                🎉 Clerk Integration Complete!
              </h3>
              <p className="text-blue-700">
                Your social media platform now has secure authentication powered by Clerk. 
                Users can sign in, manage their profiles, and access protected features seamlessly.
              </p>
            </div>
          </div>
        </SignedIn>
      </main>
    </div>
  );
}
