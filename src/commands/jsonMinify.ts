import * as vscode from 'vscode';

export function registerCommand(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand('dev-pocket.jsonMinify', async () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showErrorMessage('No active editor found.');
      return;
    }

    const selection = editor.selection;
    const document = editor.document;

    let content: string;
    let isSelection = false;

    if (!selection.isEmpty) {
      content = document.getText(selection);
      isSelection = true;
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
      vscode.window.showErrorMessage('No content to minify.');
      return;
    }

    try {
      await vscode.languages.setTextDocumentLanguage(document, 'json');

      const trimmed = content.trim();
      const minified = minifyContent(trimmed);

      if (isSelection) {
        await editor.edit(editBuilder => {
          editBuilder.replace(selection, minified);
        });
      } else {
        const fullRange = new vscode.Range(
          0,
          0,
          document.lineCount - 1,
          document.lineAt(document.lineCount - 1).text.length
        );
        await editor.edit(editBuilder => {
          editBuilder.replace(fullRange, minified);
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred.';
      vscode.window.showErrorMessage(`Minification failed: ${message}`);
    }
  });

  context.subscriptions.push(disposable);
}

function minifyContent(content: string): string {
  const trimmed = content.trim();

  if (trimmed.startsWith('[')) {
    const arr = JSON.parse(trimmed);
    if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'object') {
      return arr.map(item => JSON.stringify(item)).join('\n\n');
    }
    return JSON.stringify(arr);
  }

  if (trimmed.startsWith('{')) {
    try {
      JSON.parse(trimmed);
      return JSON.stringify(JSON.parse(trimmed));
    } catch {
      const objects = extractMultipleObjects(trimmed);
      if (objects.length > 1) {
        return objects.map(obj => JSON.stringify(JSON.parse(obj))).join('\n\n');
      }
      throw new Error('Invalid JSON');
    }
  }

  const objects = extractMultipleObjects(trimmed);
  if (objects.length > 1) {
    return objects.map(obj => JSON.stringify(JSON.parse(obj))).join('\n\n');
  }

  return JSON.stringify(JSON.parse(trimmed));
}

function extractMultipleObjects(content: string): string[] {
  const objects: string[] = [];
  let depth = 0;
  let currentObject = '';
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (escapeNext) {
      currentObject += char;
      escapeNext = false;
      continue;
    }

    if (char === '\\' && inString) {
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

    if (char === '{' || char === '[') {
      if (depth === 0 && currentObject.trim()) {
        objects.push(currentObject.trim());
        currentObject = '';
      }
      depth++;
      currentObject += char;
    } else if (char === '}' || char === ']') {
      depth--;
      currentObject += char;

      if (depth === 0) {
        objects.push(currentObject.trim());
        currentObject = '';
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