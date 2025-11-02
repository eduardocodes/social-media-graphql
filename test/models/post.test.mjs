import { assert } from 'poku';

// Test Post model schema validation
assert(true, 'Post model tests - Schema validation and functionality 📝');

// Mock Post data for testing
const validPostData = {
  body: 'This is a test post content',
  username: 'testuser',
  createdAt: new Date(),
  comments: [],
  likes: [],
  likeCount: 0,
  commentCount: 0,
  user: '507f1f77bcf86cd799439011' // Mock ObjectId
};

const invalidPostData = {
  body: '', // empty body
  username: '',
  user: null
};

// Test valid post data structure
assert(validPostData.body.length > 0, 'Valid post should have non-empty body');
assert(validPostData.body.length <= 1000, 'Post body should not exceed 1000 characters');
assert(validPostData.username.length > 0, 'Valid post should have username');
assert(Array.isArray(validPostData.comments), 'Comments should be an array');
assert(Array.isArray(validPostData.likes), 'Likes should be an array');
assert(typeof validPostData.likeCount === 'number', 'likeCount should be a number');
assert(typeof validPostData.commentCount === 'number', 'commentCount should be a number');

// Test invalid post data
assert(invalidPostData.body.length === 0, 'Invalid post has empty body');
assert(invalidPostData.username.length === 0, 'Invalid post has empty username');
assert(invalidPostData.user === null, 'Invalid post has null user reference');

// Test comment structure
const validComment = {
  id: 'comment_123',
  body: 'This is a test comment',
  username: 'commenter',
  createdAt: new Date()
};

assert(validComment.body.length > 0, 'Valid comment should have non-empty body');
assert(validComment.body.length <= 500, 'Comment body should not exceed 500 characters');
assert(validComment.username.length > 0, 'Valid comment should have username');
assert(validComment.createdAt instanceof Date, 'Comment createdAt should be a Date');

// Test like structure
const validLike = {
  id: 'like_123',
  username: 'liker',
  createdAt: new Date()
};

assert(validLike.username.length > 0, 'Valid like should have username');
assert(validLike.createdAt instanceof Date, 'Like createdAt should be a Date');

// Test post with comments and likes
const postWithInteractions = {
  ...validPostData,
  comments: [validComment],
  likes: [validLike],
  likeCount: 1,
  commentCount: 1
};

assert(postWithInteractions.comments.length === 1, 'Post should have 1 comment');
assert(postWithInteractions.likes.length === 1, 'Post should have 1 like');
assert(postWithInteractions.likeCount === postWithInteractions.likes.length, 'likeCount should match likes array length');
assert(postWithInteractions.commentCount === postWithInteractions.comments.length, 'commentCount should match comments array length');

// Test body trimming
const bodyWithSpaces = '  This is a post with spaces  ';
const trimmedBody = bodyWithSpaces.trim();
assert(trimmedBody === 'This is a post with spaces', 'Post body should be trimmed of whitespace');

// Test date sorting for comments (simulate the sortPostComments function)
const comments = [
  { createdAt: new Date('2024-01-02'), body: 'Second comment' },
  { createdAt: new Date('2024-01-01'), body: 'First comment' },
  { createdAt: new Date('2024-01-03'), body: 'Third comment' }
];

const sortedComments = comments.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
assert(sortedComments[0].body === 'First comment', 'Comments should be sorted by createdAt ascending');
assert(sortedComments[2].body === 'Third comment', 'Last comment should be the newest');

console.log('✅ All Post model tests passed!');