import * as assert from 'assert';
import * as vscode from 'vscode';

suite('DevPocket Commands Integration', () => {
  suiteSetup(async () => {
    await vscode.workspace.openTextDocument({ content: '', language: 'plaintext' });
  });

  test('should register dev-pocket.envJsonConvert command', async () => {
    const command = await vscode.commands.getCommands(true);
    assert.ok(command.includes('dev-pocket.envJsonConvert'));
  });

  test('should register dev-pocket.base64Encode command', async () => {
    const command = await vscode.commands.getCommands(true);
    assert.ok(command.includes('dev-pocket.base64Encode'));
  });

  test('should register dev-pocket.base64Decode command', async () => {
    const command = await vscode.commands.getCommands(true);
    assert.ok(command.includes('dev-pocket.base64Decode'));
  });

  test('should register dev-pocket.jsonMinify command', async () => {
    const command = await vscode.commands.getCommands(true);
    assert.ok(command.includes('dev-pocket.jsonMinify'));
  });

  test('should register dev-pocket.unixConvert command', async () => {
    const command = await vscode.commands.getCommands(true);
    assert.ok(command.includes('dev-pocket.unixConvert'));
  });

  test('should register dev-pocket.urlEncode command', async () => {
    const command = await vscode.commands.getCommands(true);
    assert.ok(command.includes('dev-pocket.urlEncode'));
  });

  test('should register dev-pocket.urlDecode command', async () => {
    const command = await vscode.commands.getCommands(true);
    assert.ok(command.includes('dev-pocket.urlDecode'));
  });

  test('should register dev-pocket.sqlWhereInQuotes command', async () => {
    const command = await vscode.commands.getCommands(true);
    assert.ok(command.includes('dev-pocket.sqlWhereInQuotes'));
  });
});