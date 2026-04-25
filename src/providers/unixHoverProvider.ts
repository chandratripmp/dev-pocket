import * as vscode from 'vscode';
import { formatTimestamp, formatResult, isValidUnixTimestamp } from '../utils/unixConverter';

export class UnixHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
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

    const markdown = new vscode.MarkdownString();
    markdown.appendCodeblock(formatted, 'text');

    return new vscode.Hover(markdown, range);
  }
}

export function registerProvider(context: vscode.ExtensionContext): void {
  const provider = new UnixHoverProvider();
  const disposable = vscode.languages.registerHoverProvider(
    { pattern: '**/*' },
    provider
  );
  context.subscriptions.push(disposable);
}