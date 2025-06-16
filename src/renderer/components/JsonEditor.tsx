import React from 'react';
import Editor, { OnChange } from '@monaco-editor/react';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export default function JsonEditor({
  value,
  onChange,
  height = '200px',
}: JsonEditorProps) {
  const handleChange: OnChange = (val) => {
    onChange(val ?? '');
  };
  return (
    <Editor
      height={height}
      defaultLanguage="json"
      value={value}
      onChange={handleChange}
      theme="vs-dark"
      options={{ minimap: { enabled: false }, automaticLayout: true }}
    />
  );
}
