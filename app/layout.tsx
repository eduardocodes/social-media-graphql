import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import ApolloWrapper from '../components/ApolloProvider';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Social Media GraphQL",
  description: "A modern social media platform built with Next.js, GraphQL, Apollo Client, and MongoDB — featuring real-time subscriptions, authentication, and an elegant UI powered by TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          suppressHydrationWarning={true}
        >
          <header className="bg-gradient-to-r from-blue-50 via-white to-purple-50 border-b border-gray-200/50 px-6 py-6 shadow-lg backdrop-blur-sm">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Social Media GraphQL
              </h1>
              <div className="flex items-center space-x-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="cursor-pointer hover:bg-white/50 rounded-lg p-1 transition-all duration-300">
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10 hover:scale-105 transition-transform duration-300"
                        }
                      }}
                    />
                  </div>
                </SignedIn>
              </div>
            </div>
          </header>
          <ApolloWrapper>
            {children}
          </ApolloWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
