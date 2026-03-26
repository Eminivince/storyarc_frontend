import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import Reveal from "../components/Reveal";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import SkeletonBlock from "../components/SkeletonBlock";
import { useToast } from "../context/ToastContext";
import { profileHref } from "../data/accountFlow";
import MaterialSymbol from "../components/MaterialSymbol";
import {
  createSupportTicket,
  fetchSupportHelpCenter,
  fetchSupportTickets,
} from "../support/supportApi";

const emptyHelpCenter = {
  articles: [],
  categories: [],
  supportActions: [],
};
const supportTicketCategoryOptions = [
  { label: "Account", value: "ACCOUNT" },
  { label: "Billing", value: "BILLING" },
  { label: "Content", value: "CONTENT" },
  { label: "Creator", value: "CREATOR" },
  { label: "Technical", value: "TECHNICAL" },
  { label: "General", value: "GENERAL" },
];
const supportTicketPriorityOptions = [
  { label: "Low", value: "LOW" },
  { label: "Normal", value: "NORMAL" },
  { label: "High", value: "HIGH" },
  { label: "Urgent", value: "URGENT" },
];

function normalizeSearchTerm(value) {
  return value.trim().toLowerCase();
}

function matchesSearch(query, values) {
  if (!query) {
    return true;
  }

  return values.some((value) =>
    String(value ?? "").toLowerCase().includes(query),
  );
}

function formatEnumLabel(value) {
  return String(value ?? "")
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join(" ");
}

function buildTicketDraft(action, article) {
  const template = action?.ticketTemplate ?? {
    category: "GENERAL",
    message:
      "I need help from the TaleStead support team. Please follow up on this support request.",
    priority: "NORMAL",
    subject: "General support request",
  };

  return {
    category: template.category ?? "GENERAL",
    message: article?.title
      ? `${template.message}\n\nRelated help article: ${article.title}`
      : template.message,
    priority: template.priority ?? "NORMAL",
    subject: article?.title
      ? `${template.subject}: ${article.title}`
      : template.subject,
  };
}

function splitArticleBody(body) {
  const normalized = String(body ?? "").trim();

  if (!normalized) {
    return [];
  }

  return normalized
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function ticketStatusClasses(status) {
  if (status === "RESOLVED") {
    return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300";
  }

  if (status === "OPEN") {
    return "bg-primary/15 text-primary";
  }

  return "bg-amber-500/15 text-amber-600 dark:text-amber-300";
}

function ticketPriorityClasses(priority) {
  if (priority === "URGENT" || priority === "HIGH") {
    return "bg-rose-500/15 text-rose-600 dark:text-rose-300";
  }

  if (priority === "LOW") {
    return "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200";
  }

  return "bg-primary/15 text-primary";
}

function HelpCatalogState({ message }) {
  return (
    <div className="rounded-[24px] border border-primary/10 bg-white p-5 text-sm text-slate-500 dark:bg-[#27241b] dark:text-slate-400">
      {message}
    </div>
  );
}

function SupportTicketsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          className="rounded-[24px] border border-primary/10 bg-white p-5 shadow-sm dark:bg-[#27241b]"
          key={index}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="w-full space-y-3">
              <SkeletonBlock className="h-5 w-2/3" />
              <SkeletonBlock className="h-3 w-1/3" />
              <SkeletonBlock className="h-3 w-full" />
            </div>
            <SkeletonBlock className="h-6 w-16 rounded-full" />
          </div>
          <SkeletonBlock className="mt-4 h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

function HelpCategorySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm dark:border-[#393528] dark:bg-[#27241b]"
          key={index}
        >
          <SkeletonBlock className="h-12 w-12 rounded-2xl bg-primary/20 dark:bg-primary/15" />
          <div className="mt-4 space-y-3">
            <SkeletonBlock className="h-4 w-3/4" />
            <SkeletonBlock className="h-3 w-full" />
            <SkeletonBlock className="h-3 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

function HelpArticleSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          className="rounded-[24px] border border-slate-200 bg-white p-4 dark:border-[#393528] dark:bg-[#27241b]"
          key={index}
        >
          <SkeletonBlock className="h-4 w-2/3" />
          <SkeletonBlock className="mt-2 h-3 w-1/4" />
          <SkeletonBlock className="mt-3 h-3 w-full" />
          <SkeletonBlock className="mt-2 h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}

function TicketComposerModal({
  article,
  draft,
  isOpen,
  isSubmitting,
  onClose,
  onDraftChange,
  onSubmit,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-background-dark/75 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-labelledby="support-ticket-title"
      aria-modal="true"
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-[0_28px_90px_-35px_rgba(0,0,0,0.55)] dark:bg-[#1d1a13]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
              Support Ticket
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight" id="support-ticket-title">
              Contact TaleStead support
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
              Share enough detail for the team to act quickly. Your message lands in the same ticket inbox shown on this page.
            </p>
          </div>
          <button
            className="flex size-10 items-center justify-center rounded-full border border-primary/10 text-slate-500 transition-colors hover:bg-primary/10 hover:text-primary"
            onClick={onClose}
            type="button"
          >
            <MaterialSymbol name="close" />
          </button>
        </div>

        {article ? (
          <div className="mt-5 rounded-[24px] border border-primary/10 bg-primary/5 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">
              Related Article
            </p>
            <p className="mt-2 font-bold">{article.title}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {article.excerpt}
            </p>
          </div>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Category
              </span>
              <select
                className="w-full rounded-2xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                onChange={(event) => onDraftChange("category", event.target.value)}
                value={draft.category}
              >
                {supportTicketCategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Priority
              </span>
              <select
                className="w-full rounded-2xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                onChange={(event) => onDraftChange("priority", event.target.value)}
                value={draft.priority}
              >
                {supportTicketPriorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
              Subject
            </span>
            <input
              className="w-full rounded-2xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
              minLength={4}
              onChange={(event) => onDraftChange("subject", event.target.value)}
              required
              type="text"
              value={draft.subject}
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
              Message
            </span>
            <textarea
              className="min-h-[180px] w-full rounded-[28px] border border-primary/10 bg-slate-50 px-4 py-3 text-sm leading-7 outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
              minLength={8}
              onChange={(event) => onDraftChange("message", event.target.value)}
              required
              value={draft.message}
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Submitted tickets appear under Recent Tickets after the request succeeds.
            </p>
            <div className="flex gap-3">
              <button
                className="rounded-full border border-primary/15 px-5 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-primary/10 hover:text-primary dark:text-slate-300"
                onClick={onClose}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-background-dark transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function SupportTicketsPanel({
  error,
  isLoading,
  onOpenComposer,
  primarySupportAction,
  tickets,
}) {
  return (
    <section>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
            Ticket Inbox
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight">Recent Tickets</h3>
        </div>
        <button
          className="rounded-full border border-primary/15 bg-white px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary/5"
          disabled={!primarySupportAction}
          onClick={() => onOpenComposer(primarySupportAction, null)}
          type="button"
        >
          New Ticket
        </button>
      </div>

      {isLoading ? (
        <SupportTicketsSkeleton />
      ) : error ? (
        <HelpCatalogState
          message={error.message || "We could not load your support tickets right now."}
        />
      ) : tickets.length ? (
        <div className="space-y-3">
          {tickets.slice(0, 4).map((ticket) => {
            const latestMessage = ticket.messages[ticket.messages.length - 1];

            return (
              <div
                className="rounded-[24px] border border-primary/10 bg-white p-5 shadow-sm dark:bg-[#27241b]"
                key={ticket.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-black">{ticket.subject}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${ticketStatusClasses(ticket.status)}`}
                      >
                        {formatEnumLabel(ticket.status)}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${ticketPriorityClasses(ticket.priority)}`}
                      >
                        {formatEnumLabel(ticket.priority)}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:bg-primary/10 dark:text-slate-300">
                        {formatEnumLabel(ticket.category)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-400">
                    Updated {ticket.updatedAt}
                  </p>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
                  {latestMessage?.body || "No messages have been added yet."}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-primary/20 bg-primary/5 p-5 text-sm text-slate-500 dark:text-slate-400">
          You have no support tickets yet. Open one when you need help from the TaleStead team.
        </div>
      )}
    </section>
  );
}

function CategorySection({
  activeCategoryId,
  categories,
  helpError,
  isLoadingContent,
  onCategoryToggle,
}) {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
            Help Topics
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight">
            Browse by category
          </h3>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-primary">
          {categories.length} topics
        </span>
      </div>

      {isLoadingContent ? (
        <HelpCategorySkeleton />
      ) : helpError ? (
        <HelpCatalogState
          message={helpError.message || "The help center could not be loaded right now."}
        />
      ) : categories.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <button
            className={`group rounded-[24px] border p-6 text-left shadow-sm transition-all ${
              activeCategoryId === null
                ? "border-primary/35 bg-primary/10"
                : "border-slate-200 bg-white hover:border-primary/35 dark:border-[#393528] dark:bg-[#27241b]"
            }`}
            onClick={() => onCategoryToggle(null)}
            type="button"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
              <MaterialSymbol name="dashboard" className="text-[28px]" />
            </div>
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-base font-black">All topics</h4>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Search across the full help center and jump into any article from one place.
            </p>
          </button>

          {categories.map((category, index) => {
            const isActive = activeCategoryId === category.id;

            return (
              <Reveal delay={index * 0.04} key={category.id}>
                <button
                  className={`group w-full rounded-[24px] border p-6 text-left shadow-sm transition-all ${
                    isActive
                      ? "border-primary/35 bg-primary/10"
                      : "border-slate-200 bg-white hover:border-primary/35 dark:border-[#393528] dark:bg-[#27241b]"
                  }`}
                  onClick={() => onCategoryToggle(category.id)}
                  type="button"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                    <MaterialSymbol name={category.icon} className="text-[28px]" />
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-base font-black">{category.title}</h4>
                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary dark:bg-primary/15">
                      {category.articleCount}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {category.description}
                  </p>
                </button>
              </Reveal>
            );
          })}
        </div>
      ) : (
        <HelpCatalogState message="No help categories are available right now." />
      )}
    </section>
  );
}

function ArticleDirectory({
  articles,
  categoryTitlesById,
  helpError,
  isLoadingContent,
  onArticleSelect,
  resultLabel,
  selectedArticleId,
}) {
  return (
    <section className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
            Article Directory
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight">
            Search results
          </h3>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-primary">
          {resultLabel}
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {isLoadingContent ? (
          <HelpArticleSkeleton />
        ) : helpError ? (
          <HelpCatalogState
            message={helpError.message || "The article catalog could not be loaded right now."}
          />
        ) : articles.length ? (
          articles.map((article) => {
            const isActive = selectedArticleId === article.id;

            return (
              <button
                className={`w-full rounded-[24px] border p-4 text-left transition-colors ${
                  isActive
                    ? "border-primary/35 bg-primary/10"
                    : "border-slate-200 bg-slate-50 hover:border-primary/30 hover:bg-white dark:border-[#393528] dark:bg-[#27241b] dark:hover:bg-[#393528]/30"
                }`}
                key={article.id}
                onClick={() => onArticleSelect(article)}
                type="button"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-primary">
                        {categoryTitlesById.get(article.categoryId) || "Help article"}
                      </span>
                      {article.tag ? (
                        <span className="rounded-full bg-slate-200 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:bg-primary/15 dark:text-slate-300">
                          {article.tag}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-4 text-lg font-black tracking-tight">
                      {article.title}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                      {article.excerpt}
                    </p>
                  </div>
                  <MaterialSymbol name="arrow_outward" className="text-slate-400" />
                </div>
              </button>
            );
          })
        ) : (
          <HelpCatalogState message="No help articles matched your current search." />
        )}
      </div>
    </section>
  );
}

function ArticleDetailCard({
  article,
  categoryTitle,
  primarySupportAction,
  onOpenComposer,
}) {
  if (!article) {
    return (
      <section className="rounded-[28px] border border-dashed border-primary/20 bg-primary/5 p-6 text-sm text-slate-500 dark:text-slate-400">
        Choose an article from the directory to read the full answer here.
      </section>
    );
  }

  const paragraphs = splitArticleBody(article.body);

  return (
    <section className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-primary">
          {categoryTitle || "Help center"}
        </span>
        {article.tag ? (
          <span className="rounded-full bg-slate-200 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:bg-primary/15 dark:text-slate-300">
            {article.tag}
          </span>
        ) : null}
      </div>

      <h3 className="mt-4 text-3xl font-black tracking-tight">{article.title}</h3>
      <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-400">
        {article.excerpt}
      </p>

      <div className="mt-8 space-y-5 text-[15px] leading-8 text-slate-700 dark:text-slate-200">
        {paragraphs.length ? (
          paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
        ) : (
          <p>
            The full article body has not been published yet. Open a support ticket if you still need help with this topic.
          </p>
        )}
      </div>

      <div className="mt-8 rounded-[24px] border border-primary/10 bg-slate-50 p-5 dark:bg-background-dark/50">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
          Need follow-up help?
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
          If this article does not fully resolve the issue, open a support ticket with the article reference attached.
        </p>
        <button
          className="mt-4 rounded-full bg-primary px-5 py-3 text-sm font-bold text-background-dark transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!primarySupportAction}
          onClick={() => onOpenComposer(primarySupportAction, article)}
          type="button"
        >
          Ask About This Article
        </button>
      </div>
    </section>
  );
}

function SupportActionBanner({
  isCreatingTicket,
  onOpenComposer,
  primarySupportAction,
  supportActions,
}) {
  return (
    <section className="rounded-[32px] border border-primary/20 bg-[radial-gradient(circle_at_top_left,_rgba(214,171,69,0.22),_transparent_55%),linear-gradient(135deg,rgba(255,247,221,0.9),rgba(255,255,255,0.98))] p-6 dark:bg-[radial-gradient(circle_at_top_left,_rgba(214,171,69,0.22),_transparent_55%),linear-gradient(135deg,rgba(32,25,16,0.98),rgba(24,19,14,0.98))]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
            Direct Support
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight">
            Need a human to step in?
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
            Search the help center first, then open a ticket with the issue details and any related article context attached.
          </p>
        </div>

        {supportActions.length ? (
          <div className="flex flex-wrap gap-3">
            {supportActions.map((action) => (
              <button
                className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${
                  action.primary
                    ? "bg-primary text-background-dark"
                    : "border border-primary/20 bg-white text-primary dark:bg-primary/10"
                }`}
                disabled={isCreatingTicket}
                key={action.id}
                onClick={() => onOpenComposer(action, null)}
                type="button"
              >
                <MaterialSymbol name={action.icon} className="text-base" />
                {action.title}
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-full border border-dashed border-primary/20 px-4 py-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
            Direct support actions are not configured yet.
          </div>
        )}
      </div>

      {primarySupportAction?.description ? (
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          {primarySupportAction.description}
        </p>
      ) : null}
    </section>
  );
}

function DesktopHelpLayout({ children }) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex min-h-screen">
        <AppDesktopSidebar />
        <main className="min-w-0 flex-1 bg-background-light dark:bg-background-dark">
          <div className="mx-auto max-w-7xl space-y-8 px-6 py-10 lg:px-10">{children}</div>
        </main>
      </div>
    </div>
  );
}

function MobileHelpLayout({ children, footer }) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-background-light/90 backdrop-blur-md dark:border-primary/10 dark:bg-background-dark/90">
        <div className="mx-auto flex w-full max-w-md items-center justify-between p-4">
          <Link
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-slate-200 dark:hover:bg-primary/10"
            to={profileHref}
          >
            <MaterialSymbol name="arrow_back" className="text-slate-900 dark:text-primary" />
          </Link>
          <h1 className="flex-1 text-center text-lg font-black">Help & Support</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-md space-y-6 px-4 pb-32 pt-5">{children}</main>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-background-light/95 p-4 backdrop-blur-md dark:border-primary/10 dark:bg-background-dark/95">
        <div className="mx-auto max-w-md">{footer}</div>
      </div>
      <AppMobileTabBar className="bottom-[88px]" />
    </div>
  );
}

export default function HelpSupportPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerArticle, setComposerArticle] = useState(null);
  const [ticketDraft, setTicketDraft] = useState(
    buildTicketDraft(null, null),
  );
  const deferredSearch = useDeferredValue(searchValue);
  const supportTicketsQuery = useQuery({
    queryKey: ["support", "tickets"],
    queryFn: fetchSupportTickets,
    staleTime: 30_000,
  });
  const helpCenterQuery = useQuery({
    queryKey: ["support", "help-center"],
    queryFn: fetchSupportHelpCenter,
    staleTime: 5 * 60 * 1000,
  });
  const createTicketMutation = useMutation({
    mutationFn: createSupportTicket,
    onError: (error) => {
      showToast(error.message || "We could not create your support ticket.", {
        tone: "info",
      });
    },
    onSuccess: (response) => {
      showToast(response.message || "Support ticket created.", {
        tone: "success",
      });
      setIsComposerOpen(false);
      setComposerArticle(null);
      queryClient.invalidateQueries({
        queryKey: ["support", "tickets"],
      });
    },
  });

  const helpCenter = helpCenterQuery.data ?? emptyHelpCenter;
  const categories = helpCenter.categories ?? [];
  const categoryTitlesById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.title])),
    [categories],
  );
  const searchQuery = normalizeSearchTerm(deferredSearch);
  const articles = useMemo(() => {
    return helpCenter.articles.filter((article) => {
      if (activeCategoryId && article.categoryId !== activeCategoryId) {
        return false;
      }

      return matchesSearch(searchQuery, [
        article.title,
        article.tag,
        article.excerpt,
        article.body,
        categoryTitlesById.get(article.categoryId),
      ]);
    });
  }, [activeCategoryId, categoryTitlesById, helpCenter.articles, searchQuery]);
  const supportActions = helpCenter.supportActions ?? [];
  const primarySupportAction =
    supportActions.find((action) => action.primary) ?? supportActions[0] ?? null;
  const tickets = supportTicketsQuery.data?.tickets ?? [];

  useEffect(() => {
    if (!articles.length) {
      setSelectedArticleId(null);
      return;
    }

    if (!selectedArticleId || !articles.some((article) => article.id === selectedArticleId)) {
      setSelectedArticleId(articles[0].id);
    }
  }, [articles, selectedArticleId]);

  const selectedArticle =
    articles.find((article) => article.id === selectedArticleId) ?? null;
  const selectedCategoryTitle = selectedArticle
    ? categoryTitlesById.get(selectedArticle.categoryId) ?? "Help center"
    : null;

  if (
    helpCenterQuery.isPending &&
    !helpCenterQuery.data &&
    supportTicketsQuery.isPending &&
    !supportTicketsQuery.data
  ) {
    return <RouteLoadingScreen />;
  }

  function handleCategoryToggle(categoryId) {
    setActiveCategoryId((current) => (current === categoryId ? null : categoryId));
  }

  function handleArticleSelect(article) {
    setSelectedArticleId(article.id);
  }

  function handleOpenComposer(action, article) {
    if (!action?.ticketTemplate) {
      showToast("This support action is not configured yet.", {
        tone: "info",
      });
      return;
    }

    setTicketDraft(buildTicketDraft(action, article));
    setComposerArticle(article ?? null);
    setIsComposerOpen(true);
  }

  function handleDraftChange(field, value) {
    setTicketDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleTicketSubmit(event) {
    event.preventDefault();

    try {
      await createTicketMutation.mutateAsync({
        category: ticketDraft.category,
        message: ticketDraft.message.trim(),
        priority: ticketDraft.priority,
        subject: ticketDraft.subject.trim(),
      });
    } catch {
      // Errors are surfaced through the mutation callbacks and toast system.
    }
  }

  const desktopContent = (
    <>
      <section className="rounded-[32px] border border-primary/15 bg-[radial-gradient(circle_at_top_left,_rgba(214,171,69,0.18),_transparent_45%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,247,221,0.92))] p-8 dark:bg-[radial-gradient(circle_at_top_left,_rgba(214,171,69,0.2),_transparent_45%),linear-gradient(135deg,rgba(33,27,19,0.98),rgba(26,21,15,0.98))]">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
              Account Support
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Find answers fast, then escalate with context.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400">
              Search the live help center, read full support articles, and submit a ticket when you need a human to take over.
            </p>
          </div>

          <div className="w-full max-w-2xl">
            <label className="relative block">
              <MaterialSymbol name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="h-14 w-full rounded-full border border-slate-200 bg-white pl-12 pr-4 text-base shadow-sm outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-[#27241b] dark:text-slate-100"
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search articles, billing guides, account help, and more..."
                type="text"
                value={searchValue}
              />
            </label>
          </div>
        </div>
      </section>

      <SupportActionBanner
        isCreatingTicket={createTicketMutation.isPending}
        onOpenComposer={handleOpenComposer}
        primarySupportAction={primarySupportAction}
        supportActions={supportActions}
      />

      <SupportTicketsPanel
        error={supportTicketsQuery.error}
        isLoading={supportTicketsQuery.isPending}
        onOpenComposer={handleOpenComposer}
        primarySupportAction={primarySupportAction}
        tickets={tickets}
      />

      <CategorySection
        activeCategoryId={activeCategoryId}
        categories={categories}
        helpError={helpCenterQuery.error}
        isLoadingContent={helpCenterQuery.isPending}
        onCategoryToggle={handleCategoryToggle}
      />

      <section className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <ArticleDirectory
          articles={articles}
          categoryTitlesById={categoryTitlesById}
          helpError={helpCenterQuery.error}
          isLoadingContent={helpCenterQuery.isPending}
          onArticleSelect={handleArticleSelect}
          resultLabel={`${articles.length} results`}
          selectedArticleId={selectedArticleId}
        />
        <ArticleDetailCard
          article={selectedArticle}
          categoryTitle={selectedCategoryTitle}
          onOpenComposer={handleOpenComposer}
          primarySupportAction={primarySupportAction}
        />
      </section>
    </>
  );

  const mobileContent = (
    <>
      <section className="rounded-[28px] border border-primary/15 bg-[radial-gradient(circle_at_top_left,_rgba(214,171,69,0.18),_transparent_45%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,247,221,0.92))] p-5 dark:bg-[radial-gradient(circle_at_top_left,_rgba(214,171,69,0.2),_transparent_45%),linear-gradient(135deg,rgba(33,27,19,0.98),rgba(26,21,15,0.98))]">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
          Account Support
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight">
          Search or submit a ticket.
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
          Read the help center first, then contact support with the right context attached.
        </p>
        <label className="relative mt-5 block">
          <MaterialSymbol name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="h-14 w-full rounded-full border border-slate-200 bg-white pl-12 pr-4 text-base shadow-sm outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-[#27241b] dark:text-slate-100"
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search help articles..."
            type="text"
            value={searchValue}
          />
        </label>
      </section>

      <SupportTicketsPanel
        error={supportTicketsQuery.error}
        isLoading={supportTicketsQuery.isPending}
        onOpenComposer={handleOpenComposer}
        primarySupportAction={primarySupportAction}
        tickets={tickets}
      />

      <CategorySection
        activeCategoryId={activeCategoryId}
        categories={categories}
        helpError={helpCenterQuery.error}
        isLoadingContent={helpCenterQuery.isPending}
        onCategoryToggle={handleCategoryToggle}
      />

      <ArticleDirectory
        articles={articles}
        categoryTitlesById={categoryTitlesById}
        helpError={helpCenterQuery.error}
        isLoadingContent={helpCenterQuery.isPending}
        onArticleSelect={handleArticleSelect}
        resultLabel={`${articles.length} results`}
        selectedArticleId={selectedArticleId}
      />

      <ArticleDetailCard
        article={selectedArticle}
        categoryTitle={selectedCategoryTitle}
        onOpenComposer={handleOpenComposer}
        primarySupportAction={primarySupportAction}
      />
    </>
  );

  return (
    <>
      <DesktopHelpLayout>{desktopContent}</DesktopHelpLayout>
      <MobileHelpLayout
        footer={
          <button
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-black text-background-dark transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!primarySupportAction || createTicketMutation.isPending}
            onClick={() => handleOpenComposer(primarySupportAction, selectedArticle)}
            type="button"
          >
            <MaterialSymbol name={primarySupportAction?.icon ?? "support_agent"} />
            {primarySupportAction?.title ?? "Contact Support"}
          </button>
        }
      >
        {mobileContent}
      </MobileHelpLayout>

      <TicketComposerModal
        article={composerArticle}
        draft={ticketDraft}
        isOpen={isComposerOpen}
        isSubmitting={createTicketMutation.isPending}
        onClose={() => {
          setIsComposerOpen(false);
          setComposerArticle(null);
        }}
        onDraftChange={handleDraftChange}
        onSubmit={handleTicketSubmit}
      />
    </>
  );
}
