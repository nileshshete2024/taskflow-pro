import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { Sidebar } from './components/UI/Sidebar';
import { BoardPage } from './pages/BoardPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ErrorBoundary } from './components/UI/ErrorBoundary';

export default function App() {
  const { darkMode } = useAppStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      {/* Global boundary — catches crashes in Sidebar or layout */}
      <ErrorBoundary>
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
          <ErrorBoundary
            fallback={
              <div className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex items-center justify-center">
                <p className="text-xs text-slate-400 text-center px-4">
                  Sidebar failed to load.{' '}
                  <button
                    className="text-primary-600 underline"
                    onClick={() => window.location.reload()}
                  >
                    Reload
                  </button>
                </p>
              </div>
            }
          >
            <Sidebar />
          </ErrorBoundary>
          <main className="flex-1 overflow-hidden flex flex-col">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route
                path="/dashboard"
                element={
                  <ErrorBoundary>
                    <DashboardPage />
                  </ErrorBoundary>
                }
              />

              <Route
                path="/project/:projectId"
                element={
                  <ErrorBoundary>
                    <BoardPage />
                  </ErrorBoundary>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
