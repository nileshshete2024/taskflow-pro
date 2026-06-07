import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export const NotFoundPage = () => {
  usePageTitle('Page not found');
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl mb-4">🧭</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Page not found</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/dashboard" className="btn-primary inline-flex">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};
