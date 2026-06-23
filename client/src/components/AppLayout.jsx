import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Button from './Button.jsx';
import Logo from './Logo.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'D' },
  { label: 'Profile Setup', path: '/profile-setup', icon: 'P' },
  { label: 'Create Roadmap', path: '/create-roadmap', icon: '+' },
  { label: 'My Roadmaps', path: '/roadmaps', icon: 'R' },
  { label: 'Progress', path: '/progress', icon: '%' },
  { label: 'Settings', path: '/settings', icon: 'S' },
];

function AppLayout({ children }) {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 lg:block">
        <NavLink to="/" className="mb-8 flex items-center gap-3">
          <Logo showTagline />
        </NavLink>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
                }`
              }
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-xs dark:bg-slate-800">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back</p>
              <h1 className="text-xl font-bold">{user?.name || 'Learner'}</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold ${isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export default AppLayout;
