import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  useChapterCommentsQuery,
  useCreateChapterCommentMutation,
  useDeleteChapterCommentMutation,
  useUpdateChapterCommentMutation,
} from "../reader/readerHooks";
import UserAvatar from "./UserAvatar";

function getThemeClasses(theme) {
  return (
    theme ?? {
      article: "text-slate-200",
      muted: "text-slate-400",
      panel: "border-primary/20 bg-slate-800 text-slate-100",
      panelSecondary: "border-primary/20 bg-slate-800 text-slate-100",
    }
  );
}

function formatCount(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function Composer({
  borderClass,
  compact = false,
  isPending,
  onChange,
  onSubmit,
  placeholder,
  submitLabel,
  themeClasses,
  value,
}) {
  return (
    <div className={`rounded-2xl border ${borderClass} ${themeClasses.panel}`}>
      <div className={compact ? "p-3" : "p-4"}>
        <textarea
          className={`w-full resize-none bg-transparent outline-none placeholder:text-slate-500 ${themeClasses.article} ${
            compact ? "min-h-[78px] text-sm" : "min-h-[112px] text-base"
          }`}
          disabled={isPending}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          value={value}
        />
        <div className={`mt-3 flex items-center justify-between border-t pt-3 ${borderClass}`}>
          <p className={`text-xs ${themeClasses.muted}`}>
            Keep it constructive. Replies stay attached to this chapter.
          </p>
          <button
            className="rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wide text-background-dark transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!value.trim() || isPending}
            onClick={onSubmit}
            type="button"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function CommentItem({
  borderClass,
  comment,
  compact = false,
  deleteMutation,
  editDrafts,
  editingCommentId,
  isDeleting,
  onDelete,
  onEditDraftChange,
  onReplyDraftChange,
  onStartEdit,
  onStopEdit,
  onToggleReply,
  onUpdate,
  onReply,
  replyingToId,
  replyDrafts,
  themeClasses,
}) {
  const canReply = !comment.isRemoved && !comment.isReply;
  const bodyClass = compact ? "text-sm leading-6" : "text-[15px] leading-7";
  const editDraft = editDrafts[comment.id] ?? "";
  const isEditing = editingCommentId === comment.id;
  const isReplying = replyingToId === comment.id;
  const replyDraft = replyDrafts[comment.id] ?? "";

  return (
    <article className={`rounded-2xl border ${borderClass} ${themeClasses.panel}`}>
      <div className={compact ? "p-3" : "p-4"}>
        <div className="flex items-start gap-3">
          <UserAvatar
            className={compact ? "size-9 rounded-full" : "size-10 rounded-full"}
            name={comment.author.displayName}
            src={comment.author.avatarUrl}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className={`font-bold ${themeClasses.article}`}>
                {comment.author.displayName}
              </p>
              <span className={`text-xs ${themeClasses.muted}`}>
                {comment.createdAtLabel}
              </span>
              {comment.editedLabel ? (
                <span className={`text-[11px] uppercase tracking-wide ${themeClasses.muted}`}>
                  {comment.editedLabel}
                </span>
              ) : null}
              {comment.isRemoved ? (
                <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-rose-400">
                  Removed
                </span>
              ) : null}
            </div>

            {isEditing ? (
              <div className="mt-3">
                <textarea
                  className={`min-h-[88px] w-full rounded-xl border bg-transparent p-3 outline-none ${borderClass} ${themeClasses.article}`}
                  onChange={(event) => onEditDraftChange(comment.id, event.target.value)}
                  value={editDraft}
                />
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide ${borderClass} ${themeClasses.muted}`}
                    onClick={() => onStopEdit()}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wide text-background-dark transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!editDraft.trim()}
                    onClick={() => onUpdate(comment)}
                    type="button"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p
                className={`mt-3 ${bodyClass} ${
                  comment.isRemoved ? `italic ${themeClasses.muted}` : themeClasses.article
                }`}
              >
                {comment.body}
              </p>
            )}

            <div className={`mt-4 flex flex-wrap items-center gap-4 text-xs ${themeClasses.muted}`}>
              {canReply ? (
                <button
                  className="font-bold uppercase tracking-wide transition-colors hover:text-primary"
                  onClick={() => onToggleReply(comment.id)}
                  type="button"
                >
                  {isReplying ? "Close Reply" : "Reply"}
                </button>
              ) : null}
              {comment.canEdit && !comment.isRemoved ? (
                <button
                  className="font-bold uppercase tracking-wide transition-colors hover:text-primary"
                  onClick={() => onStartEdit(comment)}
                  type="button"
                >
                  Edit
                </button>
              ) : null}
              {comment.canDelete && !comment.isRemoved ? (
                <button
                  className="font-bold uppercase tracking-wide text-rose-400 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isDeleting}
                  onClick={() => onDelete(comment)}
                  type="button"
                >
                  Delete
                </button>
              ) : null}
              {comment.replyCount ? (
                <span>{comment.replyCount} repl{comment.replyCount === 1 ? "y" : "ies"}</span>
              ) : null}
            </div>

            {isReplying ? (
              <div className={`mt-4 rounded-2xl border p-3 ${borderClass} ${themeClasses.panelSecondary}`}>
                <textarea
                  className={`min-h-[72px] w-full resize-none bg-transparent text-sm outline-none placeholder:text-slate-500 ${themeClasses.article}`}
                  onChange={(event) => onReplyDraftChange(comment.id, event.target.value)}
                  placeholder={`Reply to ${comment.author.displayName}`}
                  value={replyDraft}
                />
                <div className="mt-3 flex justify-end">
                  <button
                    className="rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wide text-background-dark transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!replyDraft.trim()}
                    onClick={() => onReply(comment)}
                    type="button"
                  >
                    Post Reply
                  </button>
                </div>
              </div>
            ) : null}

            {comment.replies.length ? (
              <div className={`mt-5 space-y-3 border-l pl-4 ${borderClass}`}>
                {comment.replies.map((reply) => (
                  <CommentItem
                    borderClass={borderClass}
                    comment={reply}
                    compact
                    deleteMutation={deleteMutation}
                    editDrafts={editDrafts}
                    editingCommentId={editingCommentId}
                    isDeleting={deleteMutation.isPending}
                    key={reply.id}
                    onDelete={onDelete}
                    onEditDraftChange={onEditDraftChange}
                    onReplyDraftChange={onReplyDraftChange}
                    onReply={onReply}
                    onStartEdit={onStartEdit}
                    onStopEdit={onStopEdit}
                    onToggleReply={onToggleReply}
                    onUpdate={onUpdate}
                    replyingToId={replyingToId}
                    replyDrafts={replyDrafts}
                    themeClasses={themeClasses}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export function ChapterCommentsSection({ compact = false, story, chapter, theme }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const themeClasses = getThemeClasses(theme);
  const borderClass = compact ? "border-primary/15" : "border-primary/10";
  const [sortBy, setSortBy] = useState("top");
  const [draft, setDraft] = useState("");
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editDrafts, setEditDrafts] = useState({});
  const commentsQuery = useChapterCommentsQuery(story.slug, chapter.chapterSlug, sortBy);
  const createCommentMutation = useCreateChapterCommentMutation();
  const updateCommentMutation = useUpdateChapterCommentMutation();
  const deleteCommentMutation = useDeleteChapterCommentMutation();
  const comments = commentsQuery.data?.comments ?? [];
  const commentCount = commentsQuery.data?.summary?.totalCount ?? chapter.commentCount ?? 0;
  const mutationPending =
    createCommentMutation.isPending ||
    updateCommentMutation.isPending ||
    deleteCommentMutation.isPending;

  async function handleCreateComment(parentCommentId = null) {
    const body = parentCommentId ? replyDrafts[parentCommentId]?.trim() : draft.trim();

    if (!body) {
      return;
    }

    try {
      const response = await createCommentMutation.mutateAsync({
        chapterSlug: chapter.chapterSlug,
        input: {
          body,
          parentCommentId,
        },
        storySlug: story.slug,
      });

      if (parentCommentId) {
        setReplyDrafts((current) => ({
          ...current,
          [parentCommentId]: "",
        }));
        setReplyingToId(null);
      } else {
        setDraft("");
      }

      showToast(response.message || "Comment posted.");
    } catch (error) {
      showToast(error?.message || "Could not post the comment.", {
        title: "Comment failed",
        tone: "error",
      });
    }
  }

  async function handleUpdateComment(comment) {
    const body = (editDrafts[comment.id] ?? "").trim();

    if (!body) {
      return;
    }

    try {
      const response = await updateCommentMutation.mutateAsync({
        chapterSlug: chapter.chapterSlug,
        commentId: comment.id,
        input: {
          body,
        },
        storySlug: story.slug,
      });

      setEditingCommentId(null);
      showToast(response.message || "Comment updated.");
    } catch (error) {
      showToast(error?.message || "Could not update the comment.", {
        title: "Update failed",
        tone: "error",
      });
    }
  }

  async function handleDeleteComment(comment) {
    if (!window.confirm("Delete this comment?")) {
      return;
    }

    try {
      const response = await deleteCommentMutation.mutateAsync({
        chapterSlug: chapter.chapterSlug,
        commentId: comment.id,
        storySlug: story.slug,
      });

      showToast(response.message || "Comment deleted.");
    } catch (error) {
      showToast(error?.message || "Could not delete the comment.", {
        title: "Delete failed",
        tone: "error",
      });
    }
  }

  function handleStartEdit(comment) {
    setEditingCommentId(comment.id);
    setEditDrafts((current) => ({
      ...current,
      [comment.id]: comment.body,
    }));
    setReplyingToId(null);
  }

  function handleStopEdit() {
    setEditingCommentId(null);
  }

  function handleToggleReply(commentId) {
    setReplyingToId((current) => (current === commentId ? null : commentId));
    setEditingCommentId(null);
  }

  if (commentsQuery.isLoading) {
    return (
      <section className={compact ? "pt-3" : "pt-4"}>
        <div className="space-y-3">
          {[0, 1, 2].map((value) => (
            <div
              className={`h-24 animate-pulse rounded-2xl border ${borderClass} ${themeClasses.panel}`}
              key={value}
            />
          ))}
        </div>
      </section>
    );
  }

  if (commentsQuery.isError) {
    return (
      <section className={`rounded-2xl border p-4 ${borderClass} ${themeClasses.panel}`}>
        <p className={`text-sm ${themeClasses.article}`}>
          {commentsQuery.error?.message || "Comments could not be loaded right now."}
        </p>
        <button
          className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wide text-background-dark"
          onClick={() => commentsQuery.refetch()}
          type="button"
        >
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className={compact ? "pt-2" : "pt-4"}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className={`font-bold tracking-tight ${compact ? "text-lg" : "text-2xl"} ${themeClasses.article}`}>
            Chapter Comments
          </h3>
          <p className={`mt-1 text-sm ${themeClasses.muted}`}>
            {formatCount(commentCount)} discussion entr{commentCount === 1 ? "y" : "ies"} on this chapter
          </p>
        </div>
        <div className={`inline-flex rounded-full border p-1 ${borderClass} ${themeClasses.panelSecondary}`}>
          {["top", "newest"].map((value) => (
            <button
              className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                sortBy === value
                  ? "bg-primary text-background-dark"
                  : themeClasses.muted
              }`}
              key={value}
              onClick={() => setSortBy(value)}
              type="button"
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-start gap-3">
        <UserAvatar
          className={compact ? "mt-1 size-9 rounded-full" : "mt-1 size-10 rounded-full"}
          name={user?.displayName ?? "StoryArc Reader"}
          src={user?.avatarUrl}
        />
        <div className="min-w-0 flex-1">
          <Composer
            borderClass={borderClass}
            compact={compact}
            isPending={mutationPending}
            onChange={setDraft}
            onSubmit={() => handleCreateComment(null)}
            placeholder="What stood out in this chapter?"
            submitLabel="Post"
            themeClasses={themeClasses}
            value={draft}
          />
        </div>
      </div>

      {comments.length ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              borderClass={borderClass}
              comment={comment}
              compact={compact}
              deleteMutation={deleteCommentMutation}
              editDrafts={editDrafts}
              editingCommentId={editingCommentId}
              isDeleting={deleteCommentMutation.isPending}
              key={comment.id}
              onDelete={handleDeleteComment}
              onEditDraftChange={(commentId, value) =>
                setEditDrafts((current) => ({
                  ...current,
                  [commentId]: value,
                }))
              }
              onReply={() => handleCreateComment(comment.id)}
              onReplyDraftChange={(commentId, value) =>
                setReplyDrafts((current) => ({
                  ...current,
                  [commentId]: value,
                }))
              }
              onStartEdit={handleStartEdit}
              onStopEdit={handleStopEdit}
              onToggleReply={handleToggleReply}
              onUpdate={handleUpdateComment}
              replyingToId={replyingToId}
              replyDrafts={replyDrafts}
              themeClasses={themeClasses}
            />
          ))}
        </div>
      ) : (
        <div className={`rounded-2xl border p-6 text-center ${borderClass} ${themeClasses.panel}`}>
          <p className={`text-sm ${themeClasses.article}`}>
            No one has commented yet.
          </p>
          <p className={`mt-2 text-sm ${themeClasses.muted}`}>
            {compact
              ? "Be the first reader to leave a thought."
              : "Start the discussion with a thoughtful first comment."}
          </p>
        </div>
      )}
    </section>
  );
}
