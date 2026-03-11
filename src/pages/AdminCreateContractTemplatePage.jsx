import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createAdminContractTemplate,
  fetchAdminContractTemplate,
  updateAdminContractTemplate,
} from "../admin/adminApi";
import { buildTemplatePayload, mapTemplateToDraft } from "../admin/adminContractUtils";
import AdminPageLayout from "../components/AdminPageLayout";
import ReaderStateScreen from "../components/ReaderStateScreen";
import Reveal from "../components/Reveal";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import { useAdmin } from "../context/AdminContext";
import {
  buildContractPreview,
  contractExclusivityOptions,
  contractGeographicRightsOptions,
  contractTemplatePlaceholders,
  contractTermOptions,
  createEmptyContractTemplateDraft,
} from "../data/adminContractFlow";
import {
  adminContractTemplatesHref,
  adminContractsHref,
} from "../data/adminFlow";

function SectionHeading({ icon, title }) {
  return (
    <div className="flex items-center gap-2 border-b border-primary/10 pb-3">
      <span className="material-symbols-outlined text-primary">{icon}</span>
      <h2 className="text-lg font-black tracking-tight">{title}</h2>
    </div>
  );
}

function ToolbarButton({ icon, label, onClick }) {
  return (
    <button
      aria-label={label}
      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-primary/20 hover:text-white"
      onClick={onClick}
      type="button"
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    </button>
  );
}

export default function AdminCreateContractTemplatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { templateId } = useParams();
  const { adminNotice, clearAdminNotice, showAdminNotice } = useAdmin();
  const [form, setForm] = useState(createEmptyContractTemplateDraft);
  const isEditing = Boolean(templateId);

  const templateQuery = useQuery({
    enabled: isEditing,
    queryKey: ["admin", "contractTemplate", templateId],
    queryFn: () => fetchAdminContractTemplate(templateId),
    staleTime: 15_000,
  });

  useEffect(() => {
    if (!templateQuery.data?.template) {
      return;
    }

    setForm(mapTemplateToDraft(templateQuery.data.template));
  }, [templateQuery.data?.template]);

  const previewBody = useMemo(
    () =>
      buildContractPreview(form.body, {
        advancePayment: form.advancePayment,
        companyName: form.companyName,
        revenueSharePercent: form.revenueSharePercent,
        storyTitle: "Sample Story Title",
        userName: "Sample Creator",
      }),
    [
      form.advancePayment,
      form.body,
      form.companyName,
      form.revenueSharePercent,
    ],
  );

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      isEditing
        ? updateAdminContractTemplate(templateId, payload)
        : createAdminContractTemplate(payload),
    onError: (error) => {
      showAdminNotice(
        error.message || "Could not save this contract template.",
        "info",
      );
    },
    onSuccess: (response) => {
      showAdminNotice(response.message || "Contract template saved.");
      queryClient.invalidateQueries({ queryKey: ["admin", "contractTemplates"] });
      if (templateId) {
        queryClient.invalidateQueries({
          queryKey: ["admin", "contractTemplate", templateId],
        });
      }
      navigate(adminContractTemplatesHref);
    },
  });

  function updateField(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function insertPlaceholder(placeholder) {
    setForm((current) => ({
      ...current,
      body: `${current.body}${current.body.endsWith("\n") ? "" : "\n"}${placeholder}`,
    }));
  }

  function validateForm() {
    if (!form.templateName.trim()) {
      return "Template name is required.";
    }

    if (!form.companyName.trim()) {
      return "Company name is required.";
    }

    if (!form.exclusivity) {
      return "Choose an exclusivity setting.";
    }

    if (!form.geographicRights) {
      return "Choose geographic rights coverage.";
    }

    if (!form.termMonths) {
      return "Choose a term duration.";
    }

    if (form.revenueSharePercent === "") {
      return "Revenue share is required.";
    }

    if (form.signingBonusCoins === "") {
      return "Signing bonus is required.";
    }

    if (form.advancePayment === "") {
      return "Advance payment is required.";
    }

    if (!form.body.trim()) {
      return "Contract body is required.";
    }

    return null;
  }

  function handleSave() {
    const validationMessage = validateForm();

    if (validationMessage) {
      showAdminNotice(validationMessage, "info");
      return;
    }

    saveMutation.mutate(buildTemplatePayload(form));
  }

  if (templateQuery.isLoading && !templateQuery.data) {
    return <RouteLoadingScreen />;
  }

  if (templateQuery.isError) {
    return (
      <ReaderStateScreen
        ctaLabel="Back To Templates"
        ctaTo={adminContractTemplatesHref}
        description={
          templateQuery.error?.message ||
          "We could not load that contract template right now."
        }
        secondaryLabel="Back To Contracts"
        secondaryTo={adminContractsHref}
        title="Template Unavailable"
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
            to={adminContractTemplatesHref}
          >
            Manage Templates
          </Link>
          <button
            className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-background-dark transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={saveMutation.isPending}
            onClick={handleSave}
            type="button"
          >
            {saveMutation.isPending ? "Saving..." : isEditing ? "Save Changes" : "Save Template"}
          </button>
        </>
      }
      notice={adminNotice}
      onDismissNotice={clearAdminNotice}
      subtitle="Define reusable agreement terms for creator contracts, including financial structure, editable company details, and the template body admins will start from."
      title={isEditing ? "Edit Contract Template" : "Create Contract Template"}
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-6">
          <Reveal className="rounded-[28px] border border-primary/10 bg-[#120f09] p-6 text-white shadow-[0_28px_80px_-40px_rgba(16,12,8,0.9)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-primary/70">
                  Contracts
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-tight">
                  Template overview
                </h2>
              </div>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-200 transition-colors hover:bg-white/10"
                to={adminContractsHref}
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Back to Contracts
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                  Revenue Share
                </p>
                <p className="mt-2 text-2xl font-black">
                  {form.revenueSharePercent || "--"}%
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                  Bonus
                </p>
                <p className="mt-2 text-2xl font-black">
                  {form.signingBonusCoins || "--"}
                </p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                  Coins
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                  Company
                </p>
                <p className="mt-2 text-lg font-black">
                  {form.companyName || "Set Company"}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {form.termMonths
                    ? contractTermOptions.find(
                        (option) => String(option.value) === String(form.termMonths),
                      )?.label || `${form.termMonths} Months`
                    : "Set term"}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
            <SectionHeading icon="info" title="Template Information" />

            <div className="mt-5 space-y-5">
              <label className="block">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Template Name
                </span>
                <input
                  className="mt-2 w-full rounded-xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                  onChange={(event) => updateField("templateName", event.target.value)}
                  placeholder="e.g., Premium Serialization Agreement"
                  type="text"
                  value={form.templateName}
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Company Name
                </span>
                <input
                  className="mt-2 w-full rounded-xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                  onChange={(event) => updateField("companyName", event.target.value)}
                  placeholder="e.g., StoryArc Publishing LLC"
                  type="text"
                  value={form.companyName}
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Description
                </span>
                <textarea
                  className="mt-2 w-full rounded-xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm leading-7 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                  onChange={(event) => updateField("description", event.target.value)}
                  rows="4"
                  value={form.description}
                />
              </label>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
              <SectionHeading icon="payments" title="Financial Terms" />

              <div className="mt-5 space-y-5">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Revenue Share (%)
                  </span>
                  <div className="relative mt-2">
                    <input
                      className="w-full rounded-xl border border-primary/10 bg-slate-50 px-4 py-3 pr-10 text-sm focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                      onChange={(event) =>
                        updateField("revenueSharePercent", event.target.value)
                      }
                      type="number"
                      value={form.revenueSharePercent}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      %
                    </span>
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Signing Bonus
                  </span>
                  <div className="relative mt-2">
                    <input
                      className="w-full rounded-xl border border-primary/10 bg-slate-50 px-4 py-3 pr-20 text-sm focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                      onChange={(event) => updateField("signingBonusCoins", event.target.value)}
                      type="number"
                      value={form.signingBonusCoins}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                      Coins
                    </span>
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Advance Payment (USD)
                  </span>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      $
                    </span>
                    <input
                      className="w-full rounded-xl border border-primary/10 bg-slate-50 py-3 pl-8 pr-4 text-sm focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                      onChange={(event) => updateField("advancePayment", event.target.value)}
                      type="number"
                      value={form.advancePayment}
                    />
                  </div>
                </label>
              </div>
            </Reveal>

            <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
              <SectionHeading icon="gavel" title="Legal Rights" />

              <div className="mt-5 space-y-5">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Exclusivity
                  </span>
                  <select
                    className="mt-2 w-full rounded-xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                    onChange={(event) => updateField("exclusivity", event.target.value)}
                    value={form.exclusivity}
                  >
                    <option value="">Select exclusivity</option>
                    {contractExclusivityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Term Duration
                  </span>
                  <select
                    className="mt-2 w-full rounded-xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                    onChange={(event) => updateField("termMonths", event.target.value)}
                    value={form.termMonths}
                  >
                    <option value="">Select term</option>
                    {contractTermOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Geographic Rights
                  </span>
                  <select
                    className="mt-2 w-full rounded-xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                    onChange={(event) => updateField("geographicRights", event.target.value)}
                    value={form.geographicRights}
                  >
                    <option value="">Select rights coverage</option>
                    {contractGeographicRightsOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="space-y-6">
          <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
            <div className="flex items-center justify-between gap-3 border-b border-primary/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit_note</span>
                <h2 className="text-lg font-black tracking-tight">Template Body Editor</h2>
              </div>
              <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-primary">
                Placeholder-ready
              </span>
            </div>

            <div className="mt-4 overflow-hidden rounded-[24px] border border-primary/10 bg-[#17130d]">
              <div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-white/5 p-2">
                <ToolbarButton
                  icon="format_bold"
                  label="Bold"
                  onClick={() =>
                    showAdminNotice(
                      "Rich text controls still collapse down to plain template text in this workflow.",
                      "info",
                    )
                  }
                />
                <ToolbarButton
                  icon="format_italic"
                  label="Italic"
                  onClick={() =>
                    showAdminNotice(
                      "Rich text controls still collapse down to plain template text in this workflow.",
                      "info",
                    )
                  }
                />
                <ToolbarButton
                  icon="format_list_bulleted"
                  label="Bullets"
                  onClick={() =>
                    showAdminNotice(
                      "Rich text controls still collapse down to plain template text in this workflow.",
                      "info",
                    )
                  }
                />
              </div>

              <div className="border-b border-white/10 px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                  Placeholders
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {contractTemplatePlaceholders.map((placeholder) => (
                    <button
                      className="rounded-lg bg-white/10 px-2.5 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-primary hover:text-background-dark"
                      key={placeholder}
                      onClick={() => insertPlaceholder(placeholder)}
                      type="button"
                    >
                      {placeholder}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                className="min-h-[420px] w-full resize-none bg-[#1d1b15] px-5 py-5 font-mono text-sm leading-7 text-neutral-200 outline-none"
                onChange={(event) => updateField("body", event.target.value)}
                value={form.body}
              />
            </div>
          </Reveal>

          <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
            <SectionHeading icon="visibility" title="Live Preview" />
            <div className="mt-4 rounded-[24px] border border-primary/10 bg-slate-950/90 p-5 font-mono text-sm leading-7 text-slate-100">
              <pre className="whitespace-pre-wrap">{previewBody}</pre>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              This preview renders the current template body with live company and financial
              inputs. PDF export remains a later admin workflow.
            </p>
          </Reveal>
        </div>
      </div>
    </AdminPageLayout>
  );
}
