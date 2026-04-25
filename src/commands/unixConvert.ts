import * as vscode from 'vscode';
import { formatTimestamp, formatResult, isValidUnixTimestamp } from '../utils/unixConverter';

const UNIX_REGEX = /\d{10,13}/g;

interface ConvertedTimestamp {
  original: string;
  formatted: string;
}

function findAllTimestamps(content: string): ConvertedTimestamp[] {
  const results: ConvertedTimestamp[] = [];
  const matches = content.matchAll(UNIX_REGEX);

  for (const match of matches) {
    const value = match[0];
    if (isValidUnixTimestamp(value)) {
      const unix = Number(value);
      const result = formatTimestamp(unix);
      results.push({
        original: value,
        formatted: formatResult(result),
      });
    }
  }

  return results;
}

export function registerCommand(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand('dev-pocket.unixConvert', async () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showErrorMessage('No active editor found.');
      return;
    }

    const selection = editor.selection;
    const document = editor.document;

    let content: string;

    if (!selection.isEmpty) {
      content = document.getText(selection);
    } else {
      const fullRange = new vscode.Range(
        0,
        0,
        document.lineCount - 1,
        document.lineAt(document.lineCount - 1).text.length
      );
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