import React from 'react';
import Editor, { loader } from '@monaco-editor/react';
import 'monaco-editor/min/vs/editor/editor.main.css';

loader.config({ paths: { vs: 'monaco-editor/min/vs' } });

interface JsonEditorProps {
  value: string;
  onChange: (val: string) => void;
  height?: string | number;
}

export default function JsonEditor({
  value,
  onChange,
  height = '20rem',
}: JsonEditorProps) {
  return (
    <Editor
      language="json"
      value={value}
      onChange={(v) => onChange(v ?? '')}
      height={height}
      options={{ minimap: { enabled: false } }}
    />
  );
}
