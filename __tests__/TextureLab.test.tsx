import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TextureLab from '../src/renderer/components/assets/TextureLab';
import { ProjectProvider } from '../src/renderer/components/providers/ProjectProvider';
import { SetPath } from './test-utils';

describe('TextureLab', () => {
  it('renders modal', () => {
    render(
      <ProjectProvider>
        <SetPath path="/proj">
          <TextureLab file="/proj/foo.png" onClose={() => {}} />
        </SetPath>
      </ProjectProvider>
    );
    expect(screen.getByTestId('daisy-modal')).toBeInTheDocument();
    expect(screen.getByText('Texture Lab')).toBeInTheDocument();
  });
});
