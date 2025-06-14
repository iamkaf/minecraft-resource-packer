import React, { Suspense, useEffect, useState, lazy, useRef } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import Navbar from './Navbar';
import Spinner from './Spinner';
import ExportSummaryModal from './ExportSummaryModal';
import type { ExportSummary } from '../../main/exporter';

const AssetBrowser = lazy(() => import('./AssetBrowser'));
const AssetSelector = lazy(() => import('./AssetSelector'));
const ProjectManager = lazy(() => import('./ProjectManager'));
import DrawerLayout from './DrawerLayout';
import About from './About';

// Main React component shown in the editor window.  It waits for the main
// process to notify which project is open and then displays an AssetBrowser for
// that directory.

const App: React.FC = () => {
  const [projectPath, setProjectPath] = useState<string | null>(null);
  const [summary, setSummary] = useState<ExportSummary | null>(null);
  const [view, setView] = useState<'projects' | 'settings' | 'about'>(
    'projects'
  );
  const confetti = useRef<((opts: unknown) => void) | null>(null);

  useEffect(() => {
    // Listen for the main process telling us which project to load.
    window.electronAPI?.onOpenProject((_event: unknown, path: string) => {
      setProjectPath(path);
      setView('projects');
    });
  }, []);

  if (view === 'about') {
    return (
      <DrawerLayout view={view} onNavigate={setView}>
        <Navbar />
        <main className="p-4">
          <About />
        </main>
      </DrawerLayout>
    );
  }

  if (!projectPath) {
    return (
      <DrawerLayout view={view} onNavigate={setView}>
        <Navbar />
        <main className="p-4 flex flex-col gap-6">
          <Suspense fallback={<Spinner />}>
            <ProjectManager />
          </Suspense>
        </main>
      </DrawerLayout>
    );
  }

  const handleExport = () => {
    if (projectPath) {
      window.electronAPI
        ?.exportProject(projectPath)
        .then((s) => {
          if (s) setSummary(s);
          if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            confetti.current?.({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
            });
          }
        })
        .catch(() => {
          /* ignore */
        });
    }
  };

  return (
    <DrawerLayout view={view} onNavigate={setView}>
      <Navbar />
      <main className="p-4 flex flex-col gap-4">
        <button
          className="link link-primary w-fit"
          onClick={() => setProjectPath(null)}
        >
          Back to Projects
        </button>
        <h1 className="font-display text-xl mb-2">Project: {projectPath}</h1>
        <button className="btn btn-accent mb-2" onClick={handleExport}>
          Export Pack
        </button>
        <Suspense fallback={<Spinner />}>
          <AssetSelector path={projectPath} />
        </Suspense>
        <Suspense fallback={<Spinner />}>
          <AssetBrowser path={projectPath} />
        </Suspense>
      </main>
      {summary && (
        <ExportSummaryModal
          summary={summary}
          onClose={() => setSummary(null)}
        />
      )}
      <ReactCanvasConfetti
        onInit={({ confetti: c }) => {
          confetti.current = c;
        }}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
        }}
      />
    </DrawerLayout>
  );
};

export default App;
