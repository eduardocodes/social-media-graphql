'use client';

import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import Dashboard from '../components/Dashboard';

export default function Home() {
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
          <Dashboard />
        </SignedIn>
      </main>
    </div>
  );
}
