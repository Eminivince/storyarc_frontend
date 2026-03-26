import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import { LogoBrand } from "../components/LogoBrand";
import UserAvatar from "../components/UserAvatar";
import MaterialSymbol from "../components/MaterialSymbol";
import {
  createCreatorWithdrawalRequest,
  fetchCreatorFinance,
} from "../creator/creatorApi";
import { useAuth } from "../context/AuthContext";
import { useCreator } from "../context/CreatorContext";
import { useToast } from "../context/ToastContext";
import {
  authorDashboardHref,
  creatorEarningsHref,
} from "../data/creatorFlow";

const creatorFinanceQueryKey = ["creator", "finance"];

function formatCurrency(amountCents) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format((amountCents || 0) / 100);
}

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getRequestStatusClasses(status) {
  if (status === "RELEASED") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300";
  }

  if (status === "IN_REVIEW") {
    return "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-300";
  }

  return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300";
}

function CreatorDesktopHeader({ authorName }) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/10 bg-background-light px-6 py-3 dark:bg-background-dark lg:px-10">
      <div className="flex items-center gap-8">
        <LogoBrand to={authorDashboardHref} textClassName="text-slate-900 dark:text-slate-100" />
      </div>
      <div className="flex items-center gap-4">
        <Link
          className="flex size-10 items-center justify-center rounded-lg bg-slate-200/50 transition-colors hover:bg-primary/20 dark:bg-primary/5"
          to="/account/notifications"
        >
          <MaterialSymbol name="settings" className="text-slate-700 dark:text-primary" />
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

function SummaryTile({ label, value }) {
  return (
    <div className="rounded-3xl border border-primary/10 bg-slate-50 px-4 py-4 dark:bg-background-dark/50">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-2xl font-black">{value}</p>
    </div>
  );
}

function WithdrawalGate({ finance }) {
  return (
    <div className="rounded-[28px] border border-dashed border-primary/20 bg-white p-8 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
        Withdrawal Access
      </p>
      <h2 className="mt-3 text-3xl font-black tracking-tight">
        No withdrawable contract balance yet
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
        {finance?.contracts?.message ??
          "Premium chapter earnings become withdrawable after a story contract is active and enough contract-backed revenue has accrued."}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-background-dark"
          to={creatorEarningsHref}
        >
          Back to Earnings
        </Link>
        <Link
          className="rounded-full border border-primary/20 px-5 py-3 text-sm font-bold text-primary"
          to={authorDashboardHref}
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

function RequestList({ requests }) {
  return (
    <div className="space-y-4">
      {requests.length ? (
        requests.map((request) => (
          <div
            className="rounded-3xl border border-primary/10 bg-slate-50 p-5 dark:bg-background-dark/50"
            key={request.id}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-lg font-black">{request.amountFormatted}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {request.label}
                </p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Updated {formatDate(request.updatedAt)}
                </p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${getRequestStatusClasses(request.status)}`}
              >
                {request.statusLabel}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-3xl border border-dashed border-primary/20 bg-slate-50 px-4 py-6 text-sm text-slate-500 dark:bg-background-dark/50 dark:text-slate-400">
          No withdrawal requests have been submitted yet.
        </div>
      )}
    </div>
  );
}

function ContractCoverage({ contracts }) {
  return (
    <div className="space-y-4">
      {contracts.map((contract) => (
        <div
          className="rounded-3xl border border-primary/10 bg-slate-50 p-5 dark:bg-background-dark/50"
          key={contract.id}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-black">{contract.story.title}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {contract.contractTypeLabel} · {contract.revenueSharePercent}% share
              </p>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${getRequestStatusClasses(
                contract.status === "ACTIVE" ? "RELEASED" : "IN_REVIEW",
              )}`}
            >
              {contract.statusLabel}
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Active since {formatDate(contract.activatedAt)}
          </p>
        </div>
      ))}
    </div>
  );
}

function WithdrawalForm({
  amountDraft,
  finance,
  isSubmitting,
  onAmountChange,
  onSubmit,
}) {
  const amountCents = Math.round((Number(amountDraft) || 0) * 100);
  const remainingCents = Math.max(
    0,
    (finance?.summary?.availableCents ?? 0) - amountCents,
  );
  const openRequestExists = (finance?.withdrawal?.openRequestCount ?? 0) > 0;

  return (
    <div className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
        Request Payout
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-tight">Withdrawal amount</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        Withdrawal requests are reviewed by finance, then released through your
        contract payout workflow. Self-serve payout account management is not live
        yet.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <SummaryTile label="Available" value={finance.summary.availableFormatted} />
        <SummaryTile label="Minimum" value={finance.withdrawal.minimumFormatted} />
        <SummaryTile label="Pending" value={finance.summary.pendingPayoutFormatted} />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400">
          Amount to withdraw
        </label>
        <div className="relative mt-2">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
          <input
            className="w-full rounded-2xl border border-primary/10 bg-slate-50 py-4 pl-8 pr-4 text-lg font-black focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
            inputMode="decimal"
            onChange={(event) => onAmountChange(event.target.value)}
            placeholder="0.00"
            type="number"
            value={amountDraft}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>Requested: {formatCurrency(amountCents)}</span>
          <span>Remaining after request: {formatCurrency(remainingCents)}</span>
        </div>
      </div>

      {openRequestExists ? (
        <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          A payout request is already open. Release or review that request before
          submitting another one.
        </div>
      ) : null}

      <button
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-sm font-black text-background-dark transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={
          isSubmitting ||
          openRequestExists ||
          amountCents < finance.withdrawal.minimumCents ||
          amountCents > finance.summary.availableCents
        }
        onClick={onSubmit}
        type="button"
      >
        {isSubmitting ? "Submitting..." : "Submit Withdrawal Request"}
        <MaterialSymbol name="north_east" />
      </button>
    </div>
  );
}

function DesktopWithdrawal({ authorName, amountDraft, errorMessage, finance, isLoading, isSubmitting, onAmountChange, onSubmit }) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        <CreatorDesktopHeader authorName={authorName} />
        <div className="flex flex-1">
          <AppDesktopSidebar memberLabel="Contract Creator" memberName={authorName} mode="creator" />
          <main className="flex-1 overflow-y-auto bg-background-light p-8 dark:bg-background-dark">
            <div className="mx-auto max-w-6xl space-y-8">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                    Creator Finance
                  </p>
                  <h1 className="mt-3 text-4xl font-black tracking-tight">
                    Withdraw contract earnings
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 dark:text-slate-400">
                    Only contract-backed chapter sales can be withdrawn. Requests move
                    into admin finance review before release.
                  </p>
                </div>
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 px-6 py-3 text-sm font-bold text-primary"
                  to={creatorEarningsHref}
                >
                  <MaterialSymbol name="analytics" />
                  Back to Earnings
                </Link>
              </div>

              {errorMessage ? (
                <div className="rounded-[28px] border border-rose-500/20 bg-rose-500/10 px-6 py-5 text-sm text-rose-600 dark:text-rose-300">
                  {errorMessage}
                </div>
              ) : null}

              {isLoading ? (
                <div className="space-y-6">
                  <div className="h-80 animate-pulse rounded-[28px] border border-primary/10 bg-white dark:bg-primary/5" />
                  <div className="grid gap-6 xl:grid-cols-2">
                    <div className="h-72 animate-pulse rounded-[28px] border border-primary/10 bg-white dark:bg-primary/5" />
                    <div className="h-72 animate-pulse rounded-[28px] border border-primary/10 bg-white dark:bg-primary/5" />
                  </div>
                </div>
              ) : null}

              {!isLoading && finance ? (
                finance.contracts.hasAnyEligibleContract ? (
                  <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="space-y-6">
                      <WithdrawalForm
                        amountDraft={amountDraft}
                        finance={finance}
                        isSubmitting={isSubmitting}
                        onAmountChange={onAmountChange}
                        onSubmit={onSubmit}
                      />
                      <div className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
                        <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                          Request History
                        </p>
                        <h2 className="mt-2 text-2xl font-black tracking-tight">
                          Withdrawal queue
                        </h2>
                        <div className="mt-6">
                          <RequestList requests={finance.withdrawal.requests} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
                        <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                          Contract Coverage
                        </p>
                        <h2 className="mt-2 text-2xl font-black tracking-tight">
                          Eligible stories
                        </h2>
                        <div className="mt-6">
                          <ContractCoverage contracts={finance.contracts.items} />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <WithdrawalGate finance={finance} />
                )
              ) : null}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function MobileWithdrawal({ amountDraft, authorName, errorMessage, finance, isLoading, isSubmitting, onAmountChange, onSubmit }) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden pb-28">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-background-light/90 px-4 py-3 backdrop-blur-md dark:bg-background-dark/90">
          <Link className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-primary/10" to={creatorEarningsHref}>
            <MaterialSymbol name="arrow_back" className="text-lg" />
          </Link>
          <h1 className="text-base font-bold tracking-tight">Withdraw Earnings</h1>
          <Link className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-primary/10" to="/account/profile">
            <UserAvatar
              className="size-9 rounded-full border border-primary/20 bg-primary/10"
              fallbackClassName="text-[11px]"
              name={authorName}
            />
          </Link>
        </header>

        <main className="flex-1 space-y-5 px-4 py-5">
          {errorMessage ? (
            <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">
              {errorMessage}
            </div>
          ) : null}

          {isLoading ? (
            <div className="space-y-4">
              <div className="h-80 animate-pulse rounded-3xl border border-primary/10 bg-white dark:bg-primary/5" />
              <div className="h-64 animate-pulse rounded-3xl border border-primary/10 bg-white dark:bg-primary/5" />
            </div>
          ) : null}

          {!isLoading && finance ? (
            finance.contracts.hasAnyEligibleContract ? (
              <>
                <WithdrawalForm
                  amountDraft={amountDraft}
                  finance={finance}
                  isSubmitting={isSubmitting}
                  onAmountChange={onAmountChange}
                  onSubmit={onSubmit}
                />
                <div className="rounded-3xl border border-primary/10 bg-white p-5 dark:bg-primary/5">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                    Request History
                  </p>
                  <div className="mt-4">
                    <RequestList requests={finance.withdrawal.requests.slice(0, 4)} />
                  </div>
                </div>
              </>
            ) : (
              <WithdrawalGate finance={finance} />
            )
          ) : null}
        </main>

        <AppMobileTabBar memberName={authorName} mode="creator" />
      </div>
    </div>
  );
}

export default function CreatorWithdrawalPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { enterWriterMode } = useCreator();
  const { showToast } = useToast();
  const [amountDraft, setAmountDraft] = useState("");

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
    finance?.creator?.displayName || user?.displayName || "TaleStead Creator";
  const errorMessage = financeQuery.isError
    ? financeQuery.error?.message || "Withdrawal data could not be loaded."
    : null;

  const withdrawalMutation = useMutation({
    mutationFn: (amountCents) => createCreatorWithdrawalRequest({ amountCents }),
    onError: (error) => {
      showToast(error.message || "Withdrawal request failed.", {
        tone: "info",
      });
    },
    onSuccess: (response) => {
      showToast(response.message || "Withdrawal request submitted.");
      setAmountDraft("");
      queryClient.invalidateQueries({
        queryKey: creatorFinanceQueryKey,
      });
    },
  });

  function handleSubmit() {
    const amountCents = Math.round((Number(amountDraft) || 0) * 100);

    withdrawalMutation.mutate(amountCents);
  }

  return (
    <>
      <DesktopWithdrawal
        amountDraft={amountDraft}
        authorName={authorName}
        errorMessage={errorMessage}
        finance={finance}
        isLoading={financeQuery.isLoading}
        isSubmitting={withdrawalMutation.isPending}
        onAmountChange={setAmountDraft}
        onSubmit={handleSubmit}
      />
      <MobileWithdrawal
        amountDraft={amountDraft}
        authorName={authorName}
        errorMessage={errorMessage}
        finance={finance}
        isLoading={financeQuery.isLoading}
        isSubmitting={withdrawalMutation.isPending}
        onAmountChange={setAmountDraft}
        onSubmit={handleSubmit}
      />
    </>
  );
}
