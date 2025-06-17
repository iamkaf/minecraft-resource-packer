import path from 'path';
import { Protocol } from 'electron';

let monacoDir: string | null = null;

export function registerMonacoProtocol(protocol: Protocol) {
  if (!monacoDir) {
    const pkg = require.resolve('monaco-editor/package.json');
    monacoDir = path.join(path.dirname(pkg), 'min');
  }
  protocol.registerFileProtocol('monaco', (request, callback) => {
    const rel = decodeURI(request.url.replace('monaco://', ''));
    const file = monacoDir ? path.join(monacoDir, rel) : '';
    callback(file);
  });
}
