// JavaScript version of timeAgo function for testing
export function timeAgo(input) {
  if (!input) return '';

  let date;
  if (input instanceof Date) {
    date = input;
  } else if (typeof input === 'number') {
    // treat numbers < 1e12 as seconds timestamp
    date = new Date(input < 1e12 ? input * 1000 : input);
  } else if (typeof input === 'string') {
    if (/^\d+$/.test(input)) {
      const num = Number(input);
      date = new Date(num < 1e12 ? num * 1000 : num);
    } else {
      date = new Date(input);
    }
  } else {
    return '';
  }

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return '';
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);

  // Handle edge cases for very large differences
  if (!isFinite(diffSec) || Math.abs(diffSec) > 1e10) {
    return '';
  }

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const divisions = [
    { amount: 60, unit: 'seconds' },
    { amount: 60, unit: 'minutes' },
    { amount: 24, unit: 'hours' },
    { amount: 7, unit: 'days' },
    { amount: 4.34524, unit: 'weeks' }, // approx weeks in month
    { amount: 12, unit: 'months' },
    { amount: 10, unit: 'years' }
  ];

  let duration = diffSec;
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      // Ensure duration is finite before formatting
      if (!isFinite(duration)) {
        return '';
      }
      return rtf.format(-duration, division.unit);
    }
    duration = Math.round(duration / division.amount);
  }
  
  // Final check for finite duration
  if (!isFinite(duration)) {
    return '';
  }
  
  return rtf.format(-duration, 'years');
}