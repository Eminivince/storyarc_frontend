import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Reveal from "../components/Reveal";
import ReaderStateScreen from "../components/ReaderStateScreen";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import SkeletonBlock from "../components/SkeletonBlock";
import { useMonetization } from "../context/MonetizationContext";
import { useToast } from "../context/ToastContext";
import { buildGiftSendingHref } from "../data/communityFlow";
import { buildCoinStoreHref } from "../data/monetization";
import { buildStoryHref } from "../data/readerFlow";
import { useStoryDetailsQuery } from "../reader/readerHooks";

function getAuthorFirstName(authorName) {
  return authorName?.trim()?.split(/\s+/)[0] || "creator";
}

function getAuthorInitials(authorName) {
  return authorName
    ?.trim()
    ?.split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "SC";
}

function GiftCatalogNotice({ message, compact }) {
  return (
    <div
      className={`border border-primary/15 bg-primary/5 text-slate-500 dark:text-slate-400 ${
        compact ? "rounded-xl p-3 text-xs" : "rounded-3xl p-5 text-sm"
      }`}
    >
      {message}
    </div>
  );
}

function CreatorAvatar({ authorImage, authorName }) {
  if (authorImage) {
    return (
      <img
        alt={authorName}
        className="size-full rounded-full object-cover"
        src={authorImage}
      />
    );
  }

  return (
    <div className="flex size-full items-center justify-center rounded-full bg-primary/15 text-2xl font-black text-primary">
      {getAuthorInitials(authorName)}
    </div>
  );
}

function LoadingState() {
  return <RouteLoadingScreen />;
}

function GiftCatalogSkeleton({ mobile = false }) {
  const items = 4;

  return (
    <div className={mobile ? "grid grid-cols-2 gap-2" : "grid gap-4 sm:grid-cols-2"}>
      {Array.from({ length: items }).map((_, index) => (
        <div
          className={`border border-primary/10 ${
            mobile ? "rounded-2xl bg-primary/5 p-2.5" : "rounded-3xl p-4 bg-white/80 dark:bg-primary/5"
          }`}
          key={index}
        >
          <SkeletonBlock className={`aspect-square w-full ${mobile ? "rounded-xl" : "rounded-2xl"}`} />
          <div className={mobile ? "mt-2 space-y-1.5" : "mt-4 space-y-2"}>
            <SkeletonBlock className={mobile ? "h-3 w-3/4" : "h-4 w-3/4"} />
            <SkeletonBlock className={mobile ? "h-2.5 w-1/3" : "h-3 w-1/3"} />
            {!mobile ? <SkeletonBlock className="h-3 w-full" /> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function DesktopGiftSending({
  balance,
  catalogError,
  gifts,
  isCatalogLoading,
  message,
  onMessageChange,
  onSelectGift,
  onSend,
  selectedGift,
  storyMeta,
}) {
  const authorFirstName = getAuthorFirstName(storyMeta.authorName);
  const storyHref = buildStoryHref(storyMeta.storySlug);

  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <header className="sticky top-0 z-50 border-b border-primary/10 bg-background-light/90 backdrop-blur-md dark:bg-background-dark/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-10">
          <Link
            className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-primary/10"
            to={storyHref}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
              Reader Support
            </p>
            <h1 className="text-2xl font-black tracking-tight">Send a Gift</h1>
          </div>
          <button
            className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-primary/10"
            type="button"
          >
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:px-10">
        <div className="space-y-8">
          <Reveal className="flex items-center gap-5 rounded-3xl border border-primary/10 bg-white/80 p-6 dark:bg-primary/5">
            <div className="size-24 rounded-full border-2 border-primary bg-background-light shadow-lg shadow-primary/10 dark:bg-background-dark">
              <CreatorAvatar
                authorImage={storyMeta.authorImage}
                authorName={storyMeta.authorName}
              />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-primary">
                Support Creator
              </p>
              <h2 className="mt-2 text-3xl font-black">{storyMeta.authorName}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Author of <span className="italic text-primary">{storyMeta.storyTitle}</span>
              </p>
            </div>
          </Reveal>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Choose a Gift</h3>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                Balance: {balance} Coins
              </span>
            </div>

            {isCatalogLoading ? (
              <GiftCatalogSkeleton />
            ) : catalogError ? (
              <GiftCatalogNotice
                message={catalogError.message || "The gift catalog could not be loaded right now."}
              />
            ) : gifts.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {gifts.map((gift) => {
                  const active = gift.id === selectedGift?.id;

                  return (
                    <motion.button
                      className={`group overflow-hidden rounded-3xl border p-4 text-left transition-colors ${
                        active
                          ? "border-primary bg-primary/15 ring-2 ring-primary/30"
                          : "border-primary/10 bg-white/80 hover:border-primary/30 hover:bg-primary/5 dark:bg-primary/5"
                      }`}
                      key={gift.id}
                      onClick={() => onSelectGift(gift)}
                      type="button"
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative flex aspect-square items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(244,192,37,0.25),_transparent_60%),linear-gradient(135deg,rgba(244,192,37,0.14),rgba(15,23,42,0.85))]">
                        <span className="material-symbols-outlined text-6xl text-primary">
                          {gift.icon}
                        </span>
                        {active ? (
                          <span className="absolute right-3 top-3 rounded-full bg-primary p-1 text-background-dark">
                            <span className="material-symbols-outlined text-sm">check</span>
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className={`font-bold ${active ? "text-primary" : ""}`}>{gift.name}</p>
                          <span className="text-sm font-bold text-primary">{gift.coins} Coins</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          {gift.description}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <GiftCatalogNotice message="No gift options are available right now." />
            )}
          </section>

          <section className="rounded-3xl border border-primary/10 bg-white/80 p-6 dark:bg-primary/5">
            <label className="block">
              <span className="mb-3 block text-base font-bold uppercase tracking-widest text-slate-400">
                Personalized Message
              </span>
              <textarea
                className="min-h-[160px] w-full rounded-2xl border border-primary/20 bg-primary/5 p-4 text-base leading-relaxed focus:border-primary focus:ring-primary"
                onChange={(event) => onMessageChange(event.target.value)}
                placeholder={`Write a supportive note to ${authorFirstName}...`}
                value={message}
              />
            </label>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-primary/10 bg-primary/5 p-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-primary">info</span>
              Gifts help authors unlock bonus rewards and keep premium chapters coming.
            </div>
          </section>
        </div>

        <Reveal className="h-fit rounded-3xl border border-primary/15 bg-white/90 p-6 shadow-xl shadow-primary/5 dark:bg-primary/5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Summary</p>
          <h3 className="mt-3 text-2xl font-black">
            {selectedGift?.name ?? "No gift selected"}
          </h3>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">Gift Cost</span>
              <span className="font-bold">{selectedGift?.coins ?? 0} Coins</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">Remaining</span>
              <span className="font-bold">
                {Math.max(balance - (selectedGift?.coins ?? 0), 0)} Coins
              </span>
            </div>
          </div>
          <button
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-bold text-background-dark shadow-lg shadow-primary/20 transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            disabled={!selectedGift}
            onClick={onSend}
            type="button"
          >
            <span className="material-symbols-outlined">card_giftcard</span>
            Send Gift
          </button>
          <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
            Reader gifts are a direct support signal for creators on StoryArc.
          </p>
        </Reveal>
      </main>
    </div>
  );
}

function MobileGiftSending({
  balance,
  catalogError,
  gifts,
  isCatalogLoading,
  message,
  onMessageChange,
  onSelectGift,
  onSend,
  selectedGift,
  storyMeta,
}) {
  const authorFirstName = getAuthorFirstName(storyMeta.authorName);
  const storyHref = buildStoryHref(storyMeta.storySlug);

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex h-screen flex-col overflow-hidden">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/10 bg-background-light/90 px-3 py-2.5 backdrop-blur-md dark:bg-background-dark/90">
          <Link
            className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-primary/10"
            to={storyHref}
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </Link>
          <h1 className="text-base font-bold tracking-tight">Send a Gift</h1>
          <button
            className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-primary/10"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">help</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto pb-36 mt-4">
          

          <div className="space-y-4 px-3">
            <section>
              <div className="mb-3 flex items-center justify-between px-0.5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary/80">
                  Choose a Gift
                </h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                  {balance} Coins
                </span>
              </div>
              {isCatalogLoading ? (
                <GiftCatalogSkeleton mobile />
              ) : catalogError ? (
                <GiftCatalogNotice
                  compact
                  message={catalogError.message || "The gift catalog could not be loaded right now."}
                />
              ) : gifts.length ? (
                <div className="grid grid-cols-2 gap-2">
                  {gifts.map((gift) => {
                    const active = gift.id === selectedGift?.id;

                    return (
                      <button
                        className={`flex flex-col gap-2 rounded-2xl border p-2.5 text-left transition-colors ${
                          active
                            ? "border-primary/40 bg-primary/20 ring-2 ring-primary/30"
                            : "border-primary/10 bg-primary/5"
                        }`}
                        key={gift.id}
                        onClick={() => onSelectGift(gift)}
                        type="button"
                      >
                        <div className="relative flex aspect-square items-center justify-center rounded-xl bg-[radial-gradient(circle_at_top,_rgba(244,192,37,0.25),_transparent_60%),linear-gradient(135deg,rgba(244,192,37,0.14),rgba(15,23,42,0.85))]">
                          <span className="material-symbols-outlined text-4xl text-primary">
                            {gift.icon}
                          </span>
                          {active ? (
                            <div className="absolute right-1.5 top-1.5 rounded-full bg-primary p-0.5 text-background-dark">
                              <span className="material-symbols-outlined text-xs">check</span>
                            </div>
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className={`truncate text-xs font-bold ${active ? "text-primary" : ""}`}>
                            {gift.name}
                          </p>
                          <p className="text-[11px] font-medium text-slate-400">{gift.coins} Coins</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <GiftCatalogNotice compact message="No gift options are available right now." />
              )}
            </section>

            <section>
              <label className="block">
                <span className="mb-1.5 ml-1 block text-xs font-bold uppercase tracking-widest text-slate-400">
                  Message
                </span>
                <textarea
                  className="min-h-[88px] w-full rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 text-sm focus:border-primary focus:ring-primary"
                  onChange={(event) => onMessageChange(event.target.value)}
                  placeholder={`Note to ${authorFirstName}...`}
                  value={message}
                />
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-primary/10 bg-primary/5 p-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-base text-primary">info</span>
                Gifts help authors unlock rewards and keep creating.
              </div>
            </section>
          </div>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 border-t border-primary/20 bg-background-light/90 p-3 backdrop-blur-xl dark:bg-background-dark/90">
          <div className="mb-2 flex items-center justify-between px-1">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Total
              </p>
              <p className="text-lg font-black">{selectedGift?.coins ?? 0} Coins</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Left
              </p>
              <p className="text-xs font-semibold text-slate-400">
                {Math.max(balance - (selectedGift?.coins ?? 0), 0)}
              </p>
            </div>
          </div>
          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-background-dark shadow-lg shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!selectedGift}
            onClick={onSend}
            type="button"
          >
            <span className="material-symbols-outlined text-lg">card_giftcard</span>
            Send Gift to {authorFirstName}
          </button>
        </footer>
      </div>
    </div>
  );
}

export default function GiftSendingPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { storySlug } = useParams();
  const storyQuery = useStoryDetailsQuery(storySlug);
  const {
    catalogError,
    coinBalance,
    giftCatalog,
    isCatalogLoading,
    sendGift,
  } = useMonetization();
  const [selectedGiftId, setSelectedGiftId] = useState(null);
  const [message, setMessage] = useState("");
  const storyMeta = {
    authorImage: null,
    authorName: storyQuery.data?.story?.authorName ?? "Creator",
    storySlug: storyQuery.data?.story?.slug ?? storySlug ?? "",
    storyTitle: storyQuery.data?.story?.title ?? "StoryArc Story",
  };
  const selectedGift =
    giftCatalog.find((gift) => gift.id === selectedGiftId) ?? null;

  useEffect(() => {
    if (!giftCatalog.length) {
      if (selectedGiftId !== null) {
        setSelectedGiftId(null);
      }

      return;
    }

    if (!giftCatalog.some((gift) => gift.id === selectedGiftId)) {
      setSelectedGiftId(giftCatalog[0].id);
    }
  }, [giftCatalog, selectedGiftId]);

  if (!storySlug) {
    return (
      <ReaderStateScreen
        ctaLabel="Back to Dashboard"
        ctaTo="/dashboard"
        description="Open a story first, then send a gift from that story page."
        title="Story Not Selected"
        tone="error"
      />
    );
  }

  if (storyQuery.isLoading) {
    return <LoadingState />;
  }

  if (storyQuery.isError || !storyQuery.data?.story) {
    return (
      <ReaderStateScreen
        ctaLabel="Back to Dashboard"
        ctaTo="/dashboard"
        description={
          storyQuery.error?.message ||
          "This story could not be loaded, so the gift flow is unavailable."
        }
        secondaryLabel="Browse Stories"
        secondaryTo="/search"
        title="Gift Flow Unavailable"
        tone="error"
      />
    );
  }

  async function handleSendGift() {
    if (!selectedGift) {
      return;
    }

    try {
      await sendGift({
        costCoins: selectedGift.coins,
        giftCode: selectedGift.id,
        giftName: selectedGift.name,
        message,
        storySlug,
      });
    } catch (error) {
      if (/not enough coins/i.test(error?.message || "")) {
        navigate(buildCoinStoreHref(buildGiftSendingHref(storySlug)));
        return;
      }

      showToast(error?.message || "Could not send this gift.", {
        title: "Gift failed",
        tone: "error",
      });
    }
  }

  return (
    <>
      <DesktopGiftSending
        balance={coinBalance}
        catalogError={catalogError}
        gifts={giftCatalog}
        isCatalogLoading={isCatalogLoading}
        message={message}
        onMessageChange={setMessage}
        onSelectGift={(gift) => setSelectedGiftId(gift.id)}
        onSend={handleSendGift}
        selectedGift={selectedGift}
        storyMeta={storyMeta}
      />
      <MobileGiftSending
        balance={coinBalance}
        catalogError={catalogError}
        gifts={giftCatalog}
        isCatalogLoading={isCatalogLoading}
        message={message}
        onMessageChange={setMessage}
        onSelectGift={(gift) => setSelectedGiftId(gift.id)}
        onSend={handleSendGift}
        selectedGift={selectedGift}
        storyMeta={storyMeta}
      />
    </>
  );
}
