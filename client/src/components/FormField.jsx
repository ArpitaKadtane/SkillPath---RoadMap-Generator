function FormField({
  error,
  helpText,
  label,
  name,
  options = [],
  type = 'text',
  ...props
}) {
  const baseInputClasses =
    'w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500';
  const stateClasses = error
    ? 'border-red-300 dark:border-red-800'
    : 'border-slate-300 dark:border-slate-700';

  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
        {label}
      </label>

      {type === 'select' ? (
        <select
          id={name}
          name={name}
          className={`${baseInputClasses} ${stateClasses}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          className={`${baseInputClasses} ${stateClasses}`}
          {...props}
        />
      )}

      {error ? (
        <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
      ) : (
        helpText && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{helpText}</p>
      )}
    </div>
  );
}

export default FormField;

