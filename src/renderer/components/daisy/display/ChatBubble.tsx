import React from 'react';

interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function ChatBubble({
  children,
  className = '',
  ...rest
}: ChatBubbleProps) {
  return (
    <div
      className={`chat-bubble ${className}`.trim()}
      data-testid="chat-bubble"
      {...rest}
    >
      {children}
    </div>
  );
}
