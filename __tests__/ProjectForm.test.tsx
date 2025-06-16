import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import ProjectForm, {
  FormatOption,
} from '../src/renderer/components/project/ProjectForm';

describe('ProjectForm', () => {
  it('submits name and version', async () => {
    const create = vi.fn();
    const formats: FormatOption[] = [{ format: 15, label: '1.20-1.20.1' }];
    render(
      <ProjectForm formats={formats} onCreate={create} onImport={() => {}} />
    );
    fireEvent.click(screen.getByText('New Project'));
    const modal = await screen.findByTestId('daisy-modal');
    const input = within(modal).getByPlaceholderText('Name');
    fireEvent.change(input, { target: { value: 'Pack' } });
    fireEvent.change(within(modal).getByRole('combobox'), {
      target: { value: '15' },
    });
    fireEvent.click(within(modal).getByRole('button', { name: 'Create' }));
    expect(create).toHaveBeenCalledWith('Pack', '1.20.1');
  });

  it('imports when button clicked', async () => {
    const imp = vi.fn();
    render(<ProjectForm formats={[]} onCreate={() => {}} onImport={imp} />);
    fireEvent.click(screen.getByText('New Project'));
    const modal = await screen.findByTestId('daisy-modal');
    fireEvent.click(within(modal).getByRole('tab', { name: 'Import' }));
    fireEvent.click(within(modal).getByRole('button', { name: 'Import' }));
    expect(imp).toHaveBeenCalled();
  });

  it('does not submit without version', async () => {
    const create = vi.fn();
    const formats: FormatOption[] = [{ format: 15, label: '1.20-1.20.1' }];
    render(
      <ProjectForm formats={formats} onCreate={create} onImport={() => {}} />
    );
    fireEvent.click(screen.getByText('New Project'));
    const modal = await screen.findByTestId('daisy-modal');
    fireEvent.change(within(modal).getByPlaceholderText('Name'), {
      target: { value: 'Pack' },
    });
    fireEvent.click(within(modal).getByRole('button', { name: 'Create' }));
    expect(create).not.toHaveBeenCalled();
  });
});
