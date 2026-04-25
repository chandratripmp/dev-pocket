export interface ConversionResult {
  gmt: string;
  local: string;
  relative: string;
}

export function formatTimestamp(unix: number): ConversionResult {
  const isMilliseconds = unix > 9999999999;
  const ms = isMilliseconds ? unix : unix * 1000;
  const date = new Date(ms);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid timestamp');
  }

  const gmt = formatDateInZone(date, 'UTC');
  const local = formatDateInZone(date, Intl.DateTimeFormat().resolvedOptions().timeZone);
  const relative = formatRelative(date);

  return { gmt, local, relative };
}

function formatDateInZone(date: Date, timeZone: string): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    timeZone,
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(date);

  const getPart = (type: string) => parts.find(p => p.type === type)?.value || '';

  const weekday = getPart('weekday');
  const month = getPart('month');
  const day = getPart('day');
  const year = getPart('year');
  const hour = getPart('hour');
  const minute = getPart('minute');
  const second = getPart('second');
  const fractionalSecond = getPart('fractionalSecond');

  return `${weekday}, ${month} ${day}, ${year} at ${hour}:${minute}:${second}.${fractionalSecond}`;
}

function formatRelative(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const absDiff = Math.abs(diffMs);
  const isPast = diffMs > 0;

  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let timeStr: string;

  if (seconds < 60) {
    timeStr = `${seconds} second${seconds !== 1 ? 's' : ''}`;
  } else if (minutes < 60) {
    timeStr = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else if (hours < 24) {
    timeStr = `${hours} hour${hours !== 1 ? 's' : ''}`;
  } else {
    timeStr = `${days} day${days !== 1 ? 's' : ''}`;
  }

  return isPast ? `${timeStr} ago` : `in ${timeStr}`;
}

export function formatResult(result: ConversionResult): string {
  return `GMT: ${result.gmt}\nYour time zone: ${result.local}\nRelative: ${result.relative}`;
}

export function isValidUnixTimestamp(value: string): boolean {
  const num = Number(value);

  if (isNaN(num) || !Number.isInteger(num) || num <= 0) {
    return false;
  }

  const minSeconds = 0;
  const maxMs = 4102444800000;

  const isMilliseconds = num > 9999999999;
  const ms = isMilliseconds ? num : num * 1000;

  return ms >= minSeconds && ms <= maxMs;
}