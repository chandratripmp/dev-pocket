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
const unixConverter_1 = require("../../utils/unixConverter");
suite('unixConverter', () => {
    suite('isValidUnixTimestamp', () => {
        test('should return true for valid seconds timestamp', () => {
            assert.strictEqual((0, unixConverter_1.isValidUnixTimestamp)('1609459200'), true);
        });
        test('should return true for valid milliseconds timestamp', () => {
            assert.strictEqual((0, unixConverter_1.isValidUnixTimestamp)('1609459200000'), true);
        });
        test('should return false for negative number', () => {
            assert.strictEqual((0, unixConverter_1.isValidUnixTimestamp)('-100'), false);
        });
        test('should return false for zero', () => {
            assert.strictEqual((0, unixConverter_1.isValidUnixTimestamp)('0'), false);
        });
        test('should return false for non-integer', () => {
            assert.strictEqual((0, unixConverter_1.isValidUnixTimestamp)('123.456'), false);
        });
        test('should return false for non-numeric string', () => {
            assert.strictEqual((0, unixConverter_1.isValidUnixTimestamp)('abc'), false);
        });
        test('should return false for very small number', () => {
            assert.strictEqual((0, unixConverter_1.isValidUnixTimestamp)('1'), false);
        });
        test('should return true for 10 digit timestamp', () => {
            assert.strictEqual((0, unixConverter_1.isValidUnixTimestamp)('1000000000'), true);
        });
        test('should return true for 13 digit timestamp', () => {
            assert.strictEqual((0, unixConverter_1.isValidUnixTimestamp)('1000000000000'), true);
        });
        test('should return false for timestamp beyond year 2100', () => {
            assert.strictEqual((0, unixConverter_1.isValidUnixTimestamp)('4102444800001'), false);
        });
        test('should return true for current timestamp', () => {
            const nowSeconds = Math.floor(Date.now() / 1000).toString();
            assert.strictEqual((0, unixConverter_1.isValidUnixTimestamp)(nowSeconds), true);
        });
    });
    suite('formatTimestamp', () => {
        test('should format timestamp in seconds', () => {
            const result = (0, unixConverter_1.formatTimestamp)(1609459200);
            assert.ok(result.gmt.includes('2021'));
            assert.ok(result.local.length > 0);
            assert.ok(result.relative.length > 0);
        });
        test('should format timestamp in milliseconds', () => {
            const result = (0, unixConverter_1.formatTimestamp)(1609459200000);
            assert.ok(result.gmt.includes('2021'));
            assert.ok(result.local.length > 0);
            assert.ok(result.relative.length > 0);
        });
        test('should include GMT label', () => {
            const result = (0, unixConverter_1.formatTimestamp)(1609459200);
            assert.ok(result.gmt.startsWith('Saturday') || result.gmt.startsWith('Friday'));
        });
        test('should include relative time', () => {
            const result = (0, unixConverter_1.formatTimestamp)(1609459200);
            assert.ok(result.relative.includes('ago') || result.relative.includes('in '));
        });
        test('should include fractional seconds', () => {
            const result = (0, unixConverter_1.formatTimestamp)(1609459200123);
            assert.ok(result.gmt.includes('.'));
        });
        test('should throw for invalid timestamp', () => {
            assert.throws(() => (0, unixConverter_1.formatTimestamp)(-1));
        });
        test('should handle future timestamp', () => {
            const futureTimestamp = Math.floor(Date.now() / 1000) + 86400;
            const result = (0, unixConverter_1.formatTimestamp)(futureTimestamp);
            assert.ok(result.relative.startsWith('in '));
        });
        test('should handle past timestamp', () => {
            const pastTimestamp = Math.floor(Date.now() / 1000) - 86400;
            const result = (0, unixConverter_1.formatTimestamp)(pastTimestamp);
            assert.ok(result.relative.endsWith('ago'));
        });
    });
    suite('formatResult', () => {
        test('should format result with all parts', () => {
            const timestamp = Math.floor(Date.now() / 1000) - 60;
            const result = (0, unixConverter_1.formatTimestamp)(timestamp);
            const formatted = (0, unixConverter_1.formatResult)(result);
            assert.ok(formatted.includes('GMT:'));
            assert.ok(formatted.includes('Your time zone:'));
            assert.ok(formatted.includes('Relative:'));
        });
        test('should have proper newlines between parts', () => {
            const result = (0, unixConverter_1.formatTimestamp)(1609459200);
            const formatted = (0, unixConverter_1.formatResult)(result);
            const parts = formatted.split('\n');
            assert.strictEqual(parts.length, 3);
            assert.ok(formatted.includes('\n'));
        });
    });
});
//# sourceMappingURL=unixConverter.test.js.map