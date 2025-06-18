import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface Props {
  text: string;
  setText: (t: string) => void;
  error: string | null;
  isJson: boolean;
}

export default function TextPanel({ text, setText, error, isJson }: Props) {
  return (
    <div className="flex flex-col gap-2" data-testid="text-panel">
      {error && <div className="text-error mb-1">{error}</div>}
      <div className="h-[14rem]">
        <MonacoEditor
          defaultLanguage={isJson ? 'json' : 'plaintext'}
          value={text}
          onChange={(v) => setText(v ?? '')}
          options={{ minimap: { enabled: false } }}
          theme="vs-dark"
        />
      </div>
    </div>
  );
}
