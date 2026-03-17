import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDeferredValue, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchAdminComments,
  fetchAdminReviews,
  updateAdminComment,
  updateAdminReview,
} from "../admin/adminApi";
import AdminPageLayout from "../components/AdminPageLayout";
import Reveal from "../components/Reveal";
import SkeletonBlock from "../components/SkeletonBlock";
import {
  approveCreatorApplication,
  listAdminCreatorApplications,
  rejectCreatorApplication,
} from "../creator/creatorApi";
import { useAdmin } from "../context/AdminContext";

const moderationFilters = ["All", "Applications", "Flagged", "Resolved"];
const creatorApplicationsQueryKey = ["admin", "creator-applications"];
const adminCommentsQueryKey = ["admin", "comments"];
const adminReviewsQueryKey = ["admin", "reviews"];
const ADMIN_LIST_PAGE_SIZE = 200;
const emptyPageInfo = {
  hasMore: false,
  limit: ADMIN_LIST_PAGE_SIZE,
  nextOffset: null,
  offset: 0,
};

function toneClasses(tone) {
  if (tone === "rose") {
    return "bg-rose-500/15 text-rose-600 dark:text-rose-300";
  }

  if (tone === "amber") {
    return "bg-amber-500/15 text-amber-600 dark:text-amber-300";
  }

  return "bg-primary/15 text-primary";
}

function matchesFilter(item, filter) {
  if (filter === "All") {
    return true;
  }

  if (filter === "Applications") {
    return item.type.includes("Application");
  }

  if (filter === "Flagged") {
    return !item.type.includes("Application") && item.status === "Pending";
  }

  return item.status !== "Pending";
}

function applicationStatusClasses(status) {
  if (status === "APPROVED") {
    return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300";
  }

  if (status === "REJECTED") {
    return "bg-rose-500/15 text-rose-600 dark:text-rose-300";
  }

  if (status === "DRAFT") {
    return "bg-amber-500/15 text-amber-600 dark:text-amber-300";
  }

  return "bg-primary/15 text-primary";
}

function formatApplicationDate(value) {
  if (!value) {
    return "Draft not submitted";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function commentStatusClasses(status) {
  if (status === "Deleted") {
    return "bg-rose-500/15 text-rose-600 dark:text-rose-300";
  }

  if (status === "Hidden") {
    return "bg-amber-500/15 text-amber-600 dark:text-amber-300";
  }

  return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300";
}

function reviewStatusClasses(status) {
  if (status === "Deleted") {
    return "bg-rose-500/15 text-rose-600 dark:text-rose-300";
  }

  if (status === "Hidden") {
    return "bg-amber-500/15 text-amber-600 dark:text-amber-300";
  }

  return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300";
}

export default function AdminContentModerationPage() {
  const queryClient = useQueryClient();
  const {
    isLoadingMoreReports,
    loadMoreReports,
    reports,
    reportsPageInfo,
    resolveModerationItem,
    showAdminNotice,
  } = useAdmin();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(reports[0]?.id ?? null);
  const deferredSearch = useDeferredValue(searchTerm);
  const [adminComments, setAdminComments] = useState([]);
  const [adminReviews, setAdminReviews] = useState([]);
  const [commentsPageInfo, setCommentsPageInfo] = useState(emptyPageInfo);
  const [reviewsPageInfo, setReviewsPageInfo] = useState(emptyPageInfo);
  const [isLoadingMoreComments, setIsLoadingMoreComments] = useState(false);
  const [isLoadingMoreReviews, setIsLoadingMoreReviews] = useState(false);
  const creatorApplicationsQuery = useQuery({
    queryKey: creatorApplicationsQueryKey,
    queryFn: () => listAdminCreatorApplications(),
    retry: false,
    staleTime: 30_000,
  });
  const adminCommentsQuery = useQuery({
    queryKey: adminCommentsQueryKey,
    queryFn: () =>
      fetchAdminComments({
        limit: ADMIN_LIST_PAGE_SIZE,
        offset: 0,
      }),
    retry: false,
    staleTime: 15_000,
  });
  const adminReviewsQuery = useQuery({
    queryKey: adminReviewsQueryKey,
    queryFn: () =>
      fetchAdminReviews({
        limit: ADMIN_LIST_PAGE_SIZE,
        offset: 0,
      }),
    retry: false,
    staleTime: 15_000,
  });
  const approveApplicationMutation = useMutation({
    mutationFn: (applicationId) => approveCreatorApplication(applicationId),
    onError: (error) => {
      showAdminNotice(
        error.message || "Could not approve the creator application.",
        "info",
      );
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: creatorApplicationsQueryKey,
      });
      showAdminNotice(
        response.message ||
          `${response.application.fullName} is now approved for creator access.`,
      );
    },
  });
  const rejectApplicationMutation = useMutation({
    mutationFn: (applicationId) => rejectCreatorApplication(applicationId),
    onError: (error) => {
      showAdminNotice(
        error.message || "Could not reject the creator application.",
        "info",
      );
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: creatorApplicationsQueryKey,
      });
      showAdminNotice(
        response.message || `${response.application.fullName} was rejected.`,
        "info",
      );
    },
  });
  const moderateCommentMutation = useMutation({
    mutationFn: ({ action, commentId }) =>
      updateAdminComment(commentId, {
        action,
        notes: null,
      }),
    onError: (error) => {
      showAdminNotice(
        error.message || "Could not update that comment.",
        "info",
      );
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: adminCommentsQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "activity"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reader", "chapter"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reader", "chapter-comments"],
      });
      showAdminNotice(response.message || "Comment updated.");
    },
  });
  const moderateReviewMutation = useMutation({
    mutationFn: ({ action, reviewId }) =>
      updateAdminReview(reviewId, {
        action,
        notes: null,
      }),
    onError: (error) => {
      showAdminNotice(
        error.message || "Could not update that review.",
        "info",
      );
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: adminReviewsQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ["reader", "story"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reader", "story-reviews"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "activity"],
      });
      showAdminNotice(response.message || "Review updated.");
    },
  });
  const creatorApplications = creatorApplicationsQuery.data?.applications ?? [];
  const adminCommentSummary = useMemo(
    () =>
      adminComments.reduce(
        (summary, comment) => {
          if (comment.status === "Deleted") {
            summary.deletedCount += 1;
          } else if (comment.status === "Hidden") {
            summary.hiddenCount += 1;
          } else if (comment.status === "Visible") {
            summary.visibleCount += 1;
          }

          if (comment.isReply) {
            summary.replyCount += 1;
          }

          return summary;
        },
        { deletedCount: 0, hiddenCount: 0, replyCount: 0, visibleCount: 0 },
      ),
    [adminComments],
  );
  const adminReviewSummary = useMemo(
    () =>
      adminReviews.reduce(
        (summary, review) => {
          if (review.status === "Deleted") {
            summary.deletedCount += 1;
          } else if (review.status === "Hidden") {
            summary.hiddenCount += 1;
          } else if (review.status === "Visible") {
            summary.visibleCount += 1;
          }

          if (review.containsSpoilers) {
            summary.spoilerCount += 1;
          }

          return summary;
        },
        { deletedCount: 0, hiddenCount: 0, spoilerCount: 0, visibleCount: 0 },
      ),
    [adminReviews],
  );
  const hasMoreComments = commentsPageInfo?.hasMore;
  const hasMoreReviews = reviewsPageInfo?.hasMore;
  const creatorApplicationCounts = {
    approved: creatorApplications.filter((application) => application.status === "APPROVED")
      .length,
    pending: creatorApplications.filter((application) => application.status === "SUBMITTED")
      .length,
    rejected: creatorApplications.filter((application) => application.status === "REJECTED")
      .length,
  };

  const filteredReports = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    return reports.filter((item) => {
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query) ||
        item.detail.toLowerCase().includes(query);

      return matchesFilter(item, activeFilter) && matchesQuery;
    });
  }, [activeFilter, deferredSearch, reports]);
  const filteredComments = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    return adminComments.filter((comment) => {
      if (!query) {
        return true;
      }

      return [
        comment.authorName,
        comment.body,
        comment.chapterTitle,
        comment.storyTitle,
        comment.status,
        comment.parentComment?.authorName ?? "",
        comment.parentComment?.bodyPreview ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [adminComments, deferredSearch]);
  const filteredStoryReviews = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    return adminReviews.filter((review) => {
      if (!query) {
        return true;
      }

      return [
        review.authorName,
        review.body,
        review.storyTitle,
        review.status,
        review.title ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [adminReviews, deferredSearch]);
  const moderationStats = [
    {
      id: "pending",
      icon: "priority_high",
      label: "Pending Reports",
      tone: "rose",
      value: reports.filter((item) => item.status === "Pending").length.toString(),
    },
    {
      id: "applications",
      icon: "description",
      label: "Creator Reviews",
      tone: "primary",
      value: creatorApplicationCounts.pending.toString(),
    },
    {
      id: "dmca",
      icon: "copyright",
      label: "Copyright Cases",
      tone: "amber",
      value: reports
        .filter((item) => item.detail.toLowerCase().includes("copyright"))
        .length.toString(),
    },
    {
      id: "hidden-comments",
      icon: "forum",
      label: "Hidden Comments",
      tone: "amber",
      value: adminCommentSummary.hiddenCount.toString(),
    },
    {
      id: "hidden-reviews",
      icon: "rate_review",
      label: "Hidden Reviews",
      tone: "amber",
      value: adminReviewSummary.hiddenCount.toString(),
    },
  ];

  useEffect(() => {
    if (!filteredReports.length) {
      setSelectedId(null);
      return;
    }

    if (!selectedId || !filteredReports.some((item) => item.id === selectedId)) {
      setSelectedId(filteredReports[0].id);
    }
  }, [filteredReports, selectedId]);

  useEffect(() => {
    if (!adminCommentsQuery.data) {
      return;
    }

    setAdminComments(adminCommentsQuery.data.comments ?? []);
    setCommentsPageInfo(adminCommentsQuery.data.pageInfo ?? emptyPageInfo);
  }, [adminCommentsQuery.data]);

  useEffect(() => {
    if (!adminReviewsQuery.data) {
      return;
    }

    setAdminReviews(adminReviewsQuery.data.reviews ?? []);
    setReviewsPageInfo(adminReviewsQuery.data.pageInfo ?? emptyPageInfo);
  }, [adminReviewsQuery.data]);

  async function loadMoreComments() {
    if (
      isLoadingMoreComments ||
      adminCommentsQuery.isPending ||
      !commentsPageInfo.hasMore
    ) {
      return;
    }

    setIsLoadingMoreComments(true);

    try {
      const response = await fetchAdminComments({
        limit: ADMIN_LIST_PAGE_SIZE,
        offset: commentsPageInfo.nextOffset ?? 0,
      });
      setAdminComments((current) => [...current, ...(response?.comments ?? [])]);
      setCommentsPageInfo(response?.pageInfo ?? emptyPageInfo);
    } finally {
      setIsLoadingMoreComments(false);
    }
  }

  async function loadMoreReviews() {
    if (
      isLoadingMoreReviews ||
      adminReviewsQuery.isPending ||
      !reviewsPageInfo.hasMore
    ) {
      return;
    }

    setIsLoadingMoreReviews(true);

    try {
      const response = await fetchAdminReviews({
        limit: ADMIN_LIST_PAGE_SIZE,
        offset: reviewsPageInfo.nextOffset ?? 0,
      });
      setAdminReviews((current) => [...current, ...(response?.reviews ?? [])]);
      setReviewsPageInfo(response?.pageInfo ?? emptyPageInfo);
    } finally {
      setIsLoadingMoreReviews(false);
    }
  }

  const selectedReport =
    filteredReports.find((item) => item.id === selectedId) ?? filteredReports[0] ?? reports[0];

  return (
    <AdminPageLayout
      headerActions={
        <button
          className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-background-dark transition-opacity hover:opacity-90"
          onClick={() => showAdminNotice("Bulk review mode opened for the moderation queue.")}
          type="button"
        >
          Bulk Review
        </button>
      }
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search reports, creators, policies, or flagged stories..."
      searchTerm={searchTerm}
      subtitle="Resolve safety reports, creator applications, and live content issues before they affect reader trust."
      title="Content Moderation"
    >
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {moderationStats.map((stat, index) => (
          <Reveal
            className="rounded-3xl border border-primary/10 bg-white p-5 dark:bg-primary/5"
            delay={index * 0.04}
            key={stat.id}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-3 text-3xl font-black tracking-tight">{stat.value}</p>
              </div>
              <div className={`flex size-12 items-center justify-center rounded-2xl ${toneClasses(stat.tone)}`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
              Creator Reviews
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">
              Real creator application queue
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              These applications are now coming from the backend. Approving one grants
              the applicant the `CREATOR` role immediately.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-3xl border border-primary/10 bg-slate-50 px-4 py-3 text-center dark:bg-background-dark/40">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                Pending
              </p>
              <p className="mt-2 text-2xl font-black">
                {creatorApplicationCounts.pending}
              </p>
            </div>
            <div className="rounded-3xl border border-primary/10 bg-slate-50 px-4 py-3 text-center dark:bg-background-dark/40">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                Approved
              </p>
              <p className="mt-2 text-2xl font-black">
                {creatorApplicationCounts.approved}
              </p>
            </div>
            <div className="rounded-3xl border border-primary/10 bg-slate-50 px-4 py-3 text-center dark:bg-background-dark/40">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                Rejected
              </p>
              <p className="mt-2 text-2xl font-black">
                {creatorApplicationCounts.rejected}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {creatorApplicationsQuery.isPending ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                className="rounded-3xl border border-primary/10 bg-slate-50 p-5 dark:bg-background-dark/50"
                key={index}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <SkeletonBlock className="h-5 w-44" />
                    <SkeletonBlock className="h-3 w-28" />
                  </div>
                  <SkeletonBlock className="h-8 w-24 rounded-full" />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <SkeletonBlock className="h-20 w-full rounded-2xl" />
                  <SkeletonBlock className="h-20 w-full rounded-2xl" />
                  <SkeletonBlock className="h-20 w-full rounded-2xl" />
                </div>
                <div className="mt-5 flex gap-3">
                  <SkeletonBlock className="h-10 w-28 rounded-xl bg-primary/20 dark:bg-primary/15" />
                  <SkeletonBlock className="h-10 w-28 rounded-xl" />
                </div>
              </div>
            ))
          ) : creatorApplicationsQuery.isError ? (
            <div className="rounded-3xl border border-dashed border-rose-500/20 bg-rose-500/10 px-5 py-8 text-sm text-rose-600 dark:text-rose-300">
              {creatorApplicationsQuery.error.message ||
                "Creator applications could not be loaded."}
            </div>
          ) : creatorApplications.length ? (
            creatorApplications.map((application) => {
              const reviewLocked = application.status === "APPROVED";

              return (
                <div
                  className="rounded-3xl border border-primary/10 bg-slate-50 p-5 dark:bg-background-dark/50"
                  key={application.id}
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-lg font-black">
                          {application.fullName}
                        </p>
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${applicationStatusClasses(application.status)}`}
                        >
                          {application.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {application.email}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        <span>{application.primaryGenre || "No genre yet"}</span>
                        <span>{application.experience || "No experience selected"}</span>
                        <span>
                          {application.wantsContract
                            ? application.requestedContractType === "NON_EXCLUSIVE"
                              ? "Contract: Non-Exclusive"
                              : "Contract: Exclusive"
                            : "No contract request"}
                        </span>
                        <span>{formatApplicationDate(application.submittedAt)}</span>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {application.motivation || "No creator motivation has been provided yet."}
                      </p>
                      {application.reviewNotes ? (
                        <div className="mt-4 rounded-2xl border border-primary/10 bg-white px-4 py-3 text-sm text-slate-600 dark:bg-background-dark/50 dark:text-slate-300">
                          <span className="font-black text-primary">Review note:</span>{" "}
                          {application.reviewNotes}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-3 lg:w-48">
                      <button
                        className="rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-background-dark disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={
                          reviewLocked ||
                          approveApplicationMutation.isPending ||
                          rejectApplicationMutation.isPending
                        }
                        onClick={() =>
                          approveApplicationMutation.mutate(application.id)
                        }
                        type="button"
                      >
                        Approve Creator
                      </button>
                      <button
                        className="rounded-2xl border border-primary/20 px-4 py-3 text-sm font-bold text-primary disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={
                          application.status === "REJECTED" ||
                          reviewLocked ||
                          approveApplicationMutation.isPending ||
                          rejectApplicationMutation.isPending
                        }
                        onClick={() =>
                          rejectApplicationMutation.mutate(application.id)
                        }
                        type="button"
                      >
                        Reject Application
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-3xl border border-dashed border-primary/20 bg-slate-50 px-5 py-8 text-sm text-slate-500 dark:bg-background-dark/50 dark:text-slate-400">
              No creator applications have been submitted yet.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
              Chapter Comment Moderation
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">
              Real chapter discussion queue
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Review reader discussion directly from live chapter threads. You can
              hide, restore, or delete a comment without leaving the moderation
              console.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-3xl border border-primary/10 bg-slate-50 px-4 py-3 text-center dark:bg-background-dark/40">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                Visible
              </p>
              <p className="mt-2 text-2xl font-black">
                {adminCommentSummary.visibleCount}
              </p>
            </div>
            <div className="rounded-3xl border border-primary/10 bg-slate-50 px-4 py-3 text-center dark:bg-background-dark/40">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                Hidden
              </p>
              <p className="mt-2 text-2xl font-black">
                {adminCommentSummary.hiddenCount}
              </p>
            </div>
            <div className="rounded-3xl border border-primary/10 bg-slate-50 px-4 py-3 text-center dark:bg-background-dark/40">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                Deleted
              </p>
              <p className="mt-2 text-2xl font-black">
                {adminCommentSummary.deletedCount}
              </p>
            </div>
            <div className="rounded-3xl border border-primary/10 bg-slate-50 px-4 py-3 text-center dark:bg-background-dark/40">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                Replies
              </p>
              <p className="mt-2 text-2xl font-black">
                {adminCommentSummary.replyCount}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {adminCommentsQuery.isPending ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                className="rounded-3xl border border-primary/10 bg-slate-50 p-5 dark:bg-background-dark/50"
                key={index}
              >
                <SkeletonBlock className="h-5 w-52" />
                <SkeletonBlock className="mt-3 h-4 w-36" />
                <SkeletonBlock className="mt-4 h-16 w-full rounded-2xl" />
              </div>
            ))
          ) : adminCommentsQuery.isError ? (
            <div className="rounded-3xl border border-dashed border-rose-500/20 bg-rose-500/10 px-5 py-8 text-sm text-rose-600 dark:text-rose-300">
              {adminCommentsQuery.error.message ||
                "Chapter comments could not be loaded."}
            </div>
          ) : filteredComments.length ? (
            filteredComments.map((comment) => (
              <div
                className="rounded-3xl border border-primary/10 bg-slate-50 p-5 dark:bg-background-dark/50"
                key={comment.id}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-black">
                        {comment.authorName}
                      </p>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${commentStatusClasses(comment.status)}`}
                      >
                        {comment.status}
                      </span>
                      {comment.isReply ? (
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                          Reply
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {comment.storyTitle} • Chapter {comment.chapterNumber}:{" "}
                      {comment.chapterTitle} • {comment.createdAtLabel}
                    </p>

                    <div className="mt-4 rounded-2xl border border-primary/10 bg-white px-4 py-3 text-sm leading-6 text-slate-700 dark:bg-background-dark/50 dark:text-slate-200">
                      {comment.bodyPreview}
                    </div>

                    {comment.parentComment ? (
                      <div className="mt-4 rounded-2xl border border-primary/10 bg-white/70 px-4 py-3 text-sm text-slate-500 dark:bg-background-dark/40 dark:text-slate-300">
                        <span className="font-black text-primary">
                          Replying to {comment.parentComment.authorName}:
                        </span>{" "}
                        {comment.parentComment.bodyPreview}
                      </div>
                    ) : null}

                    {comment.moderationNotes ? (
                      <div className="mt-4 rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-black text-primary">
                          Moderation note:
                        </span>{" "}
                        {comment.moderationNotes}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-3 lg:w-56">
                    <Link
                      className="rounded-2xl border border-primary/20 px-4 py-3 text-center text-sm font-bold text-primary transition-colors hover:bg-primary/10"
                      to={comment.readHref}
                    >
                      Open Chapter
                    </Link>
                    {comment.status !== "Hidden" ? (
                      <button
                        className="rounded-2xl border border-amber-500/20 px-4 py-3 text-sm font-bold text-amber-600 disabled:cursor-not-allowed disabled:opacity-60 dark:text-amber-300"
                        disabled={moderateCommentMutation.isPending}
                        onClick={() =>
                          moderateCommentMutation.mutate({
                            action: "HIDE",
                            commentId: comment.id,
                          })
                        }
                        type="button"
                      >
                        Hide Comment
                      </button>
                    ) : null}
                    {comment.status !== "Visible" ? (
                      <button
                        className="rounded-2xl border border-emerald-500/20 px-4 py-3 text-sm font-bold text-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 dark:text-emerald-300"
                        disabled={moderateCommentMutation.isPending}
                        onClick={() =>
                          moderateCommentMutation.mutate({
                            action: "RESTORE",
                            commentId: comment.id,
                          })
                        }
                        type="button"
                      >
                        Restore Comment
                      </button>
                    ) : null}
                    {comment.status !== "Deleted" ? (
                      <button
                        className="rounded-2xl bg-rose-500 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={moderateCommentMutation.isPending}
                        onClick={() =>
                          moderateCommentMutation.mutate({
                            action: "DELETE",
                            commentId: comment.id,
                          })
                        }
                        type="button"
                      >
                        Delete Comment
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-primary/20 bg-slate-50 px-5 py-8 text-sm text-slate-500 dark:bg-background-dark/50 dark:text-slate-400">
              No chapter comments matched the current search.
            </div>
          )}
        </div>

        {hasMoreComments ? (
          <div className="mt-6 flex justify-end">
            <button
              className="rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoadingMoreComments}
              onClick={loadMoreComments}
              type="button"
            >
              {isLoadingMoreComments ? "Loading..." : "Load More Comments"}
            </button>
          </div>
        ) : null}
      </section>

      <section className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
              Story Review Moderation
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">
              Live written review queue
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Moderate published written reviews separately from quick star ratings.
              This queue is backed by the new review model used on the story page.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-3xl border border-primary/10 bg-slate-50 px-4 py-3 text-center dark:bg-background-dark/40">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                Visible
              </p>
              <p className="mt-2 text-2xl font-black">
                {adminReviewSummary.visibleCount}
              </p>
            </div>
            <div className="rounded-3xl border border-primary/10 bg-slate-50 px-4 py-3 text-center dark:bg-background-dark/40">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                Hidden
              </p>
              <p className="mt-2 text-2xl font-black">
                {adminReviewSummary.hiddenCount}
              </p>
            </div>
            <div className="rounded-3xl border border-primary/10 bg-slate-50 px-4 py-3 text-center dark:bg-background-dark/40">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                Deleted
              </p>
              <p className="mt-2 text-2xl font-black">
                {adminReviewSummary.deletedCount}
              </p>
            </div>
            <div className="rounded-3xl border border-primary/10 bg-slate-50 px-4 py-3 text-center dark:bg-background-dark/40">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                Spoilers
              </p>
              <p className="mt-2 text-2xl font-black">
                {adminReviewSummary.spoilerCount}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {adminReviewsQuery.isPending ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                className="rounded-3xl border border-primary/10 bg-slate-50 p-5 dark:bg-background-dark/50"
                key={index}
              >
                <SkeletonBlock className="h-5 w-52" />
                <SkeletonBlock className="mt-3 h-4 w-36" />
                <SkeletonBlock className="mt-4 h-20 w-full rounded-2xl" />
              </div>
            ))
          ) : adminReviewsQuery.isError ? (
            <div className="rounded-3xl border border-dashed border-rose-500/20 bg-rose-500/10 px-5 py-8 text-sm text-rose-600 dark:text-rose-300">
              {adminReviewsQuery.error.message ||
                "Story reviews could not be loaded."}
            </div>
          ) : filteredStoryReviews.length ? (
            filteredStoryReviews.map((review) => (
              <div
                className="rounded-3xl border border-primary/10 bg-slate-50 p-5 dark:bg-background-dark/50"
                key={review.id}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-black">
                        {review.authorName}
                      </p>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${reviewStatusClasses(review.status)}`}
                      >
                        {review.status}
                      </span>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                        {review.rating}/5
                      </span>
                      {review.containsSpoilers ? (
                        <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">
                          Spoilers
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {review.storyTitle} • {review.createdAtLabel}
                    </p>

                    {review.title ? (
                      <h3 className="mt-4 text-lg font-black text-primary">
                        {review.title}
                      </h3>
                    ) : null}

                    <div className="mt-4 rounded-2xl border border-primary/10 bg-white px-4 py-3 text-sm leading-6 text-slate-700 dark:bg-background-dark/50 dark:text-slate-200">
                      {review.bodyPreview}
                    </div>

                    {review.moderationNotes ? (
                      <div className="mt-4 rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                        <span className="font-black text-primary">
                          Moderation note:
                        </span>{" "}
                        {review.moderationNotes}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-3 lg:w-56">
                    <Link
                      className="rounded-2xl border border-primary/20 px-4 py-3 text-center text-sm font-bold text-primary transition-colors hover:bg-primary/10"
                      to={review.readHref}
                    >
                      Open Reviews
                    </Link>
                    {review.status !== "Hidden" ? (
                      <button
                        className="rounded-2xl border border-amber-500/20 px-4 py-3 text-sm font-bold text-amber-600 disabled:cursor-not-allowed disabled:opacity-60 dark:text-amber-300"
                        disabled={moderateReviewMutation.isPending}
                        onClick={() =>
                          moderateReviewMutation.mutate({
                            action: "HIDE",
                            reviewId: review.id,
                          })
                        }
                        type="button"
                      >
                        Hide Review
                      </button>
                    ) : null}
                    {review.status !== "Visible" ? (
                      <button
                        className="rounded-2xl border border-emerald-500/20 px-4 py-3 text-sm font-bold text-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 dark:text-emerald-300"
                        disabled={moderateReviewMutation.isPending}
                        onClick={() =>
                          moderateReviewMutation.mutate({
                            action: "RESTORE",
                            reviewId: review.id,
                          })
                        }
                        type="button"
                      >
                        Restore Review
                      </button>
                    ) : null}
                    {review.status !== "Deleted" ? (
                      <button
                        className="rounded-2xl bg-rose-500 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={moderateReviewMutation.isPending}
                        onClick={() =>
                          moderateReviewMutation.mutate({
                            action: "DELETE",
                            reviewId: review.id,
                          })
                        }
                        type="button"
                      >
                        Delete Review
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-primary/20 bg-slate-50 px-5 py-8 text-sm text-slate-500 dark:bg-background-dark/50 dark:text-slate-400">
              No story reviews matched the current search.
            </div>
          )}
        </div>

        {hasMoreReviews ? (
          <div className="mt-6 flex justify-end">
            <button
              className="rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoadingMoreReviews}
              onClick={loadMoreReviews}
              type="button"
            >
              {isLoadingMoreReviews ? "Loading..." : "Load More Reviews"}
            </button>
          </div>
        ) : null}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Reveal className="rounded-[28px] border border-primary/10 bg-white p-5 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
          <div className="flex flex-wrap gap-2">
            {moderationFilters.map((filter) => (
              <button
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  activeFilter === filter
                    ? "bg-primary text-background-dark"
                    : "bg-slate-100 text-slate-500 hover:bg-primary/10 hover:text-primary dark:bg-background-dark/60 dark:text-slate-300"
                }`}
                key={filter}
                onClick={() => setActiveFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            {filteredReports.length ? (
              filteredReports.map((item) => (
              <div
                className={`w-full rounded-3xl border p-5 text-left transition-colors ${
                  selectedReport?.id === item.id
                    ? "border-primary/40 bg-primary/10"
                    : "border-primary/10 bg-slate-50 hover:border-primary/30 hover:bg-primary/5 dark:bg-background-dark/50"
                }`}
                key={item.id}
                onClick={() => setSelectedId(item.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                      {item.type}
                    </p>
                    <h2 className="mt-2 text-lg font-black">{item.title}</h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {item.subtitle}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${
                    item.status === "Pending"
                      ? "bg-rose-500/15 text-rose-500"
                      : "bg-emerald-500/15 text-emerald-500"
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.detail}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-background-dark"
                    onClick={(event) => {
                      event.stopPropagation();
                      resolveModerationItem(item.id, item.primaryAction);
                    }}
                    type="button"
                  >
                    {item.primaryAction}
                  </button>
                  <button
                    className="rounded-full border border-primary/20 px-4 py-2 text-xs font-bold text-primary"
                    onClick={(event) => {
                      event.stopPropagation();
                      showAdminNotice(`${item.secondaryAction} opened for ${item.title}.`, "info");
                    }}
                    type="button"
                  >
                    {item.secondaryAction}
                  </button>
                </div>
              </div>
            ))
            ) : (
              <div className="rounded-3xl border border-dashed border-primary/20 bg-slate-50 px-5 py-8 text-sm text-slate-500 dark:bg-background-dark/50 dark:text-slate-400">
                No moderation items matched the current search and filter.
              </div>
            )}
          </div>

          {reportsPageInfo?.hasMore ? (
            <div className="mt-6 flex justify-end">
              <button
                className="rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isLoadingMoreReports}
                onClick={loadMoreReports}
                type="button"
              >
                {isLoadingMoreReports ? "Loading..." : "Load More Reports"}
              </button>
            </div>
          ) : null}
        </Reveal>

        <Reveal className="rounded-[28px] border border-primary/10 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(13,15,22,0.35)] dark:bg-primary/5">
          {selectedReport && filteredReports.length ? (
            <>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                Review Details
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight">
                {selectedReport.title}
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {selectedReport.subtitle}
              </p>

              <div className="mt-6 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#18130f] via-[#24180e] to-[#100d09] p-6 text-white">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-primary">
                    {selectedReport.type}
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    Status: {selectedReport.status}
                  </span>
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-200">
                  {selectedReport.detail}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="font-black text-white">High priority</p>
                    <p className="mt-1 text-slate-300">
                      Reader trust is directly affected if this waits.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="font-black text-white">Creator follow-up</p>
                    <p className="mt-1 text-slate-300">
                      Messaging and status updates should happen after review.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  className="rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-background-dark"
                  onClick={() =>
                    resolveModerationItem(
                      selectedReport.id,
                      selectedReport.primaryAction,
                    )
                  }
                  type="button"
                >
                  {selectedReport.primaryAction}
                </button>
                <button
                  className="rounded-2xl border border-primary/20 px-4 py-3 text-sm font-bold text-primary"
                  onClick={() =>
                    showAdminNotice(
                      `${selectedReport.secondaryAction} started for ${selectedReport.title}.`,
                      "info",
                    )
                  }
                  type="button"
                >
                  {selectedReport.secondaryAction}
                </button>
              </div>
            </>
          ) : null}
        </Reveal>
      </section>
    </AdminPageLayout>
  );
}
