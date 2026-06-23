import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { List, CheckCircle2, TrendingUp, LayoutDashboard } from 'lucide-react';
import Badge from '../components/Badge.jsx';
import Card from '../components/Card.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { fetchMyRoadmaps } from '../services/roadmapService';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
];

const STATUS_MAP = {
  active: { label: 'Active', tone: 'indigo' },
  completed: { label: 'Completed', tone: 'green' },
  draft: { label: 'Draft', tone: 'gray' },
  archived: { label: 'Archived', tone: 'gray' },
};

function Progress() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    fetchMyRoadmaps()
      .then((res) => setRoadmaps(res.roadmaps || []))
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load roadmaps'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = roadmaps.filter((r) => filter === 'all' || r.status === filter);

  const totalRoadmaps = roadmaps.length;
  const activeRoadmaps = roadmaps.filter((r) => r.status === 'active').length;
  const completedRoadmaps = roadmaps.filter((r) => r.status === 'completed').length;
  const avgProgress = roadmaps.length === 0
    ? 0
    : Math.round(
        roadmaps.reduce((sum, r) => {
          const total = r.tasks?.length || 0;
          const done = r.tasks?.filter((t) => t.status === 'completed').length || 0;
          return sum + (total === 0 ? 0 : (done / total) * 100);
        }, 0) / roadmaps.length
      );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Progress</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight dark:text-white">Track your learning</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Roadmaps</p>
              <p className="text-xl font-bold dark:text-white">{totalRoadmaps}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <List className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active</p>
              <p className="text-xl font-bold dark:text-white">{activeRoadmaps}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Completed</p>
              <p className="text-xl font-bold dark:text-white">{completedRoadmaps}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Avg Progress</p>
              <p className="text-xl font-bold dark:text-white">{avgProgress}%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition active:scale-95 ${
              filter === f.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-600 dark:text-slate-300">Loading roadmaps...</div>
      ) : error ? (
        <div className="py-20 text-center text-rose-600 dark:text-rose-400">{error}</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={filter === 'all' ? 'No roadmaps yet' : `No ${filter} roadmaps`}
          description={filter === 'all' ? 'Create a roadmap to start tracking your progress.' : `You don't have any ${filter} roadmaps.`}
          action={filter === 'all' ? 'Create roadmap' : undefined}
          actionPath={filter === 'all' ? '/create-roadmap' : undefined}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((roadmap) => {
            const total = roadmap.tasks?.length || 0;
            const completed = roadmap.tasks?.filter((t) => t.status === 'completed').length || 0;
            const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
            const statusInfo = STATUS_MAP[roadmap.status] || { label: roadmap.status, tone: 'gray' };

            return (
              <Link
                key={roadmap.id}
                to={`/progress/${roadmap.id}`}
                className="block rounded-2xl outline-none transition hover:shadow-lg focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <Card>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold dark:text-white">{roadmap.title}</h3>
                    <Badge tone={statusInfo.tone}>{statusInfo.label}</Badge>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">{completed} / {total} tasks</span>
                      <span className="font-semibold text-emerald-600">{progress}%</span>
                    </div>
                    <ProgressBar value={progress} />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Progress;
