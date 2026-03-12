import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import Reveal from "../components/Reveal";
import { useCreator } from "../context/CreatorContext";
import {
  creatorCommunityActions,
  creatorCommunityTabs,
} from "../data/communityFlow";
import {
  createAnnouncement,
  createPoll,
  fetchCommunity,
  votePoll,
} from "../engagement/engagementApi";

function CommunityTabs({ activeTab, onChange, tabs = creatorCommunityTabs }) {
  return (
    <nav className="hide-scrollbar flex gap-6 overflow-x-auto border-b border-primary/10">
      {tabs.map((tab) => {
        const active = tab.id === activeTab;

        return (
          <button
            className={`shrink-0 border-b-2 px-1 pb-4 pt-1 text-sm font-bold transition-colors ${
              active
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 dark:text-slate-400"
            }`}
            key={tab.id}
            onClick={() => onChange(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}

function LivePollCard({ compact = false, isVoting, onVote, poll }) {
  if (!poll) {
    return (
      <section className="rounded-3xl border border-primary/20 bg-primary/5 p-5">
        <h2 className={`${compact ? "text-lg" : "text-xl"} font-black`}>
          No live poll yet
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Publish a poll from the quick actions panel to start collecting votes.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-primary/20 bg-primary/5">
      <div className="h-36 bg-[radial-gradient(circle_at_top_left,_rgba(244,192,37,0.32),_transparent_55%),linear-gradient(135deg,#27241b,#181611)] p-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-[11px] font-black uppercase tracking-widest text-background-dark">
          <span className="size-2 rounded-full bg-background-dark" />
          Live Poll
        </span>
      </div>
      <div className="p-5">
        <h2 className={`${compact ? "text-lg" : "text-xl"} font-black`}>
          {poll.title}
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {poll.subtitle}
        </p>

        <div className="mt-5 space-y-3">
          {poll.options.map((option) => (
            <button
              className="relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-primary/10 bg-background-dark/50 px-4 py-3 text-left"
              key={option.id}
              onClick={() => onVote(option.id)}
              type="button"
            >
              <span
                className="absolute inset-y-0 left-0 rounded-l-2xl bg-primary/15"
                style={{ width: `${option.percent}%` }}
              />
              <span className="relative z-10 text-sm font-medium">{option.label}</span>
              <span
                className={`relative z-10 text-xs font-bold ${
                  option.voted ? "text-primary" : "text-slate-400"
                }`}
              >
                {option.percent}%
              </span>
            </button>
          ))}
        </div>

        <button
          className="mt-5 w-full rounded-2xl bg-primary py-3 text-sm font-bold text-background-dark disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isVoting}
          onClick={() => {
            const preferredOption = poll.options.find((option) => option.voted);

            if (preferredOption) {
              onVote(preferredOption.id);
            }
          }}
          type="button"
        >
          {isVoting ? "Saving Vote..." : "Vote & View Results"}
        </button>
      </div>
    </section>
  );
}

function QuickActions({ onTrigger }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2">
      {creatorCommunityActions.map((action) => (
        <button
          className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/10 p-4 text-left transition-colors hover:bg-primary/20"
          key={action.id}
          onClick={() => onTrigger(action)}
          type="button"
        >
          <span className="material-symbols-outlined text-primary">{action.icon}</span>
          <div>
            <p className="text-sm font-bold text-primary">{action.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{action.detail}</p>
          </div>
        </button>
      ))}
    </section>
  );
}

function FeedCard({ item }) {
  return (
    <article className="rounded-3xl border border-primary/10 bg-white/80 p-5 dark:bg-primary/5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
            <span className="material-symbols-outlined">
              {item.type === "Poll" ? "poll" : "campaign"}
            </span>
          </div>
          <div>
            <p className="font-bold">{item.author}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {item.publishedAt} • {item.type}
            </p>
          </div>
        </div>
        <button className="text-slate-500" type="button">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-bold">{item.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {item.body}
        </p>
      </div>

      {item.image ? (
        <div className="mt-4 overflow-hidden rounded-2xl">
          <img alt={item.title} className="aspect-video w-full object-cover" src={item.image} />
        </div>
      ) : null}

      {item.options ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {item.options.map((option) => (
            <div className="overflow-hidden rounded-2xl border border-primary/10 bg-background-dark/50" key={option.label}>
              <img alt={option.label} className="aspect-square w-full object-cover" src={option.image} />
              <div className="p-3 text-xs font-bold">{option.label}</div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">favorite</span>
            {item.likes ?? "856"}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">
              {item.type === "Poll" ? "poll" : "chat_bubble"}
            </span>
            {item.votes ?? item.comments}
          </span>
        </div>
        {item.cta ? (
          <button className="text-xs font-bold uppercase tracking-widest text-primary" type="button">
            {item.cta}
          </button>
        ) : (
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
            {item.voted}
          </span>
        )}
      </div>
    </article>
  );
}

function FeedList({ activeTab, archivedPosts, feed, scheduledPosts }) {
  const items =
    activeTab === "polls"
      ? feed.filter((item) => item.type === "Poll")
      : activeTab === "scheduled"
      ? scheduledPosts
      : activeTab === "archive"
        ? archivedPosts
        : feed;

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-primary/20 bg-primary/5 p-6 text-sm text-slate-500 dark:text-slate-400">
        No community posts in this tab yet.
      </div>
    );
  }

  if (activeTab === "scheduled" || activeTab === "archive") {
    return (
      <div className="space-y-4">
        {items.map((item) => (
          <div
            className="rounded-3xl border border-primary/10 bg-white/80 p-5 dark:bg-primary/5"
            key={item.id}
          >
            <p className="text-lg font-bold">{item.title}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.detail}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {items.map((item) => (
        <FeedCard item={item} key={item.id} />
      ))}
    </div>
  );
}

function DesktopCommunity({
  activeTab,
  community,
  isVoting,
  onAction,
  onTabChange,
  onVote,
  storySlug,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex min-h-screen">
        <AppDesktopSidebar memberLabel="Pro Creator" mode="creator" storySlug={storySlug} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-6xl space-y-8">
            <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
                  Creator Hub
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-tight">
                  Polls & Announcements
                </h1>
                <p className="mt-2 max-w-2xl text-base text-slate-500 dark:text-slate-400">
                  Publish updates, launch community votes, and keep your readers involved
                  between chapter releases.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {(community.stats ?? []).map((stat) => (
                  <div
                    className="rounded-2xl border border-primary/10 bg-white/80 px-4 py-3 text-center dark:bg-primary/5"
                    key={stat.label}
                  >
                    <p className="text-xl font-black">{stat.value}</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <CommunityTabs activeTab={activeTab} onChange={onTabChange} />

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <Reveal>
                <FeedList
                  activeTab={activeTab}
                  archivedPosts={community.archived ?? []}
                  feed={community.feed ?? []}
                  scheduledPosts={community.scheduled ?? []}
                />
              </Reveal>

              <div className="space-y-6">
                <Reveal>
                  <LivePollCard
                    isVoting={isVoting}
                    onVote={onVote}
                    poll={community.livePoll}
                  />
                </Reveal>
                <Reveal>
                  <QuickActions onTrigger={onAction} />
                </Reveal>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileCommunity({
  activeTab,
  community,
  isVoting,
  onAction,
  onTabChange,
  onVote,
  storySlug,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex h-screen flex-col overflow-hidden">
        <header className="sticky top-0 z-50 border-b border-primary/10 bg-background-light/90 px-4 py-3 backdrop-blur-md dark:bg-background-dark/90">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Creator Hub
              </p>
              <h1 className="text-lg font-bold">StoryArc Community</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-full p-2 transition-colors hover:bg-primary/10" type="button">
                <span className="material-symbols-outlined">search</span>
              </button>
              <button className="rounded-full p-2 transition-colors hover:bg-primary/10" type="button">
                <span className="material-symbols-outlined">notifications</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-24">
          <div className="space-y-5 px-4 py-4">
            <CommunityTabs
              activeTab={activeTab}
              onChange={onTabChange}
              tabs={creatorCommunityTabs.slice(0, 2)}
            />
            <LivePollCard
              compact
              isVoting={isVoting}
              onVote={onVote}
              poll={community.livePoll}
            />
            <QuickActions onTrigger={onAction} />
            <FeedList
              activeTab={activeTab}
              archivedPosts={community.archived ?? []}
              feed={community.feed ?? []}
              scheduledPosts={community.scheduled ?? []}
            />
          </div>
        </main>

        <AppMobileTabBar mode="creator" storySlug={storySlug} />
      </div>
    </div>
  );
}

export default function PollsAnnouncementsPage() {
  const navigate = useNavigate();
  const {
    activeStorySlug,
    creatorStatus,
    enterWriterMode,
    getCreatorEntryHref,
    showCreatorNotice,
  } = useCreator();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("recent");
  const communityQuery = useQuery({
    queryKey: ["engagement", "community", activeStorySlug ?? "default"],
    queryFn: () => fetchCommunity(activeStorySlug ?? undefined),
    enabled: creatorStatus === "approved",
  });
  const announcementMutation = useMutation({
    mutationFn: createAnnouncement,
  });
  const pollMutation = useMutation({
    mutationFn: createPoll,
  });
  const voteMutation = useMutation({
    mutationFn: ({ optionId, postId }) => votePoll(postId, { optionId }),
  });

  useEffect(() => {
    enterWriterMode();

    if (creatorStatus !== "approved") {
      navigate(getCreatorEntryHref(), { replace: true });
    }
  }, [creatorStatus, enterWriterMode, getCreatorEntryHref, navigate]);

  async function handleAction(action) {
    try {
      if (action.id === "poll") {
        const response = await pollMutation.mutateAsync({
          body: "Choose the next bonus drop your readers will see in StoryArc Community.",
          options: [
            { label: "Character dossiers" },
            { label: "Lore and worldbuilding notes" },
          ],
          storySlug: activeStorySlug,
          title: "What should go live next?",
        });

        await queryClient.invalidateQueries({
          queryKey: ["engagement", "community", activeStorySlug ?? "default"],
        });
        showCreatorNotice(response.message || "Poll published.");
        return;
      }

      const response = await announcementMutation.mutateAsync({
        body: "A fresh creator update just went live. Use this feed to keep readers informed between chapter drops.",
        imageUrl:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
        storySlug: activeStorySlug,
        title: "New creator update is live",
      });

      await queryClient.invalidateQueries({
        queryKey: ["engagement", "community", activeStorySlug ?? "default"],
      });
      showCreatorNotice(response.message || "Announcement published.");
    } catch (error) {
      showCreatorNotice(
        error.message || "Could not publish the community update right now.",
        "info",
      );
    }
  }

  async function handleVote(optionId) {
    const livePoll = communityQuery.data?.livePoll;

    if (!livePoll) {
      return;
    }

    try {
      const response = await voteMutation.mutateAsync({
        optionId,
        postId: livePoll.postId,
      });

      queryClient.setQueryData(
        ["engagement", "community", activeStorySlug ?? "default"],
        response.community,
      );
      showCreatorNotice(response.message || "Vote recorded.");
    } catch (error) {
      showCreatorNotice(error.message || "Could not record the vote.", "info");
    }
  }

  const community = communityQuery.data ?? {
    archived: [],
    feed: [],
    livePoll: null,
    scheduled: [],
    stats: [
      { label: "Reach", value: "0" },
      { label: "Engagement", value: "0.0%" },
      { label: "Poll Votes", value: "0" },
    ],
  };

  return (
    <>
      <DesktopCommunity
        activeTab={activeTab}
        community={community}
        isVoting={voteMutation.isPending}
        onAction={handleAction}
        onTabChange={setActiveTab}
        onVote={handleVote}
        storySlug={activeStorySlug}
      />
      <MobileCommunity
        activeTab={activeTab}
        community={community}
        isVoting={voteMutation.isPending}
        onAction={handleAction}
        onTabChange={setActiveTab}
        onVote={handleVote}
        storySlug={activeStorySlug}
      />
    </>
  );
}
