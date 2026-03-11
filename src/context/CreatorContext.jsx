import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchCreatorApplication,
  saveCreatorApplicationDraft as saveCreatorApplicationDraftRequest,
  submitCreatorApplication as submitCreatorApplicationRequest,
} from "../creator/creatorApi";
import {
  createStudioStory as createStudioStoryRequest,
  fetchStudioChapterDraft,
  fetchStudioStories,
  publishStudioChapter as publishStudioChapterRequest,
  saveStudioChapterDraft as saveStudioChapterDraftRequest,
  saveStudioStructure as saveStudioStructureRequest,
  updateStudioStory as updateStudioStoryRequest,
  uploadStudioCover as uploadStudioCoverRequest,
} from "../creator/studioApi";
import {
  authorDashboardHref,
  createInitialStoryDraft,
  creatorApplicationHref,
  creatorLandingHref,
  creatorSubmittedHref,
  initialCreatorApplication,
} from "../data/creatorFlow";
import { useAuth } from "./AuthContext";

const CreatorContext = createContext(null);

function mapCreatorStatus(role, applicationStatus) {
  if (role === "CREATOR" || role === "ADMIN") {
    return "approved";
  }

  if (applicationStatus === "SUBMITTED") {
    return "pending";
  }

  if (applicationStatus === "DRAFT" || applicationStatus === "REJECTED") {
    return "draft";
  }

  return "not_started";
}

function createDefaultApplicationDraft(user) {
  return {
    ...initialCreatorApplication,
    email: user?.email ?? initialCreatorApplication.email,
    fullName: user?.displayName ?? initialCreatorApplication.fullName,
  };
}

function mapApplicationToDraft(application, user) {
  if (!application) {
    return createDefaultApplicationDraft(user);
  }

  return {
    ...createDefaultApplicationDraft(user),
    email: application.email ?? user?.email ?? initialCreatorApplication.email,
    experience: application.experience ?? "",
    fullName:
      application.fullName ?? user?.displayName ?? initialCreatorApplication.fullName,
    motivation: application.motivation ?? "",
    portfolioUrl: application.portfolioUrl ?? "",
    primaryGenre: application.primaryGenre ?? "",
  };
}

function getDraftKey(storySlug, chapterId = null) {
  return `${storySlug}:${chapterId ?? "new"}`;
}

function getStoryPlacement(story) {
  const firstVolume = story?.volumes?.[0] ?? null;
  const firstArc = firstVolume?.arcs?.[0] ?? null;

  return {
    arcId: firstArc?.id ?? null,
    volumeId: firstVolume?.id ?? null,
  };
}

function parseChapterNumber(value) {
  const match = String(value ?? "").match(/(\d+)/);

  return match ? Number(match[1]) : 0;
}

function getNextChapterNumber(story) {
  const numbers = [];

  story?.volumes?.forEach((volume) => {
    volume.arcs?.forEach((arc) => {
      arc.chapters?.forEach((chapter) => {
        numbers.push(parseChapterNumber(chapter.number));
      });
    });
  });

  story?.recentChapters?.forEach((chapter) => {
    numbers.push(parseChapterNumber(chapter.number));
  });

  story?.publishedChapters?.forEach((chapter) => {
    numbers.push(parseChapterNumber(chapter.number));
  });

  const highestChapterNumber = numbers.reduce(
    (highest, value) => (value > highest ? value : highest),
    0,
  );

  return highestChapterNumber + 1;
}

function createDraftForStory(story) {
  const nextChapterNumber = getNextChapterNumber(story);
  const placement = getStoryPlacement(story);

  return {
    arcId: placement.arcId,
    authorsNote: "",
    body: "",
    chapterId: null,
    coinUnlockPrice: 50,
    lastSavedAt: "Not saved yet",
    number: `Chapter ${nextChapterNumber}`,
    publishType: "now",
    premiumEnabled: false,
    scheduledFor: "",
    storyTitle: story?.title ?? "",
    title: "",
    volumeId: placement.volumeId,
    warnings: [],
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.readAsDataURL(file);
  });
}

function mergeStory(stories, nextStory) {
  const nextStories = stories.filter((story) => story.slug !== nextStory.slug);

  return [nextStory, ...nextStories];
}

function buildStoryUpdatePayload(story, overrides = {}) {
  return {
    audience: overrides.audience ?? story.audience,
    coverImage: overrides.coverImage ?? overrides.image ?? story.image,
    genre: overrides.genre ?? story.genre,
    synopsis: overrides.synopsis ?? story.synopsis,
    tags: overrides.tags ?? story.tags ?? [],
    termsAccepted: true,
    title: overrides.title ?? story.title,
  };
}

function createLocalVolume(volumeCount) {
  return {
    arcCount: 1,
    arcs: [
      {
        chapterCount: 0,
        chapters: [],
        id: `local-volume-${volumeCount}-arc-1`,
        status: "Planning",
        title: "Arc I: New Arc",
      },
    ],
    chapterCount: 0,
    id: `local-volume-${volumeCount}`,
    number: volumeCount,
    status: "Planning",
    title: `Volume ${volumeCount}: Untitled`,
  };
}

function cloneStoryWithNewVolume(story) {
  const nextVolumeNumber = story.volumes.length + 1;
  const nextVolume = createLocalVolume(nextVolumeNumber);

  return {
    ...story,
    volumes: [...story.volumes, nextVolume],
  };
}

function cloneStoryWithNewArc(story, volumeId) {
  return {
    ...story,
    volumes: story.volumes.map((volume) => {
      if (volume.id !== volumeId) {
        return volume;
      }

      const nextArcNumber = volume.arcs.length + 1;
      const nextArc = {
        chapterCount: 0,
        chapters: [],
        id: `${volume.id}-local-arc-${nextArcNumber}`,
        status: "Planning",
        title: `Arc ${nextArcNumber}: Untitled`,
      };

      return {
        ...volume,
        arcCount: volume.arcCount + 1,
        arcs: [...volume.arcs, nextArc],
      };
    }),
  };
}

export function CreatorProvider({ children }) {
  const { refetchCurrentUser, refreshSession, user } = useAuth();
  const [creatorMode, setCreatorMode] = useState("reader");
  const [applicationDraft, setApplicationDraft] = useState(() =>
    createDefaultApplicationDraft(user),
  );
  const [creatorApplication, setCreatorApplication] = useState(null);
  const [creatorNotice, setCreatorNotice] = useState(null);
  const [isCreatorApplicationLoading, setIsCreatorApplicationLoading] = useState(false);
  const [isSavingCreatorDraft, setIsSavingCreatorDraft] = useState(false);
  const [isSubmittingCreatorApplication, setIsSubmittingCreatorApplication] =
    useState(false);
  const [stories, setStories] = useState([]);
  const [storyDraft, setStoryDraft] = useState(() => createInitialStoryDraft());
  const [activeStorySlug, setActiveStorySlug] = useState(null);
  const [chapterDrafts, setChapterDrafts] = useState({});
  const [isStudioLoading, setIsStudioLoading] = useState(false);
  const [isSavingStory, setIsSavingStory] = useState(false);
  const [isSavingChapterDraft, setIsSavingChapterDraft] = useState(false);
  const [isPublishingChapter, setIsPublishingChapter] = useState(false);
  const [isSavingStructure, setIsSavingStructure] = useState(false);
  const [isUploadingStoryCover, setIsUploadingStoryCover] = useState(false);
  const [loadingChapterDraftId, setLoadingChapterDraftId] = useState(null);

  const creatorApplicationStatus =
    creatorApplication?.status ?? user?.creatorApplication?.status ?? null;
  const creatorStatus = mapCreatorStatus(user?.role, creatorApplicationStatus);
  const hasStudioAccess = user?.role === "CREATOR" || user?.role === "ADMIN";

  useEffect(() => {
    if (!user) {
      setCreatorMode("reader");
      setApplicationDraft(createDefaultApplicationDraft(null));
      setCreatorApplication(null);
      setStories([]);
      setActiveStorySlug(null);
      setChapterDrafts({});
      setStoryDraft(createInitialStoryDraft());
      return;
    }

    if (hasStudioAccess) {
      setCreatorMode("writer");
    }
  }, [hasStudioAccess, user]);

  async function refreshCreatorState() {
    if (!user) {
      setCreatorApplication(null);
      setApplicationDraft(createDefaultApplicationDraft(null));
      return null;
    }

    setIsCreatorApplicationLoading(true);

    try {
      const response = await fetchCreatorApplication();

      if (
        response.application?.status === "APPROVED" &&
        user.role !== "CREATOR" &&
        user.role !== "ADMIN"
      ) {
        await refreshSession();
      }

      setCreatorApplication(response.application);
      setApplicationDraft(mapApplicationToDraft(response.application, user));

      return response.application;
    } catch (error) {
      if (error.status === 404) {
        setCreatorApplication(null);
        setApplicationDraft(createDefaultApplicationDraft(user));
        return null;
      }

      showCreatorNotice(
        error.message || "Could not load your creator application right now.",
        "info",
      );

      return null;
    } finally {
      setIsCreatorApplicationLoading(false);
    }
  }

  async function refreshStudioStories(preferredStorySlug) {
    if (!hasStudioAccess) {
      setStories([]);
      setActiveStorySlug(null);
      setChapterDrafts({});
      return [];
    }

    setIsStudioLoading(true);

    try {
      const response = await fetchStudioStories();
      const nextStories = response.stories ?? [];

      setStories(nextStories);
      setActiveStorySlug((currentStorySlug) => {
        const desiredStorySlug = preferredStorySlug ?? currentStorySlug;

        if (desiredStorySlug && nextStories.some((story) => story.slug === desiredStorySlug)) {
          return desiredStorySlug;
        }

        return nextStories[0]?.slug ?? null;
      });

      return nextStories;
    } catch (error) {
      showCreatorNotice(
        error.message || "Could not load your studio workspace right now.",
        "info",
      );

      return [];
    } finally {
      setIsStudioLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadCreatorState() {
      if (!user) {
        return;
      }

      const application = await refreshCreatorState();

      if (cancelled || !application) {
        return;
      }

      setApplicationDraft(mapApplicationToDraft(application, user));
    }

    loadCreatorState();

    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.role]);

  useEffect(() => {
    let cancelled = false;

    async function loadStudioState() {
      if (!hasStudioAccess) {
        setStories([]);
        setActiveStorySlug(null);
        setChapterDrafts({});
        return;
      }

      const nextStories = await refreshStudioStories();

      if (cancelled || nextStories.length > 0) {
        return;
      }

      setActiveStorySlug(null);
    }

    loadStudioState();

    return () => {
      cancelled = true;
    };
  }, [hasStudioAccess, user?.id]);

  function clearCreatorNotice() {
    setCreatorNotice(null);
  }

  function showCreatorNotice(message, tone = "success") {
    setCreatorNotice({
      message,
      tone,
    });
  }

  function enterWriterMode() {
    setCreatorMode("writer");
  }

  function enterReaderMode() {
    setCreatorMode("reader");
  }

  function getCreatorEntryHref() {
    if (creatorStatus === "approved") {
      return authorDashboardHref;
    }

    if (creatorStatus === "pending") {
      return creatorSubmittedHref;
    }

    if (creatorStatus === "draft") {
      return creatorApplicationHref;
    }

    return creatorLandingHref;
  }

  function getCreatorNextStepHref() {
    if (creatorStatus === "approved") {
      return authorDashboardHref;
    }

    if (creatorStatus === "pending") {
      return creatorSubmittedHref;
    }

    return creatorApplicationHref;
  }

  function updateApplicationDraft(nextDraft) {
    setApplicationDraft(nextDraft);
  }

  async function saveCreatorDraft(nextDraft) {
    setIsSavingCreatorDraft(true);

    try {
      const response = await saveCreatorApplicationDraftRequest(nextDraft);

      setCreatorApplication(response.application);
      setApplicationDraft(mapApplicationToDraft(response.application, user));
      showCreatorNotice(response.message || "Creator application draft saved.");
      await refetchCurrentUser();

      return response;
    } catch (error) {
      showCreatorNotice(
        error.message || "Could not save your creator application draft.",
        "info",
      );
      throw error;
    } finally {
      setIsSavingCreatorDraft(false);
    }
  }

  async function submitCreatorApplication(nextDraft) {
    setIsSubmittingCreatorApplication(true);

    try {
      const response = await submitCreatorApplicationRequest(nextDraft);

      setCreatorApplication(response.application);
      setApplicationDraft(mapApplicationToDraft(response.application, user));
      showCreatorNotice(
        response.message || "Creator application submitted for review.",
      );
      await refetchCurrentUser();

      return response;
    } catch (error) {
      showCreatorNotice(
        error.message || "Could not submit your creator application.",
        "info",
      );
      throw error;
    } finally {
      setIsSubmittingCreatorApplication(false);
    }
  }

  function getStory(storySlug) {
    if (!storySlug) {
      return stories[0] ?? null;
    }

    return stories.find((story) => story.slug === storySlug) ?? null;
  }

  function syncStory(nextStory) {
    setStories((currentStories) => mergeStory(currentStories, nextStory));
    setActiveStorySlug((currentStorySlug) => currentStorySlug ?? nextStory.slug);

    return nextStory;
  }

  function setActiveStory(storySlug) {
    setActiveStorySlug(storySlug);
  }

  function updateStoryDraft(nextDraft) {
    setStoryDraft(nextDraft);
  }

  function resetStoryDraft() {
    setStoryDraft(createInitialStoryDraft());
  }

  function setChapterDraftForStory(storySlug, nextDraft, requestedChapterId = null) {
    const nextChapterId = nextDraft.chapterId ?? requestedChapterId;
    const currentDraftKey = getDraftKey(storySlug, requestedChapterId);
    const nextDraftKey = getDraftKey(storySlug, nextChapterId);

    setChapterDrafts((currentDrafts) => ({
      ...currentDrafts,
      [currentDraftKey]: nextDraft,
      [nextDraftKey]: nextDraft,
    }));

    return nextDraft;
  }

  async function createStory(nextDraft) {
    setIsSavingStory(true);

    try {
      const response = await createStudioStoryRequest(nextDraft);
      const nextStory = syncStory(response.story);

      setChapterDraftForStory(nextStory.slug, createDraftForStory(nextStory));
      setActiveStorySlug(nextStory.slug);
      resetStoryDraft();
      showCreatorNotice(`"${nextStory.title}" is live in your studio workspace.`);

      return nextStory.slug;
    } catch (error) {
      showCreatorNotice(error.message || "Could not create your story yet.", "info");
      throw error;
    } finally {
      setIsSavingStory(false);
    }
  }

  async function updateStory(storySlug, nextFields) {
    const story = getStory(storySlug);

    if (!story) {
      throw new Error("Story not found.");
    }

    setIsSavingStory(true);

    try {
      const response = await updateStudioStoryRequest(
        storySlug,
        buildStoryUpdatePayload(story, nextFields),
      );

      syncStory(response.story);
      showCreatorNotice("Story settings updated.");

      return response.story;
    } catch (error) {
      showCreatorNotice(error.message || "Could not update the story yet.", "info");
      throw error;
    } finally {
      setIsSavingStory(false);
    }
  }

  function getChapterDraft(storySlug, chapterId = null) {
    const draft =
      chapterDrafts[getDraftKey(storySlug, chapterId)] ??
      chapterDrafts[getDraftKey(storySlug, null)];

    if (draft) {
      return draft;
    }

    return createDraftForStory(getStory(storySlug));
  }

  async function loadChapterDraft(storySlug, chapterId) {
    if (!chapterId) {
      return createDraftForStory(getStory(storySlug));
    }

    setLoadingChapterDraftId(chapterId);

    try {
      const response = await fetchStudioChapterDraft(storySlug, chapterId);

      return setChapterDraftForStory(storySlug, response.chapterDraft, chapterId);
    } catch (error) {
      showCreatorNotice(
        error.message || "Could not load that chapter draft right now.",
        "info",
      );
      throw error;
    } finally {
      setLoadingChapterDraftId((currentChapterId) =>
        currentChapterId === chapterId ? null : currentChapterId,
      );
    }
  }

  function updateChapterDraft(storySlug, nextDraft, chapterId = null) {
    setChapterDraftForStory(
      storySlug,
      {
        ...nextDraft,
        chapterId: nextDraft.chapterId ?? chapterId ?? null,
        storyTitle: nextDraft.storyTitle ?? getStory(storySlug)?.title ?? "StoryArc",
      },
      chapterId,
    );
  }

  async function saveChapterDraft(storySlug, nextDraft, options = {}) {
    setIsSavingChapterDraft(true);

    try {
      const response = await saveStudioChapterDraftRequest(storySlug, nextDraft);

      if (response.story) {
        syncStory(response.story);
      }

      if (response.chapterDraft) {
        setChapterDraftForStory(
          storySlug,
          response.chapterDraft,
          nextDraft.chapterId ?? null,
        );
      }

      if (!options.silent) {
        showCreatorNotice(response.message || "Chapter draft saved.");
      }

      return response;
    } catch (error) {
      if (!options.silent) {
        showCreatorNotice(
          error.message || "Could not save your chapter draft.",
          "info",
        );
      }
      throw error;
    } finally {
      setIsSavingChapterDraft(false);
    }
  }

  async function scheduleChapter(storySlug, nextDraft) {
    setIsPublishingChapter(true);

    try {
      const savedDraftResponse = await saveChapterDraft(
        storySlug,
        {
          ...nextDraft,
          publishType: "scheduled",
        },
        { silent: true },
      );
      const chapterDraft = savedDraftResponse.chapterDraft;
      const response = await publishStudioChapterRequest(chapterDraft.chapterId, {
        mode: "scheduled",
        scheduledFor: chapterDraft.scheduledFor || nextDraft.scheduledFor || null,
      });

      if (response.story) {
        syncStory(response.story);
      }

      if (response.chapterDraft) {
        setChapterDraftForStory(storySlug, response.chapterDraft, chapterDraft.chapterId);
      }

      showCreatorNotice(response.message || "Chapter added to your scheduled release queue.");

      return response;
    } catch (error) {
      showCreatorNotice(
        error.message || "Could not schedule that chapter yet.",
        "info",
      );
      throw error;
    } finally {
      setIsPublishingChapter(false);
    }
  }

  async function publishChapter(storySlug, nextDraft) {
    setIsPublishingChapter(true);

    try {
      const savedDraftResponse = await saveChapterDraft(
        storySlug,
        {
          ...nextDraft,
          publishType: "now",
          scheduledFor: "",
        },
        { silent: true },
      );
      const chapterDraft = savedDraftResponse.chapterDraft;
      const response = await publishStudioChapterRequest(chapterDraft.chapterId, {
        mode: "now",
        scheduledFor: null,
      });
      const nextStory = response.story ? syncStory(response.story) : getStory(storySlug);

      if (nextStory) {
        setChapterDraftForStory(storySlug, createDraftForStory(nextStory));
      }

      showCreatorNotice(response.message || "Chapter published and pushed live.");

      return response;
    } catch (error) {
      showCreatorNotice(error.message || "Could not publish the chapter yet.", "info");
      throw error;
    } finally {
      setIsPublishingChapter(false);
    }
  }

  function addStoryVolume(storySlug) {
    setStories((currentStories) =>
      currentStories.map((story) =>
        story.slug === storySlug ? cloneStoryWithNewVolume(story) : story,
      ),
    );
    showCreatorNotice("New volume added to your structure map.");
  }

  function addStoryArc(storySlug, volumeId) {
    setStories((currentStories) =>
      currentStories.map((story) =>
        story.slug === storySlug ? cloneStoryWithNewArc(story, volumeId) : story,
      ),
    );
    showCreatorNotice("New arc added to the selected volume.");
  }

  async function saveVolumeStructure(storySlug) {
    const story = getStory(storySlug);

    if (!story) {
      throw new Error("Story not found.");
    }

    setIsSavingStructure(true);

    try {
      const response = await saveStudioStructureRequest(storySlug, {
        volumes: story.volumes.map((volume, volumeIndex) => ({
          arcs: volume.arcs.map((arc, arcIndex) => ({
            id: arc.id ?? null,
            sortOrder: arcIndex,
            status: arc.status ?? "Planning",
            title: arc.title,
          })),
          id: volume.id ?? null,
          number: volume.number,
          sortOrder: volumeIndex,
          status: volume.status ?? "Planning",
          title: volume.title,
        })),
      });

      if (response.story) {
        syncStory(response.story);
      }

      showCreatorNotice(response.message || "Volume and arc structure saved.");

      return response;
    } catch (error) {
      showCreatorNotice(
        error.message || "Could not save the volume structure yet.",
        "info",
      );
      throw error;
    } finally {
      setIsSavingStructure(false);
    }
  }

  async function uploadStoryCover(file) {
    if (!file) {
      return null;
    }

    setIsUploadingStoryCover(true);

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const [, base64 = ""] = dataUrl.split(",", 2);
      const response = await uploadStudioCoverRequest({
        base64,
        contentType: file.type || "image/png",
        filename: file.name,
      });

      setStoryDraft((currentDraft) => ({
        ...currentDraft,
        coverImage: response.coverImageUrl,
      }));
      showCreatorNotice("Story cover uploaded.");

      return response.coverImageUrl;
    } catch (error) {
      showCreatorNotice(
        error.message || "Could not upload that cover image right now.",
        "info",
      );
      throw error;
    } finally {
      setIsUploadingStoryCover(false);
    }
  }

  function getStoryCountSummary() {
    const totalStories = stories.length;
    const totalVolumes = stories.reduce((count, story) => count + story.volumes.length, 0);
    const totalArcs = stories.reduce(
      (count, story) => count + story.volumes.reduce((sum, volume) => sum + volume.arcCount, 0),
      0,
    );

    return {
      totalArcs,
      totalStories,
      totalVolumes,
    };
  }

  const activeStory = getStory(activeStorySlug);

  return (
    <CreatorContext.Provider
      value={{
        activeStory,
        activeStorySlug,
        addStoryArc,
        addStoryVolume,
        applicationDraft,
        chapterDrafts,
        clearCreatorNotice,
        createStory,
        creatorApplication,
        creatorApplicationStatus,
        creatorMode,
        creatorNotice,
        creatorStatus,
        enterReaderMode,
        enterWriterMode,
        getChapterDraft,
        getCreatorEntryHref,
        getCreatorNextStepHref,
        getStory,
        getStoryCountSummary,
        isCreatorApplicationLoading,
        isLoadingChapterDraft: Boolean(loadingChapterDraftId),
        isPublishingChapter,
        isSavingChapterDraft,
        isSavingCreatorDraft,
        isSavingStory,
        isSavingStructure,
        isStudioLoading,
        isSubmittingCreatorApplication,
        isUploadingStoryCover,
        loadChapterDraft,
        refreshCreatorState,
        refreshStudioStories,
        saveChapterDraft,
        saveCreatorDraft,
        saveVolumeStructure,
        scheduleChapter,
        setActiveStory,
        showCreatorNotice,
        stories,
        storyDraft,
        submitCreatorApplication,
        updateApplicationDraft,
        updateChapterDraft,
        updateStory,
        updateStoryDraft,
        uploadStoryCover,
        publishChapter,
        resetStoryDraft,
      }}
    >
      {children}
    </CreatorContext.Provider>
  );
}

export function useCreator() {
  const context = useContext(CreatorContext);

  if (!context) {
    throw new Error("useCreator must be used within a CreatorProvider");
  }

  return context;
}
