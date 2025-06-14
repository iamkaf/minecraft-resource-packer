import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectForm from '../src/renderer/components/project/ProjectForm';

describe('ProjectForm', () => {
  it('submits name and version', () => {
    const create = vi.fn();
    render(
      <ProjectForm versions={['1.20']} onCreate={create} onImport={() => {}} />
    );
    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'Pack' },
    });
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '1.20' },
    });
    fireEvent.click(screen.getByText('Create'));
    expect(create).toHaveBeenCalledWith('Pack', '1.20');
  });

  it('imports when button clicked', () => {
    const imp = vi.fn();
    render(<ProjectForm versions={[]} onCreate={() => {}} onImport={imp} />);
    fireEvent.click(screen.getByText('Import'));
    expect(imp).toHaveBeenCalled();
  });

  it('does not submit without version', () => {
    const create = vi.fn();
    render(
      <ProjectForm versions={['1.20']} onCreate={create} onImport={() => {}} />
    );
    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'Pack' },
    });
    fireEvent.click(screen.getByText('Create'));
    expect(create).not.toHaveBeenCalled();
  });
});
