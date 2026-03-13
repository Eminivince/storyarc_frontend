import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import Reveal from "../components/Reveal";
import UserAvatar from "../components/UserAvatar";
import { fetchCreatorFinance } from "../creator/creatorApi";
import { useAuth } from "../context/AuthContext";
import { useCreator } from "../context/CreatorContext";
import {
  authorDashboardHref,
  creatorWithdrawalHref,
} from "../data/creatorFlow";

const creatorFinanceQueryKey = ["creator", "finance"];

function formatDate(value) {
  if (!value) {
    return "No activity yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getContractStatusClasses(status) {
  if (status === "ACTIVE") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300";
  }

  if (status === "EXPIRED") {
    return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300";
  }

  return "border-slate-300 bg-slate-200/70 text-slate-700 dark:border-primary/10 dark:bg-background-dark/60 dark:text-slate-300";
}

function getTransactionTone(item) {
  if (item.direction === "OUTBOUND") {
    return {
      amountClass: "text-rose-500",
      icon: "north_east",
      iconClass: "bg-rose-500/10 text-rose-500",
    };
  }

  return {
    amountClass: "text-emerald-500",
    icon: "south_west",
    iconClass: "bg-emerald-500/10 text-emerald-500",
  };
}

function CreatorDesktopHeader({ authorName }) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/10 bg-background-light px-6 py-3 dark:bg-background-dark lg:px-10">
      <div className="flex items-center gap-8">
        <Link className="flex items-center gap-3 text-primary" to={authorDashboardHref}>
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <span className="material-symbols-outlined">auto_stories</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            StoryArc
          </h2>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link
          className="flex size-10 items-center justify-center rounded-lg bg-slate-200/50 transition-colors hover:bg-primary/20 dark:bg-primary/5"
          to="/account/notifications"
        >
          <span className="material-symbols-outlined text-slate-700 dark:text-primary">
            settings
          </span>
        </Link>
        <div className="mx-2 h-10 w-px bg-slate-300 dark:bg-primary/10" />
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold leading-none">{authorName}</p>
            <p className="text-xs text-slate-500 dark:text-primary/60">Contract Creator</p>
          </div>
          <Link className="size-10" to="/account/profile">
            <UserAvatar
              className="size-10 rounded-full border-2 border-primary bg-primary/20"
              fallbackClassName="text-sm"
              name={authorName}
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

function OverviewCard({ accentClass, compact, icon, label, subtext, value }) {
  return (
    <Reveal className={`rounded-2xl border border-primary/10 bg-white shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5 ${compact ? "rounded-lg p-2" : "rounded-[28px] p-6"}`}>
      <div className={`flex items-start justify-between ${compact ? "gap-1.5" : "gap-4"}`}>
        <div className="min-w-0 flex-1">
          <p className={`font-black uppercase tracking-[0.24em] text-slate-400 ${compact ? "text-[9px]" : "text-xs"}`}>
            {label}
          </p>
          <p className={`font-black tracking-tight ${compact ? "mt-1 text-lg" : "mt-4 text-3xl"}`}>{value}</p>
          <p className={`text-slate-500 dark:text-slate-400 ${compact ? "mt-0.5 text-[10px]" : "mt-2 text-sm"}`}>{subtext}</p>
        </div>
        <div
          className={`flex shrink-0 items-center justify-center rounded-lg ${accentClass} ${compact ? "size-8" : "size-12 rounded-2xl"}`}
        >
          <span className={`material-symbols-outlined ${compact ? "text-base" : ""}`}>{icon}</span>
        </div>
      </div>
    </Reveal>
  );
}

function RevenueSeriesCard({ compact, series }) {
  const peak = Math.max(
    1,
    ...series.map((item) => Math.max(item.creatorEarningsCents, item.grossSalesCents)),
  );

  return (
    <Reveal className={`rounded-2xl border border-primary/10 bg-white shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5 ${compact ? "rounded-lg p-3" : "rounded-[28px] p-6"}`}>
      <div className={`flex items-start justify-between ${compact ? "gap-1.5" : "gap-4"}`}>
        <div className="min-w-0">
          <p className={`font-black uppercase tracking-[0.24em] text-primary ${compact ? "text-[9px]" : "text-xs"}`}>
            Revenue Trend
          </p>
          <h2 className={`font-black tracking-tight ${compact ? "mt-0.5 text-sm" : "mt-2 text-2xl"}`}>
            Contract-backed chapter sales
          </h2>
          {!compact && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Gross chapter purchase revenue is shown against the creator share that
              actually accrues under active or historical contracts.
            </p>
          )}
        </div>
        <div className={`shrink-0 rounded-full border border-primary/15 bg-primary/5 font-black uppercase tracking-[0.18em] text-primary ${compact ? "px-2 py-0.5 text-[9px]" : "px-4 py-2 text-xs"}`}>
          Last 30 Days
        </div>
      </div>

      <div className={compact ? "mt-3" : "mt-8"}>
        <div className={`grid items-end gap-1 md:gap-3 md:grid-cols-15 lg:grid-cols-30 ${compact ? "h-20 grid-cols-10" : "h-64 grid-cols-10"}`}>
          {series.map((item) => (
            <div className="flex h-full flex-col items-center justify-end gap-2" key={item.label}>
              <div className="flex h-full w-full items-end justify-center gap-1">
                <div
                  className="w-2 rounded-full bg-slate-300 dark:bg-slate-700"
                  style={{
                    height: `${Math.max(8, (item.grossSalesCents / peak) * 100)}%`,
                  }}
                />
                <div
                  className="w-2 rounded-full bg-primary"
                  style={{
                    height: `${Math.max(8, (item.creatorEarningsCents / peak) * 100)}%`,
                  }}
                />
              </div>
              <p className={`font-bold uppercase tracking-[0.16em] text-slate-400 ${compact ? "text-[9px]" : "text-[10px]"}`}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
        <div className={`flex flex-wrap font-medium text-slate-500 dark:text-slate-400 ${compact ? "mt-2 gap-1.5 text-[9px]" : "mt-5 gap-4 text-xs"}`}>
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-slate-300 dark:bg-slate-700" />
            Gross sales
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary" />
            Creator earnings
          </span>
        </div>
      </div>
    </Reveal>
  );
}

function ContractCard({ compact, contract }) {
  return (
    <div className={`rounded-2xl border border-primary/10 bg-slate-50 dark:bg-background-dark/50 ${compact ? "rounded-lg p-2" : "rounded-3xl p-5"}`}>
      <div className={`flex flex-wrap items-center justify-between ${compact ? "gap-1.5" : "gap-3"}`}>
        <div className="min-w-0">
          <p className={`font-black ${compact ? "text-xs" : "text-lg"}`}>{contract.story.title}</p>
          <p className={`text-slate-500 dark:text-slate-400 ${compact ? "mt-0.5 text-[10px]" : "mt-1 text-sm"}`}>
            {contract.contractTypeLabel} contract · {contract.revenueSharePercent}% creator share
          </p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${getContractStatusClasses(contract.status)}`}
        >
          {contract.statusLabel}
        </span>
      </div>
      <div className={`grid gap-1.5 text-sm sm:grid-cols-2 ${compact ? "mt-2" : "mt-4 gap-3"}`}>
        <div className={`rounded-lg border border-primary/10 bg-white dark:bg-background-dark/70 ${compact ? "px-2 py-1.5" : "rounded-2xl px-4 py-3"}`}>
          <p className={`font-black uppercase tracking-[0.16em] text-slate-400 ${compact ? "text-[9px]" : "text-[10px]"}`}>Active Since</p>
          <p className={`font-semibold ${compact ? "mt-0.5 text-[11px]" : "mt-2"}`}>{formatDate(contract.activatedAt)}</p>
        </div>
        <div className={`rounded-lg border border-primary/10 bg-white dark:bg-background-dark/70 ${compact ? "px-2 py-1.5" : "rounded-2xl px-4 py-3"}`}>
          <p className={`font-black uppercase tracking-[0.16em] text-slate-400 ${compact ? "text-[9px]" : "text-[10px]"}`}>Contract ID</p>
          <p className={`font-semibold truncate ${compact ? "mt-0.5 text-[11px]" : "mt-2"}`}>{contract.contractId}</p>
        </div>
      </div>
    </div>
  );
}

function StoryEarningsRow({ compact, item }) {
  return (
    <div className={`rounded-2xl border border-primary/10 bg-slate-50 dark:bg-background-dark/50 ${compact ? "rounded-lg p-2" : "rounded-3xl p-5"}`}>
      <div className={`flex flex-wrap items-start justify-between ${compact ? "gap-1.5" : "gap-4"}`}>
        <div className="min-w-0 flex-1">
          <p className={`font-black ${compact ? "text-xs" : "text-lg"}`}>{item.story.title}</p>
          <p className={`text-slate-500 dark:text-slate-400 ${compact ? "mt-0.5 text-[10px]" : "mt-1 text-sm"}`}>
            {item.contractTypeLabel} · {item.revenueSharePercent}% share · {item.unlockCount} paid unlocks
          </p>
        </div>
        <div className={`text-right ${compact ? "shrink-0" : ""}`}>
          <p className={`font-black uppercase tracking-[0.18em] text-slate-400 ${compact ? "text-[9px]" : "text-[10px]"}`}>
            Creator Earnings
          </p>
          <p className={`font-black text-primary ${compact ? "mt-0.5 text-base" : "mt-2 text-2xl"}`}>
            {item.creatorEarningsFormatted}
          </p>
        </div>
      </div>
      <div className={`grid gap-1.5 sm:grid-cols-3 ${compact ? "mt-2" : "mt-5 gap-3"}`}>
        <div className={`rounded-lg border border-primary/10 bg-white dark:bg-background-dark/70 ${compact ? "px-2 py-1.5" : "rounded-2xl px-4 py-3"}`}>
          <p className={`font-black uppercase tracking-[0.16em] text-slate-400 ${compact ? "text-[9px]" : "text-[10px]"}`}>Gross Sales</p>
          <p className={`font-semibold ${compact ? "mt-0.5 text-[11px]" : "mt-2"}`}>{item.grossSalesFormatted}</p>
        </div>
        <div className={`rounded-lg border border-primary/10 bg-white dark:bg-background-dark/70 ${compact ? "px-2 py-1.5" : "rounded-2xl px-4 py-3"}`}>
          <p className={`font-black uppercase tracking-[0.16em] text-slate-400 ${compact ? "text-[9px]" : "text-[10px]"}`}>Last Sale</p>
          <p className={`font-semibold ${compact ? "mt-0.5 text-[11px]" : "mt-2"}`}>{formatDate(item.lastSaleAt)}</p>
        </div>
        <div className={`rounded-lg border border-primary/10 bg-white dark:bg-background-dark/70 ${compact ? "px-2 py-1.5" : "rounded-2xl px-4 py-3"}`}>
          <p className={`font-black uppercase tracking-[0.16em] text-slate-400 ${compact ? "text-[9px]" : "text-[10px]"}`}>Contract Status</p>
          <p className={`font-semibold ${compact ? "mt-0.5 text-[11px]" : "mt-2"}`}>{item.statusLabel}</p>
        </div>
      </div>
    </div>
  );
}

function TransactionsTable({ compact, items }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5 ${compact ? "rounded-lg" : "rounded-[28px]"}`}>
      <div className={`border-b border-primary/10 ${compact ? "px-2 py-2" : "px-6 py-5"}`}>
        <p className={`font-black uppercase tracking-[0.24em] text-primary ${compact ? "text-[9px]" : "text-xs"}`}>
          Activity
        </p>
        <h2 className={`font-black tracking-tight ${compact ? "mt-0.5 text-sm" : "mt-2 text-2xl"}`}>Recent finance events</h2>
      </div>
      <div className="divide-y divide-primary/10">
        {items.map((item) => {
          const tone = getTransactionTone(item);

          return (
            <div className={`flex flex-col gap-2 px-2 py-2 lg:flex-row lg:items-center lg:justify-between ${!compact ? "gap-4 px-6 py-5" : ""}`} key={item.id}>
              <div className={`flex items-start gap-2 ${compact ? "" : "gap-4"}`}>
                <div
                  className={`flex shrink-0 items-center justify-center rounded-lg ${tone.iconClass} ${compact ? "size-8" : "size-11 rounded-2xl"}`}
                >
                  <span className={`material-symbols-outlined ${compact ? "text-sm" : ""}`}>{tone.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`font-bold ${compact ? "text-xs" : ""}`}>{item.description}</p>
                  <p className={`text-slate-500 dark:text-slate-400 ${compact ? "mt-0.5 text-[10px]" : "mt-1 text-sm"}`}>
                    {formatDate(item.date)} · {item.statusLabel}
                  </p>
                </div>
              </div>
              <div className={`text-left lg:text-right ${compact ? "shrink-0" : ""}`}>
                <p className={`font-black ${tone.amountClass} ${compact ? "text-sm" : "text-lg"}`}>
                  {item.direction === "OUTBOUND" ? "-" : "+"}
                  {item.amountFormatted}
                </p>
                {item.metadata?.grossSalesFormatted && !compact ? (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Gross sale {item.metadata.grossSalesFormatted} at {item.metadata.revenueSharePercent}%
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LoadingPanel({ mobile = false }) {
  if (mobile) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-1.5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="h-20 animate-pulse rounded-lg border border-primary/10 bg-white dark:bg-primary/5"
              key={index}
            />
          ))}
        </div>
        <div className="h-32 animate-pulse rounded-lg border border-primary/10 bg-white dark:bg-primary/5" />
        <div className="h-48 animate-pulse rounded-lg border border-primary/10 bg-white dark:bg-primary/5" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="h-40 animate-pulse rounded-[28px] border border-primary/10 bg-white dark:bg-primary/5"
            key={index}
          />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-[28px] border border-primary/10 bg-white dark:bg-primary/5" />
      <div className="h-80 animate-pulse rounded-[28px] border border-primary/10 bg-white dark:bg-primary/5" />
    </div>
  );
}

function EmptyState({ compact = false, finance }) {
  return (
    <Reveal
      className={`border border-dashed border-primary/20 bg-white shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5 ${
        compact ? "rounded-xl p-4" : "rounded-[28px] p-8"
      }`}
    >
      <p className={`font-black uppercase tracking-[0.24em] text-primary ${compact ? "text-[10px]" : "text-xs"}`}>
        Contract Revenue
      </p>
      <h2 className={`font-black tracking-tight ${compact ? "mt-2 text-lg" : "mt-3 text-3xl"}`}>
        Chapter earnings start after contract activation
      </h2>
      <p className={`text-slate-500 dark:text-slate-400 ${compact ? "mt-1.5 text-[11px] leading-5" : "mt-3 max-w-2xl text-sm leading-7"}`}>
        {finance?.contracts?.message ??
          "No contract-backed stories are active yet. Once an admin activates a story contract, premium chapter purchases will start accruing creator earnings here."}
      </p>
      <div className={`flex flex-wrap gap-2 ${compact ? "mt-4" : "mt-6 gap-3"}`}>
        <Link
          className={`rounded-full bg-primary font-bold text-background-dark ${compact ? "px-3 py-2 text-xs" : "px-5 py-3 text-sm"}`}
          to={authorDashboardHref}
        >
          Back to Dashboard
        </Link>
        <Link
          className={`rounded-full border border-primary/20 font-bold text-primary ${compact ? "px-3 py-2 text-xs" : "px-5 py-3 text-sm"}`}
          to="/account/help"
        >
          Contact Support
        </Link>
      </div>
    </Reveal>
  );
}

function DesktopEarnings({ authorName, errorMessage, finance, isLoading }) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        <CreatorDesktopHeader authorName={authorName} />
        <div className="flex flex-1">
          <AppDesktopSidebar memberLabel="Contract Creator" memberName={authorName} mode="creator" />
          <main className="flex-1 overflow-y-auto bg-background-light p-8 dark:bg-background-dark">
            <div className="mx-auto max-w-7xl space-y-8">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                    Creator Finance
                  </p>
                  <h1 className="mt-3 text-4xl font-black tracking-tight">
                    Contract earnings
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 dark:text-slate-400">
                    {finance?.contracts?.message ??
                      "Track premium chapter revenue that is eligible under your StoryArc contracts."}
                  </p>
                </div>
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-background-dark"
                  to={creatorWithdrawalHref}
                >
                  <span className="material-symbols-outlined">account_balance_wallet</span>
                  Request Withdrawal
                </Link>
              </div>

              {errorMessage ? (
                <div className="rounded-[28px] border border-rose-500/20 bg-rose-500/10 px-6 py-5 text-sm text-rose-600 dark:text-rose-300">
                  {errorMessage}
                </div>
              ) : null}

              {isLoading ? <LoadingPanel /> : null}

              {!isLoading && finance ? (
                <>
                  <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <OverviewCard
                      accentClass="bg-primary/10 text-primary"
                      icon="wallet"
                      label="Available"
                      subtext="Ready for withdrawal request"
                      value={finance.summary.availableFormatted}
                    />
                    <OverviewCard
                      accentClass="bg-sky-500/10 text-sky-500"
                      icon="schedule"
                      label="Pending Payouts"
                      subtext="Already in finance review"
                      value={finance.summary.pendingPayoutFormatted}
                    />
                    <OverviewCard
                      accentClass="bg-emerald-500/10 text-emerald-500"
                      icon="payments"
                      label="Total Earned"
                      subtext="Creator share from chapter sales"
                      value={finance.summary.totalEarnedFormatted}
                    />
                    <OverviewCard
                      accentClass="bg-slate-900/10 text-slate-700 dark:bg-white/10 dark:text-white"
                      icon="stacked_line_chart"
                      label="Gross Sales"
                      subtext="Reader chapter purchase volume"
                      value={finance.summary.totalGrossSalesFormatted}
                    />
                  </section>

                  {finance.contracts.items.length ? (
                    <>
                      <RevenueSeriesCard series={finance.revenueSeries} />

                      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                        <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
                          <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                            Active Agreements
                          </p>
                          <h2 className="mt-2 text-2xl font-black tracking-tight">
                            Contract coverage
                          </h2>
                          <div className="mt-6 space-y-4">
                            {finance.contracts.items.map((contract) => (
                              <ContractCard contract={contract} key={contract.id} />
                            ))}
                          </div>
                        </Reveal>

                        <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
                          <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                            Story Breakdown
                          </p>
                          <h2 className="mt-2 text-2xl font-black tracking-tight">
                            Earnings by story
                          </h2>
                          <div className="mt-6 space-y-4">
                            {finance.storyEarnings.map((item) => (
                              <StoryEarningsRow item={item} key={item.contractId} />
                            ))}
                          </div>
                        </Reveal>
                      </section>

                      <TransactionsTable items={finance.recentTransactions} />
                    </>
                  ) : (
                    <EmptyState finance={finance} />
                  )}
                </>
              ) : null}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function MobileEarnings({ authorName, errorMessage, finance, isLoading }) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden pb-20">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-background-light/90 px-2 py-1.5 backdrop-blur-md dark:bg-background-dark/90">
          <Link className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-primary/10" to={authorDashboardHref}>
            <span className="material-symbols-outlined text-base">arrow_back</span>
          </Link>
          <h1 className="text-sm font-bold tracking-tight">Creator Earnings</h1>
          <Link className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-primary/10" to="/account/profile">
            <UserAvatar
              className="size-8 rounded-full border border-primary/20 bg-primary/10"
              fallbackClassName="text-[10px]"
              name={authorName}
            />
          </Link>
        </header>

        <main className="flex-1 space-y-3 px-2 py-2">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.24em] text-primary">
              Creator Finance
            </p>
            <h2 className="mt-1 text-lg font-black tracking-tight">Contract earnings</h2>
            <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400 line-clamp-2">
              {finance?.contracts?.message ??
                "Track premium chapter revenue that qualifies under StoryArc contracts."}
            </p>
          </div>

          {errorMessage ? (
            <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-2 text-[11px] text-rose-600 dark:text-rose-300">
              {errorMessage}
            </div>
          ) : null}

          {isLoading ? <LoadingPanel mobile /> : null}

          {!isLoading && finance ? (
            <>
              <div className="grid grid-cols-2 gap-1.5">
                <OverviewCard
                  accentClass="bg-primary/10 text-primary"
                  compact
                  icon="wallet"
                  label="Available"
                  subtext="Ready now"
                  value={finance.summary.availableFormatted}
                />
                <OverviewCard
                  accentClass="bg-emerald-500/10 text-emerald-500"
                  compact
                  icon="payments"
                  label="Earned"
                  subtext="Contract share"
                  value={finance.summary.totalEarnedFormatted}
                />
              </div>

              {finance.contracts.items.length ? (
                <>
                  <RevenueSeriesCard compact series={finance.revenueSeries} />
                  <div className="space-y-2">
                    {finance.storyEarnings.map((item) => (
                      <StoryEarningsRow compact item={item} key={item.contractId} />
                    ))}
                  </div>
                  <TransactionsTable compact items={finance.recentTransactions.slice(0, 6)} />
                  <Link
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-xs font-bold text-background-dark"
                    to={creatorWithdrawalHref}
                  >
                    <span className="material-symbols-outlined text-base">account_balance_wallet</span>
                    Request Withdrawal
                  </Link>
                </>
              ) : (
                <EmptyState compact finance={finance} />
              )}
            </>
          ) : null}
        </main>

        <AppMobileTabBar memberName={authorName} mode="creator" />
      </div>
    </div>
  );
}

export default function CreatorEarningsPage() {
  const { user } = useAuth();
  const { enterWriterMode } = useCreator();

  useEffect(() => {
    enterWriterMode();
  }, [enterWriterMode]);

  const financeQuery = useQuery({
    queryKey: creatorFinanceQueryKey,
    queryFn: fetchCreatorFinance,
    staleTime: 30_000,
  });
  const finance = financeQuery.data ?? null;
  const authorName =
    finance?.creator?.displayName || user?.displayName || "StoryArc Creator";
  const errorMessage = financeQuery.isError
    ? financeQuery.error?.message || "Creator earnings could not be loaded."
    : null;

  return (
    <>
      <DesktopEarnings
        authorName={authorName}
        errorMessage={errorMessage}
        finance={finance}
        isLoading={financeQuery.isLoading}
      />
      <MobileEarnings
        authorName={authorName}
        errorMessage={errorMessage}
        finance={finance}
        isLoading={financeQuery.isLoading}
      />
    </>
  );
}
