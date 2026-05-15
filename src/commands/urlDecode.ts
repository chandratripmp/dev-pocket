import * as vscode from 'vscode';
import { decode } from '../utils/urlCodec';

export function registerCommand(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand('dev-pocket.urlDecode', async () => {
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
      vscode.window.showErrorMessage('No content to decode.');
      return;
    }

    try {
      const decoded = decode(content);

      if (!selection.isEmpty) {
        await editor.edit(editBuilder => {
          editBuilder.replace(selection, decoded);
        });
      } else {
        const fullRange = new vscode.Range(
          0,
          0,
          document.lineCount - 1,
          document.lineAt(document.lineCount - 1).text.length
        );
        await editor.edit(editBuilder => {
          editBuilder.replace(fullRange, decoded);
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred.';
      vscode.window.showErrorMessage(`URL decoding failed: ${message}`);
    }
  });

  context.subscriptions.push(disposable);
}
