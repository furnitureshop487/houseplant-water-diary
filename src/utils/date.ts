const MS_PER_DAY = 86400000;

const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

/** Local midnight of the given date, as an ISO-like `YYYY-MM-DD` key. */
export function toDayKey(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function today(): string {
  return toDayKey(new Date());
}

export function fromDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(n => parseInt(n, 10));
  return new Date(y, (m || 1) - 1, d || 1);
}

export function shiftDays(key: string, delta: number): string {
  const d = fromDayKey(key);
  d.setDate(d.getDate() + delta);
  return toDayKey(d);
}

/** Whole days elapsed between `key` and today. Negative means in the future. */
export function daysSince(key: string): number {
  const a = fromDayKey(key).getTime();
  const b = fromDayKey(today()).getTime();
  return Math.round((b - a) / MS_PER_DAY);
}

/** `12 NOV` - uppercase, ASCII only. */
export function formatDate(key: string): string {
  const d = fromDayKey(key);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function relativeLabel(key: string): string {
  const n = daysSince(key);
  if (n <= 0) return 'TODAY';
  if (n === 1) return 'YESTERDAY';
  if (n < 7) return `${n} DAYS AGO`;
  if (n < 14) return 'LAST WEEK';
  if (n < 60) return `${Math.floor(n / 7)} WEEKS AGO`;
  return `${Math.floor(n / 30)} MONTHS AGO`;
}
