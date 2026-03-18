import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  createAdminHelpCenterArticle,
  createAdminHelpCenterCategory,
  deleteAdminHelpCenterArticle,
  fetchAdminHelpCenter,
} from "../admin/adminApi";
import AdminPageLayout from "../components/AdminPageLayout";
import Reveal from "../components/Reveal";
import { useAdmin } from "../context/AdminContext";

const adminHelpCenterQueryKey = ["admin", "help-center"];
const emptyHelpCenter = {
  articles: [],
  categories: [],
};
const initialCategoryForm = {
  description: "",
  icon: "help",
  sortOrder: "0",
  title: "",
};
const initialArticleForm = {
  body: "",
  categoryId: "",
  excerpt: "",
  published: true,
  sortOrder: "0",
  tag: "",
  title: "",
};

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

function articleStatusClasses(published) {
  return published
    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
    : "bg-amber-500/15 text-amber-600 dark:text-amber-300";
}

function formatBodyPreview(body) {
  const normalized = String(body ?? "").trim();

  if (!normalized) {
    return "No article body yet.";
  }

  if (normalized.length <= 220) {
    return normalized;
  }

  return `${normalized.slice(0, 217)}...`;
}

export default function AdminHelpCenterPage() {
  const queryClient = useQueryClient();
  const { showAdminNotice } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);
  const [articleForm, setArticleForm] = useState(initialArticleForm);
  const deferredSearch = useDeferredValue(searchTerm);
  const helpCenterQuery = useQuery({
    queryKey: adminHelpCenterQueryKey,
    queryFn: fetchAdminHelpCenter,
    staleTime: 15_000,
  });
  const helpCenter = helpCenterQuery.data ?? emptyHelpCenter;
  const categories = helpCenter.categories ?? [];
  const articles = helpCenter.articles ?? [];

  useEffect(() => {
    if (articleForm.categoryId || !categories.length) {
      return;
    }

    setArticleForm((current) => ({
      ...current,
      categoryId: categories[0].id,
    }));
  }, [articleForm.categoryId, categories]);

  const createCategoryMutation = useMutation({
    mutationFn: createAdminHelpCenterCategory,
    onError: (error) => {
      showAdminNotice(error.message || "Could not create that category.", "info");
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: adminHelpCenterQueryKey,
      });
      setCategoryForm(initialCategoryForm);
      setArticleForm((current) => ({
        ...current,
        categoryId: current.categoryId || response.category?.id || "",
      }));
      showAdminNotice(
        response.category?.title
          ? `Created category "${response.category.title}".`
          : "Help center category created.",
      );
    },
  });
  const createArticleMutation = useMutation({
    mutationFn: createAdminHelpCenterArticle,
    onError: (error) => {
      showAdminNotice(error.message || "Could not create that article.", "info");
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: adminHelpCenterQueryKey,
      });
      setArticleForm((current) => ({
        ...initialArticleForm,
        categoryId: current.categoryId,
      }));
      showAdminNotice(
        response.article?.title
          ? `Created article "${response.article.title}".`
          : "Help center article created.",
      );
    },
  });
  const deleteArticleMutation = useMutation({
    mutationFn: deleteAdminHelpCenterArticle,
    onError: (error) => {
      showAdminNotice(error.message || "Could not delete that article.", "info");
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: adminHelpCenterQueryKey,
      });
      showAdminNotice(response.message || "Help center article deleted.");
    },
  });

  const categoryTitlesById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.title])),
    [categories],
  );
  const visibleArticles = useMemo(() => {
    const query = normalizeSearchTerm(deferredSearch);

    return articles.filter((article) =>
      matchesSearch(query, [
        article.title,
        article.excerpt,
        article.tag,
        article.body,
        categoryTitlesById.get(article.categoryId),
      ]),
    );
  }, [articles, categoryTitlesById, deferredSearch]);
  const visibleCategories = useMemo(() => {
    const query = normalizeSearchTerm(deferredSearch);

    return categories.filter((category) => {
      if (
        matchesSearch(query, [
          category.title,
          category.description,
          category.icon,
        ])
      ) {
        return true;
      }

      return visibleArticles.some((article) => article.categoryId === category.id);
    });
  }, [categories, deferredSearch, visibleArticles]);

  function handleCategorySubmit(event) {
    event.preventDefault();

    createCategoryMutation.mutate({
      description: categoryForm.description.trim(),
      icon: categoryForm.icon.trim(),
      sortOrder: Number(categoryForm.sortOrder || 0),
      title: categoryForm.title.trim(),
    });
  }

  function handleArticleSubmit(event) {
    event.preventDefault();

    createArticleMutation.mutate({
      body: articleForm.body.trim() || undefined,
      categoryId: articleForm.categoryId,
      excerpt: articleForm.excerpt.trim(),
      published: articleForm.published,
      sortOrder: Number(articleForm.sortOrder || 0),
      tag: articleForm.tag.trim() || undefined,
      title: articleForm.title.trim(),
    });
  }

  function handleArticleDelete(article) {
    if (
      !globalThis.confirm(
        `Delete "${article.title}" from the help center? This cannot be undone.`,
      )
    ) {
      return;
    }

    deleteArticleMutation.mutate(article.id);
  }

  return (
    <AdminPageLayout
      headerActions={
        <button
          className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-background-dark transition-opacity hover:opacity-90"
          onClick={() => helpCenterQuery.refetch()}
          type="button"
        >
          Refresh Catalog
        </button>
      }
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search help articles, tags, body copy, or categories..."
      searchTerm={searchTerm}
      subtitle="Manage the reader-facing help center, publish new support articles, and remove outdated guidance before it confuses users."
      title="Help Center"
    >
      {helpCenterQuery.error ? (
        <section className="rounded-[28px] border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
          {helpCenterQuery.error.message ||
            "The help center catalog could not be loaded. You can retry with Refresh Catalog."}
        </section>
      ) : null}

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                New Article
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">
                Publish support guidance
              </h2>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-primary">
              {articles.length} total
            </span>
          </div>

          {categories.length ? (
            <form className="mt-6 space-y-4" onSubmit={handleArticleSubmit}>
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                    Title
                  </span>
                  <input
                    className="w-full rounded-2xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                    onChange={(event) =>
                      setArticleForm((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder="How to update your payment method"
                    required
                    type="text"
                    value={articleForm.title}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                    Category
                  </span>
                  <select
                    className="w-full rounded-2xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                    onChange={(event) =>
                      setArticleForm((current) => ({
                        ...current,
                        categoryId: event.target.value,
                      }))
                    }
                    required
                    value={articleForm.categoryId}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px]">
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                    Tag
                  </span>
                  <input
                    className="w-full rounded-2xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                    onChange={(event) =>
                      setArticleForm((current) => ({
                        ...current,
                        tag: event.target.value,
                      }))
                    }
                    placeholder="Billing"
                    type="text"
                    value={articleForm.tag}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                    Sort Order
                  </span>
                  <input
                    className="w-full rounded-2xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                    min="0"
                    onChange={(event) =>
                      setArticleForm((current) => ({
                        ...current,
                        sortOrder: event.target.value,
                      }))
                    }
                    type="number"
                    value={articleForm.sortOrder}
                  />
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm font-semibold dark:bg-background-dark/50">
                  <input
                    checked={articleForm.published}
                    className="size-4 rounded border-primary/20 text-primary focus:ring-primary/30"
                    onChange={(event) =>
                      setArticleForm((current) => ({
                        ...current,
                        published: event.target.checked,
                      }))
                    }
                    type="checkbox"
                  />
                  Publish immediately
                </label>
              </div>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  Excerpt
                </span>
                <textarea
                  className="min-h-[88px] w-full rounded-3xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                  onChange={(event) =>
                    setArticleForm((current) => ({
                      ...current,
                      excerpt: event.target.value,
                    }))
                  }
                  placeholder="Summarize the issue this article solves."
                  required
                  value={articleForm.excerpt}
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  Article Body
                </span>
                <textarea
                  className="min-h-[220px] w-full rounded-3xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm leading-7 outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                  onChange={(event) =>
                    setArticleForm((current) => ({
                      ...current,
                      body: event.target.value,
                    }))
                  }
                  placeholder="Write the full help article. Paragraph breaks are preserved on the account/help page."
                  value={articleForm.body}
                />
              </label>

              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Articles appear on the reader help page as soon as they are published.
                </p>
                <button
                  className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-background-dark transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={createArticleMutation.isPending}
                  type="submit"
                >
                  {createArticleMutation.isPending ? "Publishing..." : "Create Article"}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 rounded-[28px] border border-dashed border-primary/20 bg-primary/5 p-6 text-sm text-slate-500 dark:text-slate-400">
              Create at least one category before adding articles. The article form unlocks as soon as a category exists.
            </div>
          )}
        </Reveal>

        <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
            Categories
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight">
            Organize the catalog
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
            Categories power the filter cards on the account/help page. Use Material Symbols icon names so the reader UI stays consistent.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleCategorySubmit}>
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Title
              </span>
              <input
                className="w-full rounded-2xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                onChange={(event) =>
                  setCategoryForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Account & Billing"
                required
                type="text"
                value={categoryForm.title}
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Description
              </span>
              <textarea
                className="min-h-[110px] w-full rounded-3xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                onChange={(event) =>
                  setCategoryForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Manage subscriptions, invoices, payment methods, and access issues."
                required
                value={categoryForm.description}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  Icon
                </span>
                <input
                  className="w-full rounded-2xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                  onChange={(event) =>
                    setCategoryForm((current) => ({
                      ...current,
                      icon: event.target.value,
                    }))
                  }
                  placeholder="payments"
                  required
                  type="text"
                  value={categoryForm.icon}
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  Sort Order
                </span>
                <input
                  className="w-full rounded-2xl border border-primary/10 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                  min="0"
                  onChange={(event) =>
                    setCategoryForm((current) => ({
                      ...current,
                      sortOrder: event.target.value,
                    }))
                  }
                  type="number"
                  value={categoryForm.sortOrder}
                />
              </label>
            </div>

            <button
              className="w-full rounded-full bg-primary px-5 py-3 text-sm font-bold text-background-dark transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={createCategoryMutation.isPending}
              type="submit"
            >
              {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
            </button>
          </form>
        </Reveal>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Reveal className="rounded-[28px] border border-primary/10 bg-white p-5 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Categories
          </p>
          <p className="mt-3 text-3xl font-black">{categories.length}</p>
        </Reveal>
        <Reveal
          className="rounded-[28px] border border-primary/10 bg-white p-5 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5"
          delay={0.04}
        >
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Published Articles
          </p>
          <p className="mt-3 text-3xl font-black">
            {articles.filter((article) => article.published).length}
          </p>
        </Reveal>
        <Reveal
          className="rounded-[28px] border border-primary/10 bg-white p-5 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5"
          delay={0.08}
        >
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Draft Articles
          </p>
          <p className="mt-3 text-3xl font-black">
            {articles.filter((article) => !article.published).length}
          </p>
        </Reveal>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                Category Directory
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">
                Reader filters
              </h2>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-primary">
              {visibleCategories.length} shown
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {visibleCategories.length ? (
              visibleCategories.map((category) => (
                <div
                  className="rounded-3xl border border-primary/10 bg-slate-50 p-4 dark:bg-background-dark/50"
                  key={category.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <span className="material-symbols-outlined">
                          {category.icon}
                        </span>
                      </div>
                      <div>
                        <p className="font-black">{category.title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-primary dark:bg-primary/10">
                      {category.articleCount} articles
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[28px] border border-dashed border-primary/20 bg-primary/5 p-5 text-sm text-slate-500 dark:text-slate-400">
                No categories matched your current search.
              </div>
            )}
          </div>
        </Reveal>

        <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                Article Inventory
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">
                Live and draft content
              </h2>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-primary">
              {visibleArticles.length} shown
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {visibleArticles.length ? (
              visibleArticles.map((article) => (
                <article
                  className="rounded-[28px] border border-primary/10 bg-slate-50 p-5 dark:bg-background-dark/50"
                  key={article.id}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${articleStatusClasses(article.published)}`}
                        >
                          {article.published ? "Published" : "Draft"}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 dark:bg-primary/10 dark:text-slate-300">
                          {categoryTitlesById.get(article.categoryId) || "Uncategorized"}
                        </span>
                        {article.tag ? (
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-primary">
                            {article.tag}
                          </span>
                        ) : null}
                      </div>
                      <h3 className="mt-4 text-xl font-black tracking-tight">
                        {article.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                        {article.excerpt}
                      </p>
                      <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
                        {formatBodyPreview(article.body)}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-stretch gap-3 lg:w-44">
                      <div className="rounded-2xl border border-primary/10 bg-white px-4 py-3 text-sm dark:bg-primary/10">
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                          Sort Order
                        </p>
                        <p className="mt-2 font-black">{article.sortOrder}</p>
                      </div>
                      <button
                        className="rounded-full border border-rose-200 px-4 py-3 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-500/30 dark:text-rose-300 dark:hover:bg-rose-500/10"
                        disabled={deleteArticleMutation.isPending}
                        onClick={() => handleArticleDelete(article)}
                        type="button"
                      >
                        Delete Article
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[28px] border border-dashed border-primary/20 bg-primary/5 p-5 text-sm text-slate-500 dark:text-slate-400">
                No articles matched your current search.
              </div>
            )}
          </div>
        </Reveal>
      </section>
    </AdminPageLayout>
  );
}
