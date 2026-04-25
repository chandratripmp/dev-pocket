import * as assert from 'assert';
import { encode, decode } from '../../../utils/base64Codec';

suite('base64Codec', () => {
  suite('encode', () => {
    test('should encode single word', () => {
      const result = encode('hello');
      assert.strictEqual(result, 'hello\naGVsbG8=');
    });

    test('should encode single word with blank line separator', () => {
      const result = encode('hello');
      assert.ok(result.includes('aGVsbG8='));
    });

    test('should handle multiple lines', () => {
      const result = encode('hello\nworld');
      const lines = result.split('\n');
      assert.strictEqual(lines[0], 'hello');
      assert.strictEqual(lines[1], 'aGVsbG8=');
      assert.strictEqual(lines[2], '');
      assert.strictEqual(lines[3], 'world');
      assert.strictEqual(lines[4], 'd29ybGQ=');
    });

    test('should skip empty lines', () => {
      const result = encode('hello\n\nworld');
      const lines = result.split('\n').filter(l => l.length > 0);
      assert.strictEqual(lines.length, 4);
    });

    test('should return empty string for empty input', () => {
      const result = encode('');
      assert.strictEqual(result, '');
    });

    test('should handle special characters', () => {
      const result = encode('hello world!');
      assert.strictEqual(result, 'hello world!\naGVsbG8gd29ybGQh');
    });

    test('should handle unicode characters', () => {
      const result = encode('hello你好');
      assert.strictEqual(result, 'hello你好\naGVsbG/kvaDlpb0=');
    });

    test('should handle numbers', () => {
      const result = encode('12345');
      assert.strictEqual(result, '12345\nMTIzNDU=');
    });
  });

  suite('decode', () => {
    test('should decode single encoded string', () => {
      const result = decode('aGVsbG8=');
      assert.strictEqual(result, 'aGVsbG8=\nhello');
    });

    test('should decode multiple lines', () => {
      const result = decode('aGVsbG8=\nd29ybGQ=');
      const lines = result.split('\n');
      assert.strictEqual(lines[0], 'aGVsbG8=');
      assert.strictEqual(lines[1], 'hello');
      assert.strictEqual(lines[2], '');
      assert.strictEqual(lines[3], 'd29ybGQ=');
      assert.strictEqual(lines[4], 'world');
    });

    test('should handle base64 with whitespace', () => {
      const result = decode('  aGVsbG8=  \n  d29ybGQ=  ');
      assert.ok(result.includes('hello'));
      assert.ok(result.includes('world'));
    });

    test('should return empty string for empty input', () => {
      const result = decode('');
      assert.strictEqual(result, '');
    });

    test('should handle whitespace-only input', () => {
      const result = decode('   \n\n   ');
      assert.strictEqual(result, '');
    });

    test('should handle special characters', () => {
      const result = decode('aGVsbG8gd29ybGQh');
      assert.strictEqual(result, 'aGVsbG8gd29ybGQh\nhello world!');
    });

    test('should handle unicode characters', () => {
      const result = decode('aGVsbG/kvaDlpb0=');
      assert.strictEqual(result, 'aGVsbG/kvaDlpb0=\nhello你好');
    });
  });
});