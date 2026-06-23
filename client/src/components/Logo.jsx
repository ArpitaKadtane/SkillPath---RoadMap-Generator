function LogoIcon({ className = 'h-10 w-10' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="512" height="512" rx="128" fill="#4F46E5" />
      <path
        d="M154 344C154 290 198 272 256 256C314 240 358 222 358 168"
        stroke="white"
        strokeWidth="38"
        strokeLinecap="round"
      />
      <circle cx="154" cy="344" r="34" fill="#10B981" stroke="white" strokeWidth="18" />
      <circle cx="256" cy="256" r="26" fill="white" />
      <path d="M358 168L358 254" stroke="white" strokeWidth="38" strokeLinecap="round" />
      <path d="M358 168L284 206" stroke="white" strokeWidth="38" strokeLinecap="round" />
    </svg>
  );
}

function Logo({ showTagline = false, size = 'default' }) {
  const iconSize = size === 'small' ? 'h-9 w-9' : 'h-10 w-10';

  return (
    <div className="flex items-center gap-3">
      <LogoIcon className={`${iconSize} shrink-0 drop-shadow-sm`} />
      <div>
        <p className="text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
          SkillPath
        </p>
        {showTagline && (
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Guided learning roadmaps
          </p>
        )}
      </div>
    </div>
  );
}

export { LogoIcon };
export default Logo;
