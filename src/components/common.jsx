import { Search, X, Loader2, AlertCircle } from "lucide-react";

export function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
}) {
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 ${className}`}
    >
      {children}
    </section>
  );
}

export function Badge({ children }) {
  const greenStatuses = [
    "Active",
    "Admitted",
    "Scheduled",
    "Completed",
    "Available",
    "In Stock",
    "Paid",
  ];

  const redStatuses = ["Cancelled", "Overdue", "Out of Stock", "Maintenance"];

  let className = "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";

  if (greenStatuses.includes(children)) {
    className = "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
  }

  if (redStatuses.includes(children)) {
    className = "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";
  }

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>{children}</span>;
}

export function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative">
      <Search size={17} className="absolute left-3 top-3 text-slate-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
    </div>
  );
}

export function EmptyState({ message = "No records found." }) {
  return <div className="py-14 text-center text-sm text-slate-500 dark:text-slate-400">{message}</div>;
}

export function ErrorState({ message = "Something went wrong. Please try again." }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-500/10 dark:text-red-400">
      <AlertCircle size={18} />
      {message}
    </div>
  );
}

export function Loading({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500">
      <Loader2 className="animate-spin" size={18} />
      {label}
    </div>
  );
}

export function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:text-slate-100">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
