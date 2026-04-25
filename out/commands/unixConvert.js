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
exports.registerCommand = registerCommand;
const vscode = __importStar(require("vscode"));
const unixConverter_1 = require("../utils/unixConverter");
const UNIX_REGEX = /\d{10,13}/g;
function findAllTimestamps(content) {
    const results = [];
    const matches = content.matchAll(UNIX_REGEX);
    for (const match of matches) {
        const value = match[0];
        if ((0, unixConverter_1.isValidUnixTimestamp)(value)) {
            const unix = Number(value);
            const result = (0, unixConverter_1.formatTimestamp)(unix);
            results.push({
                original: value,
                formatted: (0, unixConverter_1.formatResult)(result),
            });
        }
    }
    return results;
}
function registerCommand(context) {
    const disposable = vscode.commands.registerCommand('dev-pocket.unixConvert', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }
        const selection = editor.selection;
        const document = editor.document;
        let content;
        if (!selection.isEmpty) {
            content = document.getText(selection);
        }
        else {
            const fullRange = new vscode.Range(0, 0, document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
            content = document.getText(fullRange);
        }
        if (!content.trim()) {
            vscode.window.showErrorMessage('No content to convert.');
            return;
        }
        const converted = findAllTimestamps(content);
        if (converted.length === 0) {
            vscode.window.showErrorMessage('No valid unix timestamp found.');
            return;
        }
        const displayResult = converted.map(c => `${c.original}:\n${c.formatted}`).join('\n\n');
        const doc = await vscode.workspace.openTextDocument({
            content: displayResult,
            language: 'plaintext',
        });
        await vscode.window.showTextDocument(doc, { viewColumn: vscode.ViewColumn.Beside });
    });
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=unixConvert.js.map