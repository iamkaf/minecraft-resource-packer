import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AppearanceSettings from '../src/renderer/views/settings/AppearanceSettings';
import ToastProvider from '../src/renderer/components/providers/ToastProvider';

const getTheme = vi.fn();
const setTheme = vi.fn();
const getConfetti = vi.fn();
const setConfetti = vi.fn();

beforeEach(() => {
  (window as unknown as { electronAPI: Record<string, unknown> }).electronAPI =
    {
      getTheme,
      setTheme,
      getConfetti,
      setConfetti,
    };
  getTheme.mockResolvedValue('system');
  setTheme.mockResolvedValue(undefined);
  getConfetti.mockResolvedValue(true);
  setConfetti.mockResolvedValue(undefined);
});

describe('AppearanceSettings', () => {
  it('changes theme and toggles confetti', async () => {
    render(
      <ToastProvider>
        <AppearanceSettings />
      </ToastProvider>
    );
    const select = await screen.findByLabelText('Theme');
    fireEvent.change(select, { target: { value: 'dark' } });
    expect(setTheme).toHaveBeenCalledWith('dark');

    const toggle = await screen.findByLabelText('Confetti effects');
    expect(toggle).toBeChecked();
    fireEvent.click(toggle);
    expect(setConfetti).toHaveBeenCalledWith(false);
  });
});
