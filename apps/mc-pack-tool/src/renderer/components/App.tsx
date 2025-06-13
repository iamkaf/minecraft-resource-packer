import React, { Suspense, useEffect, useState, lazy, useRef } from 'react';
import ReactCanvasConfetti, {
  TCanvasConfettiInstance,
} from 'react-canvas-confetti';
import Navbar from './Navbar';
import Spinner from './Spinner';

const AssetBrowser = lazy(() => import('./AssetBrowser'));
const AssetSelector = lazy(() => import('./AssetSelector'));
const ProjectManager = lazy(() => import('./ProjectManager'));
import DrawerLayout from './DrawerLayout';

// Main React component shown in the editor window.  It waits for the main
// process to notify which project is open and then displays an AssetBrowser for
// that directory.

const App: React.FC = () => {
  const [projectPath, setProjectPath] = useState<string | null>(null);
  const confetti = useRef<TCanvasConfettiInstance | null>(null);

  useEffect(() => {
    // Listen for the main process telling us which project to load.
    window.electronAPI?.onOpenProject((_event, path: string) => {
      setProjectPath(path);
    });
  }, []);

  if (!projectPath) {
    return (
      <DrawerLayout>
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
        .then(() => {
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
    <DrawerLayout>
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
