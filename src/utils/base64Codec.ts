function isValidBase64(str: string): boolean {
  return /^[A-Za-z0-9+/]+=*$/.test(str);
}

export function encode(input: string): string {
  const lines = input.split('\n');
  const nonEmptyLines = lines.filter(line => line.trim().length > 0);

  if (nonEmptyLines.length === 0) {
    return '';
  }

  const parts: string[] = [];

  for (let i = 0; i < nonEmptyLines.length; i++) {
    const line = nonEmptyLines[i];
    const encoded = Buffer.from(line, 'utf-8').toString('base64');
    parts.push(line);
    parts.push(encoded);
    if (i < nonEmptyLines.length - 1) {
      parts.push('');
    }
  }

  return parts.join('\n');
}

export function decode(input: string): string {
  const trimmed = input.trim();

  if (!trimmed) {
    return '';
  }

  if (!trimmed.includes('\n')) {
    const cleaned = trimmed.replace(/\s/g, '');
    if (!isValidBase64(cleaned)) {
      throw new Error('Input does not appear to be valid base64.');
    }
    return Buffer.from(cleaned, 'base64').toString('utf-8');
  }

  const nonEmptyLines = trimmed.split('\n').filter(line => line.trim().length > 0);

  if (nonEmptyLines.length === 0) {
    return '';
  }

  const parts: string[] = [];
  let pairIndex = 0;

  for (let i = 0; i < nonEmptyLines.length; i++) {
    const line = nonEmptyLines[i];

    if (pairIndex % 2 === 0) {
      parts.push(line);
      pairIndex++;
    } else {
      const cleaned = line.replace(/\s/g, '');
      if (!isValidBase64(cleaned)) {
        throw new Error('Invalid base64 content at line ' + (i + 1) + '.');
      }
      const decoded = Buffer.from(cleaned, 'base64').toString('utf-8');
      parts.push(decoded);
      pairIndex++;

      if (i < nonEmptyLines.length - 1) {
        parts.push('');
      }
    }
  }

  return parts.join('\n');
}
