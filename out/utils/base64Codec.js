"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = encode;
exports.decode = decode;
function encode(input) {
    const lines = input.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    if (nonEmptyLines.length === 0) {
        return '';
    }
    const parts = [];
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
function decode(input) {
    const trimmed = input.trim();
    const lines = trimmed.split('\n').filter(line => line.trim().length > 0);
    if (lines.length === 0) {
        return '';
    }
    const parts = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const cleaned = line.replace(/\s/g, '');
        const decoded = Buffer.from(cleaned, 'base64').toString('utf-8');
        parts.push(line);
        parts.push(decoded);
        if (i < lines.length - 1) {
            parts.push('');
        }
    }
    return parts.join('\n');
}
//# sourceMappingURL=base64Codec.js.map