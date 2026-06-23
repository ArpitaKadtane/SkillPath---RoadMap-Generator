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
        <div className="flex items-center gap-3 text-sm font-medium">
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
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 transition ${isActive
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
                  `rounded-xl px-3 py-2 text-white transition ${isActive ? 'bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'
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
