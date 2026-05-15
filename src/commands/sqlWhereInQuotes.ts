import * as vscode from 'vscode';

export function registerCommand(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand('dev-pocket.sqlWhereInQuotes', async () => {
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

    const lines = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) {
      vscode.window.showErrorMessage('No content to process.');
      return;
    }

    let result = '(\n';

    lines.forEach((line, index) => {
      const isLast = index === lines.length - 1;
      if (isLast) {
        result += `\t'${line}'\n`;
      } else {
        result += `\t'${line}',\n`;
      }
    });

    result += ')';

    if (!selection.isEmpty) {
      await editor.edit(editBuilder => {
        editBuilder.replace(selection, result);
      });
    } else {
      const fullRange = new vscode.Range(
        0,
        0,
        document.lineCount - 1,
        document.lineAt(document.lineCount - 1).text.length
      );
      await editor.edit(editBuilder => {
        editBuilder.replace(fullRange, result);
      });
    }
  });

  context.subscriptions.push(disposable);
}
