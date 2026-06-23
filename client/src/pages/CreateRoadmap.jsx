import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, ArrowRight, Zap, TrendingUp, Code2, Heart,
  Target, Clock, Lightbulb, Layers, Sparkles, BookOpen, Award,
  Plus,
} from 'lucide-react';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import RoadmapPlan from '../components/RoadmapPlan.jsx';
import SuccessMessage from '../components/SuccessMessage.jsx';
import useAuth from '../hooks/useAuth.js';
import api from '../services/api.js';
import { generateRoadmap, saveRoadmap } from '../services/roadmapService';

const LEARNING_PURPOSES = [
  { label: 'Get a Job', value: 'Get Job', icon: Briefcase },
  { label: 'Career Switch', value: 'Career Switch', icon: ArrowRight },
  { label: 'Start Freelancing', value: 'Freelancing', icon: Zap },
  { label: 'Get a Promotion', value: 'Promotion', icon: TrendingUp },
  { label: 'Build a Startup', value: 'Build Startup', icon: Code2 },
  { label: 'Personal Growth', value: 'Personal Growth', icon: Heart },
];

const DESIRED_OUTCOMES = ['Job Ready', 'Interview Ready', 'Portfolio Ready', 'Certification Ready'];

const ROADMAP_STYLES = ['Fast Track', 'Balanced', 'Deep Learning'];

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

function getInitials(name) {
  const parts = (name || '').trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (name || '?')[0].toUpperCase();
}

function CreateRoadmap() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    goal: '',
    skillLevel: 'Beginner',
    studyHours: 2,
    targetDate: '',
    learningPurpose: '',
    preferredTech: [],
    currentSkills: [],
    desiredOutcome: '',
    roadmapStyle: 'Balanced',
  });

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [techInput, setTechInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.get('/api/profile');
        if (res.data.profile) {
          const p = res.data.profile;
          setProfile(p);
          setFormData((prev) => ({
            ...prev,
            goal: p.careerGoal || prev.goal,
            skillLevel: p.skillLevel || prev.skillLevel,
            studyHours: p.studyHoursPerWeek ? Math.max(1, Math.round(p.studyHoursPerWeek / 5)) : prev.studyHours,
            targetDate: p.targetCompletionDate ? p.targetCompletionDate.split('T')[0] : prev.targetDate,
            learningPurpose: p.learningGoal || prev.learningPurpose,
            currentSkills: Array.isArray(p.skills) ? p.skills : prev.currentSkills,
          }));
        }
      } catch {
        // No profile yet — that is fine
      } finally {
        setIsLoading(false);
      }
    }
    if (user?.id) loadProfile();
  }, [user?.id]);

  const estimation = useMemo(() => {
    if (!formData.targetDate || !formData.studyHours) return null;

    const now = new Date();
    const target = new Date(formData.targetDate);
    const diffMs = target - now;
    if (diffMs <= 0) return null;

    const totalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.ceil(totalDays / 7);

    const daysPerWeek = formData.roadmapStyle === 'Fast Track' ? 7 : formData.roadmapStyle === 'Deep Learning' ? 5 : 6;
    const weeklyHours = formData.studyHours * daysPerWeek;

    const stylePhases = { 'Fast Track': 3, 'Balanced': 5, 'Deep Learning': 7 };
    const phases = stylePhases[formData.roadmapStyle] || 5;

    const outcomeProjects = { 'Portfolio Ready': 4, 'Job Ready': 3, 'Interview Ready': 2, 'Certification Ready': 2 };
    const projects = formData.desiredOutcome ? (outcomeProjects[formData.desiredOutcome] || 3) : 3;

    const durationLabel = totalWeeks >= 4
      ? `~${Math.floor(totalWeeks / 4)} months (${totalWeeks} weeks)`
      : `~${totalWeeks} weeks`;

    return {
      duration: durationLabel,
      totalWeeks,
      phases,
      projects,
      weeklyWorkload: `${formData.studyHours}–${Math.ceil(formData.studyHours * 1.5)} hrs/week`,
      busyDays: `${daysPerWeek} days/week`,
    };
  }, [formData]);

  const recommendationText = useMemo(() => {
    if (!formData.goal.trim() && !formData.learningPurpose) return null;

    const purpose = formData.learningPurpose || 'your goal';
    const style = formData.roadmapStyle?.toLowerCase() || 'balanced';
    const hours = formData.studyHours || '—';

    let focus = 'core concepts and practical skills.';
    if (formData.desiredOutcome === 'Interview Ready') focus = 'interview preparation, algorithms, and system design.';
    else if (formData.desiredOutcome === 'Portfolio Ready') focus = 'building real-world projects for your portfolio.';
    else if (formData.desiredOutcome === 'Certification Ready') focus = 'exam-focused topics and certification requirements.';

    return {
      headline: `${style} roadmap for ${purpose}`,
      body: `We recommend a **${style}** approach with **${hours} hrs/day** focused on **${focus}** This pace balances depth with steady progress.`,
      features: [
        `${estimation?.phases || '—'} structured phases`,
        `${estimation?.projects || '—'} hands-on projects`,
        `${estimation?.weeklyWorkload || '—'} weekly commitment`,
      ],
    };
  }, [formData, estimation]);

  function handleChange(event) {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setError(null);
    setPreview(null);
  }

  function addTech() {
    const trimmed = techInput.trim();
    if (!trimmed) return;
    if (formData.preferredTech.includes(trimmed)) { setTechInput(''); return; }
    if (formData.preferredTech.length >= 20) return;
    setFormData((prev) => ({ ...prev, preferredTech: [...prev.preferredTech, trimmed] }));
    setTechInput('');
  }

  function removeTech(tech) {
    setFormData((prev) => ({ ...prev, preferredTech: prev.preferredTech.filter((t) => t !== tech) }));
  }

  function addCurrentSkill() {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (formData.currentSkills.includes(trimmed)) { setSkillInput(''); return; }
    if (formData.currentSkills.length >= 20) return;
    setFormData((prev) => ({ ...prev, currentSkills: [...prev.currentSkills, trimmed] }));
    setSkillInput('');
  }

  function removeCurrentSkill(skill) {
    setFormData((prev) => ({ ...prev, currentSkills: prev.currentSkills.filter((s) => s !== skill) }));
  }

  function handleGenerate() {
    setError(null);
    setSuccess(null);
    setPreview(null);

    if (!formData.goal.trim() || !formData.targetDate) {
      setError('Please enter your career goal and target completion date.');
      return;
    }

    setIsGenerating(true);

    const payload = {
      careerGoal: formData.goal,
      currentSkillLevel: formData.skillLevel,
      studyHoursPerDay: Number(formData.studyHours),
      targetCompletionDate: formData.targetDate,
      learningPurpose: formData.learningPurpose || null,
      preferredTech: formData.preferredTech,
      currentSkills: formData.currentSkills,
      desiredOutcome: formData.desiredOutcome || null,
      roadmapStyle: formData.roadmapStyle || 'Balanced',
    };

    generateRoadmap(payload)
      .then((res) => {
        setPreview(res.roadmap);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || 'Failed to generate roadmap');
      })
      .finally(() => setIsGenerating(false));
  }

  function handleSave() {
    if (!preview) return;
    setIsSaving(true);
    setError(null);

    const payload = {
      title: preview.title || `${formData.goal} Roadmap`,
      goal: formData.goal,
      skillLevel: formData.skillLevel,
      studyHoursPerDay: Number(formData.studyHours),
      targetCompletionDate: formData.targetDate,
      summary: preview.summary || '',
      roadmapType: preview.roadmapType || '',
      estimatedDuration: preview.estimatedDuration || '',
      phases: preview.phases || [],
      learningPurpose: formData.learningPurpose || null,
      preferredTech: formData.preferredTech,
      currentSkills: formData.currentSkills,
      desiredOutcome: formData.desiredOutcome || null,
      roadmapStyle: formData.roadmapStyle || 'Balanced',
    };

    saveRoadmap(payload)
      .then((res) => {
        setSuccess('Roadmap saved successfully');
        setPreview(null);
        if (res.roadmap?.id) {
          navigate(`/roadmaps/${res.roadmap.id}`);
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.message || 'Failed to save roadmap');
      })
      .finally(() => setIsSaving(false));
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-10 w-96 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
            ))}
          </div>
          <div className="space-y-6">
            <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
            <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge>Create Roadmap</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            Map out your learning journey.
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
            Tell SkillPath about your goal, preferences, and schedule. Our AI will craft a personalized roadmap tailored to you.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <Target className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold dark:text-white">Learning Purpose</h3>
            </div>
            <label className="mb-3 block text-sm font-semibold text-slate-800 dark:text-slate-200">
              What brings you here?
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {LEARNING_PURPOSES.map((purpose) => {
                const selected = formData.learningPurpose === purpose.value;
                return (
                  <button
                    key={purpose.value}
                    type="button"
                    name="learningPurpose"
                    value={purpose.value}
                    onClick={(e) => handleChange(e)}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center text-sm font-medium transition ${
                      selected
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600'
                    }`}
                  >
                    <purpose.icon className={`h-5 w-5 ${selected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                    {purpose.label}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <BookOpen className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold dark:text-white">Roadmap Details</h3>
            </div>
            <div className="space-y-5">
              <div>
                <label htmlFor="goal" className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Career Goal
                </label>
                <input
                  id="goal"
                  name="goal"
                  type="text"
                  value={formData.goal}
                  onChange={handleChange}
                  placeholder="Example: Become a full-stack developer"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="skillLevel" className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Current Skill Level
                  </label>
                  <select
                    id="skillLevel"
                    name="skillLevel"
                    value={formData.skillLevel}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    {SKILL_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Roadmap Style
                  </label>
                  <div className="flex gap-2">
                    {ROADMAP_STYLES.map((style) => {
                      const selected = formData.roadmapStyle === style;
                      return (
                        <button
                          key={style}
                          type="button"
                          name="roadmapStyle"
                          value={style}
                          onClick={(e) => handleChange(e)}
                          className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-center text-xs font-semibold transition ${
                            selected
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600'
                          }`}
                        >
                          {style}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                <Code2 className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold dark:text-white">Technologies</h3>
            </div>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Preferred Technologies <span className="font-normal text-slate-400">(what you want to learn)</span>
                </label>
                {formData.preferredTech.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {formData.preferredTech.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTech(tech)}
                          className="inline-flex h-4 w-4 items-center justify-center rounded-full text-indigo-400 transition hover:bg-indigo-200 hover:text-indigo-700 dark:hover:bg-indigo-800 dark:hover:text-indigo-200"
                          aria-label={`Remove ${tech}`}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                    placeholder="Type a technology and press Enter"
                    maxLength={50}
                    className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    disabled={!techInput.trim() || formData.preferredTech.length >= 20}
                    className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {formData.preferredTech.length} / 20 technologies
                </div>
              </div>

              <hr className="border-slate-200 dark:border-slate-800" />

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Current Skills <span className="font-normal text-slate-400">(what you already know)</span>
                </label>
                {formData.currentSkills.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {formData.currentSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeCurrentSkill(skill)}
                          className="inline-flex h-4 w-4 items-center justify-center rounded-full text-emerald-400 transition hover:bg-emerald-200 hover:text-emerald-700 dark:hover:bg-emerald-800 dark:hover:text-emerald-200"
                          aria-label={`Remove ${skill}`}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCurrentSkill(); } }}
                    placeholder="Type a skill you have and press Enter"
                    maxLength={50}
                    className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={addCurrentSkill}
                    disabled={!skillInput.trim() || formData.currentSkills.length >= 20}
                    className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {formData.currentSkills.length} / 20 skills
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                <Award className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold dark:text-white">Desired Outcome</h3>
            </div>
            <label className="mb-3 block text-sm font-semibold text-slate-800 dark:text-slate-200">
              What do you want to be ready for?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {DESIRED_OUTCOMES.map((outcome) => {
                const selected = formData.desiredOutcome === outcome;
                return (
                  <button
                    key={outcome}
                    type="button"
                    name="desiredOutcome"
                    value={outcome}
                    onClick={(e) => handleChange(e)}
                    className={`rounded-xl border-2 px-4 py-3 text-center text-sm font-semibold transition ${
                      selected
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600'
                    }`}
                  >
                    {outcome}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <Clock className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold dark:text-white">Schedule</h3>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="studyHours" className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Study Hours Per Day
                </label>
                <input
                  id="studyHours"
                  name="studyHours"
                  type="number"
                  min="1"
                  max="24"
                  value={formData.studyHours}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="targetDate" className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Target Completion Date
                </label>
                <input
                  id="targetDate"
                  name="targetDate"
                  type="date"
                  value={formData.targetDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>
          </Card>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              {error}
            </div>
          )}

          {success && <SuccessMessage>{success}</SuccessMessage>}

          {preview && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 shadow-soft dark:border-indigo-900 dark:from-indigo-950/50 dark:via-slate-900 dark:to-violet-950/40">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  AI-generated preview {preview.roadmapType ? `\u2022 ${preview.roadmapType.toLowerCase()} roadmap` : ''}
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{preview.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{preview.summary}</p>
                {preview.estimatedDuration && (
                  <p className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    Estimated Duration: {preview.estimatedDuration}
                  </p>
                )}
              </div>

              <RoadmapPlan phases={preview.phases || []} roadmapType={preview.roadmapType} />

              <div className="flex gap-3">
                <Button type="button" isLoading={isSaving} onClick={handleSave}>
                  Save Roadmap
                </Button>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <Card>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white shadow-sm">
                {getInitials(user?.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold dark:text-white">{user?.name || 'Your Name'}</p>
                <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                  {formData.goal || 'Ready to learn'}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {formData.skillLevel && <Badge>{formData.skillLevel}</Badge>}
              {formData.learningPurpose && <Badge tone="green">{formData.learningPurpose}</Badge>}
              {formData.roadmapStyle && <Badge tone="gray">{formData.roadmapStyle}</Badge>}
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Live Estimation
              </h3>
            </div>
            {estimation ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Duration</p>
                    <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{estimation.duration}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Phases</p>
                    <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{estimation.phases} phases</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Projects</p>
                    <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{estimation.projects} projects</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Workload</p>
                    <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{estimation.weeklyWorkload}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{estimation.busyDays}</span>
                  <span>{formData.studyHours} hrs/day</span>
                </div>
                <ProgressBar value={Math.min(100, Math.round((estimation.totalWeeks / 52) * 100))} />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {estimation.totalWeeks <= 4 ? 'Short-term sprint' : estimation.totalWeeks <= 16 ? 'Medium-term journey' : 'Long-term commitment'}
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-950/60">
                Set a target date and study hours to see your roadmap estimation.
              </div>
            )}
          </Card>

          {recommendationText && (
            <Card className="relative overflow-hidden">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-indigo-200/30 to-violet-200/30 blur-2xl dark:from-indigo-500/10 dark:to-violet-500/10" />
              <div className="relative">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    AI Recommendation
                  </h3>
                </div>
                <h4 className="text-base font-bold capitalize text-slate-900 dark:text-white">
                  {recommendationText.headline}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {recommendationText.body.split('**').map((part, i) =>
                    i % 2 === 1 ? <strong key={i} className="font-semibold text-slate-900 dark:text-white">{part}</strong> : part
                  )}
                </p>
                <div className="mt-4 space-y-2">
                  {recommendationText.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                        <Lightbulb className="h-3 w-3" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          <Button
            type="button"
            isLoading={isGenerating}
            className="w-full"
            onClick={handleGenerate}
          >
            Generate Roadmap
          </Button>

          <p className="text-center text-xs text-slate-400 dark:text-slate-500">
            Powered by Groq AI &middot; Your inputs shape a personalized learning plan
          </p>
        </aside>
      </div>
    </div>
  );
}

export default CreateRoadmap;
