import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReaderStateScreen from "../components/ReaderStateScreen";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import Reveal from "../components/Reveal";
import { useMonetization } from "../context/MonetizationContext";
import { useToast } from "../context/ToastContext";
import {
  buildCoinStoreHref,
  buildPlanHref,
  pricingHref,
} from "../data/monetization";
import {
  buildChapterCompleteHref,
  buildChapterHref,
  buildLockedChapterHref,
  buildSearchHref,
  buildStoryHref,
  desktopLockedPreview,
  mobileLockedPreview,
} from "../data/readerFlow";
import { useChapterQuery } from "../reader/readerHooks";

function getSequentialAccessDescription(chapter) {
  if (!chapter?.requiredPreviousChapter) {
    return "Open the previous chapter first to continue in order.";
  }

  return `Continue with Chapter ${chapter.requiredPreviousChapter.chapterNumber}: ${chapter.requiredPreviousChapter.title} before opening this chapter.`;
}

function DesktopLockedChapter({
  canUnlockWithCoins,
  chapterNumber,
  chapterTitle,
  chapterUnlocked,
  coinStoreTo,
  coinBalance,
  handlePrimaryAction,
  handleWatchAd,
  lockedChapterCost,
  primaryLabel,
  premiumHref,
  premiumLabel,
  storyTitle,
  storyTo,
}) {
  return (
    <div className="hidden min-h-screen bg-background-dark font-display text-slate-100 md:block">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/20 bg-background-dark/80 px-6 py-3 backdrop-blur-md md:px-40">
          <Link className="flex items-center gap-4 text-primary" to="/dashboard">
            <span className="material-symbols-outlined text-3xl">auto_stories</span>
            <h2 className="text-lg font-bold tracking-tight text-slate-100">
              StoryArc
            </h2>
          </Link>

          <div className="flex gap-3">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-colors hover:bg-primary/20"
              type="button"
            >
              <span className="material-symbols-outlined">share</span>
            </button>
            <Link
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-colors hover:bg-primary/20"
              to={pricingHref}
            >
              <span className="material-symbols-outlined">workspace_premium</span>
            </Link>
            <Link
              className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-background-dark"
              to={coinStoreTo}
            >
              <span className="material-symbols-outlined text-[20px]">
                monetization_on
              </span>
              <span>{coinBalance}</span>
            </Link>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center">
          <div className="w-full max-w-[800px] px-6 py-10">
            <nav className="mb-8 flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-primary/70">
              <Link className="transition-colors hover:text-primary" to={storyTo}>
                {storyTitle}
              </Link>
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
              <span className="text-slate-100">Chapter {chapterNumber}</span>
            </nav>

            <h1 className="mb-8 font-serif text-4xl font-bold italic md:text-5xl">
              {chapterTitle}
            </h1>

            <Reveal className="relative space-y-6">
              {desktopLockedPreview.paragraphs.map((paragraph, index) => (
                <p
                  className="font-serif text-lg leading-relaxed text-slate-300"
                  key={`${index}-${paragraph.slice(0, 24)}`}
                >
                  {paragraph}
                </p>
              ))}

              <div className="relative mt-10">
                <div className="space-y-6 select-none opacity-40 blur-[4px]">
                  {desktopLockedPreview.blurredParagraphs.map((paragraph, index) => (
                    <p
                      className="font-serif text-lg leading-relaxed text-slate-400"
                      key={`${index}-${paragraph.slice(0, 24)}`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-background-dark" />

                <div className="absolute left-0 right-0 top-0 flex justify-center px-4 pb-40 pt-20">
                  <motion.div
                    className="w-full max-w-md rounded-xl border-2 border-primary/40 bg-zinc-900/90 p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                    initial={{ opacity: 0, y: 24 }}
                    transition={{ duration: 0.4 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: 0.25, once: true }}
                  >
                    <div className="mb-6 inline-flex rounded-full bg-primary/20 p-4">
                      <span className="material-symbols-outlined text-4xl text-primary">
                        {chapterUnlocked ? "lock_open" : "lock"}
                      </span>
                    </div>
                    <h3 className="mb-2 text-2xl font-bold">
                      {chapterUnlocked ? "Chapter Ready" : "Continue Reading"}
                    </h3>
                    <p className="mb-6 text-slate-400">
                      {chapterUnlocked
                        ? "Your access is active. Jump straight into Chapter 13 and keep reading."
                        : "Use coins, unlock premium access, or watch an ad to open the rest of the chapter."}
                    </p>

                    <div className="mb-6 grid grid-cols-2 gap-3 rounded-xl border border-primary/10 bg-background-dark/60 p-4 text-left">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                          Wallet
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-lg font-bold text-primary">
                          <span className="material-symbols-outlined text-base">
                            monetization_on
                          </span>
                          {coinBalance}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                          Unlock Cost
                        </p>
                        <p className="mt-2 text-lg font-bold text-slate-100">
                          {lockedChapterCost} coins
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <button
                        className="flex w-full items-center justify-center gap-3 rounded-lg bg-primary py-4 font-bold text-background-dark transition-all hover:shadow-[0_0_20px_rgba(244,192,37,0.4)]"
                        onClick={handlePrimaryAction}
                        type="button"
                      >
                        <span className="material-symbols-outlined">
                          {chapterUnlocked || canUnlockWithCoins
                            ? "menu_book"
                            : "shopping_bag"}
                        </span>
                        {primaryLabel}
                      </button>

                      <Link
                        className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-slate-700 py-4 font-bold text-slate-200 transition-all hover:border-primary/50 hover:bg-white/5"
                        to={premiumHref}
                      >
                        <span className="material-symbols-outlined">
                          workspace_premium
                        </span>
                        {premiumLabel}
                      </Link>

                      <button
                        className="flex w-full items-center justify-center gap-3 rounded-lg border border-primary/20 bg-primary/5 py-4 font-bold text-primary transition-all hover:bg-primary/10"
                        onClick={handleWatchAd}
                        type="button"
                      >
                        <span className="material-symbols-outlined">
                          play_circle
                        </span>
                        Watch Ad to Unlock
                      </button>
                    </div>

                    <Link
                      className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/80 transition-colors hover:text-primary"
                      to={pricingHref}
                    >
                      Compare all premium plans
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </Link>

                    <div className="mt-8 flex items-center justify-center gap-2">
                      <div className="flex -space-x-2">
                        {desktopLockedPreview.avatars.map((avatar) => (
                          <img
                            alt="Reader avatar"
                            className="h-8 w-8 rounded-full border-2 border-zinc-900 object-cover"
                            key={avatar}
                            src={avatar}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-slate-500">
                        {desktopLockedPreview.unlockedToday}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </Reveal>
          </div>
        </main>

        <footer className="border-t border-primary/10 bg-background-dark px-10 py-6 text-center">
          <p className="text-sm text-slate-500">
            © 2024 StoryArc Chronicles. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

function MobileLockedChapter({
  chapterNumber,
  chapterTitle,
  chapterUnlocked,
  chapterCompleteTo,
  coinStoreTo,
  coinBalance,
  handlePrimaryAction,
  handleWatchAd,
  lockedChapterCost,
  primaryLabel,
  premiumHref,
  premiumLabel,
  storyTitle,
  storyTo,
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="sticky top-0 z-10 flex items-center border-b border-slate-200 bg-background-light px-4 py-3 dark:border-primary/10 dark:bg-background-dark/95">
        <div className="flex items-center gap-3">
          <Link className="transition-colors hover:text-primary" to={chapterCompleteTo}>
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-sm font-bold leading-tight">
              Chapter {chapterNumber}: Locked
            </h1>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-primary/60">
              {storyTitle}
            </p>
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <Link className="transition-colors hover:text-primary" to={pricingHref}>
            <span className="material-symbols-outlined text-xl">workspace_premium</span>
          </Link>
          <Link className="transition-colors hover:text-primary" to={coinStoreTo}>
            <span className="material-symbols-outlined text-xl">more_vert</span>
          </Link>
        </div>
      </header>

      <main className="relative flex-1 overflow-y-auto px-6 py-8">
        <article className="space-y-6">
          {mobileLockedPreview.paragraphs.map((paragraph, index) => (
            <p
              className="text-lg leading-relaxed text-slate-700 dark:text-slate-300"
              key={`${index}-${paragraph.slice(0, 24)}`}
            >
              {paragraph}
            </p>
          ))}

          <div className="relative">
            <div className="space-y-6 select-none opacity-50 blur-[4px]">
              {mobileLockedPreview.blurredParagraphs.map((paragraph, index) => (
                <p
                  className="text-lg leading-relaxed text-slate-700 dark:text-slate-300"
                  key={`${index}-${paragraph.slice(0, 24)}`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="absolute inset-x-0 -top-12 flex justify-center px-4">
              <motion.div
                className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-2xl backdrop-blur-md dark:border-primary/20 dark:bg-slate-900/40"
                initial={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.4, once: true }}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="material-symbols-outlined fill-1 text-4xl text-primary">
                    {chapterUnlocked ? "lock_open" : "lock"}
                  </span>
                </div>
                <h2 className="mb-2 text-xl font-bold">
                  {chapterUnlocked
                    ? "Chapter Ready to Open"
                    : chapterTitle}
                </h2>
                <p className="mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {chapterUnlocked
                    ? "Your purchase or unlock is active. Continue reading as soon as you are ready."
                    : "Choose coins, premium, or a rewarded ad to open the rest of this chapter."}
                </p>

                <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-primary/5 dark:bg-background-dark/50">
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Your Balance
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-primary">
                        monetization_on
                      </span>
                      <span className="font-bold">{coinBalance}</span>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-slate-200 dark:bg-primary/10" />
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Chapter Cost
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-primary">
                        monetization_on
                      </span>
                      <span className="font-bold">{lockedChapterCost}</span>
                    </div>
                  </div>
                </div>

                <button
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 font-bold text-background-dark shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  onClick={handlePrimaryAction}
                  type="button"
                >
                  <span>{primaryLabel}</span>
                </button>
                <Link
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 py-4 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
                  to={premiumHref}
                >
                  <span className="material-symbols-outlined text-base">
                    workspace_premium
                  </span>
                  {premiumLabel}
                </Link>
                <button
                  className="mt-4 w-full text-xs font-semibold uppercase tracking-widest text-slate-400 transition-colors hover:text-primary dark:text-primary/60"
                  onClick={handleWatchAd}
                  type="button"
                >
                  Watch ad to unlock
                </button>
                <Link
                  className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-primary/70"
                  to={pricingHref}
                >
                  Compare plans
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>
        </article>
      </main>

      <footer className="sticky bottom-0 z-10 w-full border-t border-slate-200 bg-background-light px-2 pb-4 pt-2 backdrop-blur-sm dark:border-primary/10 dark:bg-background-dark/95">
        <div className="mx-auto flex max-w-lg justify-around items-end">
          <Link className="group flex flex-col items-center gap-1" to={storyTo}>
            <span className="material-symbols-outlined text-slate-400 transition-colors group-hover:text-primary">
              library_books
            </span>
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary">
              Library
            </span>
          </Link>
          <Link className="group flex flex-col items-center gap-1" to={buildSearchHref("Fantasy")}>
            <span className="material-symbols-outlined text-slate-400 transition-colors group-hover:text-primary">
              explore
            </span>
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary">
              Discover
            </span>
          </Link>
          <Link className="group flex flex-col items-center gap-1" to={chapterCompleteTo}>
            <span className="material-symbols-outlined fill-1 text-primary">
              auto_stories
            </span>
            <span className="text-[10px] font-medium text-primary">Reading</span>
          </Link>
          <Link className="group flex flex-col items-center gap-1" to={pricingHref}>
            <span className="material-symbols-outlined text-slate-400 transition-colors group-hover:text-primary">
              notifications
            </span>
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary">
              Plans
            </span>
          </Link>
          <Link className="group flex flex-col items-center gap-1" to="/dashboard">
            <span className="material-symbols-outlined text-slate-400 transition-colors group-hover:text-primary">
              person
            </span>
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary">
              Profile
            </span>
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default function LockedChapterPage() {
  const navigate = useNavigate();
  const { storySlug = "wolvex", chapterSlug = "chapter-13" } = useParams();
  const { showToast } = useToast();
  const { data, error, isError, isLoading } = useChapterQuery(storySlug, chapterSlug);
  const {
    canUnlockWithCoins,
    coinBalance,
    hasPremium,
    isChapterUnlocked,
    spendCoinsForChapter,
    unlockWithAd,
  } = useMonetization();
  const chapter = data?.chapter;
  const story = data?.story;
  const chapterHref = buildChapterHref(storySlug, chapterSlug);
  const lockedChapterHref = buildLockedChapterHref(storySlug, chapterSlug);
  const coinStoreTo = buildCoinStoreHref(lockedChapterHref);
  const storyTo = buildStoryHref(storySlug);
  const chapterCompleteTo = buildChapterCompleteHref(storySlug, chapterSlug);
  const lockedChapterKey = `${storySlug}-${chapterSlug}`;
  const lockedChapterCost = chapter?.unlockPriceCoins ?? 0;
  const chapterUnlocked =
    chapter?.accessState === "READABLE" ||
    hasPremium ||
    isChapterUnlocked(lockedChapterKey);
  const canSpendNow = canUnlockWithCoins(lockedChapterCost);
  const missingCoins = Math.max(lockedChapterCost - coinBalance, 0);
  const primaryLabel = chapterUnlocked
    ? "Continue Reading"
    : canSpendNow
      ? `Unlock with ${lockedChapterCost} Coins`
      : `Get ${missingCoins} More Coins`;
  const premiumHref = chapterUnlocked
    ? chapterHref
    : buildPlanHref("arcane", lockedChapterHref);
  const premiumLabel = hasPremium ? "Premium Active" : "Subscribe to Premium";

  if (isLoading) {
    return <RouteLoadingScreen />;
  }

  if (isError || !story || !chapter) {
    return (
      <ReaderStateScreen
        ctaLabel="Back to Dashboard"
        ctaTo="/dashboard"
        description={error?.message || "This locked chapter could not be loaded."}
        secondaryLabel="Browse Stories"
        secondaryTo="/search?q=Fantasy"
        title="Locked Chapter Unavailable"
        tone="error"
      />
    );
  }

  if (chapter.accessState === "SEQUENCE_BLOCKED") {
    return (
      <ReaderStateScreen
        ctaLabel={
          chapter.requiredPreviousChapter
            ? `Open Chapter ${chapter.requiredPreviousChapter.chapterNumber}`
            : "Open Story"
        }
        ctaTo={
          chapter.requiredPreviousChapter
            ? buildChapterHref(story.slug, chapter.requiredPreviousChapter.chapterSlug)
            : storyTo
        }
        description={getSequentialAccessDescription(chapter)}
        secondaryLabel="Back to Story"
        secondaryTo={storyTo}
        title="Continue in Order"
      />
    );
  }

  async function handlePrimaryAction() {
    if (chapterUnlocked) {
      navigate(chapterHref);
      return;
    }

    if (!canSpendNow) {
      navigate(coinStoreTo);
      return;
    }

    try {
      await spendCoinsForChapter({
        chapterSlug,
        storySlug,
      });
      navigate(chapterHref);
    } catch (unlockError) {
      showToast(unlockError?.message || "Could not unlock this chapter.", {
        title: "Unlock failed",
        tone: "error",
      });
    }
  }

  async function handleWatchAd() {
    try {
      await unlockWithAd({
        chapterSlug,
        storySlug,
      });
      navigate(chapterHref);
    } catch (unlockError) {
      showToast(unlockError?.message || "Could not apply ad unlock.", {
        title: "Ad unlock failed",
        tone: "error",
      });
    }
  }

  return (
    <>
      <DesktopLockedChapter
        canUnlockWithCoins={canSpendNow}
        chapterNumber={chapter.chapterNumber}
        chapterTitle={chapter.chapterTitle}
        chapterUnlocked={chapterUnlocked}
        coinStoreTo={coinStoreTo}
        coinBalance={coinBalance}
        handlePrimaryAction={handlePrimaryAction}
        handleWatchAd={handleWatchAd}
        lockedChapterCost={lockedChapterCost}
        premiumHref={premiumHref}
        premiumLabel={premiumLabel}
        primaryLabel={primaryLabel}
        storyTitle={story.title}
        storyTo={storyTo}
      />
      <MobileLockedChapter
        chapterNumber={chapter.chapterNumber}
        chapterTitle={chapter.chapterTitle}
        chapterUnlocked={chapterUnlocked}
        chapterCompleteTo={chapterCompleteTo}
        coinStoreTo={coinStoreTo}
        coinBalance={coinBalance}
        handlePrimaryAction={handlePrimaryAction}
        handleWatchAd={handleWatchAd}
        lockedChapterCost={lockedChapterCost}
        premiumHref={premiumHref}
        premiumLabel={premiumLabel}
        primaryLabel={primaryLabel}
        storyTitle={story.title}
        storyTo={storyTo}
      />
    </>
  );
}
