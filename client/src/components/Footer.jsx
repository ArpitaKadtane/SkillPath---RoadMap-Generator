import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

const footerLinks = [
  { label: 'About', href: '/#about' },
  { label: 'Features', href: '/#features' },
  { label: 'Privacy Policy', href: '/#privacy' },
  { label: 'Terms', href: '/#terms' },
];

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-4 py-10 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link to="/" aria-label="SkillPath home">
            <Logo size="small" />
          </Link>
          <p className="mt-3 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            AI-powered learning roadmaps for focused career growth.
          </p>
        </div>
        <nav className="flex flex-wrap gap-5 text-sm font-semibold text-slate-600 dark:text-slate-300">
          {footerLinks.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-indigo-600">
              {link.label}
            </a>
          ))}
        </nav>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          © 2026 SkillPath. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
