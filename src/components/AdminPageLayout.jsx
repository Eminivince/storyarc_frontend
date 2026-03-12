import { Link } from "react-router-dom";
import { AppDesktopSidebar, AppMobileTabBar } from "./AppShellNav";
import { adminDashboardHref } from "../data/adminFlow";

const adminConsoleLabel = "StoryArc Admin";

function IconAction({ icon, label, onClick, to }) {
  const classes =
    "flex size-10 items-center justify-center rounded-full bg-slate-200/70 text-slate-600 transition-colors hover:bg-primary/15 hover:text-primary dark:bg-primary/5 dark:text-slate-300";

  if (to) {
    return (
      <Link aria-label={label} className={classes} to={to}>
        <span className="material-symbols-outlined">{icon}</span>
      </Link>
    );
  }

  return (
    <button
      aria-label={label}
      className={classes}
      onClick={onClick}
      type="button"
    >
      <span className="material-symbols-outlined">{icon}</span>
    </button>
  );
}

function SearchField({ onSearchChange, placeholder, searchTerm }) {
  if (typeof onSearchChange !== "function") {
    return (
      <Link
        className="inline-flex items-center gap-3 rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary"
        to={adminDashboardHref}
      >
        <span className="material-symbols-outlined text-base">admin_panel_settings</span>
        StoryArc Admin Console
      </Link>
    );
  }

  return (
    <label className="group relative block w-full max-w-2xl">
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary">
        search
      </span>
      <input
        className="w-full rounded-full border border-primary/10 bg-slate-200/60 py-3 pl-12 pr-4 text-base transition-all focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-primary/5"
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={placeholder}
        type="text"
        value={searchTerm}
      />
    </label>
  );
}

export default function AdminPageLayout({
  children,
  contentClassName = "",
  headerActions = null,
  onSearchChange,
  searchPlaceholder = "Search users, reports, stories, or support cases...",
  searchTerm = "",
  subtitle,
  title,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <div className="hidden min-h-screen md:flex">
        <AppDesktopSidebar mode="admin" />

        <main className="min-w-0 flex-1 bg-background-light dark:bg-background-dark">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-primary/10 bg-background-light/90 px-6 py-4 backdrop-blur-md dark:bg-background-dark/90 lg:px-10">
            <div className="min-w-0 flex-1">
              <SearchField
                onSearchChange={onSearchChange}
                placeholder={searchPlaceholder}
                searchTerm={searchTerm}
              />
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {headerActions}
              <IconAction icon="help" label="Help" />
              <IconAction icon="notifications" label="Notifications" />
            </div>
          </header>

          <div className={`mx-auto max-w-7xl space-y-8 p-6 lg:p-10 ${contentClassName}`.trim()}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-primary">
                  {adminConsoleLabel}
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight lg:text-4xl">
                  {title}
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
                  {subtitle}
                </p>
              </div>
            </div>

            {children}
          </div>
        </main>
      </div>

      <div className="md:hidden">
        <header className="sticky top-0 z-30 border-b border-primary/10 bg-background-light/95 px-4 py-4 backdrop-blur-md dark:bg-background-dark/95">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-primary">
                {adminConsoleLabel}
              </p>
              <h1 className="mt-2 text-2xl font-black tracking-tight">{title}</h1>
              <p className="mt-2 max-w-xs text-xs text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <IconAction icon="notifications" label="Notifications" />
              <IconAction icon="help" label="Help" />
            </div>
          </div>

          <div className="mt-4">
            <SearchField
              onSearchChange={onSearchChange}
              placeholder={searchPlaceholder}
              searchTerm={searchTerm}
            />
          </div>
          {headerActions ? <div className="mt-4 flex flex-wrap gap-2">{headerActions}</div> : null}
        </header>

        <main className="space-y-6 px-4 pb-28 pt-4">
          {children}
        </main>

        <AppMobileTabBar mode="admin" />
      </div>
    </div>
  );
}
