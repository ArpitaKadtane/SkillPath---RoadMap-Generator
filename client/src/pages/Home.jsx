import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import Footer from '../components/Footer.jsx';
import LandingCard from '../components/landing/LandingCard.jsx';
import LandingSection from '../components/landing/LandingSection.jsx';
import SectionHeading from '../components/landing/SectionHeading.jsx';
import Logo from '../components/Logo.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

const features = [
  {
    title: 'AI Roadmap Generation',
    description: 'Generate personalized learning paths based on your goals.',
    icon: 'AI',
  },
  {
    title: 'Progress Tracking',
    description: 'Track completed skills, milestones, and weekly momentum.',
    icon: '%',
  },
  {
    title: 'Skill Gap Analysis',
    description: 'Identify missing skills needed for your target role.',
    icon: 'SG',
  },
  {
    title: 'Project Recommendations',
    description: 'Get project ideas aligned with your roadmap.',
    icon: 'PR',
  },
  {
    title: 'Personalized Study Plans',
    description: 'AI-generated weekly learning schedules around your time.',
    icon: 'SP',
  },
  {
    title: 'Career Growth Insights',
    description: 'Understand what to learn next and why it matters.',
    icon: 'CG',
  },
];

const trustedBy = ['Students', 'Developers', 'Career Switchers', 'Professionals'];

const steps = [
  {
    title: 'Set Your Goal',
    description: 'Choose the career path or skill outcome you want.',
  },
  {
    title: 'Tell Us Your Skill Level',
    description: 'Share your current experience and available study time.',
  },
  {
    title: 'Generate Your AI Roadmap',
    description: 'Receive milestones, topics, projects, and weekly pacing.',
  },
  {
    title: 'Track Progress and Achieve Your Goal',
    description: 'Stay focused with visible progress and next steps.',
  },
];

const roadmapMonths = [
  { month: 'Month 1', topics: ['HTML', 'CSS', 'Git'], progress: 100 },
  { month: 'Month 2', topics: ['JavaScript', 'DOM'], progress: 75 },
  { month: 'Month 3', topics: ['React', 'API Integration'], progress: 45 },
  { month: 'Month 4', topics: ['Portfolio Project'], progress: 20 },
];

const testimonials = [
  {
    name: 'Maya Chen',
    role: 'Frontend Developer',
    quote:
      'SkillPath helped me stop jumping between random tutorials and finally follow a sequence that made sense.',
  },
  {
    name: 'Daniel Brooks',
    role: 'Career Switcher',
    quote:
      'The roadmap felt practical. I knew what to learn each week and which projects would prove the skills.',
  },
  {
    name: 'Aisha Patel',
    role: 'Computer Science Student',
    quote:
      'I use it to organize my learning outside college. The progress view makes consistency much easier.',
  },
];

const faqs = [
  {
    question: 'How does SkillPath generate roadmaps?',
    answer:
      'SkillPath uses your career goal, skill level, available time, and target date to create a structured learning plan with milestones and projects.',
  },
  {
    question: 'Is SkillPath suitable for beginners?',
    answer:
      'Yes. Beginners can start with foundational topics, while intermediate learners can receive more advanced paths.',
  },
  {
    question: 'Can I track my progress?',
    answer:
      'Yes. SkillPath is designed to track completed topics, pending milestones, and overall roadmap progress.',
  },
  {
    question: 'What career paths are supported?',
    answer:
      'You can plan paths for frontend, backend, full-stack, data, AI, design-adjacent development roles, and more.',
  },
];

function ProgressLine({ value }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${value}%` }} />
    </div>
  );
}

function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
      className="relative"
    >
      <div className="absolute -inset-6 rounded-[2rem] bg-indigo-500/20 blur-3xl dark:bg-indigo-400/10" />
      <LandingCard className="relative overflow-hidden p-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white shadow-2xl dark:border-slate-700">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">AI Roadmap</p>
              <h3 className="text-lg font-bold">Frontend Developer</h3>
            </div>
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">
              72% complete
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              {['HTML + CSS foundations', 'JavaScript and DOM', 'React components', 'API integration'].map(
                (item, index) => (
                  <div key={item} className="rounded-2xl bg-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold">{item}</p>
                        <p className="text-xs text-slate-400">AI-generated milestone</p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-white p-4 text-slate-950">
                <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">Progress</p>
                <p className="mt-2 text-3xl font-bold">72%</p>
                <div className="mt-3">
                  <ProgressLine value={72} />
                </div>
              </div>
              <div className="rounded-2xl bg-indigo-500 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-indigo-100">
                  Project Recommendation
                </p>
                <p className="mt-2 font-bold">Build a responsive portfolio with GitHub API cards.</p>
              </div>
            </div>
          </div>
        </div>
      </LandingCard>
    </motion.div>
  );
}

function Home() {
  return (
    <main className="overflow-hidden bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.16),_transparent_32%),linear-gradient(to_bottom,_#ffffff,_#f8fafc)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_32%),linear-gradient(to_bottom,_#020617,_#0f172a)]" />
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link to="/" aria-label="SkillPath home">
            <Logo />
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300 lg:flex">
            <a href="#features" className="hover:text-indigo-600">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600">How It Works</a>
            <a href="#about" className="hover:text-indigo-600">About</a>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle className="hidden sm:inline-flex" />
            <Link to="/login" className="hidden text-sm font-semibold text-slate-700 hover:text-indigo-600 dark:text-slate-300 sm:block">
              Login
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>

        <div className="mx-auto grid max-w-7xl gap-14 px-4 pb-24 pt-14 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            <Badge>AI-powered roadmap generator</Badge>
            <h1 className="mt-7 max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Turn Your Career Goal Into a Clear Learning Roadmap
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              SkillPath uses AI to generate personalized learning roadmaps, study plans,
              and project recommendations tailored to your goals and available time.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/register">
                <Button className="w-full px-6 sm:w-auto">Get Started</Button>
              </Link>
              <a href="#demo">
                <Button variant="secondary" className="w-full px-6 sm:w-auto">Watch Demo</Button>
              </a>
            </div>
          </motion.div>

          <HeroMockup />
        </div>
      </section>

      <LandingSection className="py-12">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
            Helping learners build skills with confidence.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustedBy.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </LandingSection>

      <LandingSection id="features">
        <SectionHeading
          centered
          eyebrow="Features"
          title="A complete learning command center."
          description="SkillPath combines AI guidance, structure, and progress visibility so learning feels less random."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <LandingCard key={feature.title} className="transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl dark:hover:border-indigo-900">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-sm font-black text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold">{feature.title}</h3>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">{feature.description}</p>
            </LandingCard>
          ))}
        </div>
      </LandingSection>

      <LandingSection id="how-it-works">
        <SectionHeading
          eyebrow="How It Works"
          title="From ambition to weekly action."
          description="A simple four-step flow that turns an unclear goal into a practical roadmap."
        />
        <div className="relative grid gap-5 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-slate-200 dark:bg-slate-800 lg:block" />
          {steps.map((step, index) => (
            <LandingCard key={step.title} className="relative">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-500/30">
                {index + 1}
              </div>
              <h3 className="text-lg font-bold">{step.title}</h3>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">{step.description}</p>
            </LandingCard>
          ))}
        </div>
      </LandingSection>

      <LandingSection id="demo">
        <SectionHeading
          centered
          eyebrow="Demo Preview"
          title="A sample roadmap that feels actionable."
          description="See how a roadmap can break a career goal into months, milestones, and measurable progress."
        />
        <LandingCard className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Badge tone="green">Sample Roadmap</Badge>
              <h3 className="mt-4 text-2xl font-bold">Frontend Developer Roadmap</h3>
            </div>
            <div className="min-w-56">
              <div className="mb-2 flex justify-between text-sm font-semibold">
                <span>Overall progress</span>
                <span className="text-emerald-600">60%</span>
              </div>
              <ProgressLine value={60} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {roadmapMonths.map((month) => (
              <div key={month.month} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-bold">{month.month}</h4>
                  <span className="text-sm font-bold text-emerald-600">{month.progress}%</span>
                </div>
                <ProgressLine value={month.progress} />
                <div className="mt-5 space-y-2">
                  {month.topics.map((topic) => (
                    <div key={topic} className="rounded-xl bg-white px-3 py-2 text-sm font-semibold dark:bg-slate-900">
                      {topic}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </LandingCard>
      </LandingSection>

      <LandingSection id="about">
        <SectionHeading
          centered
          eyebrow="Why Choose SkillPath"
          title="Replace tutorial chaos with guided progress."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <LandingCard className="border-red-200 dark:border-red-950">
            <h3 className="text-xl font-bold">Without SkillPath</h3>
            <ul className="mt-6 space-y-4 text-slate-600 dark:text-slate-400">
              {['Confusing learning paths', 'Random tutorials', 'No progress tracking'].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="font-bold text-red-500">×</span>
                  {item}
                </li>
              ))}
            </ul>
          </LandingCard>

          <LandingCard className="border-emerald-200 dark:border-emerald-950">
            <h3 className="text-xl font-bold">With SkillPath</h3>
            <ul className="mt-6 space-y-4 text-slate-600 dark:text-slate-400">
              {['Clear roadmap', 'Structured learning', 'AI guidance', 'Progress tracking'].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="font-bold text-emerald-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </LandingCard>
        </div>
      </LandingSection>

      <LandingSection>
        <SectionHeading
          centered
          eyebrow="Testimonials"
          title="Built for learners who want direction."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <LandingCard key={testimonial.name}>
              <p className="leading-7 text-slate-600 dark:text-slate-300">“{testimonial.quote}”</p>
              <div className="mt-6">
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
              </div>
            </LandingCard>
          ))}
        </div>
      </LandingSection>

      <LandingSection>
        <SectionHeading centered eyebrow="FAQ" title="Questions before you start?" />
        <div className="mx-auto grid max-w-4xl gap-4">
          {faqs.map((faq) => (
            <LandingCard key={faq.question} className="p-5">
              <h3 className="font-bold">{faq.question}</h3>
              <p className="mt-2 leading-7 text-slate-600 dark:text-slate-400">{faq.answer}</p>
            </LandingCard>
          ))}
        </div>
      </LandingSection>

      <LandingSection className="py-16">
        <div className="rounded-[2rem] bg-indigo-600 px-6 py-16 text-center text-white shadow-2xl shadow-indigo-500/25">
          <h2 className="text-4xl font-bold tracking-tight">Start Your Learning Journey Today</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100">
            Generate your personalized roadmap in minutes.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/register">
              <Button className="w-full bg-grey text-indigo-700 hover:bg-indigo-50 sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20 sm:w-auto">
                Explore Features
              </Button>
            </a>
          </div>
        </div>
      </LandingSection>

      <Footer />
    </main>
  );
}

export default Home;
