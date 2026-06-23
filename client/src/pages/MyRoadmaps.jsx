import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Badge from '../components/Badge.jsx';
import Card from '../components/Card.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { fetchMyRoadmaps, deleteRoadmap as deleteRoadmapApi } from '../services/roadmapService';

function MyRoadmaps() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roadmapToDelete, setRoadmapToDelete] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchMyRoadmaps()
      .then((res) => {
        setRoadmaps(res.roadmaps || []);
      })
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load roadmaps'))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(roadmap) {
    try {
      await deleteRoadmapApi(roadmap.id);
      setRoadmaps((prev) => prev.filter((r) => r.id !== roadmap.id));
      toast.success('Roadmap deleted successfully');
    } catch {
      toast.error('Failed to delete roadmap');
    } finally {
      setRoadmapToDelete(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">My Roadmaps</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight dark:text-white">Your learning plans</h2>
        </div>
        <div className="flex gap-3">
          <input
            type="search"
            placeholder="Search roadmaps..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white sm:w-64"
          />
          <select className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white">
            <option>All</option>
            <option>Active</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : roadmaps.length === 0 ? (
        <EmptyState title="No roadmaps yet" description="Generate your first roadmap to start tracking your learning." action="Create roadmap" />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {roadmaps.map((roadmap) => {
            const total = roadmap.tasks?.length || 0;
            const completed = roadmap.tasks?.filter((t) => t.status === 'completed').length || 0;
            const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

            return (
              <div key={roadmap.id} className="group relative">
                <Link to={`/roadmaps/${roadmap.id}`} className="block rounded-3xl outline-none transition hover:shadow-lg focus-visible:ring-2 focus-visible:ring-indigo-500">
                  <Card>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold dark:text-white">{roadmap.title}</h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{new Date(roadmap.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Badge>{roadmap.skillLevel}</Badge>
                    </div>
                    <div className="mt-6">
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="font-medium dark:text-slate-200">Progress</span>
                        <span className="text-emerald-600">{progress}%</span>
                      </div>
                      <ProgressBar value={progress} />
                    </div>
                  </Card>
                </Link>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setRoadmapToDelete(roadmap); }}
                  className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-950"
                  aria-label={`Delete ${roadmap.title}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {roadmapToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h3 className="text-lg font-bold dark:text-white">Delete roadmap</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to delete this roadmap?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRoadmapToDelete(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(roadmapToDelete)}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyRoadmaps;
