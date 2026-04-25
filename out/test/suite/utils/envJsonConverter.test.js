"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const envJsonConverter_1 = require("../../../utils/envJsonConverter");
suite('envJsonConverter', () => {
    suite('detectFormat', () => {
        test('should detect JSON object', () => {
            assert.strictEqual((0, envJsonConverter_1.detectFormat)('{"a": 1}'), 'json');
        });
        test('should detect JSON array', () => {
            assert.strictEqual((0, envJsonConverter_1.detectFormat)('[1, 2, 3]'), 'json');
        });
        test('should detect ENV format', () => {
            assert.strictEqual((0, envJsonConverter_1.detectFormat)('KEY=value'), 'env');
        });
        test('should detect ENV with multiple lines', () => {
            assert.strictEqual((0, envJsonConverter_1.detectFormat)('KEY1=value1\nKEY2=value2'), 'env');
        });
        test('should detect ENV with comments', () => {
            assert.strictEqual((0, envJsonConverter_1.detectFormat)('# comment\nKEY=value'), 'env');
        });
        test('should return unknown for invalid format', () => {
            assert.strictEqual((0, envJsonConverter_1.detectFormat)('random text'), 'unknown');
        });
        test('should return unknown for empty string', () => {
            assert.strictEqual((0, envJsonConverter_1.detectFormat)(''), 'unknown');
        });
    });
    suite('envToJson', () => {
        test('should convert simple KEY=value to JSON', () => {
            const result = JSON.parse((0, envJsonConverter_1.envToJson)('KEY=value'));
            assert.deepStrictEqual(result, { KEY: 'value' });
        });
        test('should handle multiple lines', () => {
            const result = JSON.parse((0, envJsonConverter_1.envToJson)('KEY1=value1\nKEY2=value2'));
            assert.deepStrictEqual(result, { KEY1: 'value1', KEY2: 'value2' });
        });
        test('should skip empty lines', () => {
            const result = JSON.parse((0, envJsonConverter_1.envToJson)('KEY=value\n\nKEY2=value2'));
            assert.deepStrictEqual(result, { KEY: 'value', KEY2: 'value2' });
        });
        test('should skip comments', () => {
            const result = JSON.parse((0, envJsonConverter_1.envToJson)('# comment\nKEY=value'));
            assert.deepStrictEqual(result, { KEY: 'value' });
        });
        test('should handle trimmed values', () => {
            const result = JSON.parse((0, envJsonConverter_1.envToJson)('KEY = value '));
            assert.deepStrictEqual(result, { KEY: 'value' });
        });
        test('should handle quoted values', () => {
            const result = JSON.parse((0, envJsonConverter_1.envToJson)('KEY="value with spaces"'));
            assert.deepStrictEqual(result, { KEY: 'value with spaces' });
        });
        test('should handle single quoted values', () => {
            const result = JSON.parse((0, envJsonConverter_1.envToJson)("KEY='value'"));
            assert.deepStrictEqual(result, { KEY: 'value' });
        });
        test('should handle empty value', () => {
            const result = JSON.parse((0, envJsonConverter_1.envToJson)('KEY='));
            assert.deepStrictEqual(result, { KEY: '' });
        });
        test('should handle keys with underscores and numbers', () => {
            const result = JSON.parse((0, envJsonConverter_1.envToJson)('MY_KEY_123=value'));
            assert.deepStrictEqual(result, { MY_KEY_123: 'value' });
        });
    });
    suite('jsonToEnv', () => {
        test('should convert JSON object to ENV', () => {
            const result = (0, envJsonConverter_1.jsonToEnv)('{"KEY": "value"}');
            assert.strictEqual(result, 'KEY=value');
        });
        test('should handle nested objects with dot notation', () => {
            const result = (0, envJsonConverter_1.jsonToEnv)('{"a": {"b": "value"}}');
            assert.strictEqual(result, 'a.b=value');
        });
        test('should handle multiple key-value pairs', () => {
            const result = (0, envJsonConverter_1.jsonToEnv)('{"KEY1": "value1", "KEY2": "value2"}');
            assert.strictEqual(result, 'KEY1=value1\nKEY2=value2');
        });
        test('should handle nested arrays', () => {
            const result = (0, envJsonConverter_1.jsonToEnv)('{"a": {"b": {"c": "value"}}}');
            assert.strictEqual(result, 'a.b.c=value');
        });
        test('should handle null values', () => {
            const result = (0, envJsonConverter_1.jsonToEnv)('{"KEY": null}');
            assert.strictEqual(result, 'KEY=');
        });
        test('should quote values with spaces', () => {
            const result = (0, envJsonConverter_1.jsonToEnv)('{"KEY": "value with spaces"}');
            assert.strictEqual(result, 'KEY="value with spaces"');
        });
        test('should quote values with newlines', () => {
            const result = (0, envJsonConverter_1.jsonToEnv)('{"KEY": "value\nwith\nnewlines"}');
            assert.strictEqual(result, 'KEY="value\nwith\nnewlines"');
        });
        test('should quote values with #', () => {
            const result = (0, envJsonConverter_1.jsonToEnv)('{"KEY": "value#hash"}');
            assert.strictEqual(result, 'KEY="value#hash"');
        });
        test('should escape double quotes in values', () => {
            const result = (0, envJsonConverter_1.jsonToEnv)('{"KEY": "value\"quote"}');
            assert.strictEqual(result, 'KEY="value\"quote"');
        });
    });
    suite('convert', () => {
        test('should convert ENV to JSON', () => {
            const result = (0, envJsonConverter_1.convert)('KEY=value');
            const parsed = JSON.parse(result);
            assert.strictEqual(parsed.KEY, 'value');
        });
        test('should convert JSON to ENV', () => {
            const result = (0, envJsonConverter_1.convert)('{"KEY": "value"}');
            assert.strictEqual(result, 'KEY=value');
        });
        test('should throw error for unknown format', () => {
            assert.throws(() => (0, envJsonConverter_1.convert)('random text'), /Unable to detect format/);
        });
    });
});
//# sourceMappingURL=envJsonConverter.test.js.map