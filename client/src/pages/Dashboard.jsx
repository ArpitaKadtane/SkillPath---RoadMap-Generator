import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, CheckCircle2, Clock, TrendingUp, ArrowRight, Plus, List, BarChart3, Settings } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import api from '../services/api.js';
import { fetchMyRoadmaps } from '../services/roadmapService';

const QUICK_ACTIONS = [
  { label: 'Create Roadmap', path: '/create-roadmap', icon: Plus, bg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' },
  { label: 'My Roadmaps', path: '/roadmaps', icon: List, bg: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400' },
  { label: 'Progress', path: '/progress', icon: BarChart3, bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
  { label: 'Settings', path: '/settings', icon: Settings, bg: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400' },
];

function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [profileRes, roadmapRes] = await Promise.allSettled([
          api.get('/api/profile'),
          fetchMyRoadmaps(),
        ]);
        if (profileRes.status === 'fulfilled' && profileRes.value.data.profile) {
          setProfile(profileRes.value.data.profile);
        }
        if (roadmapRes.status === 'fulfilled') {
          setRoadmaps(roadmapRes.value.roadmaps || []);
        }
      } catch {
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const activeRoadmap = roadmaps.find((r) => r.status === 'active') || roadmaps[0] || null;

  const incompleteTaskCount = activeRoadmap
    ? activeRoadmap.tasks?.filter((t) => t.status !== 'completed').length || 0
    : 0;
  const completedTaskCount = activeRoadmap
    ? activeRoadmap.tasks?.filter((t) => t.status === 'completed').length || 0
    : 0;
  const activeTotalTasks = activeRoadmap?.tasks?.length || 0;
  const activeProgress = activeTotalTasks === 0
    ? 0
    : Math.round((completedTaskCount / activeTotalTasks) * 100);

  const incompleteTasks = activeRoadmap
    ? (activeRoadmap.tasks || []).filter((t) => t.status !== 'completed').slice(0, 5)
    : [];

  const recentRoadmaps = roadmaps.slice(0, 3);
  const totalRoadmaps = roadmaps.length;

  const allTasks = roadmaps.flatMap((r) => r.tasks || []);
  const totalCompleted = allTasks.filter((t) => t.status === 'completed').length;
  const totalPending = allTasks.filter((t) => t.status === 'pending').length;
  const overallProgress = allTasks.length === 0
    ? 0
    : Math.round((totalCompleted / allTasks.length) * 100);

  function daysRemaining(date) {
    const diff = new Date(date) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold dark:text-white sm:text-2xl">Dashboard</h2>
        <Link to="/create-roadmap">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-1.5 h-4 w-4" />
            Create New Roadmap
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-800 text-white dark:from-indigo-500 dark:to-slate-900">
        <div className="space-y-4">
          {profile ? (
            <>
              <Badge tone="green">Profile Complete</Badge>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back, {user.name}. Your {profile.careerGoal || 'learning'} path is taking shape.
              </h2>
              <p className="text-sm text-indigo-100 sm:text-base sm:max-w-xl">
                Skill level: {profile.skillLevel}{profile.studyHoursPerWeek ? ` \u2022 ${profile.studyHoursPerWeek} hours/week` : ''}{profile.targetCompletionDate ? ` \u2022 Target: ${new Date(profile.targetCompletionDate).toLocaleDateString()}` : ''}
              </p>
              {activeRoadmap && (
                <div className="mt-4 rounded-lg bg-indigo-700/20 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm text-indigo-100">Active roadmap</div>
                      <div className="truncate font-semibold text-white">{activeRoadmap.title}</div>
                    </div>
                    <div className="shrink-0 text-white">{activeProgress}%</div>
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={activeProgress} />
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <Badge tone="yellow">Setup Required</Badge>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome, {user.name}! Let&apos;s personalize your learning path.
              </h2>
              <p className="text-sm text-indigo-100 sm:text-base sm:max-w-xl">
                Complete your profile setup so we can generate a roadmap tailored to your goals and schedule.
              </p>
              <Link to="/profile-setup">
                <Button className="mt-4">Complete Profile Setup</Button>
              </Link>
            </>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Layers className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total</p>
              <p className="text-lg font-bold dark:text-white sm:text-xl">{totalRoadmaps}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Completed</p>
              <p className="text-lg font-bold dark:text-white sm:text-xl">{totalCompleted}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending</p>
              <p className="text-lg font-bold dark:text-white sm:text-xl">{totalPending}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Progress</p>
              <p className="text-lg font-bold dark:text-white sm:text-xl">{overallProgress}%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between sm:mb-5">
            <h3 className="text-base font-bold dark:text-white sm:text-lg">Active Roadmap</h3>
            {activeRoadmap && <Badge>{activeProgress}%</Badge>}
          </div>
          {activeRoadmap ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <Link
                      to={`/roadmaps/${activeRoadmap.id}`}
                      className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                      {activeRoadmap.title}
                    </Link>
                    <div className="mt-3 flex gap-4 text-sm">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Completed</span>
                        <p className="font-semibold dark:text-white">{completedTaskCount}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Remaining</span>
                        <p className="font-semibold dark:text-white">{incompleteTaskCount}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:block sm:text-right">
                    <span className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">Days left</span>
                    <p className="text-xl font-bold text-amber-600 sm:text-2xl">{daysRemaining(activeRoadmap.targetCompletionDate)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <ProgressBar value={activeProgress} />
                </div>
              </div>
              <Link to={`/roadmaps/${activeRoadmap.id}`}>
                <Button variant="secondary" className="w-full">
                  View Roadmap <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <EmptyState
              title="No roadmaps yet"
              description="Create your first roadmap to begin your learning journey."
              action="Create roadmap"
              actionPath="/create-roadmap"
            />
          )}
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-4 text-base font-bold dark:text-white sm:mb-5 sm:text-lg">Continue Learning</h3>
          {incompleteTasks.length > 0 ? (
            <div className="space-y-2">
              {incompleteTasks.map((task) => (
                <Link
                  key={task.id}
                  to={`/roadmaps/${activeRoadmap.id}`}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 transition hover:border-indigo-200 hover:bg-indigo-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/40 sm:gap-3 sm:p-3"
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full sm:h-2.5 sm:w-2.5 ${
                      task.status === 'in_progress' ? 'bg-amber-500' : 'bg-slate-400'
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium dark:text-slate-100">{task.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{task.phase}</p>
                  </div>
                  <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-slate-400 sm:h-4 sm:w-4" />
                </Link>
              ))}
              {incompleteTaskCount > 5 && (
                <p className="pt-1 text-center text-xs text-slate-500 dark:text-slate-400">
                  +{incompleteTaskCount - 5} more {incompleteTaskCount - 5 === 1 ? 'task' : 'tasks'} remaining
                </p>
              )}
            </div>
          ) : (
            <EmptyState
              title={activeRoadmap ? 'All tasks completed' : 'No tasks yet'}
              description={activeRoadmap ? 'Great job! You have completed all tasks for this roadmap.' : 'Create a roadmap to get started.'}
            />
          )}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-4 sm:p-6 lg:col-span-2">
          <h3 className="mb-4 text-base font-bold dark:text-white sm:mb-5 sm:text-lg">Recent Roadmaps</h3>
          {recentRoadmaps.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {recentRoadmaps.map((r) => {
                const total = r.tasks?.length || 0;
                const done = r.tasks?.filter((t) => t.status === 'completed').length || 0;
                const pct = total === 0 ? 0 : Math.round((done / total) * 100);
                return (
                    <Link
                      key={r.id}
                      to={`/roadmaps/${r.id}`}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 transition hover:border-indigo-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900 sm:gap-4 sm:p-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold dark:text-white sm:text-base">{r.title}</p>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 sm:mt-2 sm:gap-3 sm:text-sm">
                          <span>{r.skillLevel}</span>
                          <span>&middot;</span>
                          <span>{done}/{total} tasks</span>
                        </div>
                      </div>
                      <div className="w-16 shrink-0 text-right sm:w-28">
                        <p className="text-xs font-semibold text-emerald-600 sm:text-sm">{pct}%</p>
                        <div className="mt-1">
                          <ProgressBar value={pct} />
                        </div>
                      </div>
                    </Link>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No roadmaps yet"
              description="Create a roadmap to get started."
              action="Create roadmap"
              actionPath="/create-roadmap"
            />
          )}
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-4 text-base font-bold dark:text-white sm:mb-5 sm:text-lg">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-3 text-center transition hover:border-indigo-200 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900 sm:gap-2 sm:p-4"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${action.bg}`}>
                  <action.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="text-xs font-semibold dark:text-white sm:text-sm">{action.label}</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
