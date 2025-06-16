import React, { Suspense, useEffect, useState, lazy } from 'react';
import Navbar from './Navbar';
import Spinner from './Spinner';

const ProjectManagerView = lazy(() => import('../views/ProjectManagerView'));
const EditorView = lazy(() => import('../views/EditorView'));
const SettingsView = lazy(() => import('../views/SettingsView'));
const AboutView = lazy(() => import('../views/AboutView'));

export type View = 'manager' | 'editor' | 'settings' | 'about';

export default function App() {
  const [projectPath, setProjectPath] = useState<string | null>(null);
  const [view, setView] = useState<View>('manager');

  useEffect(() => {
    window.electronAPI?.onOpenProject((_e, path: string) => {
      setProjectPath(path);
      setView('editor');
    });
  }, []);

  const toManager = () => {
    setProjectPath(null);
    setView('manager');
  };

  const toSettings = () => {
    setProjectPath(null);
    setView('settings');
  };

  let content: React.ReactNode = null;
  switch (view) {
    case 'editor':
      content = projectPath ? (
        <Suspense fallback={<Spinner />}>
          <EditorView
            projectPath={projectPath}
            onBack={toManager}
            onSettings={toSettings}
          />
        </Suspense>
      ) : null;
      break;
    case 'settings':
      content = (
        <Suspense fallback={<Spinner />}>
          <SettingsView />
        </Suspense>
      );
      break;
    case 'about':
      content = (
        <Suspense fallback={<Spinner />}>
          <AboutView />
        </Suspense>
      );
      break;
    default:
      content = (
        <Suspense fallback={<Spinner />}>
          <ProjectManagerView />
        </Suspense>
      );
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col">{content}</div>
    </div>
  );
}
