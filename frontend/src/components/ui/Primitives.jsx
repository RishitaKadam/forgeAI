import { Loader2, Inbox, AlertTriangle } from "lucide-react";

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-slate-900/60 border border-slate-800 rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

export function Badge({ children, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    slate: "bg-slate-500/10 text-slate-300 border-slate-500/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 text-slate-400 py-16">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-5">
        <Icon className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && <p className="text-slate-400 max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorNotice({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">
      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        {eyebrow && (
          <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">{eyebrow}</span>
        )}
        <h1 className="text-3xl font-bold text-white mt-1">{title}</h1>
        {description && <p className="text-slate-400 mt-2 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
