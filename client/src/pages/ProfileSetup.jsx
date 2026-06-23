import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Target, Code, Heart, CheckCircle2,
  Briefcase, Layers, Zap, ArrowRight,
} from 'lucide-react';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import FormField from '../components/FormField.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import SuccessMessage from '../components/SuccessMessage.jsx';
import useAuth from '../hooks/useAuth.js';
import api from '../services/api.js';

const SKILL_LEVELS = [
  { label: 'Beginner', value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced', value: 'Advanced' },
  { label: 'Expert', value: 'Expert' },
];

const EXPERIENCE_LEVELS = [
  { label: 'Student', value: 'Student' },
  { label: 'Fresher', value: 'Fresher' },
  { label: 'Junior Developer', value: 'Junior Developer' },
  { label: 'Mid-Level Developer', value: 'Mid-Level Developer' },
  { label: 'Senior Developer', value: 'Senior Developer' },
];

const OCCUPATIONS = [
  { label: 'Student', value: 'Student' },
  { label: 'Working Professional', value: 'Working Professional' },
  { label: 'Freelancer', value: 'Freelancer' },
  { label: 'Job Seeker', value: 'Job Seeker' },
];

const LEARNING_GOALS = [
  { label: 'Get a Job', value: 'Get Job', icon: Briefcase },
  { label: 'Get a Promotion', value: 'Promotion', icon: ArrowRight },
  { label: 'Start Freelancing', value: 'Freelancing', icon: Zap },
  { label: 'Switch Career', value: 'Career Switch', icon: ArrowRight },
  { label: 'Upgrade Skills', value: 'Skill Upgrade', icon: Layers },
  { label: 'Build a Startup', value: 'Build Startup', icon: Code },
];

const LEARNING_STYLES = [
  { label: 'Video Courses', value: 'Video Courses' },
  { label: 'Documentation', value: 'Documentation' },
  { label: 'Project Based', value: 'Project Based' },
  { label: 'Mixed', value: 'Mixed' },
];

const CHECKLIST_ITEMS = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'skillLevel', label: 'Skill Level' },
  { key: 'learningGoal', label: 'Learning Goal' },
  { key: 'skills', label: 'Skills' },
  { key: 'motivation', label: 'Motivation' },
];

const INITIAL_PROFILE = {
  fullName: '',
  skillLevel: '',
  learningGoal: '',
  learningStyle: '',
  experienceLevel: '',
  occupation: '',
  skills: [],
  motivation: '',
};

function getInitials(name) {
  const parts = (name || '').trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (name || '?')[0].toUpperCase();
}

function validateProfile(profile) {
  const errors = {};

  if (!profile.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!profile.skillLevel) errors.skillLevel = 'Please choose your current skill level.';

  return errors;
}

function ProfileSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ ...INITIAL_PROFILE, fullName: user?.name || '' });
  const [errors, setErrors] = useState({});
  const [savedProfile, setSavedProfile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        const response = await api.get('/api/profile');
        if (response.data.profile) {
          const p = response.data.profile;
          setProfile({
            fullName: user?.name || '',
            skillLevel: p.skillLevel || '',
            learningGoal: p.learningGoal || '',
            learningStyle: p.learningStyle || '',
            experienceLevel: p.experienceLevel || '',
            occupation: p.occupation || '',
            skills: Array.isArray(p.skills) ? p.skills : [],
            motivation: p.motivation || '',
          });
        }
      } catch {
        // No existing profile is fine
      } finally {
        setIsLoading(false);
      }
    }
    if (user?.id) loadProfile();
  }, [user?.id]);

  const completion = useMemo(() => {
    let filled = 0;
    const total = 4;
    if (profile.fullName.trim()) filled++;
    if (profile.skillLevel) filled++;
    if (profile.learningGoal) filled++;
    if (profile.skills.length > 0) filled++;
    return Math.round((filled / total) * 100);
  }, [profile]);

  const readinessScore = useMemo(() => {
    let score = 0;
    const maxScore = 5;
    const checklist = {
      fullName: !!profile.fullName.trim(),
      skillLevel: !!profile.skillLevel,
      learningGoal: !!profile.learningGoal,
      skills: profile.skills.length > 0,
      motivation: !!profile.motivation.trim(),
    };
    Object.values(checklist).forEach((v) => { if (v) score++; });
    return { score: Math.round((score / maxScore) * 100), completed: score, total: maxScore, checklist };
  }, [profile]);

  function handleChange(event) {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setSavedProfile(null);
  }

  const [skillInput, setSkillInput] = useState('');

  function addSkill() {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (profile.skills.includes(trimmed)) {
      setSkillInput('');
      return;
    }
    if (profile.skills.length >= 20) return;
    setProfile((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    setSkillInput('');
    setSavedProfile(null);
  }

  function removeSkill(skill) {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
    setSavedProfile(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateProfile(profile);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const profileData = {
        skillLevel: profile.skillLevel,
        learningGoal: profile.learningGoal || null,
        learningStyle: profile.learningStyle || null,
        experienceLevel: profile.experienceLevel || null,
        occupation: profile.occupation || null,
        skills: profile.skills || [],
        motivation: profile.motivation || null,
      };

      const response = await api.post('/api/profile', profileData);
      if (response.status === 201 || response.status === 200) {
        setSavedProfile(profile);
        window.setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-10 w-96 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
            ))}
          </div>
          <div className="space-y-6">
            <div className="h-72 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
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
          <Badge>Profile Setup</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            Personalize your SkillPath experience.
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
            Set up your learning profile to get roadmaps tailored to your goals, schedule, and experience level.
          </p>
        </div>
      </div>

      {savedProfile && (
        <SuccessMessage>
          Profile saved successfully! Redirecting to dashboard...
        </SuccessMessage>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <Card>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <User className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-bold dark:text-white">Personal Info</h3>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  label="Full Name"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  placeholder="Example: Arpita Sharma"
                  error={errors.fullName}
                />
                <FormField
                  label="Skill Level"
                  name="skillLevel"
                  type="select"
                  value={profile.skillLevel}
                  onChange={handleChange}
                  error={errors.skillLevel}
                  options={[
                    { label: 'Select your skill level', value: '' },
                    ...SKILL_LEVELS.map((s) => ({ label: s.label, value: s.value })),
                  ]}
                />
              </div>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <FormField
                  label="Experience Level"
                  name="experienceLevel"
                  type="select"
                  value={profile.experienceLevel}
                  onChange={handleChange}
                  options={[
                    { label: 'Select experience level', value: '' },
                    ...EXPERIENCE_LEVELS.map((e) => ({ label: e.label, value: e.value })),
                  ]}
                />
                <FormField
                  label="Current Occupation"
                  name="occupation"
                  type="select"
                  value={profile.occupation}
                  onChange={handleChange}
                  options={[
                    { label: 'Select your occupation', value: '' },
                    ...OCCUPATIONS.map((o) => ({ label: o.label, value: o.value })),
                  ]}
                />
              </div>
            </Card>

            <Card>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <Target className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-bold dark:text-white">Learning Preferences</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Learning Goal
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {LEARNING_GOALS.map((goal) => {
                      const selected = profile.learningGoal === goal.value;
                      return (
                        <button
                          key={goal.value}
                          type="button"
                          name="learningGoal"
                          onClick={() => {
                            setProfile((prev) => ({ ...prev, learningGoal: goal.value }));
                            setSavedProfile(null);
                          }}
                          className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center text-sm font-medium transition ${
                            selected
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600'
                          }`}
                        >
                          <goal.icon className={`h-5 w-5 ${selected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                          {goal.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="grid gap-5">
                  <FormField
                    label="Preferred Learning Style"
                    name="learningStyle"
                    type="select"
                    value={profile.learningStyle}
                    onChange={handleChange}
                    options={[
                      { label: 'Select learning style', value: '' },
                      ...LEARNING_STYLES.map((s) => ({ label: s.label, value: s.value })),
                    ]}
                  />
                </div>
              </div>
            </Card>



            <Card>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                  <Code className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-bold dark:text-white">Skills</h3>
              </div>
              {profile.skills.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-indigo-400 transition hover:bg-indigo-200 hover:text-indigo-700 dark:hover:bg-indigo-800 dark:hover:text-indigo-200"
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
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  placeholder="Type a skill and press Enter"
                  maxLength={50}
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  disabled={!skillInput.trim() || profile.skills.length >= 20}
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{profile.skills.length} / 20 skills</span>
                {profile.skills.length >= 20 && (
                  <span className="font-medium text-amber-600">Maximum reached</span>
                )}
              </div>
            </Card>

            <Card>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                  <Heart className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-bold dark:text-white">Motivation</h3>
              </div>
              <textarea
                name="motivation"
                value={profile.motivation}
                onChange={handleChange}
                placeholder="Why are you learning this skill? What drives you to achieve this goal?"
                rows={4}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
              />
            </Card>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {savedProfile ? 'Profile saved!' : 'Your progress is saved when you click Save.'}
              </p>
              <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                {savedProfile ? 'Saved' : 'Save Profile'}
              </Button>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <Card>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white shadow-sm">
                  {getInitials(profile.fullName)}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-bold dark:text-white">
                    {profile.fullName || 'Your Name'}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {profile.skillLevel && <Badge>{profile.skillLevel}</Badge>}
                {profile.learningGoal && <Badge>{profile.learningGoal}</Badge>}
                {profile.skills.length > 0 && (
                  <Badge tone="gray">
                    {profile.skills.slice(0, 2).join(', ')}
                    {profile.skills.length > 2 && ` +${profile.skills.length - 2}`}
                  </Badge>
                )}
              </div>
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Profile Completion
                  </span>
                  <span className="font-bold text-emerald-600">{completion}%</span>
                </div>
                <ProgressBar value={completion} />
              </div>
            </Card>

            <Card>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <CheckCircle2 className="h-4 w-4" />
                Onboarding Checklist
              </h3>
              <div className="space-y-3">
                {CHECKLIST_ITEMS.map((item) => {
                  const done = readinessScore.checklist[item.key];
                  return (
                    <div key={item.key} className="flex items-center gap-3 text-sm">
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition ${
                          done
                            ? 'bg-emerald-500 text-white'
                            : 'border-2 border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900'
                        }`}
                      >
                        {done && <CheckCircle2 className="h-4 w-4" />}
                      </div>
                      <span
                        className={
                          done
                            ? 'font-medium text-slate-900 dark:text-white'
                            : 'text-slate-500 dark:text-slate-400'
                        }
                      >
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Roadmap Readiness
                </h3>
                <span className="text-2xl font-bold text-indigo-600">{readinessScore.score}%</span>
              </div>
              <ProgressBar value={readinessScore.score} />
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                {readinessScore.score < 40 && 'Fill in more details to get a personalized roadmap.'}
                {readinessScore.score >= 40 && readinessScore.score < 70 && 'Good start! A few more details will sharpen your roadmap.'}
                {readinessScore.score >= 70 && readinessScore.score < 100 && 'Almost ready! Your roadmap will be highly tailored.'}
                {readinessScore.score === 100 && 'Perfect! You are ready to generate roadmaps.'}
              </p>
            </Card>
          </aside>
        </div>
      </form>
    </div>
  );
}

export default ProfileSetup;
