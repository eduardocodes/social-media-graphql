'use client';

// Temporarily using mock data to test UI
const mockPosts = [
  {
    id: '1',
    body: 'um comentário',
    username: 'John Doe',
    createdAt: '6 horas atrás',
    likeCount: 110,
    commentCount: 0,
    likes: [],
    comments: []
  },
  {
    id: '2', 
    body: 'um comentário',
    username: 'John Doe',
    createdAt: '6 horas atrás',
    likeCount: 10,
    commentCount: 3,
    likes: [],
    comments: []
  },
  {
    id: '3',
    body: 'um comentário', 
    username: 'Mary Jane',
    createdAt: '6 horas atrás',
    likeCount: 10,
    commentCount: 3,
    likes: [],
    comments: []
  },
  {
    id: '4',
    body: 'um comentário',
    username: 'Mary Jane', 
    createdAt: '6 horas atrás',
    likeCount: 100,
    commentCount: 3,
    likes: [],
    comments: []
  },
  {
    id: '5',
    body: 'um comentário',
    username: 'Mary Jane',
    createdAt: '6 horas atrás', 
    likeCount: 10,
    commentCount: 30,
    likes: [],
    comments: []
  }
];

export default function PostsFeed() {
  return (
    <>
      {mockPosts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg border border-gray-200 p-4 h-fit">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm font-medium">
                {post.username.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{post.username}</h3>
              <p className="text-sm text-gray-500">{post.createdAt}</p>
            </div>
          </div>
          
          <p className="text-gray-800 mb-4">{post.body}</p>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <button className="flex items-center space-x-1 hover:text-red-500">
              <span>❤️</span>
              <span>{post.likeCount} likes</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-500">
              <span>💬</span>
              <span>{post.commentCount} Comentários</span>
            </button>
          </div>
        </div>
      ))}
    </>
  );
}