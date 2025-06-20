import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChatBubble from '../../../src/renderer/components/daisy/display/ChatBubble';

describe('ChatBubble', () => {
  it('renders and accepts props', () => {
    render(
      <ChatBubble id="cb1" className="extra">
        Hi
      </ChatBubble>
    );
    const bubble = screen.getByTestId('chat-bubble');
    expect(bubble).toBeInTheDocument();
    expect(bubble).toHaveClass('extra');
    expect(bubble).toHaveAttribute('id', 'cb1');
  });
});
