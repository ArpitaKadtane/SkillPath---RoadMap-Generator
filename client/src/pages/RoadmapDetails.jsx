import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { List, CheckCircle2, Clock, Target } from 'lucide-react';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import RoadmapPlan from '../components/RoadmapPlan.jsx';
import { fetchRoadmapById, deleteRoadmap as deleteRoadmapApi } from '../services/roadmapService';

function inferRoadmapType(phases, savedType) {
  if (savedType) return savedType;
  if (phases.some((p) => p.days?.length > 0)) return 'DAILY';
  const first = phases[0]?.phase?.toLowerCase() || '';
  if (first.includes('quarter')) return 'QUARTERLY';
  if (first.includes('month')) return 'MONTHLY';
  if (first.includes('week')) return 'WEEKLY';
  return 'WEEKLY';
}

const STATUS_MAP = {
  active: { label: 'Active', tone: 'indigo' },
  completed: { label: 'Completed', tone: 'green' },
  archived: { label: 'Archived', tone: 'gray' },
};

const TYPE_LABELS = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  QUARTERLY: 'Quarterly',
};

function RoadmapDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadRoadmap() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchRoadmapById(id);
        setRoadmap(res.roadmap);
      } catch (err) {
        console.error('Roadmap fetch error:', err);
        setError(err?.response?.data?.message || 'Failed to load roadmap');
      } finally {
        setLoading(false);
      }
    }
    if (id) loadRoadmap();
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteRoadmapApi(roadmap.id);
      toast.success('Roadmap deleted successfully');
      navigate('/roadmaps');
    } catch {
      toast.error('Failed to delete roadmap');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  const completedTasks = roadmap?.tasks?.filter((t) => t.status === 'completed').length || 0;
  const totalTasks = roadmap?.tasks?.length || 0;
  const remainingTasks = totalTasks - completedTasks;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const phases = Array.isArray(roadmap?.phasesData) ? roadmap.phasesData : [];
  const roadmapType = inferRoadmapType(phases, roadmap?.roadmapType);
  const statusInfo = STATUS_MAP[roadmap?.status?.toLowerCase()] || { label: roadmap?.status || 'Draft', tone: 'gray' };
  const hasContent = phases.length > 0 || totalTasks > 0;

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-600 dark:text-slate-300">
        Loading roadmap...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-rose-600 dark:text-rose-400">
        {error}
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="py-20 text-center text-slate-600 dark:text-slate-300">
        Roadmap not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Roadmap Details</p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight dark:text-white">{roadmap.title}</h1>
            <Badge tone={statusInfo.tone}>{statusInfo.label}</Badge>
          </div>
        </div>
        <div className="flex shrink-0 gap-3">
          <Link to="/roadmaps">
            <Button variant="secondary">Back to My Roadmaps</Button>
          </Link>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(true)}
            className="text-red-600 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-950"
          >
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Summary
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Career Goal</p>
            <p className="mt-1 font-medium text-slate-900 dark:text-white">{roadmap.goal}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Skill Level</p>
            <p className="mt-1 font-medium text-slate-900 dark:text-white">{roadmap.skillLevel}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Roadmap Type</p>
            <p className="mt-1 font-medium text-slate-900 dark:text-white">{TYPE_LABELS[roadmapType] || roadmapType}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Created</p>
            <p className="mt-1 font-medium text-slate-900 dark:text-white">{new Date(roadmap.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Target Completion</p>
            <p className="mt-1 font-medium text-slate-900 dark:text-white">{new Date(roadmap.targetCompletionDate).toLocaleDateString()}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <List className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Tasks</p>
              <p className="text-xl font-bold dark:text-white">{totalTasks}</p>
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
              <p className="text-xl font-bold dark:text-white">{completedTasks}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Remaining</p>
              <p className="text-xl font-bold dark:text-white">{remainingTasks}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Progress</p>
              <p className="text-xl font-bold dark:text-white">{progress}%</p>
            </div>
          </div>
        </Card>
      </div>

      {totalTasks > 0 && (
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {completedTasks} / {totalTasks} Tasks Completed
              </p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">{progress}% Complete</p>
            </div>
            <div className="w-full sm:w-48">
              <ProgressBar value={progress} />
            </div>
          </div>
        </Card>
      )}

      {hasContent ? (
        <RoadmapPlan phases={phases} roadmapType={roadmapType} />
      ) : (
        <EmptyState
          title="No content yet"
          description="This roadmap doesn't have any phases or tasks yet. Generate it to start tracking your learning journey."
        />
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-bold dark:text-white">Delete roadmap</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to delete this roadmap?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoadmapDetails;
