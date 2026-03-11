import { Link, useLocation } from "react-router-dom";
import { useAccount } from "../context/AccountContext";
import { accountSettingsTabs } from "../data/accountFlow";
import UserAvatar from "./UserAvatar";

export default function AccountSettingsNav() {
  const { pathname } = useLocation();
  const { profile } = useAccount();

  return (
    <>
      <aside className="hidden w-full max-w-64 shrink-0 lg:block">
        <div className="rounded-3xl border border-primary/10 bg-white/70 p-4 shadow-sm dark:bg-primary/5">
          <div className="flex items-center gap-3 px-2 pb-4">
            <UserAvatar
              className="size-12 rounded-full border-2 border-primary"
              fallbackClassName="text-base"
              name={profile.displayName}
              src={profile.avatar}
            />
            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold">{profile.displayName}</h2>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                Premium Member
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            {accountSettingsTabs.map((tab) => {
              const active = pathname === tab.href;

              return (
                <Link
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-colors ${
                    active
                      ? "bg-primary font-bold text-background-dark"
                      : "text-slate-600 hover:bg-primary/10 dark:text-slate-300"
                  }`}
                  key={tab.id}
                  to={tab.href}
                >
                  <span
                    className={`material-symbols-outlined ${
                      active ? "" : "text-primary"
                    }`}
                  >
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <nav className="hide-scrollbar flex gap-6 overflow-x-auto border-b border-primary/10 lg:hidden">
        {accountSettingsTabs.map((tab) => {
          const active = pathname === tab.href;

          return (
            <Link
              className={`shrink-0 border-b-2 px-1 pb-3 pt-1 text-sm font-bold transition-colors ${
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 dark:text-slate-400"
              }`}
              key={tab.id}
              to={tab.href}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
