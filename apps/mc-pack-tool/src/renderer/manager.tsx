import React from 'react';
import { createRoot } from 'react-dom/client';
import ProjectManager from './manager/ProjectManager';
import '../index.css';

// Entry point for the project manager renderer window.

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<ProjectManager />);
}
