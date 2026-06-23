import { Link, NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Logo from './Logo.jsx';
import ThemeToggle from './ThemeToggle.jsx';

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link to="/" aria-label="SkillPath home">
          <Logo size="small" />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3 text-sm font-medium">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 transition ${isActive
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
                  }`
                }
              >
                Dashboard
              </NavLink>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
              ) : (
                <span className="hidden text-slate-500 dark:text-slate-400 sm:inline">Hi, {user.name}</span>
              )}
              <button
                type="button"
                onClick={logout}
                className="text-slate-700 hover:text-indigo-600 dark:text-slate-300"
                aria-label="Logout"
              >
                <span className="hidden sm:inline">Logout</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:hidden"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `rounded-xl px-2 sm:px-3 py-2 transition ${isActive
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `rounded-xl px-2 sm:px-3 py-2 text-white transition ${isActive ? 'bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
