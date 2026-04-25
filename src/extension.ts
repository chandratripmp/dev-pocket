import * as vscode from 'vscode';
import { registerCommand as registerHelloWorld } from './commands/helloWorld';
import { registerCommand as registerEnvJsonConvert } from './commands/envJsonConvert';
import { registerCommand as registerBase64Encode } from './commands/base64Encode';
import { registerCommand as registerBase64Decode } from './commands/base64Decode';
import { registerCommand as registerJsonMinify } from './commands/jsonMinify';
import { registerCommand as registerUnixConvert } from './commands/unixConvert';
import { registerProvider as registerUnixHoverProvider } from './providers/unixHoverProvider';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "dev-pocket" is now active!');

	registerHelloWorld(context);
	registerEnvJsonConvert(context);
	registerBase64Encode(context);
	registerBase64Decode(context);
	registerJsonMinify(context);
	registerUnixConvert(context);

	const config = vscode.workspace.getConfiguration('dev-pocket');
	const unixHoverEnabled = config.get<boolean>('unixHoverEnabled', true);

	if (unixHoverEnabled) {
		registerUnixHoverProvider(context);
	}
}

export function deactivate() { }
