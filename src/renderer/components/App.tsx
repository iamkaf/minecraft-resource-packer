import React, { Suspense, useEffect, useState, lazy } from 'react';
import Navbar from './Navbar';
import { Skeleton } from './daisy/feedback';

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
        <Suspense fallback={<Skeleton width="100%" height="20rem" />}>
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
        <Suspense fallback={<Skeleton width="100%" height="20rem" />}>
          <SettingsView />
        </Suspense>
      );
      break;
    case 'about':
      content = (
        <Suspense fallback={<Skeleton width="100%" height="20rem" />}>
          <AboutView />
        </Suspense>
      );
      break;
    default:
      content = (
        <Suspense fallback={<Skeleton width="100%" height="20rem" />}>
          <ProjectManagerView />
        </Suspense>
      );
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Navbar
        onNavigate={(v) => {
          setProjectPath(null);
          setView(v);
        }}
      />
      <div className="flex-1 flex flex-col">{content}</div>
    </div>
  );
}
