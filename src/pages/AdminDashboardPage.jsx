import { Link } from "react-router-dom";
import AdminPageLayout from "../components/AdminPageLayout";
import Reveal from "../components/Reveal";
import UserAvatar from "../components/UserAvatar";
import { useAdmin } from "../context/AdminContext";
import {
  adminQuickLinks,
  adminMessagesHref,
  adminUsersHref,
  buildAdminUserDetailsHref,
} from "../data/adminFlow";

function getToneClasses(tone) {
  if (tone === "emerald") {
    return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300";
  }

  if (tone === "rose") {
    return "bg-rose-500/15 text-rose-600 dark:text-rose-300";
  }

  return "bg-primary/15 text-primary";
}

export default function AdminDashboardPage() {
  const {
    financialHealth,
    overviewStats,
    recentReports,
    recentUsers,
  } = useAdmin();

  return (
    <AdminPageLayout
      headerActions={
        <>
          <Link
            className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-background-dark transition-opacity hover:opacity-90"
            to={adminUsersHref}
          >
            Review Users
          </Link>
          <Link
            className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
            to={adminMessagesHref}
          >
            Open Inbox
          </Link>
        </>
      }
      subtitle="Track platform health, queue pressure, revenue posture, and the highest-priority admin actions from one command center."
      title="Admin Dashboard"
    >
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((stat, index) => (
          <Reveal
            className="rounded-3xl border border-primary/10 bg-white p-5 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5"
            delay={index * 0.05}
            key={stat.id}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-3 text-3xl font-black tracking-tight">
                  <span className="hidden sm:inline">{stat.value}</span>
                  <span className="sm:hidden">{stat.mobileValue}</span>
                </p>
              </div>
              <div className={`flex size-12 items-center justify-center rounded-2xl ${getToneClasses(stat.tone)}`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Change vs last period
              </span>
              <span className="text-sm font-bold text-primary">{stat.delta}</span>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Reveal className="rounded-[28px] border border-primary/10 bg-gradient-to-br from-[#17130d] via-[#221a0f] to-[#120f0a] p-6 text-white shadow-[0_28px_80px_-40px_rgba(16,12,8,0.9)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-primary/70">
                Financial Health
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight">
                Month-to-date revenue pacing
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                Net revenue has reached {financialHealth.achieved} of the
                active target. The monthly mix below reflects subscriptions,
                coin purchases, and ad unlocks from live platform data.
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.26em] text-primary">
              {financialHealth.monthlyTarget}
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Target completion</span>
              <span className="font-bold text-primary">{financialHealth.achieved}</span>
            </div>
            <div className="mt-4 h-4 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: financialHealth.width }}
              />
            </div>
            {financialHealth.breakdown?.length ? (
              <div className="mt-5 grid grid-cols-1 gap-3 text-xs text-slate-300 sm:grid-cols-3">
                {financialHealth.breakdown.map((item) => (
                  <div
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    key={item.id}
                  >
                    <p className="font-black text-white">{item.value}</p>
                    <p className="mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-5 text-sm text-slate-300">
                Monthly revenue data will appear here as transactions are recorded.
              </div>
            )}
          </div>
        </Reveal>

        <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                Quick Links
              </p>
              <h2 className="mt-2 text-xl font-black tracking-tight">Focus lanes</h2>
            </div>
            <span className="material-symbols-outlined text-primary">rocket_launch</span>
          </div>

          <div className="mt-5 space-y-3">
            {adminQuickLinks.map((link) => (
              <Link
                className="flex items-center justify-between rounded-2xl border border-primary/10 bg-slate-50 px-4 py-4 transition-colors hover:border-primary/30 hover:bg-primary/5 dark:bg-background-dark/50"
                key={link.title}
                to={link.href}
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">{link.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold">{link.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {link.detail}
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400">
                  arrow_forward
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                Moderation Queue
              </p>
              <h2 className="mt-2 text-xl font-black tracking-tight">
                Pending escalations
              </h2>
            </div>
            <Link className="text-sm font-bold text-primary hover:underline" to="/admin/moderation">
              Open queue
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {recentReports.length ? (
              recentReports.map((item) => (
                <div
                  className="rounded-3xl border border-primary/10 bg-slate-50 p-5 dark:bg-background-dark/50"
                  key={item.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                        {item.type}
                      </p>
                      <h3 className="mt-2 text-lg font-black">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {item.subtitle}
                      </p>
                    </div>
                    <span className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-rose-500">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {item.detail}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-primary/20 bg-slate-50 px-5 py-8 text-sm text-slate-500 dark:bg-background-dark/50 dark:text-slate-400">
                No live moderation issues are waiting right now.
              </div>
            )}
          </div>
        </Reveal>

        <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                Recent Users
              </p>
              <h2 className="mt-2 text-xl font-black tracking-tight">Account health</h2>
            </div>
            <Link className="text-sm font-bold text-primary hover:underline" to={adminUsersHref}>
              View all
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {recentUsers.length ? (
              recentUsers.map((user) => (
                <Link
                  className="flex items-center gap-4 rounded-3xl border border-primary/10 bg-slate-50 p-4 transition-colors hover:border-primary/30 hover:bg-primary/5 dark:bg-background-dark/50"
                  key={user.id}
                  to={buildAdminUserDetailsHref(user.id)}
                >
                  <UserAvatar
                    className="size-14 rounded-2xl"
                    fallbackClassName="text-xl"
                    name={user.displayName}
                    src={user.avatar}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate font-black">{user.displayName}</p>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                        {user.role}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">{user.location}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-primary/20 bg-slate-50 px-5 py-8 text-sm text-slate-500 dark:bg-background-dark/50 dark:text-slate-400">
                No recent user activity is available yet.
              </div>
            )}
          </div>
        </Reveal>
      </section>
    </AdminPageLayout>
  );
}
