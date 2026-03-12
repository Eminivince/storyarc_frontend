import { useDeferredValue, useMemo, useState } from "react";
import AdminPageLayout from "../components/AdminPageLayout";
import Reveal from "../components/Reveal";
import { useAdmin } from "../context/AdminContext";

function toneClasses(tone) {
  if (tone === "emerald") {
    return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300";
  }

  if (tone === "rose") {
    return "bg-rose-500/15 text-rose-600 dark:text-rose-300";
  }

  if (tone === "amber") {
    return "bg-amber-500/15 text-amber-600 dark:text-amber-300";
  }

  return "bg-primary/15 text-primary";
}

export default function AdminActivityLogPage() {
  const { activityGroups, showAdminNotice } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm);

  const filteredGroups = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    return activityGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (!query) {
            return true;
          }

          return (
            item.admin.toLowerCase().includes(query) ||
            item.summary.toLowerCase().includes(query) ||
            item.detail.toLowerCase().includes(query)
          );
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [activityGroups, deferredSearch]);

  return (
    <AdminPageLayout
      headerActions={
        <button
          className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-background-dark transition-opacity hover:opacity-90"
          onClick={() => showAdminNotice("Activity export is being prepared.")}
          type="button"
        >
          Export Log
        </button>
      }
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search by admin, action, policy, or moderation event..."
      searchTerm={searchTerm}
      subtitle="Audit every admin action that affects users, content, publishing, monetization, or platform safety."
      title="Activity Log"
    >
      <section className="space-y-6">
        {filteredGroups.map((group, groupIndex) => (
          <Reveal
            className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5"
            delay={groupIndex * 0.04}
            key={group.label}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                  {group.label}
                </p>
                <h2 className="mt-2 text-xl font-black tracking-tight">
                  {group.items.length} logged actions
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {group.items.map((item) => (
                <div
                  className="flex items-start gap-4 rounded-3xl border border-primary/10 bg-slate-50 p-4 dark:bg-background-dark/50"
                  key={item.id}
                >
                  <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${toneClasses(item.tone)}`}>
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-black">{item.summary}</p>
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        {item.time}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {item.detail}
                    </p>
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                      By {item.admin}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </section>
    </AdminPageLayout>
  );
}
