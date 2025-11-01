'use client';

import { SignedIn, SignedOut } from '@clerk/nextjs';
import Dashboard from '../components/Dashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="max-w-6xl mx-auto px-6 py-12">
        <SignedOut>
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <h1 className="text-6xl font-extrabold mb-6 leading-tight">
                Social Media
                <br />
                <span className="text-5xl">GraphQL</span>
              </h1>
            </div>
            <p className="text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience the future of social networking with our cutting-edge platform built on 
              <span className="font-semibold text-blue-600"> Next.js</span>, 
              <span className="font-semibold text-purple-600"> GraphQL</span>, and 
              <span className="font-semibold text-green-600"> MongoDB</span>
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Real-time Features */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-time Updates</h3>
              <p className="text-gray-600 leading-relaxed">
                Experience instant notifications and live updates as conversations happen. 
                Stay connected with real-time messaging and activity feeds.
              </p>
            </div>

            {/* GraphQL API */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">GraphQL Powered</h3>
              <p className="text-gray-600 leading-relaxed">
                Efficient data fetching with GraphQL ensures fast loading times and 
                optimal performance for all your social interactions.
              </p>
            </div>

            {/* Modern Tech */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-green-200 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Modern Stack</h3>
              <p className="text-gray-600 leading-relaxed">
                Built with the latest technologies including Next.js 14, TypeScript, 
                and MongoDB for a robust and scalable experience.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
              <h2 className="text-3xl font-bold mb-4">Ready to Connect?</h2>
              <p className="text-xl opacity-90 mb-6">
                Join thousands of users already sharing their stories and building connections.
              </p>
              <div className="inline-flex items-center space-x-2 text-lg font-medium">
                <span>Sign in to get started</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
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
