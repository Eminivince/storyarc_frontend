import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import AccountNotice from "../components/AccountNotice";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import Reveal from "../components/Reveal";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import SkeletonBlock from "../components/SkeletonBlock";
import { profileHref } from "../data/accountFlow";
import {
  createSupportTicket,
  fetchSupportHelpCenter,
  fetchSupportTickets,
} from "../support/supportApi";

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

function HelpCatalogState({ message }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white p-5 text-sm text-slate-500 dark:bg-[#27241b] dark:text-slate-400">
      {message}
    </div>
  );
}

function SupportTicketsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm dark:bg-[#27241b]"
          key={index}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="w-full space-y-3">
              <SkeletonBlock className="h-5 w-2/3" />
              <SkeletonBlock className="h-3 w-1/3" />
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#393528] dark:bg-[#27241b]"
          key={index}
        >
          <SkeletonBlock className="h-12 w-12 rounded-lg bg-primary/20 dark:bg-primary/15" />
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
          className="rounded-lg border border-slate-200 bg-white p-4 dark:border-[#393528] dark:bg-[#27241b]"
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

function SupportTicketsPanel({ isLoading, tickets }) {
  return (
    <section className="mb-16">
      <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
        <span className="h-6 w-1.5 rounded-full bg-primary" />
        Recent Tickets
      </h3>
      {isLoading ? (
        <SupportTicketsSkeleton />
      ) : tickets.length ? (
        <div className="space-y-3">
          {tickets.slice(0, 3).map((ticket) => (
            <div
              className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm dark:bg-[#27241b]"
              key={ticket.id}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold">{ticket.subject}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-primary">
                    {ticket.category} • {ticket.priority}
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                  {ticket.status}
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Updated {ticket.updatedAt}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-5 text-sm text-slate-500 dark:text-slate-400">
          You have no support tickets yet. Start one below if you need help.
        </div>
      )}
    </section>
  );
}

function DesktopHelp({
  articles,
  categories,
  clearNotice,
  helpError,
  isCreatingTicket,
  isLoadingContent,
  isLoadingTickets,
  notice,
  onArticleSelect,
  onCategorySelect,
  onSearchChange,
  onSupportAction,
  primarySupportAction,
  searchValue,
  supportActions,
  tickets,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex h-screen overflow-hidden">
        <AppDesktopSidebar />

        <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
          <div className="mx-auto max-w-5xl px-6 py-12">
            <header className="mb-12">
              <h2 className="mb-3 text-4xl font-extrabold leading-tight tracking-tight">
                How can we help?
              </h2>
              <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                Search the live help center or browse support topics below to
                find the fastest way to resolve your issue.
              </p>
              <div className="mt-8">
                <label className="relative flex w-full max-w-2xl">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <input
                    className="block h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-base shadow-sm transition-all placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-border-dark dark:bg-[#27241b] dark:text-slate-100"
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search for articles, guides, and more..."
                    type="text"
                    value={searchValue}
                  />
                </label>
              </div>
            </header>

            <AccountNotice notice={notice} onDismiss={clearNotice} />
            <SupportTicketsPanel isLoading={isLoadingTickets} tickets={tickets} />

            <section className="mb-16">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
                <span className="h-6 w-1.5 rounded-full bg-primary" />
                Support Categories
              </h3>
              {isLoadingContent ? (
                <HelpCategorySkeleton />
              ) : helpError ? (
                <HelpCatalogState
                  message={helpError.message || "The help center could not be loaded right now."}
                />
              ) : categories.length ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {categories.map((category, index) => (
                    <Reveal delay={index * 0.04} key={category.id}>
                      <button
                        className="group w-full rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:border-primary/50 dark:border-[#393528] dark:bg-[#27241b]"
                        onClick={() => onCategorySelect(category)}
                        type="button"
                      >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                          <span className="material-symbols-outlined text-[28px]">
                            {category.icon}
                          </span>
                        </div>
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="mb-2 text-base font-bold">{category.title}</h4>
                          <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                            {category.articleCount}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {category.description}
                        </p>
                      </button>
                    </Reveal>
                  ))}
                </div>
              ) : (
                <HelpCatalogState message="No help categories matched your search." />
              )}
            </section>

            <section className="mb-16">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
                <span className="h-6 w-1.5 rounded-full bg-primary" />
                Popular Articles
              </h3>
              {isLoadingContent ? (
                <HelpArticleSkeleton />
              ) : helpError ? (
                <HelpCatalogState
                  message={helpError.message || "The article catalog could not be loaded right now."}
                />
              ) : articles.length ? (
                <div className="space-y-3">
                  {articles.map((article) => (
                    <button
                      className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-left transition-colors hover:bg-slate-50 dark:border-[#393528] dark:bg-[#27241b] dark:hover:bg-[#393528]/30"
                      key={article.id}
                      onClick={() => onArticleSelect(article)}
                      type="button"
                    >
                      <div>
                        <span className="font-medium">{article.title}</span>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {article.tag}
                        </p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          {article.excerpt}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-slate-400">
                        chevron_right
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <HelpCatalogState message="No help articles matched your search." />
              )}
            </section>

            <section className="flex flex-col items-center justify-between gap-8 rounded-2xl border border-primary/20 bg-primary/5 p-8 md:flex-row">
              <div className="flex flex-col gap-2 text-center md:text-left">
                <h3 className="text-2xl font-bold">Still need help?</h3>
                <p className="max-w-md text-slate-600 dark:text-slate-400">
                  Open a live support request and the StoryArc team will follow
                  up from your ticket inbox.
                </p>
              </div>
              <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
                {supportActions.map((action) => (
                  <button
                    className={`flex items-center justify-center gap-2 rounded-lg px-8 py-3 font-bold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
                      action.primary
                        ? "bg-primary text-background-dark hover:shadow-lg"
                        : "border-2 border-primary text-primary hover:bg-primary/10"
                    }`}
                    disabled={isCreatingTicket}
                    key={action.id}
                    onClick={() => onSupportAction(action)}
                    type="button"
                  >
                    <span className="material-symbols-outlined">{action.icon}</span>
                    {action.title}
                  </button>
                ))}
              </div>
            </section>

            {!supportActions.length && !isLoadingContent && !helpError ? (
              <div className="mt-6">
                <HelpCatalogState message="No direct support actions are configured right now." />
              </div>
            ) : null}

            {primarySupportAction?.description ? (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                {primarySupportAction.description}
              </p>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileHelp({
  articles,
  categories,
  clearNotice,
  helpError,
  isCreatingTicket,
  isLoadingContent,
  isLoadingTickets,
  notice,
  onArticleSelect,
  onCategorySelect,
  onSearchChange,
  onSupportAction,
  primarySupportAction,
  searchValue,
  tickets,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-background-light/80 backdrop-blur-md dark:border-primary/10 dark:bg-background-dark/80">
        <div className="mx-auto flex w-full max-w-md items-center justify-between p-4">
          <Link
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-slate-200 dark:hover:bg-primary/10"
            to={profileHref}
          >
            <span className="material-symbols-outlined text-slate-900 dark:text-primary">
              arrow_back
            </span>
          </Link>
          <h1 className="flex-1 text-center text-lg font-bold">Help & Support</h1>
          <div className="flex w-10 items-center justify-end">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-slate-200 dark:hover:bg-primary/10"
              type="button"
            >
              <span className="material-symbols-outlined text-slate-900 dark:text-primary">
                more_vert
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md pb-32">
        <div className="px-4 py-6">
          <div className="mb-2">
            <h2 className="text-2xl font-bold dark:text-primary">How can we help?</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Search the live help center or browse support topics below.
            </p>
          </div>
          <label className="mt-4 flex w-full flex-col">
            <div className="flex h-14 w-full items-stretch rounded-xl border border-slate-200 bg-slate-100 shadow-sm dark:border-primary/20 dark:bg-primary/5">
              <div className="flex items-center justify-center pl-4">
                <span className="material-symbols-outlined text-slate-400 dark:text-primary/60">
                  search
                </span>
              </div>
              <input
                className="w-full border-none bg-transparent px-4 text-base outline-none placeholder:text-slate-500 dark:text-slate-100"
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search help articles..."
                type="text"
                value={searchValue}
              />
            </div>
          </label>
        </div>

        <div className="px-4">
          <AccountNotice notice={notice} onDismiss={clearNotice} />
        </div>

        <section className="px-4 py-2">
          <SupportTicketsPanel isLoading={isLoadingTickets} tickets={tickets} />
        </section>

        <section className="px-4 py-4">
          <h3 className="mb-4 text-lg font-bold">Categories</h3>
          {isLoadingContent ? (
            <HelpCategorySkeleton />
          ) : helpError ? (
            <HelpCatalogState
              message={helpError.message || "The help center could not be loaded right now."}
            />
          ) : categories.length ? (
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  className="flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-transform active:scale-95 dark:border-primary/10 dark:bg-primary/5"
                  key={category.id}
                  onClick={() => onCategorySelect(category)}
                  type="button"
                >
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <span className="material-symbols-outlined">{category.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-left text-sm font-bold leading-tight">
                      {category.title}
                    </h2>
                    <p className="mt-1 text-left text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      {category.articleCount} Articles
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <HelpCatalogState message="No help categories matched your search." />
          )}
        </section>

        <section className="px-4 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">Popular Articles</h3>
            <span className="text-sm font-medium text-primary">
              {articles.length}
            </span>
          </div>
          {isLoadingContent ? (
            <HelpArticleSkeleton />
          ) : helpError ? (
            <HelpCatalogState
              message={helpError.message || "The article catalog could not be loaded right now."}
            />
          ) : articles.length ? (
            <div className="space-y-2">
              {articles.map((article) => (
                <button
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors active:bg-slate-50 dark:border-primary/10 dark:bg-primary/5 dark:active:bg-primary/10"
                  key={article.id}
                  onClick={() => onArticleSelect(article)}
                  type="button"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{article.title}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {article.tag}
                    </span>
                    <span className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {article.excerpt}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">
                    chevron_right
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <HelpCatalogState message="No help articles matched your search." />
          )}
        </section>

        <section className="px-4 py-2">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-amber-600 p-6">
            <div className="relative z-10">
              <h4 className="text-lg font-bold text-background-dark">
                Join the Writer&apos;s Circle
              </h4>
              <p className="mt-1 max-w-[200px] text-sm text-background-dark/80">
                Get exclusive tips on how to grow your audience and monetize your stories.
              </p>
              <button
                className="mt-4 rounded-lg bg-background-dark px-4 py-2 text-sm font-bold text-primary"
                onClick={() =>
                  onArticleSelect({
                    excerpt:
                      "Creator education updates will appear here as the support content feed expands.",
                    title: "Writer's Circle",
                  })
                }
                type="button"
              >
                Learn More
              </button>
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-20">
              <span className="material-symbols-outlined text-[120px] text-background-dark">
                auto_awesome
              </span>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-background-light p-4 dark:border-primary/10 dark:bg-background-dark">
        <div className="mx-auto max-w-md">
          <button
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-lg font-bold text-background-dark transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!primarySupportAction || isCreatingTicket}
            onClick={() => onSupportAction(primarySupportAction)}
            type="button"
          >
            <span className="material-symbols-outlined">
              {primarySupportAction?.icon ?? "support_agent"}
            </span>
            {primarySupportAction?.title ?? "Contact Support"}
          </button>
        </div>
      </div>
      <AppMobileTabBar className="bottom-[88px]" />
    </div>
  );
}

export default function HelpSupportPage() {
  const queryClient = useQueryClient();
  const [notice, setNotice] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const supportTicketsQuery = useQuery({
    queryKey: ["support", "tickets"],
    queryFn: fetchSupportTickets,
  });
  const helpCenterQuery = useQuery({
    queryKey: ["support", "help-center"],
    queryFn: fetchSupportHelpCenter,
  });
  const createTicketMutation = useMutation({
    mutationFn: createSupportTicket,
    onError: (error) => {
      setNotice({
        message: error.message || "We could not create your support ticket.",
        tone: "info",
      });
    },
    onSuccess: (response) => {
      setNotice({
        message: response.message || "Support ticket created.",
        tone: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["support", "tickets"],
      });
    },
  });

  const searchQuery = normalizeSearchTerm(searchValue);
  const helpCenter = helpCenterQuery.data ?? {
    articles: [],
    categories: [],
    supportActions: [],
  };
  const categoryTitlesById = new Map(
    helpCenter.categories.map((category) => [category.id, category.title]),
  );
  const categories = helpCenter.categories.filter((category) =>
    matchesSearch(searchQuery, [
      category.title,
      category.description,
    ]),
  );
  const articles = helpCenter.articles.filter((article) =>
    matchesSearch(searchQuery, [
      article.title,
      article.tag,
      article.excerpt,
      categoryTitlesById.get(article.categoryId),
    ]),
  );
  const supportActions = helpCenter.supportActions ?? [];
  const primarySupportAction =
    supportActions.find((action) => action.primary) ?? supportActions[0] ?? null;
  const tickets = supportTicketsQuery.data?.tickets ?? [];

  if (
    helpCenterQuery.isPending &&
    !helpCenterQuery.data &&
    supportTicketsQuery.isPending &&
    !supportTicketsQuery.data
  ) {
    return <RouteLoadingScreen />;
  }

  function clearNotice() {
    setNotice(null);
  }

  function handleCategorySelect(category) {
    setSearchValue(category.title);
    setNotice({
      message: `${category.title}: ${category.description}`,
      tone: "info",
    });
  }

  function handleArticleSelect(article) {
    setNotice({
      message: article.excerpt || `${article.title} is available in the help center.`,
      tone: "info",
    });
  }

  function handleSupportAction(action) {
    if (!action?.ticketTemplate) {
      setNotice({
        message: "This support action is not configured yet.",
        tone: "info",
      });
      return;
    }

    createTicketMutation.mutate(action.ticketTemplate);
  }

  return (
    <>
      <DesktopHelp
        articles={articles}
        categories={categories}
        clearNotice={clearNotice}
        helpError={helpCenterQuery.error}
        isCreatingTicket={createTicketMutation.isPending}
        isLoadingContent={helpCenterQuery.isPending}
        isLoadingTickets={supportTicketsQuery.isPending}
        notice={notice}
        onArticleSelect={handleArticleSelect}
        onCategorySelect={handleCategorySelect}
        onSearchChange={setSearchValue}
        onSupportAction={handleSupportAction}
        primarySupportAction={primarySupportAction}
        searchValue={searchValue}
        supportActions={supportActions}
        tickets={tickets}
      />
      <MobileHelp
        articles={articles}
        categories={categories}
        clearNotice={clearNotice}
        helpError={helpCenterQuery.error}
        isCreatingTicket={createTicketMutation.isPending}
        isLoadingContent={helpCenterQuery.isPending}
        isLoadingTickets={supportTicketsQuery.isPending}
        notice={notice}
        onArticleSelect={handleArticleSelect}
        onCategorySelect={handleCategorySelect}
        onSearchChange={setSearchValue}
        onSupportAction={handleSupportAction}
        primarySupportAction={primarySupportAction}
        searchValue={searchValue}
        tickets={tickets}
      />
    </>
  );
}
