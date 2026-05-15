import * as vscode from 'vscode';
import { registerCommand as registerEnvJsonConvert } from './commands/envJsonConvert';
import { registerCommand as registerBase64Encode } from './commands/base64Encode';
import { registerCommand as registerBase64Decode } from './commands/base64Decode';
import { registerCommand as registerJsonMinify } from './commands/jsonMinify';
import { registerCommand as registerUnixConvert } from './commands/unixConvert';
import { registerCommand as registerUrlEncode } from './commands/urlEncode';
import { registerCommand as registerUrlDecode } from './commands/urlDecode';
import { registerCommand as registerSqlWhereInQuotes } from './commands/sqlWhereInQuotes';
import { registerProvider as registerUnixHoverProvider } from './providers/unixHoverProvider';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "dev-pocket" is now active!');

	registerEnvJsonConvert(context);
	registerBase64Encode(context);
	registerBase64Decode(context);
	registerJsonMinify(context);
	registerUnixConvert(context);
	registerUrlEncode(context);
	registerUrlDecode(context);
	registerSqlWhereInQuotes(context);

	const config = vscode.workspace.getConfiguration('dev-pocket');
	const unixHoverEnabled = config.get<boolean>('unixHoverEnabled', true);

	if (unixHoverEnabled) {
		registerUnixHoverProvider(context);
	}
}

export function deactivate() { }
