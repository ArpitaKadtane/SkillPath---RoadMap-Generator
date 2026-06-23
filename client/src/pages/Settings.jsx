import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import useAuth from '../hooks/useAuth.js';
import useTheme from '../hooks/useTheme.js';

function Settings() {
  const { user } = useAuth();
  const { isDark } = useTheme();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Settings</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight dark:text-white">Account preferences</h2>
      </div>

      <Card>
        <h3 className="mb-5 text-lg font-bold dark:text-white">Profile Settings</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold dark:text-slate-200">Name</label>
            <input
              value={user?.name || ''}
              readOnly
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold dark:text-slate-200">Email</label>
            <input
              value={user?.email || ''}
              readOnly
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold dark:text-white">Theme Switcher</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Current theme: {isDark ? 'Dark mode' : 'Light mode'}
            </p>
          </div>
          <div className="flex w-fit items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
            <ThemeToggle />
            <span className="text-sm text-slate-600 dark:text-slate-300">Toggle theme</span>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold dark:text-white">Account Preferences</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Notification and study reminder settings will be added after roadmap progress tracking.
        </p>
      </Card>
    </div>
  );
}

export default Settings;
