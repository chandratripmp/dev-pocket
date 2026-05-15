"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode10 = __toESM(require("vscode"));

// src/commands/envJsonConvert.ts
var vscode = __toESM(require("vscode"));

// src/utils/envJsonConverter.ts
function detectFormat(content) {
  const trimmed = content.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      JSON.parse(trimmed);
      return "json";
    } catch {
      return "unknown";
    }
  }
  const lines = trimmed.split("\n");
  const hasEnvFormat = lines.some((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) {
      return false;
    }
    return /^[\w\-\.]+=/.test(trimmedLine);
  });
  if (hasEnvFormat) {
    return "env";
  }
  return "unknown";
}
function envToJson(envContent) {
  const lines = envContent.split("\n");
  const result = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) {
      continue;
    }
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    if (key) {
      result[key] = value;
    }
  }
  return JSON.stringify(result, null, 2);
}
function flattenObject(obj, prefix = "") {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (value === null) {
      result[newKey] = "";
    } else if (typeof value === "object" && value !== void 0) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = String(value);
    }
  }
  return result;
}
function jsonToEnv(jsonContent) {
  const parsed = JSON.parse(jsonContent);
  console.log("jsonContent", jsonContent);
  console.log("parsed", parsed);
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Input must be a JSON object");
  }
  const flat = flattenObject(parsed);
  const lines = [];
  for (const [key, value] of Object.entries(flat)) {
    const needsQuotes = value.includes(" ") || value.includes("\n") || value.includes('"') || value.includes("#");
    let formattedValue = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
    if (needsQuotes) {
      formattedValue = `"${formattedValue}"`;
    }
    lines.push(`${key}=${formattedValue}`);
  }
  return lines.join("\n");
}
function convert(content) {
  const format = detectFormat(content);
  if (format === "env") {
    return envToJson(content);
  }
  if (format === "json") {
    return jsonToEnv(content);
  }
  throw new Error("Unable to detect format. Please provide valid ENV or JSON content.");
}

// src/commands/envJsonConvert.ts
function registerCommand(context) {
  const disposable = vscode.commands.registerCommand("dev-pocket.envJsonConvert", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No active editor found.");
      return;
    }
    const selection = editor.selection;
    const document = editor.document;
    let content;
    if (!selection.isEmpty) {
      content = document.getText(selection);
    } else {
      const fullRange = new vscode.Range(0, 0, document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
      content = document.getText(fullRange);
    }
    if (!content.trim()) {
      vscode.window.showErrorMessage("No content to convert.");
      return;
    }
    try {
      const converted = convert(content);
      if (!selection.isEmpty) {
        await editor.edit((editBuilder) => {
          editBuilder.replace(selection, converted);
        });
      } else {
        const fullRange = new vscode.Range(0, 0, document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
        await editor.edit((editBuilder) => {
          editBuilder.replace(fullRange, converted);
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred.";
      vscode.window.showErrorMessage(`Conversion failed: ${message}`);
    }
  });
  context.subscriptions.push(disposable);
}

// src/commands/base64Encode.ts
var vscode2 = __toESM(require("vscode"));

// src/utils/base64Codec.ts
function encode(input) {
  const lines = input.split("\n");
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
  if (nonEmptyLines.length === 0) {
    return "";
  }
  const parts = [];
  for (let i = 0; i < nonEmptyLines.length; i++) {
    const line = nonEmptyLines[i];
    const encoded = Buffer.from(line, "utf-8").toString("base64");
    parts.push(line);
    parts.push(encoded);
    if (i < nonEmptyLines.length - 1) {
      parts.push("");
    }
  }
  return parts.join("\n");
}
function decode(input) {
  const trimmed = input.trim();
  const lines = trimmed.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return "";
  }
  const parts = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cleaned = line.replace(/\s/g, "");
    const decoded = Buffer.from(cleaned, "base64").toString("utf-8");
    parts.push(line);
    parts.push(decoded);
    if (i < lines.length - 1) {
      parts.push("");
    }
  }
  return parts.join("\n");
}

// src/commands/base64Encode.ts
function registerCommand2(context) {
  const disposable = vscode2.commands.registerCommand("dev-pocket.base64Encode", async () => {
    const editor = vscode2.window.activeTextEditor;
    if (!editor) {
      vscode2.window.showErrorMessage("No active editor found.");
      return;
    }
    const selection = editor.selection;
    const document = editor.document;
    let content;
    if (!selection.isEmpty) {
      content = document.getText(selection);
    } else {
      const fullRange = new vscode2.Range(
        0,
        0,
        document.lineCount - 1,
        document.lineAt(document.lineCount - 1).text.length
      );
      content = document.getText(fullRange);
    }
    if (!content.trim()) {
      vscode2.window.showErrorMessage("No content to encode.");
      return;
    }
    try {
      const encoded = encode(content);
      const newContent = content + "\n\n" + encoded;
      if (!selection.isEmpty) {
        await editor.edit((editBuilder) => {
          editBuilder.replace(selection, newContent);
        });
      } else {
        const fullRange = new vscode2.Range(
          0,
          0,
          document.lineCount - 1,
          document.lineAt(document.lineCount - 1).text.length
        );
        await editor.edit((editBuilder) => {
          editBuilder.replace(fullRange, newContent);
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred.";
      vscode2.window.showErrorMessage(`Encoding failed: ${message}`);
    }
  });
  context.subscriptions.push(disposable);
}

// src/commands/base64Decode.ts
var vscode3 = __toESM(require("vscode"));
function registerCommand3(context) {
  const disposable = vscode3.commands.registerCommand("dev-pocket.base64Decode", async () => {
    const editor = vscode3.window.activeTextEditor;
    if (!editor) {
      vscode3.window.showErrorMessage("No active editor found.");
      return;
    }
    const selection = editor.selection;
    const document = editor.document;
    let content;
    if (!selection.isEmpty) {
      content = document.getText(selection);
    } else {
      const fullRange = new vscode3.Range(
        0,
        0,
        document.lineCount - 1,
        document.lineAt(document.lineCount - 1).text.length
      );
      content = document.getText(fullRange);
    }
    if (!content.trim()) {
      vscode3.window.showErrorMessage("No content to decode.");
      return;
    }
    try {
      const decoded = decode(content);
      const newContent = content + "\n\n" + decoded;
      if (!selection.isEmpty) {
        await editor.edit((editBuilder) => {
          editBuilder.replace(selection, newContent);
        });
      } else {
        const fullRange = new vscode3.Range(
          0,
          0,
          document.lineCount - 1,
          document.lineAt(document.lineCount - 1).text.length
        );
        await editor.edit((editBuilder) => {
          editBuilder.replace(fullRange, newContent);
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred.";
      vscode3.window.showErrorMessage(`Decoding failed: ${message}`);
    }
  });
  context.subscriptions.push(disposable);
}

// src/commands/jsonMinify.ts
var vscode4 = __toESM(require("vscode"));
function registerCommand4(context) {
  const disposable = vscode4.commands.registerCommand("dev-pocket.jsonMinify", async () => {
    const editor = vscode4.window.activeTextEditor;
    if (!editor) {
      vscode4.window.showErrorMessage("No active editor found.");
      return;
    }
    const selection = editor.selection;
    const document = editor.document;
    let content;
    let isSelection = false;
    if (!selection.isEmpty) {
      content = document.getText(selection);
      isSelection = true;
    } else {
      const fullRange = new vscode4.Range(
        0,
        0,
        document.lineCount - 1,
        document.lineAt(document.lineCount - 1).text.length
      );
      content = document.getText(fullRange);
    }
    if (!content.trim()) {
      vscode4.window.showErrorMessage("No content to minify.");
      return;
    }
    try {
      await vscode4.languages.setTextDocumentLanguage(document, "json");
      const trimmed = content.trim();
      const minified = minifyContent(trimmed);
      if (isSelection) {
        await editor.edit((editBuilder) => {
          editBuilder.replace(selection, minified);
        });
      } else {
        const fullRange = new vscode4.Range(
          0,
          0,
          document.lineCount - 1,
          document.lineAt(document.lineCount - 1).text.length
        );
        await editor.edit((editBuilder) => {
          editBuilder.replace(fullRange, minified);
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred.";
      vscode4.window.showErrorMessage(`Minification failed: ${message}`);
    }
  });
  context.subscriptions.push(disposable);
}
function minifyContent(content) {
  const trimmed = content.trim();
  if (trimmed.startsWith("[")) {
    const arr = JSON.parse(trimmed);
    if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === "object") {
      return arr.map((item) => JSON.stringify(item)).join("\n\n");
    }
    return JSON.stringify(arr);
  }
  if (trimmed.startsWith("{")) {
    try {
      JSON.parse(trimmed);
      return JSON.stringify(JSON.parse(trimmed));
    } catch {
      const objects2 = extractMultipleObjects(trimmed);
      if (objects2.length > 1) {
        return objects2.map((obj) => JSON.stringify(JSON.parse(obj))).join("\n\n");
      }
      throw new Error("Invalid JSON");
    }
  }
  const objects = extractMultipleObjects(trimmed);
  if (objects.length > 1) {
    return objects.map((obj) => JSON.stringify(JSON.parse(obj))).join("\n\n");
  }
  return JSON.stringify(JSON.parse(trimmed));
}
function extractMultipleObjects(content) {
  const objects = [];
  let depth = 0;
  let currentObject = "";
  let inString = false;
  let escapeNext = false;
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (escapeNext) {
      currentObject += char;
      escapeNext = false;
      continue;
    }
    if (char === "\\" && inString) {
      currentObject += char;
      escapeNext = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      currentObject += char;
      continue;
    }
    if (inString) {
      currentObject += char;
      continue;
    }
    if (char === "{" || char === "[") {
      if (depth === 0 && currentObject.trim()) {
        objects.push(currentObject.trim());
        currentObject = "";
      }
      depth++;
      currentObject += char;
    } else if (char === "}" || char === "]") {
      depth--;
      currentObject += char;
      if (depth === 0) {
        objects.push(currentObject.trim());
        currentObject = "";
      }
    } else {
      currentObject += char;
    }
  }
  if (currentObject.trim()) {
    objects.push(currentObject.trim());
  }
  return objects;
}

// src/commands/unixConvert.ts
var vscode5 = __toESM(require("vscode"));

// src/utils/unixConverter.ts
function formatTimestamp(unix) {
  if (!isValidUnixTimestamp(unix.toString())) {
    throw new Error("Invalid timestamp");
  }
  const isMilliseconds = unix > 9999999999;
  const ms = isMilliseconds ? unix : unix * 1e3;
  const date = new Date(ms);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid timestamp");
  }
  const gmt = formatDateInZone(date, "UTC");
  const local = formatDateInZone(date, Intl.DateTimeFormat().resolvedOptions().timeZone);
  const relative = formatRelative(date);
  return { gmt, local, relative };
}
function formatDateInZone(date, timeZone) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
    timeZone
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(date);
  const getPart = (type) => parts.find((p) => p.type === type)?.value || "";
  const weekday = getPart("weekday");
  const month = getPart("month");
  const day = getPart("day");
  const year = getPart("year");
  const hour = getPart("hour");
  const minute = getPart("minute");
  const second = getPart("second");
  const fractionalSecond = getPart("fractionalSecond");
  return `${weekday}, ${month} ${day}, ${year} at ${hour}:${minute}:${second}.${fractionalSecond}`;
}
function formatRelative(date) {
  const now = /* @__PURE__ */ new Date();
  const diffMs = now.getTime() - date.getTime();
  const absDiff = Math.abs(diffMs);
  const isPast = diffMs > 0;
  const seconds = Math.floor(absDiff / 1e3);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  let timeStr;
  if (seconds < 60) {
    timeStr = `${seconds} second${seconds !== 1 ? "s" : ""}`;
  } else if (minutes < 60) {
    timeStr = `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  } else if (hours < 24) {
    timeStr = `${hours} hour${hours !== 1 ? "s" : ""}`;
  } else {
    timeStr = `${days} day${days !== 1 ? "s" : ""}`;
  }
  return isPast ? `${timeStr} ago` : `in ${timeStr}`;
}
function formatResult(result) {
  return `GMT: ${result.gmt}
Your time zone: ${result.local}
Relative: ${result.relative}`;
}
function isValidUnixTimestamp(value) {
  const num = Number(value);
  if (isNaN(num) || !Number.isInteger(num) || num <= 0) {
    return false;
  }
  const minSeconds = 0;
  const maxMs = 41024448e5;
  const isMilliseconds = num > 9999999999;
  const ms = isMilliseconds ? num : num * 1e3;
  return ms >= minSeconds && ms <= maxMs;
}

// src/commands/unixConvert.ts
var UNIX_REGEX = /\d{10,13}/g;
function findAllTimestamps(content) {
  const results = [];
  const matches = content.matchAll(UNIX_REGEX);
  for (const match of matches) {
    const value = match[0];
    if (isValidUnixTimestamp(value)) {
      const unix = Number(value);
      const result = formatTimestamp(unix);
      results.push({
        original: value,
        formatted: formatResult(result)
      });
    }
  }
  return results;
}
function registerCommand5(context) {
  const disposable = vscode5.commands.registerCommand("dev-pocket.unixConvert", async () => {
    const editor = vscode5.window.activeTextEditor;
    if (!editor) {
      vscode5.window.showErrorMessage("No active editor found.");
      return;
    }
    const selection = editor.selection;
    const document = editor.document;
    let content;
    if (!selection.isEmpty) {
      content = document.getText(selection);
    } else {
      const fullRange = new vscode5.Range(
        0,
        0,
        document.lineCount - 1,
        document.lineAt(document.lineCount - 1).text.length
      );
      content = document.getText(fullRange);
    }
    if (!content.trim()) {
      vscode5.window.showErrorMessage("No content to convert.");
      return;
    }
    const converted = findAllTimestamps(content);
    if (converted.length === 0) {
      vscode5.window.showErrorMessage("No valid unix timestamp found.");
      return;
    }
    const displayResult = converted.map((c) => `${c.original}:
${c.formatted}`).join("\n\n");
    const doc = await vscode5.workspace.openTextDocument({
      content: displayResult,
      language: "plaintext"
    });
    await vscode5.window.showTextDocument(doc, { viewColumn: vscode5.ViewColumn.Beside });
  });
  context.subscriptions.push(disposable);
}

// src/commands/urlEncode.ts
var vscode6 = __toESM(require("vscode"));

// src/utils/urlCodec.ts
function encode2(input) {
  return encodeURIComponent(input);
}
function decode2(input) {
  return decodeURIComponent(input);
}

// src/commands/urlEncode.ts
function registerCommand6(context) {
  const disposable = vscode6.commands.registerCommand("dev-pocket.urlEncode", async () => {
    const editor = vscode6.window.activeTextEditor;
    if (!editor) {
      vscode6.window.showErrorMessage("No active editor found.");
      return;
    }
    const selection = editor.selection;
    const document = editor.document;
    let content;
    if (!selection.isEmpty) {
      content = document.getText(selection);
    } else {
      const fullRange = new vscode6.Range(
        0,
        0,
        document.lineCount - 1,
        document.lineAt(document.lineCount - 1).text.length
      );
      content = document.getText(fullRange);
    }
    if (!content.trim()) {
      vscode6.window.showErrorMessage("No content to encode.");
      return;
    }
    try {
      const encoded = encode2(content);
      if (!selection.isEmpty) {
        await editor.edit((editBuilder) => {
          editBuilder.replace(selection, encoded);
        });
      } else {
        const fullRange = new vscode6.Range(
          0,
          0,
          document.lineCount - 1,
          document.lineAt(document.lineCount - 1).text.length
        );
        await editor.edit((editBuilder) => {
          editBuilder.replace(fullRange, encoded);
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred.";
      vscode6.window.showErrorMessage(`URL encoding failed: ${message}`);
    }
  });
  context.subscriptions.push(disposable);
}

// src/commands/urlDecode.ts
var vscode7 = __toESM(require("vscode"));
function registerCommand7(context) {
  const disposable = vscode7.commands.registerCommand("dev-pocket.urlDecode", async () => {
    const editor = vscode7.window.activeTextEditor;
    if (!editor) {
      vscode7.window.showErrorMessage("No active editor found.");
      return;
    }
    const selection = editor.selection;
    const document = editor.document;
    let content;
    if (!selection.isEmpty) {
      content = document.getText(selection);
    } else {
      const fullRange = new vscode7.Range(
        0,
        0,
        document.lineCount - 1,
        document.lineAt(document.lineCount - 1).text.length
      );
      content = document.getText(fullRange);
    }
    if (!content.trim()) {
      vscode7.window.showErrorMessage("No content to decode.");
      return;
    }
    try {
      const decoded = decode2(content);
      if (!selection.isEmpty) {
        await editor.edit((editBuilder) => {
          editBuilder.replace(selection, decoded);
        });
      } else {
        const fullRange = new vscode7.Range(
          0,
          0,
          document.lineCount - 1,
          document.lineAt(document.lineCount - 1).text.length
        );
        await editor.edit((editBuilder) => {
          editBuilder.replace(fullRange, decoded);
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred.";
      vscode7.window.showErrorMessage(`URL decoding failed: ${message}`);
    }
  });
  context.subscriptions.push(disposable);
}

// src/commands/sqlWhereInQuotes.ts
var vscode8 = __toESM(require("vscode"));
function registerCommand8(context) {
  const disposable = vscode8.commands.registerCommand("dev-pocket.sqlWhereInQuotes", async () => {
    const editor = vscode8.window.activeTextEditor;
    if (!editor) {
      vscode8.window.showErrorMessage("No active editor found.");
      return;
    }
    const selection = editor.selection;
    const document = editor.document;
    let content;
    if (!selection.isEmpty) {
      content = document.getText(selection);
    } else {
      const fullRange = new vscode8.Range(
        0,
        0,
        document.lineCount - 1,
        document.lineAt(document.lineCount - 1).text.length
      );
      content = document.getText(fullRange);
    }
    const lines = content.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
    if (lines.length === 0) {
      vscode8.window.showErrorMessage("No content to process.");
      return;
    }
    let result = "(\n";
    lines.forEach((line, index) => {
      const isLast = index === lines.length - 1;
      if (isLast) {
        result += `	'${line}'
`;
      } else {
        result += `	'${line}',
`;
      }
    });
    result += ")";
    if (!selection.isEmpty) {
      await editor.edit((editBuilder) => {
        editBuilder.replace(selection, result);
      });
    } else {
      const fullRange = new vscode8.Range(
        0,
        0,
        document.lineCount - 1,
        document.lineAt(document.lineCount - 1).text.length
      );
      await editor.edit((editBuilder) => {
        editBuilder.replace(fullRange, result);
      });
    }
  });
  context.subscriptions.push(disposable);
}

// src/providers/unixHoverProvider.ts
var vscode9 = __toESM(require("vscode"));
var UnixHoverProvider = class {
  provideHover(document, position, token) {
    const range = document.getWordRangeAtPosition(position, /\d+/);
    if (!range) {
      return null;
    }
    const word = document.getText(range);
    if (!isValidUnixTimestamp(word)) {
      return null;
    }
    const unix = Number(word);
    const result = formatTimestamp(unix);
    const formatted = formatResult(result);
    const markdown = new vscode9.MarkdownString();
    markdown.appendCodeblock(formatted, "text");
    return new vscode9.Hover(markdown, range);
  }
};
function registerProvider(context) {
  const provider = new UnixHoverProvider();
  const disposable = vscode9.languages.registerHoverProvider(
    { pattern: "**/*" },
    provider
  );
  context.subscriptions.push(disposable);
}

// src/extension.ts
function activate(context) {
  console.log('Congratulations, your extension "dev-pocket" is now active!');
  registerCommand(context);
  registerCommand2(context);
  registerCommand3(context);
  registerCommand4(context);
  registerCommand5(context);
  registerCommand6(context);
  registerCommand7(context);
  registerCommand8(context);
  const config = vscode10.workspace.getConfiguration("dev-pocket");
  const unixHoverEnabled = config.get("unixHoverEnabled", true);
  if (unixHoverEnabled) {
    registerProvider(context);
  }
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
