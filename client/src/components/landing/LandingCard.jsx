function LandingCard({ children, className = '' }) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 ${className}`}
    >
      {children}
    </div>
  );
}

export default LandingCard;

