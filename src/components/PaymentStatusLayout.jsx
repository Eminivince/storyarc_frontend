import { Link } from "react-router-dom";

function toneClasses(tone) {
  if (tone === "success") {
    return {
      badge: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
      panel: "border-emerald-400/20 bg-emerald-500/10",
      primary: "bg-emerald-400 text-slate-950 hover:brightness-110",
      ring: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    };
  }

  if (tone === "pending") {
    return {
      badge: "border-amber-400/30 bg-amber-400/10 text-amber-200",
      panel: "border-amber-400/20 bg-amber-400/10",
      primary: "bg-amber-300 text-slate-950 hover:brightness-110",
      ring: "border-amber-400/20 bg-amber-400/10 text-amber-200",
    };
  }

  return {
    badge: "border-rose-400/30 bg-rose-500/10 text-rose-200",
    panel: "border-rose-400/20 bg-rose-500/10",
    primary: "bg-rose-300 text-slate-950 hover:brightness-110",
    ring: "border-rose-400/20 bg-rose-400/10 text-rose-200",
  };
}

export default function PaymentStatusLayout({
  balanceLabel = null,
  dashboardTo = "/dashboard",
  description,
  extraContent = null,
  icon,
  note = null,
  primaryLabel,
  primaryTo,
  secondaryLabel = "See Wallet",
  secondaryTo,
  tertiaryLabel = "Go to Dashboard",
  title,
  tone,
}) {
  const styles = toneClasses(tone);

  return (
    <div className="min-h-screen bg-background-dark px-4 py-8 font-display text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">
        <div className="w-full overflow-hidden rounded-[2rem] border border-primary/10 bg-slate-950/70 shadow-[0_32px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="relative overflow-hidden border-b border-primary/10 px-6 py-8 md:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,192,37,0.18),_transparent_55%)]" />
            <div className="relative flex flex-col gap-5">
              <div className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] ${styles.badge}`}>
                <span className="material-symbols-outlined text-sm">{icon}</span>
                <span>Payment {tone}</span>
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                  {title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                  {description}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-6 py-6 md:grid-cols-2 md:px-10">
            <div className={`rounded-3xl border p-5 ${styles.panel}`}>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-300/70">
                Next Step
              </p>
              <p className="mt-3 text-lg font-bold text-slate-100">
                Resume where you left off
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Continue your reading flow, return to the dashboard, or open your wallet overview.
              </p>
            </div>

            <div className={`rounded-3xl border p-5 ${styles.ring}`}>
              <p className="text-xs font-bold uppercase tracking-[0.25em]">
                Wallet Snapshot
              </p>
              <p className="mt-3 text-lg font-bold text-slate-100">
                {balanceLabel ?? "Balance will refresh after the next status check."}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Your coin balance and entitlements refresh from the live billing state.
              </p>
            </div>
          </div>

          {note ? (
            <div className="px-6 pb-2 md:px-10">
              <div className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm text-slate-300">
                {note}
              </div>
            </div>
          ) : null}
          {extraContent ? (
            <div className="px-6 pb-2 md:px-10">{extraContent}</div>
          ) : null}

          <div className="grid gap-3 px-6 py-6 md:grid-cols-3 md:px-10">
            <Link
              className={`flex min-h-14 items-center justify-center rounded-2xl px-4 text-center text-sm font-bold transition-all ${styles.primary}`}
              to={primaryTo}
            >
              {primaryLabel}
            </Link>
            <Link
              className="flex min-h-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 px-4 text-center text-sm font-bold text-primary transition-colors hover:bg-primary/20"
              to={secondaryTo}
            >
              {secondaryLabel}
            </Link>
            <Link
              className="flex min-h-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 px-4 text-center text-sm font-bold text-slate-100 transition-colors hover:border-primary/40 hover:text-primary"
              to={dashboardTo}
            >
              {tertiaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
