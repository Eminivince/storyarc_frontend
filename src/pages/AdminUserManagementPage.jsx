import { useDeferredValue, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminPageLayout from "../components/AdminPageLayout";
import Reveal from "../components/Reveal";
import UserAvatar from "../components/UserAvatar";
import { useAdmin } from "../context/AdminContext";
import {
  adminUserRoleFilters,
  buildAdminUserDetailsHref,
} from "../data/adminFlow";

function roleMatchesFilter(role, filter) {
  if (filter === "All") {
    return true;
  }

  if (filter === "Readers") {
    return role === "Viewer" || role === "Reader";
  }

  return role === filter.slice(0, -1);
}

function statusClasses(status) {
  if (status === "Active") {
    return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300";
  }

  if (status === "Suspended" || status === "Deleted") {
    return "bg-rose-500/15 text-rose-600 dark:text-rose-300";
  }

  return "bg-amber-500/15 text-amber-600 dark:text-amber-300";
}

export default function AdminUserManagementPage() {
  const {
    showAdminNotice,
    suspendUser,
    users,
  } = useAdmin();
  const [activeRole, setActiveRole] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm);

  const filteredUsers = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole = roleMatchesFilter(user.role, activeRole);
      const matchesQuery =
        !query ||
        user.displayName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.location.toLowerCase().includes(query);

      return matchesRole && matchesQuery;
    });
  }, [activeRole, deferredSearch, users]);

  const statCards = [
    { label: "Total Users", value: users.length.toString() },
    {
      label: "Admins + Editors",
      value: users.filter((user) => user.role === "Admin" || user.role === "Editor").length.toString(),
    },
    {
      label: "Active Accounts",
      value: users.filter((user) => user.status === "Active").length.toString(),
    },
    {
      label: "Needs Attention",
      value: users.filter((user) => user.status === "Suspended" || user.status === "Away").length.toString(),
    },
  ];

  return (
    <AdminPageLayout
      headerActions={
        <>
          <button
            className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-background-dark transition-opacity hover:opacity-90"
            onClick={() => showAdminNotice("Invite link created for a new admin user.")}
            type="button"
          >
            Invite User
          </button>
          <button
            className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
            onClick={() => showAdminNotice("User list export is being prepared.")}
            type="button"
          >
            Export
          </button>
        </>
      }
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search by name, email, location, or role..."
      searchTerm={searchTerm}
      subtitle="Manage staff, authors, and reader accounts. Review roles, track account health, and escalate high-risk accounts."
      title="User Management"
    >
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

      <section className="rounded-[28px] border border-primary/10 bg-white p-5 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
        <div className="flex flex-wrap gap-2">
          {adminUserRoleFilters.map((filter) => (
            <button
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                activeRole === filter
                  ? "bg-primary text-background-dark"
                  : "bg-slate-100 text-slate-500 hover:bg-primary/10 hover:text-primary dark:bg-background-dark/60 dark:text-slate-300"
              }`}
              key={filter}
              onClick={() => setActiveRole(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-6 hidden overflow-hidden rounded-3xl border border-primary/10 xl:block">
          <table className="min-w-full divide-y divide-primary/10 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:bg-background-dark/50">
              <tr>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Join Date</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {filteredUsers.map((user) => (
                <tr className="bg-white dark:bg-transparent" key={user.id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        className="size-12 rounded-2xl"
                        fallbackClassName="text-lg"
                        name={user.displayName}
                        src={user.avatar}
                      />
                      <div>
                        <p className="font-bold">{user.displayName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-primary">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${statusClasses(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                    {user.joinDate}
                  </td>
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                    {user.location}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        className="rounded-full border border-primary/20 px-3 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
                        to={buildAdminUserDetailsHref(user.id)}
                      >
                        View
                      </Link>
                      <button
                        className="rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-500 dark:border-primary/10 dark:text-slate-300"
                        onClick={() => suspendUser(user.id)}
                        type="button"
                      >
                        {user.status === "Suspended" ? "Restore" : "Suspend"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 space-y-4 xl:hidden">
          {filteredUsers.map((user) => (
            <div
              className="rounded-3xl border border-primary/10 bg-slate-50 p-4 dark:bg-background-dark/50"
              key={user.id}
            >
              <div className="flex items-start gap-4">
                <UserAvatar
                  className="size-14 rounded-2xl"
                  fallbackClassName="text-xl"
                  name={user.displayName}
                  src={user.avatar}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black">{user.displayName}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {user.email}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${statusClasses(user.status)}`}>
                      {user.status}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    <span>{user.role}</span>
                    <span>{user.joinDate}</span>
                    <span>{user.location}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link
                      className="rounded-full bg-primary px-3 py-2 text-xs font-bold text-background-dark"
                      to={buildAdminUserDetailsHref(user.id)}
                    >
                      View Details
                    </Link>
                    <button
                      className="rounded-full border border-primary/20 px-3 py-2 text-xs font-bold text-primary"
                      onClick={() => suspendUser(user.id)}
                      type="button"
                    >
                      {user.status === "Suspended" ? "Restore" : "Suspend"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminPageLayout>
  );
}
