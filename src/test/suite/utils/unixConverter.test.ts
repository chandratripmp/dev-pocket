import * as assert from 'assert';
import { formatTimestamp, formatResult, isValidUnixTimestamp } from '../../utils/unixConverter';

suite('unixConverter', () => {
  suite('isValidUnixTimestamp', () => {
    test('should return true for valid seconds timestamp', () => {
      assert.strictEqual(isValidUnixTimestamp('1609459200'), true);
    });

    test('should return true for valid milliseconds timestamp', () => {
      assert.strictEqual(isValidUnixTimestamp('1609459200000'), true);
    });

    test('should return false for negative number', () => {
      assert.strictEqual(isValidUnixTimestamp('-100'), false);
    });

    test('should return false for zero', () => {
      assert.strictEqual(isValidUnixTimestamp('0'), false);
    });

    test('should return false for non-integer', () => {
      assert.strictEqual(isValidUnixTimestamp('123.456'), false);
    });

    test('should return false for non-numeric string', () => {
      assert.strictEqual(isValidUnixTimestamp('abc'), false);
    });

    test('should return false for very small number', () => {
      assert.strictEqual(isValidUnixTimestamp('1'), false);
    });

    test('should return true for 10 digit timestamp', () => {
      assert.strictEqual(isValidUnixTimestamp('1000000000'), true);
    });

    test('should return true for 13 digit timestamp', () => {
      assert.strictEqual(isValidUnixTimestamp('1000000000000'), true);
    });

    test('should return false for timestamp beyond year 2100', () => {
      assert.strictEqual(isValidUnixTimestamp('4102444800001'), false);
    });

    test('should return true for current timestamp', () => {
      const nowSeconds = Math.floor(Date.now() / 1000).toString();
      assert.strictEqual(isValidUnixTimestamp(nowSeconds), true);
    });
  });

  suite('formatTimestamp', () => {
    test('should format timestamp in seconds', () => {
      const result = formatTimestamp(1609459200);
      assert.ok(result.gmt.includes('2021'));
      assert.ok(result.local.length > 0);
      assert.ok(result.relative.length > 0);
    });

    test('should format timestamp in milliseconds', () => {
      const result = formatTimestamp(1609459200000);
      assert.ok(result.gmt.includes('2021'));
      assert.ok(result.local.length > 0);
      assert.ok(result.relative.length > 0);
    });

    test('should include GMT label', () => {
      const result = formatTimestamp(1609459200);
      assert.ok(result.gmt.startsWith('Saturday') || result.gmt.startsWith('Friday'));
    });

    test('should include relative time', () => {
      const result = formatTimestamp(1609459200);
      assert.ok(result.relative.includes('ago') || result.relative.includes('in '));
    });

    test('should include fractional seconds', () => {
      const result = formatTimestamp(1609459200123);
      assert.ok(result.gmt.includes('.'));
    });

    test('should throw for invalid timestamp', () => {
      assert.throws(() => formatTimestamp(-1));
    });

    test('should handle future timestamp', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 86400;
      const result = formatTimestamp(futureTimestamp);
      assert.ok(result.relative.startsWith('in '));
    });

    test('should handle past timestamp', () => {
      const pastTimestamp = Math.floor(Date.now() / 1000) - 86400;
      const result = formatTimestamp(pastTimestamp);
      assert.ok(result.relative.endsWith('ago'));
    });
  });

  suite('formatResult', () => {
    test('should format result with all parts', () => {
      const timestamp = Math.floor(Date.now() / 1000) - 60;
      const result = formatTimestamp(timestamp);
      const formatted = formatResult(result);

      assert.ok(formatted.includes('GMT:'));
      assert.ok(formatted.includes('Your time zone:'));
      assert.ok(formatted.includes('Relative:'));
    });

    test('should have proper newlines between parts', () => {
      const result = formatTimestamp(1609459200);
      const formatted = formatResult(result);
      const parts = formatted.split('\n');

      assert.strictEqual(parts.length, 3);
      assert.ok(formatted.includes('\n'));
    });
  });
});