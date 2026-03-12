import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { fetchAdminContract } from "../admin/adminApi";
import AdminPageLayout from "../components/AdminPageLayout";
import ReaderStateScreen from "../components/ReaderStateScreen";
import Reveal from "../components/Reveal";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import {
  buildContractPreview,
  formatAdvancePaymentLabel,
  formatTermMonthsLabel,
} from "../data/adminContractFlow";
import {
  adminContractTemplatesHref,
  adminContractsHref,
  buildAdminContractEditHref,
} from "../data/adminFlow";

function SummaryCard({ label, value, subtext }) {
  return (
    <div className="rounded-3xl border border-primary/10 bg-white/5 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-lg font-black text-white">{value}</p>
      {subtext ? <p className="mt-1 text-xs text-slate-400">{subtext}</p> : null}
    </div>
  );
}

export default function AdminContractDetailsPage() {
  const { contractId } = useParams();

  const contractQuery = useQuery({
    queryKey: ["admin", "contract", contractId],
    queryFn: () => fetchAdminContract(contractId),
    staleTime: 15_000,
  });

  const contract = contractQuery.data?.contract;
  const previewBody = useMemo(() => {
    if (!contract) {
      return "";
    }

    return buildContractPreview(contract.body, {
      advancePayment: contract.advancePaymentCents / 100,
      companyName: contract.companyName,
      revenueSharePercent: contract.revenueSharePercent,
      storyTitle: contract.story.title,
      userName: contract.user.displayName,
    });
  }, [contract]);

  if (contractQuery.isLoading && !contractQuery.data) {
    return <RouteLoadingScreen />;
  }

  if (contractQuery.isError || !contract) {
    return (
      <ReaderStateScreen
        ctaLabel="Back To Contracts"
        ctaTo={adminContractsHref}
        description={
          contractQuery.error?.message ||
          "We could not load that contract record right now."
        }
        secondaryLabel="Template Library"
        secondaryTo={adminContractTemplatesHref}
        title="Contract Unavailable"
        tone="error"
      />
    );
  }

  return (
    <AdminPageLayout
      headerActions={
        <>
          <Link
            className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
            to={adminContractsHref}
          >
            Back To Contracts
          </Link>
          <Link
            className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-background-dark transition-opacity hover:opacity-90"
            to={buildAdminContractEditHref(contract.id)}
          >
            Edit Contract
          </Link>
        </>
      }
      subtitle="Review the saved contract snapshot, linked story and user, and the exact text attached to this agreement."
      title={contract.contractId}
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <Reveal className="rounded-[28px] border border-primary/10 bg-[#120f09] p-6 text-white shadow-[0_28px_80px_-40px_rgba(16,12,8,0.9)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-primary/70">
                Live Contract
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight">
                {contract.templateName || "Custom Contract"}
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                {contract.user.displayName} • {contract.story.title}
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-primary">
              {contract.statusLabel}
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <SummaryCard
              label="Company"
              subtext={contract.contractTypeLabel}
              value={contract.companyName}
            />
            <SummaryCard
              label="Revenue Share"
              subtext={formatTermMonthsLabel(contract.termMonths)}
              value={`${contract.revenueSharePercent}%`}
            />
            <SummaryCard
              label="Advance"
              subtext={`${contract.signingBonusCoins} Coins bonus`}
              value={formatAdvancePaymentLabel(contract.advancePaymentCents / 100)}
            />
          </div>
        </Reveal>

        <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                Linked User
              </p>
              <p className="mt-2 text-lg font-black">{contract.user.displayName}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {contract.user.email}
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Role: {contract.partyRole}
              </p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                Linked Story
              </p>
              <p className="mt-2 text-lg font-black">{contract.story.title}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {contract.story.authorName}
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Rights: {contract.geographicRights}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-primary/10 bg-slate-50 px-4 py-3 dark:bg-background-dark/40">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                Contract Basis
              </p>
              <p className="mt-2 text-sm font-semibold">
                {contract.template?.templateName || "Custom Snapshot"}
              </p>
            </div>
            <div className="rounded-2xl border border-primary/10 bg-slate-50 px-4 py-3 dark:bg-background-dark/40">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                Created
              </p>
              <p className="mt-2 text-sm font-semibold">
                {new Date(contract.createdAt).toLocaleDateString("en-US")}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal className="xl:col-span-2 rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
          <div className="flex items-center gap-2 border-b border-primary/10 pb-3">
            <span className="material-symbols-outlined text-primary">visibility</span>
            <h2 className="text-lg font-black tracking-tight">Saved Contract Preview</h2>
          </div>
          <div className="mt-4 rounded-[24px] border border-primary/10 bg-slate-950/90 p-5 font-mono text-sm leading-7 text-slate-100">
            <pre className="whitespace-pre-wrap">{previewBody}</pre>
          </div>
        </Reveal>
      </div>
    </AdminPageLayout>
  );
}
