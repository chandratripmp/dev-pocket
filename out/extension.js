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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const helloWorld_1 = require("./commands/helloWorld");
const envJsonConvert_1 = require("./commands/envJsonConvert");
const base64Encode_1 = require("./commands/base64Encode");
const base64Decode_1 = require("./commands/base64Decode");
const jsonMinify_1 = require("./commands/jsonMinify");
const unixConvert_1 = require("./commands/unixConvert");
const unixHoverProvider_1 = require("./providers/unixHoverProvider");
function activate(context) {
    console.log('Congratulations, your extension "dev-pocket" is now active!');
    (0, helloWorld_1.registerCommand)(context);
    (0, envJsonConvert_1.registerCommand)(context);
    (0, base64Encode_1.registerCommand)(context);
    (0, base64Decode_1.registerCommand)(context);
    (0, jsonMinify_1.registerCommand)(context);
    (0, unixConvert_1.registerCommand)(context);
    const config = vscode.workspace.getConfiguration('dev-pocket');
    const unixHoverEnabled = config.get('unixHoverEnabled', true);
    if (unixHoverEnabled) {
        (0, unixHoverProvider_1.registerProvider)(context);
    }
}
function deactivate() { }
//# sourceMappingURL=extension.js.map