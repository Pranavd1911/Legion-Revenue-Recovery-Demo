import { cn } from "@/lib/utils";
import { TrendingUp, X } from "lucide-react";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) {
  return <section className={cn("rounded-lg border border-line bg-white shadow-sm transition duration-200 hover:shadow-soft", className)} {...props}>{children}</section>;
}

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  return (
    <button
      className={cn(
        "inline-flex min-h-9 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-ink text-white shadow-sm hover:bg-slate-800",
        variant === "secondary" && "border border-line bg-white text-ink hover:bg-slate-50",
        variant === "ghost" && "text-muted hover:bg-slate-100 hover:text-ink",
        variant === "danger" && "bg-rose-600 text-white hover:bg-rose-700",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({ children, tone = "slate", className, ...props }: React.HTMLAttributes<HTMLSpanElement> & { children: React.ReactNode; tone?: "slate" | "blue" | "green" | "amber" | "red" | "purple" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-sky-50 text-sky-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-rose-50 text-rose-700",
    purple: "bg-indigo-50 text-indigo-700"
  };
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone], className)} {...props}>{children}</span>;
}

export function DataLabel({ kind }: { kind: "Actual" | "Estimated" | "Projected" }) {
  const title = {
    Actual: "Measured activity from the selected period.",
    Estimated: "Directional value calculated from attribution, conversion rate, and average treatment value.",
    Projected: "Modeled impact from a proposed experiment or recommendation."
  }[kind];
  const tone = kind === "Actual" ? "blue" : kind === "Estimated" ? "amber" : "purple";
  return <Badge tone={tone} title={title}>{kind}</Badge>;
}

export function StatCard({
  label,
  value,
  change,
  icon,
  tooltip,
  sublabel,
  dataKind,
  negative = false,
  spark = [12, 18, 16, 24, 22, 31, 35],
  children
}: {
  label: string;
  value: string;
  change: string;
  icon?: React.ReactNode;
  tooltip?: string;
  sublabel?: string;
  dataKind?: "Actual" | "Estimated" | "Projected";
  negative?: boolean;
  spark?: number[];
  children?: React.ReactNode;
}) {
  const max = Math.max(...spark);
  const points = spark.map((point, index) => `${(index / (spark.length - 1)) * 92 + 4},${38 - (point / max) * 28}`).join(" ");
  return (
    <Card className="group p-4" title={tooltip} tabIndex={tooltip ? 0 : undefined}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-indigo-50 text-indigo-700">{icon ?? <TrendingUp className="h-4 w-4" />}</div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <p className="text-2xl font-semibold tracking-normal text-ink">{value}</p>
            {dataKind && <DataLabel kind={dataKind} />}
          </div>
          {sublabel && <p className="mt-1 text-xs font-medium text-amber-700">{sublabel}</p>}
          <span className={cn("mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", negative ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700")}>{change} vs prior</span>
        </div>
        <div className="mt-auto hidden w-24 sm:block">
          <svg viewBox="0 0 100 44" className="h-12 w-full overflow-visible" aria-hidden="true">
            <polyline points={points} fill="none" stroke={negative ? "#e11d48" : "#4f46e5"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {children}
      </div>
    </Card>
  );
}

export function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 animate-in">
      <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-soft transition duration-200">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" onClick={onClose} aria-label="Close modal">
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
