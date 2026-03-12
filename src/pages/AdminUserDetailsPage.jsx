import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminPageLayout from "../components/AdminPageLayout";
import Reveal from "../components/Reveal";
import UserAvatar from "../components/UserAvatar";
import { useAdmin } from "../context/AdminContext";
import { adminUsersHref } from "../data/adminFlow";

const roleOptions = ["Admin", "Editor", "Author", "Viewer"];

function statusClasses(status) {
  if (status === "Active") {
    return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300";
  }

  if (status === "Suspended" || status === "Deleted") {
    return "bg-rose-500/15 text-rose-600 dark:text-rose-300";
  }

  return "bg-amber-500/15 text-amber-600 dark:text-amber-300";
}

export default function AdminUserDetailsPage() {
  const navigate = useNavigate();
  const { userId = "" } = useParams();
  const {
    deleteUser,
    getUser,
    loadUserDetails,
    resetUserPassword,
    saveUser,
    suspendUser,
  } = useAdmin();
  const user = getUser(userId);
  const [formState, setFormState] = useState(() => ({
    bio: "",
    displayName: "",
    email: "",
    location: "",
    role: "Viewer",
  }));

  useEffect(() => {
    if (userId) {
      loadUserDetails(userId).catch(() => {});
    }
  }, [loadUserDetails, userId]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormState({
      bio: user.bio,
      displayName: user.displayName,
      email: user.email,
      location: user.location,
      role: user.role,
    });
  }, [user]);

  if (!user) {
    return (
      <AdminPageLayout
        subtitle="The requested user record could not be found. Return to the full user directory to continue."
        title="User Details"
      >
        <div className="rounded-[28px] border border-primary/10 bg-white p-8 dark:bg-primary/5">
          <p className="text-lg font-black">User not found.</p>
          <Link
            className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-bold text-background-dark"
            to={adminUsersHref}
          >
            Back to users
          </Link>
        </div>
      </AdminPageLayout>
    );
  }

  const statCards = [
    { label: "Stories", value: user.stories },
    { label: "Chapters", value: user.chapters },
    { label: "Followers", value: user.followers },
    { label: "Revenue", value: user.revenue },
  ];

  return (
    <AdminPageLayout
      headerActions={
        <>
          <button
            className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-background-dark transition-opacity hover:opacity-90"
            onClick={() =>
              saveUser(user.id, {
                ...formState,
                name: formState.displayName,
              })
            }
            type="button"
          >
            Save Changes
          </button>
          <Link
            className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
            to={adminUsersHref}
          >
            Back to Users
          </Link>
        </>
      }
      subtitle="Review identity, permissions, account history, and moderation context before taking irreversible actions."
      title="User Details"
    >
      <section className="overflow-hidden rounded-[32px] border border-primary/10 bg-gradient-to-br from-[#18130f] via-[#23180f] to-[#110d09] p-6 text-white shadow-[0_28px_80px_-40px_rgba(16,12,8,0.9)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <UserAvatar
            className="size-24 rounded-[28px]"
            fallbackClassName="text-4xl"
            name={user.displayName}
            src={user.avatar}
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-black tracking-tight">{user.displayName}</h2>
              <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] ${statusClasses(user.status)}`}>
                {user.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-300">{user.email}</p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200">
              {user.bio}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
              <span>{user.role}</span>
              <span>{user.joinDate}</span>
              <span>{user.location}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {statCards.map((card, index) => (
          <Reveal
            className="rounded-3xl border border-primary/10 bg-white p-5 dark:bg-primary/5"
            delay={index * 0.04}
            key={card.label}
          >
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
              {card.label}
            </p>
            <p className="mt-4 text-3xl font-black tracking-tight">{card.value}</p>
          </Reveal>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                Account Info
              </p>
              <h2 className="mt-2 text-xl font-black tracking-tight">
                Identity and permissions
              </h2>
            </div>
          </div>

          <form
            className="mt-6 space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              saveUser(user.id, {
                ...formState,
                name: formState.displayName,
              });
            }}
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Display Name
                </span>
                <input
                  className="w-full rounded-2xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      displayName: event.target.value,
                    }))
                  }
                  type="text"
                  value={formState.displayName}
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Role
                </span>
                <select
                  className="w-full rounded-2xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      role: event.target.value,
                    }))
                  }
                  value={formState.role}
                >
                  {roleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Email Address
              </span>
              <input
                className="w-full rounded-2xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                type="email"
                value={formState.email}
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Location
              </span>
              <input
                className="w-full rounded-2xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    location: event.target.value,
                  }))
                }
                type="text"
                value={formState.location}
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Bio
              </span>
              <textarea
                className="min-h-36 w-full rounded-3xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm leading-7 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    bio: event.target.value,
                  }))
                }
                value={formState.bio}
              />
            </label>

            <button
              className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-background-dark"
              type="submit"
            >
              Save User Profile
            </button>
          </form>
        </Reveal>

        <div className="space-y-6">
          <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
              Account Controls
            </p>
            <div className="mt-5 grid gap-3">
              <button
                className="rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-background-dark"
                onClick={() => resetUserPassword(user.id)}
                type="button"
              >
                Reset Password
              </button>
              <button
                className="rounded-2xl border border-primary/20 px-4 py-3 text-sm font-bold text-primary"
                onClick={() => suspendUser(user.id)}
                type="button"
              >
                {user.status === "Suspended" ? "Restore Access" : "Suspend User"}
              </button>
              <button
                className="rounded-2xl border border-rose-500/20 px-4 py-3 text-sm font-bold text-rose-500"
                onClick={async () => {
                  await deleteUser(user.id);
                  navigate(adminUsersHref);
                }}
                type="button"
              >
                Delete User
              </button>
            </div>
          </Reveal>

          <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
              Moderation History
            </p>
            <div className="mt-5 space-y-3">
              {user.moderationHistory.length ? (
                user.moderationHistory.map((item) => (
                  <div
                    className="rounded-3xl border border-primary/10 bg-slate-50 p-4 dark:bg-background-dark/50"
                    key={item.id}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-black">{item.type}</p>
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {item.reason}
                    </p>
                    <p className="mt-3 text-xs text-slate-400">
                      {item.admin} • {item.date}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No moderation notes on file.
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
          Recent Activity
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {user.recentActivity.map((item) => (
            <div
              className="rounded-3xl border border-primary/10 bg-slate-50 p-4 dark:bg-background-dark/50"
              key={item.id}
            >
              <p className="font-black">{item.label}</p>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                {item.time}
              </p>
            </div>
          ))}
        </div>
      </section>
    </AdminPageLayout>
  );
}
