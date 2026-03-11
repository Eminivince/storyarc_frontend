import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import AdminPageLayout from "../components/AdminPageLayout";
import ReaderStateScreen from "../components/ReaderStateScreen";
import Reveal from "../components/Reveal";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import {
  fetchAdminBooks,
  updateAdminBookPolicy,
  updateAdminBookVisibility,
} from "../admin/adminApi";
import { useAdmin } from "../context/AdminContext";
import {
  adminBookInventoryTabs,
  adminBookLockWindowOptions,
  adminBookReleaseModeOptions,
  adminBookStatusFilters,
} from "../data/adminBookFlow";
import { buildAdminBookDetailsHref } from "../data/adminFlow";

function matchesInventoryTab(book, tab) {
  if (tab === "All Inventory") {
    return true;
  }

  if (tab === "Review Queue") {
    return book.status === "Pending Approval";
  }

  return book.flagged;
}

function matchesStatusFilter(book, filter) {
  if (filter === "All Books") {
    return true;
  }

  if (filter === "Pending") {
    return book.status === "Pending Approval";
  }

  return book.status === filter;
}

function statusTone(status) {
  if (status === "Live") {
    return "text-emerald-500";
  }

  if (status === "Pending Approval") {
    return "text-primary";
  }

  return "text-slate-400";
}

function trendBadgeClasses(tag) {
  if (!tag) {
    return "hidden";
  }

  return "inline-flex rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-500";
}

function activityToneClasses(tone) {
  if (tone === "emerald") {
    return "bg-emerald-500/10 text-emerald-500";
  }

  if (tone === "rose") {
    return "bg-rose-500/10 text-rose-500";
  }

  return "bg-primary/10 text-primary";
}

function DesktopVisibilityToggle({ book, disabled, onToggle }) {
  const checked = book.status === "Live";

  return (
    <button
      className={`relative inline-flex h-5 w-10 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${
        checked ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      disabled={disabled}
      onClick={() => onToggle(book)}
      type="button"
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function MobileBookCard({ book, isBusy, onManage, onToggle }) {
  const checked = book.status === "Live";

  return (
    <Reveal className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm dark:border-slate-700/50 dark:bg-slate-800/40">
      <div className="flex gap-4 p-4">
        <div
          className="h-32 w-24 shrink-0 rounded-lg border border-slate-100 bg-cover bg-center shadow-md dark:border-slate-700"
          style={{ backgroundImage: `url('${book.cover}')` }}
        />
        <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
          <div>
            <div className="flex items-start justify-between gap-3">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${
                  book.status === "Live"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : book.status === "Pending Approval"
                      ? "bg-primary/15 text-primary"
                      : "bg-slate-500/10 text-slate-500 dark:text-slate-400"
                }`}
              >
                {book.status === "Pending Approval" ? "Pending" : book.status}
              </span>
              <span className="material-symbols-outlined text-lg text-slate-400">
                more_vert
              </span>
            </div>
            <h3 className="mt-2 line-clamp-1 text-lg font-black">{book.title}</h3>
            <p className="text-sm italic text-slate-500 dark:text-slate-400">
              by {book.author}
            </p>
          </div>

          <div className="mt-3 flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span className="font-medium tracking-tight">{book.authorLockSummary}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700/50 dark:bg-slate-800/60">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500">Visibility</span>
          <button
            className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
              checked ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
            } ${isBusy ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={isBusy}
            onClick={() => onToggle(book)}
            type="button"
          >
            <span
              className={`absolute top-[2px] h-5 w-5 rounded-full bg-white transition-transform ${
                checked ? "translate-x-5" : "translate-x-[2px]"
              }`}
            />
          </button>
        </div>
        <button
          className="inline-flex items-center gap-1 rounded-lg bg-primary/20 px-3 py-1.5 text-sm font-bold text-primary transition-colors hover:bg-primary/30"
          onClick={() => onManage(book.id)}
          type="button"
        >
          <span className="material-symbols-outlined text-sm">settings</span>
          Manage Locks
        </button>
      </div>
    </Reveal>
  );
}

function buildVisibilityTrend(inventory) {
  const sortedInventory = [...inventory].slice(0, 7);

  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
    const item = sortedInventory[index];
    const height =
      item?.status === "Live"
        ? "88%"
        : item?.status === "Pending Approval"
          ? "52%"
          : item?.status === "Hidden"
            ? "28%"
            : "36%";

    return {
      day,
      height,
    };
  });
}

function buildRecentActivity(inventory) {
  const pendingItems = inventory
    .filter((book) => book.status === "Pending Approval")
    .slice(0, 2)
    .map((book) => ({
      actionLabel: "Open Review",
      icon: "pending",
      id: `pending-${book.id}`,
      text: `${book.title} is waiting for admin approval.`,
      time: book.publishedAt,
      tone: "primary",
    }));
  const flaggedItems = inventory
    .filter((book) => book.flagged)
    .slice(0, 2)
    .map((book) => ({
      actionLabel: "Inspect Book",
      icon: "report",
      id: `flagged-${book.id}`,
      text: `${book.title} has active content reports.`,
      time: book.publishedAt,
      tone: "rose",
    }));
  const liveItems = inventory
    .filter((book) => book.status === "Live")
    .slice(0, 2)
    .map((book) => ({
      actionLabel: "Manage Locks",
      icon: "publish",
      id: `live-${book.id}`,
      text: `${book.title} is live with admin controls active.`,
      time: book.publishedAt,
      tone: "emerald",
    }));

  return [...pendingItems, ...flaggedItems, ...liveItems].slice(0, 4);
}

export default function AdminBookManagementPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { adminNotice, clearAdminNotice, showAdminNotice } = useAdmin();
  const [activeTab, setActiveTab] = useState(adminBookInventoryTabs[0]);
  const [activeStatus, setActiveStatus] = useState(adminBookStatusFilters[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [policyDraft, setPolicyDraft] = useState({
    defaultCoinCap: 50,
    defaultPremiumWindowHours: -1,
    defaultReleaseMode: "PREMIUM_WINDOW",
  });
  const deferredSearch = useDeferredValue(searchTerm);

  function parseWindowHours(value) {
    const parsedValue = Number(value);

    if (!Number.isFinite(parsedValue)) {
      return 0;
    }

    return parsedValue < 0 ? -1 : parsedValue;
  }

  const booksQuery = useQuery({
    queryKey: ["admin", "books"],
    queryFn: fetchAdminBooks,
    staleTime: 15_000,
  });

  useEffect(() => {
    if (!booksQuery.data?.policy) {
      return;
    }

    setPolicyDraft({
      defaultCoinCap: booksQuery.data.policy.defaultCoinCap,
      defaultPremiumWindowHours: booksQuery.data.policy.defaultPremiumWindowHours,
      defaultReleaseMode: booksQuery.data.policy.defaultReleaseMode,
    });
  }, [booksQuery.data?.policy]);

  const savePolicyMutation = useMutation({
    mutationFn: updateAdminBookPolicy,
    onError: (error) => {
      showAdminNotice(
        error.message || "Could not save the book platform defaults.",
        "info",
      );
    },
    onSuccess: (response) => {
      showAdminNotice(response.message || "Book platform policy saved.");
      queryClient.invalidateQueries({ queryKey: ["admin", "books"] });
    },
  });

  const visibilityMutation = useMutation({
    mutationFn: ({ bookSlug, input }) => updateAdminBookVisibility(bookSlug, input),
    onError: (error) => {
      showAdminNotice(
        error.message || "Could not update that book visibility.",
        "info",
      );
    },
    onSuccess: (response, variables) => {
      const tone =
        variables.input.visibilityState === "HIDDEN"
          ? "info"
          : variables.input.visibilityState === "LIVE"
            ? "success"
            : "info";
      showAdminNotice(response.message || "Book visibility updated.", tone);
      queryClient.invalidateQueries({ queryKey: ["admin", "books"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "book", variables.bookSlug],
      });
    },
  });

  const inventory = booksQuery.data?.inventory ?? [];
  const stats = booksQuery.data?.inventoryStats ?? [];

  const filteredInventory = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    return inventory.filter((book) => {
      const matchesQuery =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.internalId.toLowerCase().includes(query);

      return (
        matchesInventoryTab(book, activeTab) &&
        matchesStatusFilter(book, activeStatus) &&
        matchesQuery
      );
    });
  }, [activeStatus, activeTab, deferredSearch, inventory]);

  const visibilityTrend = useMemo(
    () => buildVisibilityTrend(filteredInventory.length ? filteredInventory : inventory),
    [filteredInventory, inventory],
  );
  const recentActivity = useMemo(
    () => buildRecentActivity(filteredInventory.length ? filteredInventory : inventory),
    [filteredInventory, inventory],
  );

  function openBook(bookId) {
    navigate(buildAdminBookDetailsHref(bookId));
  }

  function updateGlobalControl(key, value) {
    setPolicyDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function toggleVisibility(book) {
    if (book.status === "Pending Approval") {
      showAdminNotice(
        `${book.title} is still pending approval. Use approve or open the book to review it.`,
        "info",
      );
      return;
    }

    visibilityMutation.mutate({
      bookSlug: book.id,
      input: {
        reviewNotes: null,
        visibilityState: book.status === "Live" ? "HIDDEN" : "LIVE",
      },
    });
  }

  function approveBook(book) {
    visibilityMutation.mutate({
      bookSlug: book.id,
      input: {
        reviewNotes: "Approved from inventory review queue.",
        visibilityState: "LIVE",
      },
    });
  }

  function rejectBook(book) {
    visibilityMutation.mutate({
      bookSlug: book.id,
      input: {
        reviewNotes: "Moved out of review queue from inventory screen.",
        visibilityState: "HIDDEN",
      },
    });
  }

  function saveGlobalProfiles() {
    savePolicyMutation.mutate(policyDraft);
  }

  if (booksQuery.isLoading && !booksQuery.data) {
    return <RouteLoadingScreen />;
  }

  if (booksQuery.isError) {
    return (
      <ReaderStateScreen
        ctaLabel="Go To Admin Dashboard"
        ctaTo="/admin/dashboard"
        description={
          booksQuery.error?.message ||
          "We could not load the admin book inventory right now."
        }
        secondaryLabel="Retry"
        secondaryTo="/admin/books"
        title="Book Inventory Unavailable"
        tone="error"
      />
    );
  }

  return (
    <AdminPageLayout
      headerActions={
        <button
          className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-background-dark transition-opacity hover:opacity-90"
          onClick={() =>
            showAdminNotice(
              "Admin book creation is not part of this workflow. Books enter here after creator publishing.",
              "info",
            )
          }
          type="button"
        >
          Review Queue
        </button>
      }
      notice={adminNotice}
      onDismissNotice={clearAdminNotice}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search books, authors, or IDs..."
      searchTerm={searchTerm}
      subtitle="Review the publishing inventory, control visibility, and manage global release defaults before books reach the reader app."
      title="Book Management"
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <Reveal
            className="rounded-[24px] border border-primary/10 bg-white p-5 shadow-sm dark:bg-primary/5"
            delay={index * 0.04}
            key={stat.id}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500 dark:text-primary/60">
              {stat.label}
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-black tracking-tight">{stat.value}</p>
              <span
                className={`text-xs font-black ${
                  stat.id === "pending-approval" ? "text-rose-500" : "text-emerald-500"
                }`}
              >
                {stat.delta}
              </span>
            </div>
            <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-primary/10">
              <div className="h-full rounded-full bg-primary" style={{ width: stat.width }} />
            </div>
          </Reveal>
        ))}
      </section>

      <Reveal className="rounded-[28px] border border-primary/20 bg-primary/5 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-black tracking-tight">
              <span className="material-symbols-outlined text-primary">lock_clock</span>
              Global Admin Lock Controls
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Manage site-wide release schedules and locking behaviors for upcoming content.
            </p>
          </div>
          <button
            className="rounded-full bg-background-dark px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={savePolicyMutation.isPending}
            onClick={saveGlobalProfiles}
            type="button"
          >
            {savePolicyMutation.isPending ? "Saving..." : "Save Profiles"}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-primary/10 bg-white p-4 dark:bg-background-dark/50">
            <label className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              Default Release Mode
            </label>
            <select
              className="mt-3 w-full rounded-lg border border-primary/10 bg-slate-100 px-3 py-3 text-sm focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-primary/5"
              onChange={(event) =>
                updateGlobalControl("defaultReleaseMode", event.target.value)
              }
              value={policyDraft.defaultReleaseMode}
            >
              {adminBookReleaseModeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-primary/10 bg-white p-4 dark:bg-background-dark/50">
            <label className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              Premium Lock Window
            </label>
            <select
              className="mt-3 w-full rounded-lg border border-primary/10 bg-slate-100 px-3 py-3 text-sm focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-primary/5"
              onChange={(event) =>
                updateGlobalControl(
                  "defaultPremiumWindowHours",
                  parseWindowHours(event.target.value),
                )
              }
              value={policyDraft.defaultPremiumWindowHours}
            >
              {adminBookLockWindowOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-primary/10 bg-white p-4 dark:bg-background-dark/50">
            <label className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              Global Coin Cap
            </label>
            <div className="mt-3 flex items-center gap-3">
              <input
                className="w-24 rounded-lg border border-primary/10 bg-slate-100 px-3 py-3 text-sm focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-primary/5"
                onChange={(event) =>
                  updateGlobalControl(
                    "defaultCoinCap",
                    Math.max(0, Number(event.target.value) || 0),
                  )
                }
                type="number"
                value={policyDraft.defaultCoinCap}
              />
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Coins per chapter
              </span>
            </div>
          </div>
        </div>
      </Reveal>

      <section className="rounded-[28px] border border-primary/10 bg-white shadow-sm dark:bg-primary/5">
        <div className="border-b border-primary/10 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="no-scrollbar flex gap-6 overflow-x-auto">
              {adminBookInventoryTabs.map((tab) => (
                <button
                  className={`border-b-2 pb-1 text-sm transition-colors ${
                    activeTab === tab
                      ? "border-primary font-black text-primary"
                      : "border-transparent font-medium text-slate-500 hover:text-primary"
                  }`}
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 self-start lg:self-auto">
              <button
                className="rounded-lg p-2 transition-colors hover:bg-primary/10"
                onClick={() =>
                  showAdminNotice(
                    "Inventory filters stay client-side in this pass. Search and status filters are active now.",
                    "info",
                  )
                }
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
              </button>
              <button
                className="rounded-lg p-2 transition-colors hover:bg-primary/10"
                onClick={() =>
                  showAdminNotice(
                    "CSV export is not wired yet. The inventory itself is now backend-backed.",
                    "info",
                  )
                }
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
              </button>
            </div>
          </div>

          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
            {adminBookStatusFilters.map((filter) => {
              const active = activeStatus === filter;
              return (
                <button
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-primary text-background-dark"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-primary/30 hover:text-primary dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300"
                  }`}
                  key={filter}
                  onClick={() => setActiveStatus(filter)}
                  type="button"
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        <Reveal className="hidden overflow-x-auto md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-black uppercase tracking-[0.22em] text-slate-500 dark:bg-primary/5">
                <th className="px-6 py-4">Book Details</th>
                <th className="px-6 py-4">Published</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Visibility</th>
                <th className="px-6 py-4">Lock Policy</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-primary/5">
              {filteredInventory.map((book) => (
                <tr
                  className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-primary/5"
                  key={book.id}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-12 overflow-hidden rounded bg-slate-200 shadow-lg">
                        <img
                          alt={book.title}
                          className="h-full w-full object-cover"
                          src={book.cover}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{book.title}</p>
                        <p className="text-xs text-slate-500">By {book.author}</p>
                        {book.trendTag ? (
                          <span className={`mt-1 ${trendBadgeClasses(book.trendTag)}`}>
                            {book.trendTag}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">{book.publishedAt}</td>
                  <td className="px-6 py-4">
                    {book.status === "Pending Approval" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                        <span className="material-symbols-outlined text-[16px]">pending</span>
                        Pending Approval
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <DesktopVisibilityToggle
                          book={book}
                          disabled={visibilityMutation.isPending}
                          onToggle={toggleVisibility}
                        />
                        <span className="text-xs font-medium">{book.status}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500">
                      <span className="material-symbols-outlined text-[14px]">
                        {book.visibility === "Public" ? "public" : "lock"}
                      </span>
                      {book.visibility}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-xs font-bold">{book.lockPolicy}</p>
                      <p className={`mt-0.5 text-[10px] ${statusTone(book.status)}`}>
                        {book.authorLockSummary}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">{book.revenue}</td>
                  <td className="px-6 py-4 text-right">
                    {book.status === "Pending Approval" ? (
                      <div className="flex justify-end gap-2">
                        <button
                          className="rounded bg-primary/20 px-3 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-background-dark disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={visibilityMutation.isPending}
                          onClick={() => approveBook(book)}
                          type="button"
                        >
                          Approve
                        </button>
                        <button
                          className="rounded p-1.5 transition-colors hover:bg-rose-500/20 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={visibilityMutation.isPending}
                          onClick={() => rejectBook(book)}
                          title="Hide"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                        <button
                          className="rounded p-1.5 transition-colors hover:bg-primary/20 hover:text-primary"
                          onClick={() => openBook(book.id)}
                          title="Review chapters"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <button
                          className="rounded p-1.5 transition-colors hover:bg-primary/20 hover:text-primary"
                          onClick={() => openBook(book.id)}
                          title="Settings"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            settings_suggest
                          </span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        <div className="space-y-4 px-4 py-4 md:hidden">
          {filteredInventory.map((book) => (
            <MobileBookCard
              book={book}
              isBusy={visibilityMutation.isPending}
              key={book.id}
              onManage={openBook}
              onToggle={toggleVisibility}
            />
          ))}
        </div>

        {!filteredInventory.length ? (
          <div className="px-6 py-10 text-sm text-slate-500 dark:text-slate-400">
            No books match the current search and filter combination.
          </div>
        ) : null}

        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 text-sm dark:border-primary/10">
          <p className="text-slate-500">
            Showing {filteredInventory.length} of {inventory.length} books
          </p>
          <div className="hidden items-center gap-2 md:flex">
            <button className="rounded bg-primary px-3 py-1.5 font-bold text-background-dark">
              1
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-sm dark:bg-primary/5">
          <h2 className="flex items-center gap-2 text-lg font-black tracking-tight">
            <span className="material-symbols-outlined text-primary">analytics</span>
            Content Visibility Trends
          </h2>
          <div className="mt-6 flex h-48 items-end gap-2">
            {visibilityTrend.map((bar) => (
              <div className="flex flex-1 flex-col items-center gap-3" key={bar.day}>
                <div className="flex h-full w-full items-end rounded-t-sm bg-primary/10">
                  <div
                    className="w-full rounded-t-sm bg-primary"
                    style={{ height: bar.height }}
                  />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-sm dark:bg-primary/5">
          <h2 className="flex items-center gap-2 text-lg font-black tracking-tight">
            <span className="material-symbols-outlined text-primary">
              notifications_active
            </span>
            Recent Book Signals
          </h2>

          <div className="mt-6 space-y-4">
            {recentActivity.map((item) => (
              <div className="flex items-start gap-3" key={item.id}>
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full ${activityToneClasses(item.tone)}`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {item.icon}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{item.text}</p>
                  <p className="text-xs text-slate-500">
                    {item.time}
                    {item.actionLabel ? (
                      <>
                        {" "}
                        •{" "}
                        <button
                          className="font-bold text-primary"
                          onClick={() =>
                            showAdminNotice(`${item.actionLabel} opened from inventory.`, "info")
                          }
                          type="button"
                        >
                          {item.actionLabel}
                        </button>
                      </>
                    ) : null}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            className="mt-6 w-full rounded-lg border border-slate-200 py-2 text-xs font-bold text-slate-500 transition-colors hover:bg-primary/5 dark:border-primary/10"
            onClick={() => navigate("/admin/activity")}
            type="button"
          >
            View All Activity Logs
          </button>
        </Reveal>
      </section>
    </AdminPageLayout>
  );
}
