export function timeAgo(input: string | number | Date | null | undefined): string {
  if (!input) return '';

  let date: Date;
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

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const divisions: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
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
      return rtf.format(-duration, division.unit);
    }
    duration = Math.round(duration / division.amount);
  }
  return rtf.format(-duration, 'years');
}