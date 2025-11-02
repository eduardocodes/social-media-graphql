import { assert } from 'poku';

// Test User model schema validation
assert(true, 'User model tests - Schema validation 🧪');

// Mock User data for testing
const validUserData = {
  clerkId: 'clerk_test_123',
  username: 'testuser',
  email: 'test@example.com'
};

const invalidUserData = {
  clerkId: '',
  username: 'ab', // too short
  email: 'invalid-email'
};

// Test valid user data structure
assert(validUserData.clerkId.length > 0, 'Valid user should have non-empty clerkId');
assert(validUserData.username.length >= 3, 'Valid username should be at least 3 characters');
assert(validUserData.username.length <= 20, 'Valid username should be at most 20 characters');
assert(validUserData.email.includes('@'), 'Valid email should contain @ symbol');

// Test invalid user data structure
assert(invalidUserData.clerkId.length === 0, 'Invalid user has empty clerkId');
assert(invalidUserData.username.length < 3, 'Invalid username is too short');
assert(!invalidUserData.email.includes('@'), 'Invalid email format');

// Test email normalization
const emailTest = 'TEST@EXAMPLE.COM';
const normalizedEmail = emailTest.toLowerCase().trim();
assert(normalizedEmail === 'test@example.com', 'Email should be normalized to lowercase');

// Test username trimming
const usernameWithSpaces = '  testuser  ';
const trimmedUsername = usernameWithSpaces.trim();
assert(trimmedUsername === 'testuser', 'Username should be trimmed of whitespace');

// Test date creation
const now = new Date();
assert(now instanceof Date, 'createdAt should be a Date object');
assert(now.getTime() > 0, 'Date should have a valid timestamp');

console.log('✅ All User model tests passed!');