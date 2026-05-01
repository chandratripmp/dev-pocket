import * as assert from 'assert';
import { detectFormat, envToJson, jsonToEnv, convert } from '../../../utils/envJsonConverter';

suite('envJsonConverter', () => {
  suite('detectFormat', () => {
    test('should detect JSON object', () => {
      assert.strictEqual(detectFormat('{"a": 1}'), 'json');
    });

    test('should detect JSON array', () => {
      assert.strictEqual(detectFormat('[1, 2, 3]'), 'json');
    });

    test('should detect ENV format', () => {
      assert.strictEqual(detectFormat('KEY=value'), 'env');
    });

    test('should detect ENV with multiple lines', () => {
      assert.strictEqual(detectFormat('KEY1=value1\nKEY2=value2'), 'env');
    });

    test('should detect ENV with comments', () => {
      assert.strictEqual(detectFormat('# comment\nKEY=value'), 'env');
    });

    test('should return unknown for invalid format', () => {
      assert.strictEqual(detectFormat('random text'), 'unknown');
    });

    test('should return unknown for empty string', () => {
      assert.strictEqual(detectFormat(''), 'unknown');
    });
  });

  suite('envToJson', () => {
    test('should convert simple KEY=value to JSON', () => {
      const result = JSON.parse(envToJson('KEY=value'));
      assert.deepStrictEqual(result, { KEY: 'value' });
    });

    test('should handle multiple lines', () => {
      const result = JSON.parse(envToJson('KEY1=value1\nKEY2=value2'));
      assert.deepStrictEqual(result, { KEY1: 'value1', KEY2: 'value2' });
    });

    test('should skip empty lines', () => {
      const result = JSON.parse(envToJson('KEY=value\n\nKEY2=value2'));
      assert.deepStrictEqual(result, { KEY: 'value', KEY2: 'value2' });
    });

    test('should skip comments', () => {
      const result = JSON.parse(envToJson('# comment\nKEY=value'));
      assert.deepStrictEqual(result, { KEY: 'value' });
    });

    test('should handle trimmed values', () => {
      const result = JSON.parse(envToJson('KEY = value '));
      assert.deepStrictEqual(result, { KEY: 'value' });
    });

    test('should handle quoted values', () => {
      const result = JSON.parse(envToJson('KEY="value with spaces"'));
      assert.deepStrictEqual(result, { KEY: 'value with spaces' });
    });

    test('should handle single quoted values', () => {
      const result = JSON.parse(envToJson("KEY='value'"));
      assert.deepStrictEqual(result, { KEY: 'value' });
    });

    test('should handle empty value', () => {
      const result = JSON.parse(envToJson('KEY='));
      assert.deepStrictEqual(result, { KEY: '' });
    });

    test('should handle keys with underscores and numbers', () => {
      const result = JSON.parse(envToJson('MY_KEY_123=value'));
      assert.deepStrictEqual(result, { MY_KEY_123: 'value' });
    });
  });

  suite('jsonToEnv', () => {
    test('should convert JSON object to ENV', () => {
      const result = jsonToEnv('{"KEY": "value"}');
      assert.strictEqual(result, 'KEY=value');
    });

    test('should handle nested objects with dot notation', () => {
      const result = jsonToEnv('{"a": {"b": "value"}}');
      assert.strictEqual(result, 'a.b=value');
    });

    test('should handle multiple key-value pairs', () => {
      const result = jsonToEnv('{"KEY1": "value1", "KEY2": "value2"}');
      assert.strictEqual(result, 'KEY1=value1\nKEY2=value2');
    });

    test('should handle nested arrays', () => {
      const result = jsonToEnv('{"a": {"b": {"c": "value"}}}');
      assert.strictEqual(result, 'a.b.c=value');
    });

    test('should handle null values', () => {
      const result = jsonToEnv('{"KEY": null}');
      assert.strictEqual(result, 'KEY=');
    });

    test('should quote values with spaces', () => {
      const result = jsonToEnv('{"KEY": "value with spaces"}');
      assert.strictEqual(result, 'KEY="value with spaces"');
    });

    test('should quote values with newlines', () => {
      const result = jsonToEnv('{"KEY": "value\\nwith\\nnewlines"}');
      console.log("result", result);
      assert.strictEqual(result, 'KEY="value\\nwith\\nnewlines"');
    });

    test('should quote values with #', () => {
      const result = jsonToEnv('{"KEY": "value#hash"}');
      assert.strictEqual(result, 'KEY="value#hash"');
    });

    test('should escape double quotes in values', () => {
      const result = jsonToEnv('{"KEY": "value\\"quote"}');
      assert.strictEqual(result, 'KEY="value\\"quote"');
    });
  });

  suite('convert', () => {
    test('should convert ENV to JSON', () => {
      const result = convert('KEY=value');
      const parsed = JSON.parse(result);
      assert.strictEqual(parsed.KEY, 'value');
    });

    test('should convert JSON to ENV', () => {
      const result = convert('{"KEY": "value"}');
      assert.strictEqual(result, 'KEY=value');
    });

    test('should throw error for unknown format', () => {
      assert.throws(() => convert('random text'), /Unable to detect format/);
    });
  });
});