import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, BarChart3 } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="sticky top-0 z-50 border-b border-indigo-500/20 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-base md:text-xl font-bold tracking-tight text-white transition-colors hover:text-indigo-400"
          >
            <BarChart3 className="h-6 w-6 text-indigo-400" />
            <span className="bg-gradient-to-r hidden md:block from-white to-indigo-200 bg-clip-text text-transparent">
              Real-Time Poll Rooms
            </span>
          </button>

          {!isHome && (
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-2 py-1 md:px-4 md:py-2 text-sm font-normal md:font-medium text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25"
            >
              <Plus className="hidden md:block  h-4 w-4" />
              Create Your Own Poll
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
