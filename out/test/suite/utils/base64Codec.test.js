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
const base64Codec_1 = require("../../../utils/base64Codec");
suite('base64Codec', () => {
    suite('encode', () => {
        test('should encode single word', () => {
            const result = (0, base64Codec_1.encode)('hello');
            assert.strictEqual(result, 'hello\naGVsbG8=');
        });
        test('should encode single word with blank line separator', () => {
            const result = (0, base64Codec_1.encode)('hello');
            assert.ok(result.includes('aGVsbG8='));
        });
        test('should handle multiple lines', () => {
            const result = (0, base64Codec_1.encode)('hello\nworld');
            const lines = result.split('\n');
            assert.strictEqual(lines[0], 'hello');
            assert.strictEqual(lines[1], 'aGVsbG8=');
            assert.strictEqual(lines[2], '');
            assert.strictEqual(lines[3], 'world');
            assert.strictEqual(lines[4], 'd29ybGQ=');
        });
        test('should skip empty lines', () => {
            const result = (0, base64Codec_1.encode)('hello\n\nworld');
            const lines = result.split('\n').filter(l => l.length > 0);
            assert.strictEqual(lines.length, 4);
        });
        test('should return empty string for empty input', () => {
            const result = (0, base64Codec_1.encode)('');
            assert.strictEqual(result, '');
        });
        test('should handle special characters', () => {
            const result = (0, base64Codec_1.encode)('hello world!');
            assert.strictEqual(result, 'hello world!\naGVsbG8gd29ybGQh');
        });
        test('should handle unicode characters', () => {
            const result = (0, base64Codec_1.encode)('hello你好');
            assert.strictEqual(result, 'hello你好\naGVsbG/kvaDlpb0=');
        });
        test('should handle numbers', () => {
            const result = (0, base64Codec_1.encode)('12345');
            assert.strictEqual(result, '12345\nMTIzNDU=');
        });
    });
    suite('decode', () => {
        test('should decode single encoded string', () => {
            const result = (0, base64Codec_1.decode)('aGVsbG8=');
            assert.strictEqual(result, 'aGVsbG8=\nhello');
        });
        test('should decode multiple lines', () => {
            const result = (0, base64Codec_1.decode)('aGVsbG8=\nd29ybGQ=');
            const lines = result.split('\n');
            assert.strictEqual(lines[0], 'aGVsbG8=');
            assert.strictEqual(lines[1], 'hello');
            assert.strictEqual(lines[2], '');
            assert.strictEqual(lines[3], 'd29ybGQ=');
            assert.strictEqual(lines[4], 'world');
        });
        test('should handle base64 with whitespace', () => {
            const result = (0, base64Codec_1.decode)('  aGVsbG8=  \n  d29ybGQ=  ');
            assert.ok(result.includes('hello'));
            assert.ok(result.includes('world'));
        });
        test('should return empty string for empty input', () => {
            const result = (0, base64Codec_1.decode)('');
            assert.strictEqual(result, '');
        });
        test('should handle whitespace-only input', () => {
            const result = (0, base64Codec_1.decode)('   \n\n   ');
            assert.strictEqual(result, '');
        });
        test('should handle special characters', () => {
            const result = (0, base64Codec_1.decode)('aGVsbG8gd29ybGQh');
            assert.strictEqual(result, 'aGVsbG8gd29ybGQh\nhello world!');
        });
        test('should handle unicode characters', () => {
            const result = (0, base64Codec_1.decode)('aGVsbG/kvaDlpb0=');
            assert.strictEqual(result, 'aGVsbG/kvaDlpb0=\nhello你好');
        });
    });
});
//# sourceMappingURL=base64Codec.test.js.map