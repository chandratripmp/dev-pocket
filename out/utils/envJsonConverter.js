"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectFormat = detectFormat;
exports.envToJson = envToJson;
exports.flattenObject = flattenObject;
exports.jsonToEnv = jsonToEnv;
exports.convert = convert;
function detectFormat(content) {
    const trimmed = content.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
            JSON.parse(trimmed);
            return 'json';
        }
        catch {
            return 'unknown';
        }
    }
    const lines = trimmed.split('\n');
    const hasEnvFormat = lines.some(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#')) {
            return false;
        }
        return /^[\w\-\.]+=/.test(trimmedLine);
    });
    if (hasEnvFormat) {
        return 'env';
    }
    return 'unknown';
}
function envToJson(envContent) {
    const lines = envContent.split('\n');
    const result = {};
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
            continue;
        }
        const eqIndex = trimmed.indexOf('=');
        if (eqIndex === -1) {
            continue;
        }
        const key = trimmed.slice(0, eqIndex).trim();
        let value = trimmed.slice(eqIndex + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        if (key) {
            result[key] = value;
        }
    }
    return JSON.stringify(result, null, 2);
}
function flattenObject(obj, prefix = '') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (value === null) {
            result[newKey] = '';
        }
        else if (typeof value === 'object' && value !== undefined) {
            Object.assign(result, flattenObject(value, newKey));
        }
        else {
            result[newKey] = String(value);
        }
    }
    return result;
}
function jsonToEnv(jsonContent) {
    const parsed = JSON.parse(jsonContent);
    if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Input must be a JSON object');
    }
    const flat = flattenObject(parsed);
    const lines = [];
    for (const [key, value] of Object.entries(flat)) {
        const needsQuotes = value.includes(' ') || value.includes('\n') || value.includes('#');
        let formattedValue = value
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n');
        if (needsQuotes) {
            formattedValue = `"${formattedValue}"`;
        }
        lines.push(`${key}=${formattedValue}`);
    }
    return lines.join('\n');
}
function convert(content) {
    const format = detectFormat(content);
    if (format === 'env') {
        return envToJson(content);
    }
    if (format === 'json') {
        return jsonToEnv(content);
    }
    throw new Error('Unable to detect format. Please provide valid ENV or JSON content.');
}
//# sourceMappingURL=envJsonConverter.js.map