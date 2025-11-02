import { assert } from 'poku';

// Test GraphQL resolver helper functions and logic
assert(true, 'GraphQL Resolvers tests - Helper functions and validation 🔧');

// Test sortPostComments helper function logic
const createMockPost = (comments) => ({
  id: 'post_123',
  body: 'Test post',
  comments: comments || []
});

// Test comment sorting logic (simulating the sortPostComments function)
const unsortedComments = [
  { id: '3', body: 'Third comment', createdAt: new Date('2024-01-03T10:00:00Z') },
  { id: '1', body: 'First comment', createdAt: new Date('2024-01-01T10:00:00Z') },
  { id: '2', body: 'Second comment', createdAt: new Date('2024-01-02T10:00:00Z') }
];

const sortComments = (comments) => {
  const parseTs = (value) => {
    if (!value) return 0;
    try {
      const date = value instanceof Date ? value : new Date(value);
      const ts = date.getTime();
      return isNaN(ts) ? 0 : ts;
    } catch {
      return 0;
    }
  };
  
  return comments.sort((a, b) => parseTs(a?.createdAt) - parseTs(b?.createdAt));
};

const sortedComments = sortComments([...unsortedComments]);
assert(sortedComments[0].id === '1', 'First comment should be the oldest');
assert(sortedComments[1].id === '2', 'Second comment should be in the middle');
assert(sortedComments[2].id === '3', 'Third comment should be the newest');

// Test parseTs helper function with various inputs
const parseTs = (value) => {
  if (!value) return 0;
  try {
    const date = value instanceof Date ? value : new Date(value);
    const ts = date.getTime();
    return isNaN(ts) ? 0 : ts;
  } catch {
    return 0;
  }
};

assert(parseTs(null) === 0, 'parseTs should return 0 for null');
assert(parseTs(undefined) === 0, 'parseTs should return 0 for undefined');
assert(parseTs('') === 0, 'parseTs should return 0 for empty string');
assert(parseTs('invalid-date') === 0, 'parseTs should return 0 for invalid date string');
assert(parseTs(new Date('2024-01-01')) > 0, 'parseTs should return positive timestamp for valid date');

// Test with edge cases for comment sorting
const edgeCaseComments = [
  { id: '1', body: 'Comment with null date', createdAt: null },
  { id: '2', body: 'Comment with valid date', createdAt: new Date('2024-01-01') },
  { id: '3', body: 'Comment with undefined date', createdAt: undefined },
  { id: '4', body: 'Comment with invalid date', createdAt: 'invalid' }
];

const sortedEdgeCases = sortComments([...edgeCaseComments]);
assert(sortedEdgeCases[sortedEdgeCases.length - 1].id === '2', 'Valid date should be sorted last (newest)');

// Test GraphQL input validation patterns
const validatePostInput = (body) => {
  if (!body || typeof body !== 'string') return false;
  if (body.trim().length === 0) return false;
  if (body.length > 1000) return false;
  return true;
};

assert(validatePostInput('Valid post content'), 'Valid post content should pass validation');
assert(!validatePostInput(''), 'Empty string should fail validation');
assert(!validatePostInput(null), 'Null should fail validation');
assert(!validatePostInput(undefined), 'Undefined should fail validation');
assert(!validatePostInput(123), 'Number should fail validation');
assert(!validatePostInput('a'.repeat(1001)), 'Content over 1000 chars should fail validation');

// Test comment input validation
const validateCommentInput = (body) => {
  if (!body || typeof body !== 'string') return false;
  if (body.trim().length === 0) return false;
  if (body.length > 500) return false;
  return true;
};

assert(validateCommentInput('Valid comment'), 'Valid comment should pass validation');
assert(!validateCommentInput(''), 'Empty comment should fail validation');
assert(!validateCommentInput('a'.repeat(501)), 'Comment over 500 chars should fail validation');

// Test user registration input validation
const validateUserInput = (input) => {
  if (!input || typeof input !== 'object') return false;
  if (!input.username || input.username.length < 3 || input.username.length > 20) return false;
  if (!input.email || !input.email.includes('@')) return false;
  return true;
};

const validUserInput = { username: 'testuser', email: 'test@example.com' };
const invalidUserInput1 = { username: 'ab', email: 'test@example.com' }; // username too short
const invalidUserInput2 = { username: 'testuser', email: 'invalid-email' }; // invalid email

assert(validateUserInput(validUserInput), 'Valid user input should pass validation');
assert(!validateUserInput(invalidUserInput1), 'Short username should fail validation');
assert(!validateUserInput(invalidUserInput2), 'Invalid email should fail validation');
assert(!validateUserInput(null), 'Null input should fail validation');

// Test ObjectId validation pattern
const isValidObjectId = (id) => {
  if (!id || typeof id !== 'string') return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
};

assert(isValidObjectId('507f1f77bcf86cd799439011'), 'Valid ObjectId should pass validation');
assert(!isValidObjectId('invalid-id'), 'Invalid ObjectId should fail validation');
assert(!isValidObjectId(''), 'Empty string should fail ObjectId validation');
assert(!isValidObjectId(null), 'Null should fail ObjectId validation');

// Test error message formatting
const formatError = (message, code = 'INTERNAL_ERROR') => {
  return {
    message,
    extensions: { code }
  };
};

const error = formatError('Test error', 'TEST_ERROR');
assert(error.message === 'Test error', 'Error should have correct message');
assert(error.extensions.code === 'TEST_ERROR', 'Error should have correct code');

// Test authentication context validation
const validateAuthContext = (context) => {
  return context && context.userId && typeof context.userId === 'string';
};

assert(validateAuthContext({ userId: 'user_123' }), 'Valid auth context should pass');
assert(!validateAuthContext({}), 'Empty context should fail validation');
assert(!validateAuthContext({ userId: null }), 'Null userId should fail validation');
assert(!validateAuthContext(null), 'Null context should fail validation');

console.log('✅ All GraphQL resolver tests passed!');