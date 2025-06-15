import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChatBubble from '../../../src/renderer/components/daisy/display/ChatBubble';

describe('ChatBubble', () => {
  it('renders', () => {
    render(<ChatBubble>Hi</ChatBubble>);
    expect(screen.getByTestId('chat-bubble')).toBeInTheDocument();
  });
});
