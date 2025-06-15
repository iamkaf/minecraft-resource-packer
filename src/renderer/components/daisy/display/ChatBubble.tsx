import React from 'react';

export default function ChatBubble({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="chat-bubble" data-testid="chat-bubble">
      {children}
    </div>
  );
}
