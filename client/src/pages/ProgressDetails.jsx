import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, List } from 'lucide-react';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { fetchRoadmapById, updateTaskStatus } from '../services/roadmapService';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

function groupTasksByPhase(tasks) {
  const map = {};
  for (const task of tasks) {
    if (!map[task.phase]) {
      map[task.phase] = { name: task.phase, order: task.phaseOrder, tasks: [] };
    }
    map[task.phase].tasks.push(task);
  }
  return Object.values(map).sort((a, b) => a.order - b.order);
}

function ProgressDetails() {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchRoadmapById(id);
        setRoadmap(res.roadmap);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load roadmap');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function handleStatusChange(taskId, newStatus) {
    const prevStatus = roadmap.tasks.find((t) => t.id === taskId)?.status;
    setRoadmap((r) => ({
      ...r,
      tasks: r.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    }));
    setUpdating(taskId);
    try {
      const res = await updateTaskStatus(taskId, newStatus);
      setRoadmap((r) => ({
        ...r,
        status: res.roadmapStatus,
        tasks: r.tasks.map((t) => (t.id === taskId ? res.task : t)),
      }));
    } catch {
      setRoadmap((r) => ({
        ...r,
        tasks: r.tasks.map((t) => (t.id === taskId ? { ...t, status: prevStatus } : t)),
      }));
    } finally {
      setUpdating(null);
    }
  }

  if (loading) {
    return <div className="py-20 text-center text-slate-600 dark:text-slate-300">Loading progress...</div>;
  }

  if (error) {
    return <div className="py-20 text-center text-rose-600 dark:text-rose-400">{error}</div>;
  }

  if (!roadmap) {
    return <div className="py-20 text-center text-slate-600 dark:text-slate-300">Roadmap not found.</div>;
  }

  const completedTasks = roadmap.tasks?.filter((t) => t.status === 'completed').length || 0;
  const totalTasks = roadmap.tasks?.length || 0;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const phases = groupTasksByPhase(roadmap.tasks || []);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <Link to="/progress" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
            &larr; Back to Progress
          </Link>
          <h1 className="text-2xl font-bold tracking-tight dark:text-white sm:text-3xl">{roadmap.title}</h1>
        </div>
        <Badge tone={roadmap.status === 'completed' ? 'green' : 'indigo'}>
          {roadmap.status === 'completed' ? 'Completed' : 'Active'}
        </Badge>
      </div>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {completedTasks} / {totalTasks} Tasks
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">{progress}% Complete</p>
          </div>
          <div className="w-full sm:w-48">
            <ProgressBar value={progress} />
          </div>
        </div>
      </Card>

      {totalTasks === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="This roadmap doesn't have any tasks. Generate it to start tracking."
        />
      ) : (
        <div className="space-y-6">
          {phases.map((phase) => (
            <Card key={phase.name}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {phase.name}
              </h3>
              <div className="space-y-3">
                {phase.tasks.map((task) => {
                  const isUpdating = updating === task.id;
                  return (
                    <div
                      key={task.id}
                      className={`rounded-xl border p-4 transition ${
                        task.status === 'completed'
                          ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30'
                          : task.status === 'in_progress'
                          ? 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30'
                          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                      }`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                          {task.status === 'completed' ? (
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                          ) : task.status === 'in_progress' ? (
                            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                          ) : (
                            <List className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                          )}
                          <div>
                            <p
                              className={`font-medium ${
                                task.status === 'completed'
                                  ? 'text-emerald-900 line-through dark:text-emerald-300'
                                  : 'dark:text-white'
                              }`}
                            >
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{task.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          {STATUS_OPTIONS.map((opt) => {
                            const isActive = task.status === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                disabled={isUpdating || isActive}
                                onClick={() => handleStatusChange(task.id, opt.value)}
                                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition disabled:cursor-not-allowed ${
                                  isActive
                                    ? opt.value === 'completed'
                                      ? 'bg-emerald-600 text-white'
                                      : opt.value === 'in_progress'
                                      ? 'bg-amber-500 text-white'
                                      : 'bg-slate-400 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProgressDetails;
