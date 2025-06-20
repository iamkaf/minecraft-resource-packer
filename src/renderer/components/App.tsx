import React, { Suspense, useEffect, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './layout/Navbar';
import {
  EditorViewSkeleton,
  SettingsViewSkeleton,
  AboutViewSkeleton,
  ProjectManagerSkeleton,
} from './skeleton';

const ProjectManagerView = lazy(() => import('../views/ProjectManagerView'));
const EditorView = lazy(() => import('../views/EditorView'));
const SettingsView = lazy(() => import('../views/SettingsView'));
const AboutView = lazy(() => import('../views/AboutView'));

import { useAppStore } from '../store';

function AppContent() {
  const projectPath = useAppStore((s) => s.projectPath);
  const setProjectPath = useAppStore((s) => s.setProjectPath);
  const navigate = useNavigate();

  useEffect(() => {
    window.electronAPI?.onOpenProject((_e, path: string) => {
      setProjectPath(path);
      navigate('/editor');
    });
  }, [navigate, setProjectPath]);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route
            path="/editor"
            element={
              projectPath ? (
                <Suspense fallback={<EditorViewSkeleton />}>
                  <EditorView />
                </Suspense>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<SettingsViewSkeleton />}>
                <SettingsView />
              </Suspense>
            }
          />
          <Route
            path="/about"
            element={
              <Suspense fallback={<AboutViewSkeleton />}>
                <AboutView />
              </Suspense>
            }
          />
          <Route
            path="/"
            element={
              <Suspense fallback={<ProjectManagerSkeleton />}>
                <ProjectManagerView />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
