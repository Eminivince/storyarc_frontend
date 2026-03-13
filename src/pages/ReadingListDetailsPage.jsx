import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppMobileTabBar } from "../components/AppShellNav";
import CreateReadingListModal from "../components/CreateReadingListModal";
import ReaderStateScreen from "../components/ReaderStateScreen";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import {
  buildChapterHref,
  buildSearchHref,
  buildStoryHref,
  readingListsHref,
} from "../data/readerFlow";
import { useAccount } from "../context/AccountContext";
import { useToast } from "../context/ToastContext";
import {
  useDeleteReadingListMutation,
  useReadingListDetailsQuery,
  useRemoveStoryFromReadingListMutation,
  useUpdateReadingListMutation,
} from "../reader/readerHooks";

function getReadingListDetailsErrorMessage(error) {
  return error?.message || "We could not load this reading list right now.";
}

function buildShareUrl(sharePath) {
  if (!sharePath) {
    return "";
  }

  if (typeof window === "undefined") {
    return sharePath;
  }

  return new URL(sharePath, window.location.origin).toString();
}

async function copyToClipboard(value) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  throw new Error("Clipboard access is not available in this browser.");
}

function getBookHref(book) {
  return book.currentChapterSlug
    ? buildChapterHref(book.slug, book.currentChapterSlug)
    : buildStoryHref(book.slug);
}

function getFilteredBooks(stories, activeTab) {
  if (activeTab === "unread") {
    return stories.filter((story) => story.readingState === "unread");
  }

  if (activeTab === "completed") {
    return stories.filter((story) => story.readingState === "completed");
  }

  if (activeTab === "recent") {
    return [...stories].sort(
      (left, right) => new Date(right.addedAt).getTime() - new Date(left.addedAt).getTime(),
    );
  }

  return stories;
}

function VisibilityPill({ visibility }) {
  return (
    <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-background-dark">
      {visibility}
    </span>
  );
}

function DesktopReadingListDetails({
  activeTab,
  books,
  list,
  onDeleteList,
  onEditList,
  onRemoveStory,
  onShareList,
  setActiveTab,
}) {
  const tabCounts = {
    all: list.storyCount,
    completed: list.stats.completedCount,
    recent: list.storyCount,
    unread: list.stats.unreadCount,
  };

  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-background-light/80 px-6 py-3 backdrop-blur-md dark:border-primary/20 dark:bg-background-dark/80 lg:px-20">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <Link className="flex items-center gap-2 text-primary" to={readingListsHref}>
              <span className="material-symbols-outlined text-3xl">layers</span>
              <h2 className="text-xl font-bold leading-tight tracking-tight">StoryArc</h2>
            </Link>
            <div className="hidden md:flex items-center">
              <div className="relative">
                <span className="material-symbols-outlined absolute inset-y-0 left-0 flex items-center pl-3 text-xl text-slate-400">
                  search
                </span>
                <input
                  className="block w-64 rounded-lg border-none bg-slate-100 py-2 pl-10 pr-3 text-sm placeholder-slate-500 focus:ring-2 focus:ring-primary dark:bg-primary/10"
                  placeholder="Search stories..."
                  type="text"
                />
              </div>
            </div>
          </div>
          <nav className="hidden items-center gap-8 lg:flex">
            <Link className="text-sm font-medium text-slate-500 transition-colors hover:text-primary" to="/browse">
              Browse
            </Link>
            <Link className="text-sm font-medium text-primary" to={readingListsHref}>
              Library
            </Link>
            <Link className="text-sm font-medium text-slate-500 transition-colors hover:text-primary" to="/creator">
              Write
            </Link>
            <Link className="text-sm font-medium text-slate-500 transition-colors hover:text-primary" to="/community">
              Community
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link className="rounded-lg p-2 transition-colors hover:bg-slate-200 dark:bg-primary/10 dark:hover:bg-primary/20" to="/account/notifications">
              <span className="material-symbols-outlined">notifications</span>
            </Link>
            <Link className="rounded-lg p-2 transition-colors hover:bg-slate-200 dark:bg-primary/10 dark:hover:bg-primary/20" to="/account/profile">
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1200px] flex-col px-6 py-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link className="transition-colors hover:text-primary" to={readingListsHref}>
            Reading Lists
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="font-medium text-slate-900 dark:text-slate-100">{list.name}</span>
        </nav>

        <section className="mb-12 flex flex-col gap-8 md:flex-row md:items-start">
          <div className="relative shrink-0">
            <div className="h-48 w-48 overflow-hidden rounded-xl border border-primary/20 shadow-2xl shadow-black/20">
              {list.coverImage ? (
                <img alt={list.name} className="h-full w-full object-cover" src={list.coverImage} />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-200 dark:bg-primary/10">
                  <span className="material-symbols-outlined text-5xl text-slate-400">
                    auto_stories
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-1 flex items-center gap-3">
                  <h1 className="text-4xl font-bold tracking-tight">{list.name}</h1>
                  <VisibilityPill visibility={list.visibility} />
                </div>
                <p className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-sm">auto_stories</span>
                  {list.storyCount} books in this collection
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-bold text-background-dark shadow-lg shadow-primary/10 transition-all hover:bg-primary/90"
                  onClick={onShareList}
                  type="button"
                >
                  <span className="material-symbols-outlined text-xl">share</span>
                  Share
                </button>
                <button
                  className="flex items-center gap-2 rounded-lg border border-primary/20 bg-slate-200 px-5 py-2.5 font-bold transition-all hover:bg-slate-300 dark:bg-primary/10 dark:hover:bg-primary/20"
                  onClick={onEditList}
                  type="button"
                >
                  <span className="material-symbols-outlined text-xl">edit</span>
                  Edit List
                </button>
                <button
                  className="flex items-center justify-center rounded-lg p-2.5 text-red-500 transition-all hover:bg-red-500/10"
                  onClick={onDeleteList}
                  type="button"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              {list.description || "A custom StoryArc shelf curated from live stories."}
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-primary/10 bg-white p-4 dark:bg-primary/5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Unread
                </p>
                <p className="mt-2 text-2xl font-black">{list.stats.unreadCount}</p>
              </div>
              <div className="rounded-2xl border border-primary/10 bg-white p-4 dark:bg-primary/5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  In Progress
                </p>
                <p className="mt-2 text-2xl font-black">{list.stats.inProgressCount}</p>
              </div>
              <div className="rounded-2xl border border-primary/10 bg-white p-4 dark:bg-primary/5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Completed
                </p>
                <p className="mt-2 text-2xl font-black">{list.stats.completedCount}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mb-8 overflow-x-auto border-b border-slate-200 dark:border-primary/20">
          <div className="flex gap-8 whitespace-nowrap">
            {[
              ["all", `All Books (${tabCounts.all})`],
              ["recent", "Recently Updated"],
              ["unread", `Unread (${tabCounts.unread})`],
              ["completed", `Completed (${tabCounts.completed})`],
            ].map(([value, label]) => (
              <button
                className={`border-b-2 px-1 pb-3 ${
                  activeTab === value
                    ? "border-primary font-bold text-primary"
                    : "border-transparent font-medium text-slate-500 transition-colors hover:text-primary"
                }`}
                key={value}
                onClick={() => setActiveTab(value)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {books.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 transition-all hover:border-primary/40 dark:border-primary/10 dark:bg-primary/5" key={book.slug}>
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-200 dark:bg-primary/10">
                  {book.coverImage ? (
                    <img alt={book.title} className="h-full w-full object-cover" src={book.coverImage} />
                  ) : null}
                  {book.hasNewChapter ? (
                    <div className="absolute right-2 top-2 rounded border border-primary/20 bg-background-dark/80 px-2 py-1 text-xs font-bold text-primary backdrop-blur">
                      NEW CHAPTER
                    </div>
                  ) : null}
                  <button
                    className="absolute left-2 top-2 rounded-full bg-background-dark/80 p-2 text-slate-100 backdrop-blur transition-colors hover:text-red-400"
                    onClick={() => onRemoveStory(book)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">remove_circle</span>
                  </button>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <h3 className="line-clamp-1 text-lg font-bold leading-tight transition-colors group-hover:text-primary">
                      {book.title}
                    </h3>
                    <span className="flex items-center gap-1 text-xs font-bold text-primary">
                      <span className="material-symbols-outlined fill-1 text-xs">star</span>
                      {book.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                    By {book.authorName}
                  </p>
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Added {book.addedAtLabel}
                  </p>
                  <div className="mt-auto space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <span>Progress: {book.progressLabel}</span>
                      <span>{book.progressPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-primary/10">
                      <div className="h-full bg-primary" style={{ width: `${book.progressPercent}%` }} />
                    </div>
                    <Link
                      className="mt-4 block w-full rounded-lg bg-primary py-2 text-center text-sm font-bold text-background-dark transition-all hover:bg-primary/90"
                      to={getBookHref(book)}
                    >
                      {book.ctaLabel}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-primary/20 bg-primary/5 p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-primary">
              auto_stories
            </span>
            <h2 className="mt-3 text-xl font-bold">No books in this view</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Try another tab or add more stories to this list.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function MobileReadingListDetails({
  activeTab,
  books,
  list,
  memberName,
  onDeleteList,
  onEditList,
  onRemoveStory,
  onShareList,
  setActiveTab,
  topGenre,
}) {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-background-light/80 px-2 py-2 backdrop-blur-md dark:border-primary/10 dark:bg-background-dark/80">
        <div className="flex items-center gap-2">
          <Link className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-slate-200 dark:hover:bg-primary/20" to={readingListsHref}>
            <span className="material-symbols-outlined text-base text-slate-900 dark:text-primary">arrow_back</span>
          </Link>
          <h1 className="text-sm font-bold leading-tight tracking-tight">Reading List</h1>
        </div>
        <button
          className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-slate-200 dark:hover:bg-primary/20"
          onClick={onShareList}
          type="button"
        >
          <span className="material-symbols-outlined text-base text-slate-900 dark:text-primary">share</span>
        </button>
      </header>

      <main className="flex-1 pb-20">
        <div className="flex flex-col gap-3 p-3">
          <div className="flex w-full flex-row items-center gap-3">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-primary/10 shadow-lg ring-1 ring-primary/20">
              {list.coverImage ? (
                <img alt={list.name} className="h-full w-full object-cover" src={list.coverImage} />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-slate-400">
                    auto_stories
                  </span>
                </div>
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                  {list.visibility}
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {list.storyCount} Books
                </span>
              </div>
              <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
                {list.name}
              </h2>
              <p className="line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {list.description || "A custom StoryArc shelf curated from live stories."}
              </p>
            </div>
          </div>
          <div className="flex w-full gap-2">
            <button
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary text-xs font-bold text-background-dark shadow-md shadow-primary/10 transition-transform active:scale-95"
              onClick={onShareList}
              type="button"
            >
              <span className="material-symbols-outlined text-xs">share</span>
              Share
            </button>
            <button
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-transparent bg-slate-200 text-xs font-bold text-slate-900 transition-transform active:scale-95 dark:border-primary/20 dark:bg-primary/10 dark:text-primary"
              onClick={onEditList}
              type="button"
            >
              <span className="material-symbols-outlined text-xs">edit</span>
              Edit
            </button>
          </div>
        </div>

        <div className="mb-2 flex items-center gap-2 overflow-x-auto border-b border-slate-200 px-3 py-2 dark:border-primary/10">
          {[
            ["all", `All (${list.storyCount})`],
            ["recent", "Recent"],
            ["unread", `Unread (${list.stats.unreadCount})`],
            ["completed", `Done (${list.stats.completedCount})`],
          ].map(([value, label]) => (
            <button
              className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${
                activeTab === value
                  ? "bg-primary text-background-dark"
                  : "border border-primary/20 bg-primary/10 text-primary"
              }`}
              key={value}
              onClick={() => setActiveTab(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 px-3">
          {books.map((book) => (
            <article className="flex gap-3 rounded-xl border border-slate-200 bg-slate-100 p-2.5 dark:border-primary/10 dark:bg-primary/5" key={book.slug}>
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-slate-300 shadow-md dark:bg-primary/10">
                {book.coverImage ? (
                  <img alt={book.title} className="h-full w-full object-cover" src={book.coverImage} />
                ) : null}
                <button
                  className="absolute right-1 top-1 rounded-full bg-background-dark/80 p-1 text-slate-100 backdrop-blur"
                  onClick={() => onRemoveStory(book)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                <div>
                  <h4 className="line-clamp-1 text-sm font-bold leading-tight">{book.title}</h4>
                  <p className="mb-0.5 text-[11px] font-medium text-slate-500 dark:text-primary/70">
                    {book.authorName}
                  </p>
                  <div className="mb-2 flex items-center gap-1 text-primary">
                    <span className="material-symbols-outlined fill-1 text-xs">star</span>
                    <span className="text-[11px] font-bold">{book.averageRating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="mb-0.5 flex justify-between text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      <span>{book.progressLabel}</span>
                      <span>{book.progressPercent}%</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-slate-300 dark:bg-primary/20">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${book.progressPercent}%` }} />
                    </div>
                  </div>
                  <Link
                    className="block w-full rounded-md bg-primary py-1.5 text-center text-[10px] font-bold uppercase tracking-widest text-background-dark shadow-sm"
                    to={getBookHref(book)}
                  >
                    {book.ctaLabel}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!books.length ? (
          <div className="mx-3 rounded-xl border border-dashed border-primary/20 bg-primary/5 p-4 text-center text-[11px] text-slate-500 dark:text-slate-400">
            No books match this view yet.
          </div>
        ) : null}

        <div className="mx-3 mt-3 flex flex-col gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3">
          <div>
            <p className="text-xs font-bold leading-tight text-red-500">Danger Zone</p>
            <p className="text-[11px] leading-normal text-slate-500 dark:text-slate-400">
              Removing this list is permanent.
            </p>
          </div>
          <button
            className="flex h-9 w-full items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 px-3 text-[11px] font-bold text-red-500"
            onClick={onDeleteList}
            type="button"
          >
            Delete Reading List
          </button>
        </div>
      </main>

      <AppMobileTabBar memberName={memberName} topGenre={topGenre} />
    </div>
  );
}

function useEditModalState(list) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("private");

  function open() {
    setTitle(list?.name ?? "");
    setDescription(list?.description ?? "");
    setVisibility(list?.visibility ?? "private");
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return {
    close,
    description,
    isOpen,
    open,
    setDescription,
    setTitle,
    setVisibility,
    title,
    visibility,
  };
}

export default function ReadingListDetailsPage() {
  const { listId = "" } = useParams();
  const navigate = useNavigate();
  const { profile } = useAccount();
  const { showToast } = useToast();
  const topGenre = profile?.topGenre ?? "fantasy";
  const memberName = profile?.displayName ?? "StoryArc Reader";
  const [activeTab, setActiveTab] = useState("all");
  const listQuery = useReadingListDetailsQuery(listId);
  const updateReadingListMutation = useUpdateReadingListMutation();
  const deleteReadingListMutation = useDeleteReadingListMutation();
  const removeStoryFromReadingListMutation = useRemoveStoryFromReadingListMutation();
  const list = listQuery.data?.list ?? null;
  const modal = useEditModalState(list);
  const books = useMemo(
    () => getFilteredBooks(list?.stories ?? [], activeTab),
    [activeTab, list?.stories],
  );

  async function handleShareList() {
    if (!list) {
      return;
    }

    if (list.visibility !== "public") {
      showToast("Make this list public before sharing it.", {
        title: "List is private",
        tone: "error",
      });
      return;
    }

    try {
      await copyToClipboard(buildShareUrl(list.sharePath));
      showToast("Share link copied to your clipboard.", {
        title: "Link copied",
      });
    } catch (error) {
      showToast(error?.message || "Could not copy that share link.", {
        title: "Share failed",
        tone: "error",
      });
    }
  }

  async function handleSaveList() {
    if (!list) {
      return;
    }

    try {
      const response = await updateReadingListMutation.mutateAsync({
        input: {
          description: modal.description.trim() || null,
          name: modal.title.trim(),
          visibility: modal.visibility,
        },
        listId: list.id,
      });
      showToast(response?.message || "Reading list updated.");
      modal.close();
    } catch (error) {
      showToast(error?.message || "Could not update this reading list.", {
        title: "Update failed",
        tone: "error",
      });
    }
  }

  async function handleDeleteList() {
    if (!list) {
      return;
    }

    if (!window.confirm(`Delete "${list.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await deleteReadingListMutation.mutateAsync(list.id);
      showToast(response?.message || "Reading list deleted.");
      navigate(readingListsHref);
    } catch (error) {
      showToast(error?.message || "Could not delete this reading list.", {
        title: "Delete failed",
        tone: "error",
      });
    }
  }

  async function handleRemoveStory(book) {
    if (!list) {
      return;
    }

    try {
      const response = await removeStoryFromReadingListMutation.mutateAsync({
        listId: list.id,
        storySlug: book.slug,
      });
      showToast(response?.message || `${book.title} removed from the list.`);
    } catch (error) {
      showToast(error?.message || "Could not remove that story from the list.", {
        title: "Remove failed",
        tone: "error",
      });
    }
  }

  if (listQuery.isLoading) {
    return <RouteLoadingScreen />;
  }

  if (listQuery.isError || !list) {
    return (
      <ReaderStateScreen
        ctaLabel="Back to Lists"
        ctaTo={readingListsHref}
        description={getReadingListDetailsErrorMessage(listQuery.error)}
        secondaryLabel="Browse Stories"
        secondaryTo={buildSearchHref("")}
        title="Reading List Unavailable"
        tone="error"
      />
    );
  }

  return (
    <>
      <DesktopReadingListDetails
        activeTab={activeTab}
        books={books}
        list={list}
        onDeleteList={handleDeleteList}
        onEditList={modal.open}
        onRemoveStory={handleRemoveStory}
        onShareList={handleShareList}
        setActiveTab={setActiveTab}
      />
      <MobileReadingListDetails
        activeTab={activeTab}
        books={books}
        list={list}
        memberName={memberName}
        onDeleteList={handleDeleteList}
        onEditList={modal.open}
        onRemoveStory={handleRemoveStory}
        onShareList={handleShareList}
        setActiveTab={setActiveTab}
        topGenre={topGenre}
      />
      <CreateReadingListModal
        description={modal.description}
        heading="Edit Reading List"
        isOpen={modal.isOpen}
        onClose={modal.close}
        onDescriptionChange={modal.setDescription}
        onSubmit={handleSaveList}
        onTitleChange={modal.setTitle}
        onVisibilityChange={modal.setVisibility}
        submitLabel="Save Changes"
        title={modal.title}
        visibility={modal.visibility}
      />
    </>
  );
}
