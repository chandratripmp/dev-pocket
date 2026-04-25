import * as vscode from 'vscode';

export function registerCommand(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand('dev-pocket.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from DevPocket!');
  });

  context.subscriptions.push(disposable);
}