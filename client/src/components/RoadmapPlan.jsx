import { CheckCircle2, Clock3, ExternalLink, Sparkles, Target } from 'lucide-react';
import Card from './Card.jsx';

function formatResource(resource) {
  if (typeof resource === 'string') {
    return { title: resource, type: 'Resource', url: '' };
  }

  return {
    title: resource?.title || resource?.name || resource?.url || 'Resource',
    type: resource?.type || resource?.category || 'Resource',
    url: resource?.url || resource?.link || '',
  };
}

function getPhaseItems(phase) {
  const sections = [
    { label: 'Milestones', items: phase.milestones || [] },
    { label: 'Objectives', items: phase.objectives || [] },
    { label: 'Deliverables', items: phase.deliverables || [] },
  ];

  return sections.filter((section) => section.items.length > 0);
}

function getPhaseCountLabel(phase, roadmapType) {
  if (roadmapType === 'DAILY') {
    return `${phase.days?.length || 0} days`;
  }

  if (roadmapType === 'WEEKLY') return 'Week card';
  if (roadmapType === 'MONTHLY') return 'Month card';
  if (roadmapType === 'QUARTERLY') return 'Quarter card';

  return phase.days?.length ? `${phase.days.length} days` : 'Phase card';
}

function inferRoadmapType(phases, roadmapType) {
  if (roadmapType) return roadmapType;
  if (phases.some((phase) => phase.days?.length > 0)) return 'DAILY';

  const firstPhase = phases[0]?.phase?.toLowerCase() || '';
  if (firstPhase.includes('quarter')) return 'QUARTERLY';
  if (firstPhase.includes('month')) return 'MONTHLY';
  if (firstPhase.includes('week')) return 'WEEKLY';

  return 'WEEKLY';
}

function RoadmapPlan({ phases = [], roadmapType, compact = false }) {
  if (!phases.length) {
    return (
      <Card>
        <p className="text-sm text-slate-600 dark:text-slate-400">No phases were saved for this roadmap yet.</p>
      </Card>
    );
  }

  const displayType = inferRoadmapType(phases, roadmapType);

  return (
    <div className="space-y-5">
      {phases.map((phase, phaseIndex) => (
        <Card key={`${phase.phase}-${phaseIndex}`} className="overflow-hidden p-0">
          <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 p-5 dark:border-slate-800 dark:from-indigo-950/50 dark:via-slate-900 dark:to-violet-950/40">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-100 dark:bg-slate-900/80 dark:text-indigo-300 dark:ring-indigo-900">
                  <Sparkles className="h-3.5 w-3.5" />
                  {phase.phase || `Week ${phaseIndex + 1}`}
                </div>
                <h3 className="mt-3 text-lg font-bold tracking-tight text-slate-950 dark:text-white sm:text-xl">
                  {phase.focus || 'Focused learning sprint'}
                </h3>
                {phase.outcome && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{phase.outcome}</p>
                )}
              </div>
              <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950/70 dark:text-slate-200 dark:ring-slate-800">
                {getPhaseCountLabel(phase, displayType)}
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5">
            {displayType === 'DAILY' && phase.days?.length > 0 && (
              <div className="relative space-y-3 before:absolute before:bottom-3 before:left-4 before:top-3 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
                {phase.days.map((day, dayIndex) => (
                  <div key={`${day.day}-${dayIndex}`} className="relative flex gap-3">
                    <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-sm">
                      {day.day}
                    </div>
                    <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">{day.title}</h4>
                        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800">
                          <Clock3 className="h-3.5 w-3.5" />
                          {day.estimatedHours}h
                        </span>
                      </div>
                      {day.description && (
                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{day.description}</p>
                      )}
                      {day.deliverable && (
                        <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                          <span className="font-semibold">Deliverable:</span> {day.deliverable}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {displayType !== 'DAILY' && (
              <div className="grid gap-3">
                {phase.goal && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Goal
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{phase.goal}</p>
                  </div>
                )}

                {getPhaseItems(phase).map((section) => (
                  <div key={section.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {section.label}
                    </p>
                    <div className="mt-3 grid gap-2">
                      {section.items.map((item, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-indigo-500" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {phase.project && (
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/40">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                  <Target className="h-4 w-4" />
                  {displayType === 'DAILY' ? 'Mini Project' : 'Project'}
                </div>
                <p className="mt-2 font-semibold text-indigo-950 dark:text-indigo-100">{phase.project.title}</p>
                <p className="mt-1 text-sm leading-6 text-indigo-800 dark:text-indigo-300">{phase.project.description}</p>
              </div>
            )}

            {phase.portfolioProjects?.length > 0 && (
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/40">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                  <Target className="h-4 w-4" />
                  Portfolio Projects
                </div>
                <div className="mt-3 grid gap-3">
                  {phase.portfolioProjects.map((project, index) => (
                    <div key={index}>
                      <p className="font-semibold text-indigo-950 dark:text-indigo-100">{project.title}</p>
                      <p className="mt-1 text-sm leading-6 text-indigo-800 dark:text-indigo-300">{project.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {phase.checkpoint?.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Mentor Checkpoint
                </p>
                <div className="mt-2 grid gap-2">
                  {phase.checkpoint.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-300">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {phase.resources?.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Curated Resources
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {phase.resources.map((item, index) => {
                    const resource = formatResource(item);
                    const content = (
                      <>
                        <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                          {resource.type}
                        </span>
                        <span className="mt-1 flex items-start justify-between gap-3 text-sm font-medium text-slate-800 dark:text-slate-200">
                          {resource.title}
                          {resource.url && <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />}
                        </span>
                      </>
                    );

                    return resource.url ? (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-slate-200 bg-white p-3 transition hover:border-indigo-200 hover:bg-indigo-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/40"
                      >
                        {content}
                      </a>
                    ) : (
                      <div key={index} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
                        {content}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

export default RoadmapPlan;
