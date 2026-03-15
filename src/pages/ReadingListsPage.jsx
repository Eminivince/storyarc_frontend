import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import CreateReadingListModal from "../components/CreateReadingListModal";
import ReaderStateScreen from "../components/ReaderStateScreen";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import {
  buildReadingListDetailsHref,
  buildSharedReadingListHref,
  buildSearchHref,
} from "../data/readerFlow";
import { useAccount } from "../context/AccountContext";
import { useToast } from "../context/ToastContext";
import {
  useCreateReadingListMutation,
  useDeleteReadingListMutation,
  usePublicReadingListsQuery,
  useReadingListsQuery,
  useUpdateReadingListMutation,
} from "../reader/readerHooks";

function getReadingListsErrorMessage(error) {
  return error?.message || "We could not load your reading lists right now.";
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

function stopListAction(event, handler) {
  event.preventDefault();
  event.stopPropagation();
  handler();
}

function getFilteredOwnedLists(lists, activeTab, searchTerm) {
  const normalizedQuery = searchTerm.trim().toLowerCase();

  return (lists ?? []).filter((list) => {
    if (activeTab !== "all" && list.visibility !== activeTab) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      list.name,
      list.description,
      list.ownerDisplayName,
      ...list.stories.map((story) => story.title),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

function VisibilityBadge({ visibility, compact = false }) {
  const baseClassName = compact
    ? "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
    : "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider";
  const iconClassName = compact ? "text-[10px]" : "text-[12px]";
  const className =
    visibility === "public"
      ? `${baseClassName} bg-primary text-background-dark`
      : `${baseClassName} bg-slate-800/80 text-slate-100 backdrop-blur`;

  return (
    <span className={className}>
      <span className={`material-symbols-outlined ${iconClassName}`}>
        {visibility === "public" ? "public" : "lock"}
      </span>
      {visibility === "public" ? "Public" : "Private"}
    </span>
  );
}

function CoverStack({ list }) {
  const previewCoverImages = list.previewCoverImages ?? [];

  return (
    <div className="flex -space-x-3">
      {previewCoverImages.length ? (
        previewCoverImages.map((url, index) => (
          <img
            alt=""
            className="size-10 rounded-lg border-2 border-background-dark object-cover dark:border-background-dark"
            key={`${list.id}-cover-${index}`}
            src={url}
          />
        ))
      ) : (
        <div className="flex size-10 items-center justify-center rounded-lg border-2 border-background-dark bg-slate-200 dark:border-background-dark dark:bg-slate-700">
          <span className="material-symbols-outlined text-slate-400">
            auto_stories
          </span>
        </div>
      )}
      {list.storyCount > previewCoverImages.length ? (
        <div className="flex size-10 items-center justify-center rounded-lg border-2 border-background-dark bg-slate-700 text-[10px] font-bold text-slate-300 dark:border-background-dark">
          +{list.storyCount - previewCoverImages.length}
        </div>
      ) : null}
    </div>
  );
}

function DesktopListCard({ list, onDelete, onEdit, onShare }) {
  const detailsHref = buildReadingListDetailsHref(list.id);

  return (
    <Link
      className="group flex h-full flex-col rounded-xl border border-primary/10 bg-slate-50 p-5 transition-all hover:border-primary/30 dark:bg-slate-800/40"
      to={detailsHref}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <VisibilityBadge visibility={list.visibility} />
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            className="rounded p-1.5 text-slate-400 transition-colors hover:bg-primary/20 hover:text-primary"
            onClick={(event) => stopListAction(event, () => onEdit(list))}
            title="Edit"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            className="rounded p-1.5 text-slate-400 transition-colors hover:bg-primary/20 hover:text-primary"
            onClick={(event) => stopListAction(event, () => onShare(list))}
            title="Share"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
          </button>
          <button
            className="rounded p-1.5 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
            onClick={(event) => stopListAction(event, () => onDelete(list))}
            title="Delete"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>
      <h3 className="mb-2 text-xl font-bold">{list.name}</h3>
      <p className="mb-6 line-clamp-2 flex-grow text-sm text-slate-500 dark:text-slate-400">
        {list.description || "A custom TaleStead shelf for your next reading run."}
      </p>
      <div className="mt-auto flex items-end justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-2xl font-black text-primary">{list.storyCount}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Total Books
          </span>
        </div>
        <CoverStack list={list} />
      </div>
    </Link>
  );
}

function PublicListCard({ list }) {
  return (
    <article className="flex items-center gap-4 rounded-xl border border-primary/10 bg-primary/5 p-4">
      <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-700">
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
      <div className="min-w-0 flex-1">
        <h4 className="text-lg font-bold">{list.name}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          By {list.ownerDisplayName} • {list.storyCount} Books
        </p>
        <div className="mt-2 flex gap-2">
          <Link
            className="rounded bg-primary/20 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary"
            to={buildSharedReadingListHref(list.shareSlug)}
          >
            View List
          </Link>
        </div>
      </div>
    </article>
  );
}

function MobileListCard({ list, onEdit, onShare }) {
  const detailsHref = buildReadingListDetailsHref(list.id);

  return (
    <Link
      className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm dark:border-primary/10 dark:bg-primary/5"
      to={detailsHref}
    >
      <div
        className="relative h-16 w-full bg-cover bg-center"
        style={{
          backgroundImage: list.coverImage ? `url("${list.coverImage}")` : undefined,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {!list.coverImage ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-primary/10">
            <span className="material-symbols-outlined text-2xl text-slate-500">
              auto_stories
            </span>
          </div>
        ) : null}
        <div className="absolute bottom-1 left-2">
          <VisibilityBadge compact visibility={list.visibility} />
        </div>
      </div>
      <div className="flex flex-col p-2">
        <div className="flex items-start justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold leading-tight text-slate-900 dark:text-slate-100">
              {list.name}
            </h3>
            <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-primary/60">
              {list.storyCount} Books • {list.updatedAtLabel}
            </p>
          </div>
          <div className="flex shrink-0 gap-0.5">
            <button
              className="rounded-full p-1 text-slate-400 transition-colors hover:bg-primary/20 hover:text-primary dark:text-primary/40"
              onClick={(event) => stopListAction(event, () => onShare(list))}
              type="button"
            >
              <span className="material-symbols-outlined text-base">share</span>
            </button>
            <button
              className="rounded-full p-1 text-slate-400 transition-colors hover:bg-primary/20 hover:text-primary dark:text-primary/40"
              onClick={(event) => stopListAction(event, () => onEdit(list))}
              type="button"
            >
              <span className="material-symbols-outlined text-base">edit</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

function DesktopReadingLists({
  lists,
  memberName,
  onDeleteList,
  onEditList,
  onOpenCreateModal,
  onShareList,
  publicLists,
  searchTerm,
  setSearchTerm,
  topGenre,
}) {
  const [activeTab, setActiveTab] = useState("all");
  const filteredLists = useMemo(
    () => getFilteredOwnedLists(lists, activeTab, searchTerm),
    [activeTab, lists, searchTerm],
  );

  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex">
        <AppDesktopSidebar memberName={memberName} topGenre={topGenre} />
        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-background-light/80 px-8 py-4 backdrop-blur-md dark:bg-background-dark/80">
            <div className="flex flex-1 items-center gap-8">
              <div className="relative w-full max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  search
                </span>
                <input
                  className="w-full rounded-lg border-none bg-slate-100 py-2 pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-primary/50 dark:bg-slate-800"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search your lists..."
                  type="text"
                  value={searchTerm}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                className="relative flex size-9 items-center justify-center text-slate-600 transition-colors hover:text-primary dark:text-slate-400"
                to="/account/notifications"
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
              </Link>
              <button
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-background-dark transition-transform hover:bg-primary/90 active:scale-95"
                onClick={onOpenCreateModal}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Create New List
              </button>
            </div>
          </header>

          <div className="flex-1 px-8 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                My Reading Lists
              </h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Manage and organize your personal literary collections.
              </p>
            </div>

            <div className="mb-8 flex items-center justify-between border-b border-primary/10">
              <div className="flex gap-8">
                {["all", "public", "private"].map((tab) => (
                  <button
                    className={`pb-4 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "border-b-2 border-primary font-bold text-primary"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                    }`}
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    type="button"
                  >
                    {tab === "all"
                      ? `All Lists (${lists.length})`
                      : tab === "public"
                        ? "Public"
                        : "Private"}
                  </button>
                ))}
              </div>
              <p className="pb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Recently Updated
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredLists.map((list) => (
                <DesktopListCard
                  key={list.id}
                  list={list}
                  onDelete={onDeleteList}
                  onEdit={onEditList}
                  onShare={onShareList}
                />
              ))}
              <button
                className="group flex h-[240px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/20 text-center transition-all hover:border-primary/60"
                onClick={onOpenCreateModal}
                type="button"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <span className="material-symbols-outlined text-3xl">add</span>
                </div>
                <h3 className="text-lg font-bold text-slate-600 transition-colors group-hover:text-primary dark:text-slate-300">
                  Create a New List
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Curate your next big reading adventure.
                </p>
              </button>
            </div>

            {!filteredLists.length ? (
              <div className="mt-6 rounded-xl border border-dashed border-primary/20 bg-primary/5 p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                {searchTerm.trim()
                  ? "No reading lists matched that search."
                  : "You do not have any reading lists yet."}
              </div>
            ) : null}

            <div className="mb-8 mt-16">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Public Reading Lists
              </h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Discover lists that other readers have made public.
              </p>
            </div>
            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
              {publicLists.length ? (
                publicLists.map((list) => <PublicListCard key={list.id} list={list} />)
              ) : (
                <div className="rounded-xl border border-dashed border-primary/20 bg-primary/5 p-6 text-sm text-slate-500 dark:text-slate-400">
                  No public reading lists are available yet.
                </div>
              )}
            </div>
          </div>

          <AppFooter className="mt-auto" />
        </main>
      </div>
    </div>
  );
}

function MobileReadingLists({
  lists,
  memberName,
  onEditList,
  onOpenCreateModal,
  onShareList,
  topGenre,
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const categories = [
    { id: "all", label: "All Lists" },
    { id: "private", label: "Private" },
    { id: "public", label: "Public" },
  ];
  const filteredLists = getFilteredOwnedLists(lists, activeCategory, "");

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-background-light/80 px-2 py-1.5 backdrop-blur-md dark:border-primary/10 dark:bg-background-dark/80">
          <Link
            className="flex size-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-primary/10"
            to="/dashboard"
          >
            <span className="material-symbols-outlined text-base text-slate-900 dark:text-slate-100">
              arrow_back
            </span>
          </Link>
          <h1 className="flex-1 text-center text-sm font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
            Reading Lists
          </h1>
          <Link
            className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-primary/10"
            to={buildSearchHref("")}
          >
            <span className="material-symbols-outlined text-base text-slate-900 dark:text-slate-100">
              search
            </span>
          </Link>
        </header>

        <main className="flex flex-1 flex-col pb-20">
          <div className="px-2 py-2">
            <button
              className="flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-primary px-3 font-bold text-xs tracking-wide text-background-dark shadow-md shadow-primary/20 transition-transform active:scale-[0.98]"
              onClick={onOpenCreateModal}
              type="button"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Create New List
            </button>
          </div>

          <div className="mb-2 flex gap-1.5 overflow-x-auto px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => (
              <button
                className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  activeCategory === category.id
                    ? "bg-primary text-background-dark"
                    : "border border-primary/20 bg-primary/10 text-primary"
                }`}
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                type="button"
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 px-2">
            {filteredLists.map((list) => (
              <MobileListCard
                key={list.id}
                list={list}
                onEdit={onEditList}
                onShare={onShareList}
              />
            ))}
            {!filteredLists.length ? (
              <div className="rounded-lg border border-dashed border-primary/20 bg-primary/5 p-4 text-center text-[11px] text-slate-500 dark:text-primary/60">
                No lists in this category yet.
              </div>
            ) : null}
            <button
              className="group relative flex min-h-[72px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 p-3 text-center transition-colors hover:border-primary/40 dark:border-primary/30 dark:hover:border-primary/50"
              onClick={onOpenCreateModal}
              type="button"
            >
              <div className="mb-1 text-slate-400 dark:text-primary/20">
                <span className="material-symbols-outlined text-2xl">auto_stories</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-primary/40">
                Start a new collection
              </p>
            </button>
          </div>
        </main>

        <AppMobileTabBar memberName={memberName} topGenre={topGenre} />
      </div>
    </div>
  );
}

function useListModalState() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [listId, setListId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("private");

  function reset() {
    setListId(null);
    setTitle("");
    setDescription("");
    setVisibility("private");
  }

  function openCreate() {
    reset();
    setMode("create");
    setIsOpen(true);
  }

  function openEdit(list) {
    setMode("edit");
    setListId(list.id);
    setTitle(list.name);
    setDescription(list.description ?? "");
    setVisibility(list.visibility);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return {
    close,
    description,
    isOpen,
    listId,
    mode,
    openCreate,
    openEdit,
    setDescription,
    setTitle,
    setVisibility,
    title,
    visibility,
  };
}

export default function ReadingListsPage() {
  const { profile } = useAccount();
  const { showToast } = useToast();
  const memberName = profile?.displayName ?? "TaleStead Reader";
  const topGenre = profile?.topGenre ?? "fantasy";
  const [searchTerm, setSearchTerm] = useState("");
  const modal = useListModalState();
  const readingListsQuery = useReadingListsQuery();
  const publicListsQuery = usePublicReadingListsQuery({ limit: 6 });
  const createReadingListMutation = useCreateReadingListMutation();
  const updateReadingListMutation = useUpdateReadingListMutation();
  const deleteReadingListMutation = useDeleteReadingListMutation();

  const ownedLists = readingListsQuery.data?.lists ?? [];
  const publicLists = useMemo(() => {
    const ownedListIds = new Set(ownedLists.map((list) => list.id));

    return (publicListsQuery.data?.lists ?? []).filter(
      (list) => !ownedListIds.has(list.id),
    );
  }, [ownedLists, publicListsQuery.data?.lists]);

  async function handleCreateOrUpdateList() {
    const input = {
      description: modal.description.trim() || null,
      name: modal.title.trim(),
      visibility: modal.visibility,
    };

    if (!input.name) {
      return;
    }

    try {
      const response =
        modal.mode === "edit" && modal.listId
          ? await updateReadingListMutation.mutateAsync({
              input,
              listId: modal.listId,
            })
          : await createReadingListMutation.mutateAsync(input);

      showToast(response?.message || "Reading list saved.", {
        title: modal.mode === "edit" ? "List updated" : "List created",
      });
      modal.close();
    } catch (error) {
      showToast(error?.message || "Could not save this reading list.", {
        title: "List action failed",
        tone: "error",
      });
    }
  }

  async function handleDeleteList(list) {
    if (!window.confirm(`Delete "${list.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await deleteReadingListMutation.mutateAsync(list.id);
      showToast(response?.message || "Reading list deleted.");
    } catch (error) {
      showToast(error?.message || "Could not delete this reading list.", {
        title: "Delete failed",
        tone: "error",
      });
    }
  }

  async function handleShareList(list) {
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

  if (readingListsQuery.isLoading && !ownedLists.length) {
    return <RouteLoadingScreen />;
  }

  if (readingListsQuery.isError) {
    return (
      <ReaderStateScreen
        ctaLabel="Retry"
        ctaTo={buildSearchHref("")}
        description={getReadingListsErrorMessage(readingListsQuery.error)}
        secondaryLabel="Browse Stories"
        secondaryTo={buildSearchHref("")}
        title="Reading Lists Unavailable"
        tone="error"
      />
    );
  }

  return (
    <>
      <DesktopReadingLists
        lists={ownedLists}
        memberName={memberName}
        onDeleteList={handleDeleteList}
        onEditList={modal.openEdit}
        onOpenCreateModal={modal.openCreate}
        onShareList={handleShareList}
        publicLists={publicLists}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        topGenre={topGenre}
      />
      <MobileReadingLists
        lists={ownedLists}
        memberName={memberName}
        onEditList={modal.openEdit}
        onOpenCreateModal={modal.openCreate}
        onShareList={handleShareList}
        topGenre={topGenre}
      />
      <CreateReadingListModal
        description={modal.description}
        heading={modal.mode === "edit" ? "Edit Reading List" : "Create New List"}
        isOpen={modal.isOpen}
        onClose={modal.close}
        onDescriptionChange={modal.setDescription}
        onSubmit={handleCreateOrUpdateList}
        onTitleChange={modal.setTitle}
        onVisibilityChange={modal.setVisibility}
        submitLabel={modal.mode === "edit" ? "Save Changes" : "Create List"}
        title={modal.title}
        visibility={modal.visibility}
      />
    </>
  );
}
