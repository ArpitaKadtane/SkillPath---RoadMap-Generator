function Timeline({ items }) {
  return (
    <div className="space-y-5">
      {items.map((item, index) => (
        <div key={item.title} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                item.done
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {item.done ? '✓' : index + 1}
            </div>
            {index < items.length - 1 && (
              <div className="mt-2 h-full min-h-8 w-px bg-slate-200 dark:bg-slate-800" />
            )}
          </div>
          <div className="pb-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Timeline;
