import { assert } from 'poku';
import { timeAgo } from './timeAgo.js';

// Test timeAgo utility function
assert(true, 'timeAgo utility tests - Date formatting and edge cases ⏰');

// Test with null and undefined inputs
assert(timeAgo(null) === '', 'timeAgo should return empty string for null');
assert(timeAgo(undefined) === '', 'timeAgo should return empty string for undefined');
assert(timeAgo('') === '', 'timeAgo should return empty string for empty string');

// Test with Date objects
const now = new Date();
const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

const oneMinuteResult = timeAgo(oneMinuteAgo);
const oneHourResult = timeAgo(oneHourAgo);
const oneDayResult = timeAgo(oneDayAgo);

assert(typeof oneMinuteResult === 'string', 'timeAgo should return string for valid date');
assert(oneMinuteResult.length > 0, 'timeAgo should return non-empty string for recent date');
assert(typeof oneHourResult === 'string', 'timeAgo should return string for hour-old date');
assert(typeof oneDayResult === 'string', 'timeAgo should return string for day-old date');

// Test with timestamp numbers (milliseconds)
const timestampMs = now.getTime() - (5 * 60 * 1000); // 5 minutes ago
const timestampResult = timeAgo(timestampMs);
assert(typeof timestampResult === 'string', 'timeAgo should handle millisecond timestamps');
assert(timestampResult.length > 0, 'timeAgo should return non-empty string for timestamp');

// Test with timestamp numbers (seconds) - numbers less than 1e12 are treated as seconds
const timestampSec = Math.floor((now.getTime() - (10 * 60 * 1000)) / 1000); // 10 minutes ago in seconds
const timestampSecResult = timeAgo(timestampSec);
assert(typeof timestampSecResult === 'string', 'timeAgo should handle second timestamps');
assert(timestampSecResult.length > 0, 'timeAgo should return non-empty string for second timestamp');

// Test with string dates
const isoString = new Date(now.getTime() - (30 * 60 * 1000)).toISOString(); // 30 minutes ago
const isoResult = timeAgo(isoString);
assert(typeof isoResult === 'string', 'timeAgo should handle ISO date strings');
assert(isoResult.length > 0, 'timeAgo should return non-empty string for ISO string');

// Test with numeric strings
const numericString = String(now.getTime() - (2 * 60 * 1000)); // 2 minutes ago
const numericStringResult = timeAgo(numericString);
assert(typeof numericStringResult === 'string', 'timeAgo should handle numeric strings');
assert(numericStringResult.length > 0, 'timeAgo should return non-empty string for numeric string');

// Test with various time intervals
const testIntervals = [
  { offset: 30 * 1000, description: '30 seconds ago' }, // 30 seconds
  { offset: 2 * 60 * 1000, description: '2 minutes ago' }, // 2 minutes
  { offset: 3 * 60 * 60 * 1000, description: '3 hours ago' }, // 3 hours
  { offset: 2 * 24 * 60 * 60 * 1000, description: '2 days ago' }, // 2 days
  { offset: 10 * 24 * 60 * 60 * 1000, description: '10 days ago' }, // 10 days (should show weeks)
  { offset: 40 * 24 * 60 * 60 * 1000, description: '40 days ago' }, // 40 days (should show months)
];

testIntervals.forEach(({ offset, description }) => {
  const testDate = new Date(now.getTime() - offset);
  const result = timeAgo(testDate);
  assert(typeof result === 'string', `timeAgo should return string for ${description}`);
  assert(result.length > 0, `timeAgo should return non-empty string for ${description}`);
});

// Test future dates (should work with negative relative time)
const futureDate = new Date(now.getTime() + (60 * 60 * 1000)); // 1 hour in future
const futureResult = timeAgo(futureDate);
assert(typeof futureResult === 'string', 'timeAgo should handle future dates');
assert(futureResult.length > 0, 'timeAgo should return non-empty string for future dates');

// Test edge case: very old dates
const veryOldDate = new Date('1990-01-01');
const veryOldResult = timeAgo(veryOldDate);
assert(typeof veryOldResult === 'string', 'timeAgo should handle very old dates');
assert(veryOldResult.length > 0, 'timeAgo should return non-empty string for very old dates');

// Test invalid date strings
const invalidDateResult = timeAgo('not-a-date');
assert(invalidDateResult === '', 'timeAgo should return empty string for invalid date string');

// Test with zero timestamp
const zeroResult = timeAgo(0);
assert(typeof zeroResult === 'string', 'timeAgo should handle zero timestamp');

// Test consistency - same input should give same output
const testDate = new Date('2024-01-01T12:00:00Z');
const result1 = timeAgo(testDate);
const result2 = timeAgo(testDate);
assert(result1 === result2, 'timeAgo should be consistent for same input');

// Test different input formats for same time
const sameTime = new Date('2024-01-01T12:00:00Z');
const sameTimeMs = sameTime.getTime();
const sameTimeIso = sameTime.toISOString();

// Note: Results might differ slightly due to timing, but should all be strings
const dateResult = timeAgo(sameTime);
const msResult = timeAgo(sameTimeMs);
const isoStringResult = timeAgo(sameTimeIso);

assert(typeof dateResult === 'string', 'Date object input should return string');
assert(typeof msResult === 'string', 'Millisecond timestamp should return string');
assert(typeof isoStringResult === 'string', 'ISO string should return string');

console.log('✅ All timeAgo utility tests passed!');