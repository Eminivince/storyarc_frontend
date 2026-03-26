import { useDeferredValue, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { fetchAdminContractTemplates } from "../admin/adminApi";
import AdminPageLayout from "../components/AdminPageLayout";
import ReaderStateScreen from "../components/ReaderStateScreen";
import Reveal from "../components/Reveal";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import MaterialSymbol from "../components/MaterialSymbol";
import {
  adminContractTemplatesHref,
  adminContractsHref,
  adminCreateContractTemplateHref,
  adminNewContractHref,
  buildAdminContractTemplateEditHref,
} from "../data/adminFlow";

function TemplateCard({ onCreateContract, onEdit, template }) {
  return (
    <Reveal className="overflow-hidden rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
            {template.exclusivity}
          </p>
          <h2 className="mt-2 text-xl font-black tracking-tight">
            {template.templateName}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {template.description || "No template description yet."}
          </p>
        </div>
        <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-black text-primary">
          {template.contractCount} linked
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-primary/10 bg-slate-50 px-4 py-3 dark:bg-background-dark/40">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
            Company
          </p>
          <p className="mt-2 text-sm font-semibold">{template.companyName}</p>
        </div>
        <div className="rounded-2xl border border-primary/10 bg-slate-50 px-4 py-3 dark:bg-background-dark/40">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
            Revenue Share
          </p>
          <p className="mt-2 text-sm font-semibold">{template.revenueShare}</p>
        </div>
        <div className="rounded-2xl border border-primary/10 bg-slate-50 px-4 py-3 dark:bg-background-dark/40">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
            Term
          </p>
          <p className="mt-2 text-sm font-semibold">{template.termDuration}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-primary/10 pt-4 text-sm">
        <p className="text-slate-500 dark:text-slate-400">
          Updated {template.updatedAt}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 font-bold text-primary transition-colors hover:bg-primary/10"
            onClick={() => onCreateContract(template)}
            type="button"
          >
            New Contract
          </button>
          <button
            className="rounded-full bg-primary px-4 py-2 font-bold text-background-dark transition-opacity hover:opacity-90"
            onClick={() => onEdit(template)}
            type="button"
          >
            Edit Template
          </button>
        </div>
      </div>
    </Reveal>
  );
}

export default function AdminContractTemplatesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm);

  const templatesQuery = useQuery({
    queryKey: ["admin", "contractTemplates"],
    queryFn: fetchAdminContractTemplates,
    staleTime: 15_000,
  });

  const templates = templatesQuery.data?.templates ?? [];
  const filteredTemplates = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    return templates.filter((template) => {
      if (!query) {
        return true;
      }

      return (
        template.templateName.toLowerCase().includes(query) ||
        template.companyName.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query)
      );
    });
  }, [deferredSearch, templates]);

  function handleEdit(template) {
    navigate(buildAdminContractTemplateEditHref(template.id));
  }

  function handleCreateContract(template) {
    navigate(`${adminNewContractHref}?templateId=${template.id}`);
  }

  if (templatesQuery.isLoading && !templatesQuery.data) {
    return <RouteLoadingScreen />;
  }

  if (templatesQuery.isError) {
    return (
      <ReaderStateScreen
        ctaLabel="Back To Contracts"
        ctaTo={adminContractsHref}
        description={
          templatesQuery.error?.message ||
          "We could not load the contract template library."
        }
        secondaryLabel="Retry"
        secondaryTo={adminContractTemplatesHref}
        title="Template Library Unavailable"
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
            to={adminCreateContractTemplateHref}
          >
            Create Template
          </Link>
        </>
      }
      subtitle="Manage reusable agreement templates, keep company terms editable, and start new contracts from the latest approved wording."
      title="Contract Templates"
    >
      <section className="space-y-5">
        <label className="group relative block">
          <MaterialSymbol name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-primary" />
          <input
            className="w-full rounded-2xl border border-primary/10 bg-white py-3 pl-12 pr-4 text-sm shadow-sm focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-primary/5"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search templates by name, company, or description..."
            type="text"
            value={searchTerm}
          />
        </label>

        {filteredTemplates.length ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                onCreateContract={handleCreateContract}
                onEdit={handleEdit}
                template={template}
              />
            ))}
          </div>
        ) : (
          <Reveal className="rounded-[28px] border border-dashed border-primary/20 bg-white px-6 py-14 text-center shadow-sm dark:bg-primary/5">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
              Templates
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight">
              No templates available yet
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
              Create your first reusable contract template to avoid retyping company
              terms, rights coverage, and compensation language for every new agreement.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-background-dark"
                to={adminCreateContractTemplateHref}
              >
                Create First Template
              </Link>
              <Link
                className="rounded-full border border-primary/20 bg-primary/5 px-5 py-3 text-sm font-bold text-primary"
                to={adminContractsHref}
              >
                Back To Contracts
              </Link>
            </div>
          </Reveal>
        )}
      </section>
    </AdminPageLayout>
  );
}
