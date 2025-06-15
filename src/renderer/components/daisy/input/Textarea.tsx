import React from 'react';

export default function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return <textarea className="textarea" {...props} />;
}
