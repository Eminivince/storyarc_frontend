import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import Reveal from "../components/Reveal";
import ReaderStateScreen from "../components/ReaderStateScreen";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import { useMonetization } from "../context/MonetizationContext";
import {
  buildCoinStoreHref,
  buildCheckoutHref,
  formatPrice,
  lockedChapterHref,
  pricingHref,
} from "../data/monetization";
import { buildSearchHref, readerLibraryHref } from "../data/readerFlow";

function DesktopCoinStore({ coinBalance, currency, packages, returnTo }) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/10 bg-background-light px-6 py-4 backdrop-blur-md dark:bg-background-dark/95 md:px-20 lg:px-40">
          <Link className="flex items-center gap-3" to="/dashboard">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-background-dark">
              <span className="material-symbols-outlined font-bold">menu_book</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">TaleStead</h2>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 sm:flex">
              <span className="material-symbols-outlined text-sm text-primary">
                database
              </span>
              <span className="text-sm font-bold text-primary">
                {coinBalance} Coins
              </span>
            </div>
            <Link
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-transparent bg-slate-200 text-slate-700 transition-colors hover:border-primary/20 hover:text-primary dark:bg-primary/10 dark:text-primary"
              to={pricingHref}
            >
              <span className="material-symbols-outlined">workspace_premium</span>
            </Link>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-transparent bg-slate-200 text-slate-700 transition-colors hover:border-primary/20 hover:text-primary dark:bg-primary/10 dark:text-primary"
              type="button"
            >
              <span className="material-symbols-outlined">help_outline</span>
            </button>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-6 py-10 md:px-20 lg:px-40">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <span className="material-symbols-outlined text-xs">auto_awesome</span>
                <span>Premium Access</span>
              </div>
              <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
                Get Story Coins
              </h1>
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Unlock the next chapter of your favorite adventure. Purchase coins
                to support authors and continue your journey through infinite worlds.
              </p>
            </div>

            <Reveal className="flex flex-col items-center rounded-xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <p className="mb-1 text-xs font-bold uppercase text-slate-500">
                Your Balance
              </p>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl text-primary">
                  database
                </span>
                <span className="text-3xl font-bold">{coinBalance}</span>
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {packages.map((item, index) => {
              const featured = item.id === "box";

              return (
                <motion.article
                  className={`relative flex flex-col items-center rounded-xl p-6 text-center transition-all ${
                    featured
                      ? "z-10 scale-[1.03] border-2 border-primary bg-primary/10 shadow-[0_0_20px_rgba(244,192,37,0.15)]"
                      : "border border-primary/10 bg-primary/5 hover:border-primary/40"
                  }`}
                  initial={{ opacity: 0, y: 24 }}
                  key={item.id}
                  transition={{ delay: index * 0.06, duration: 0.3 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.2, once: true }}
                >
                  {featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-black uppercase tracking-widest text-background-dark">
                      Most Popular
                    </div>
                  )}
                  <div
                    className={`mb-6 flex h-24 w-24 items-center justify-center rounded-full transition-colors ${
                      featured
                        ? "bg-primary/20"
                        : "bg-slate-200 dark:bg-slate-800"
                    }`}
                  >
                    <span className="material-symbols-outlined text-5xl text-primary">
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="mb-1 text-xl font-bold">{item.name}</h3>
                  <p className="mb-6 text-sm font-medium text-primary">
                    {item.bonus || item.description}
                  </p>

                  <div className="mt-auto w-full">
                    <div className="mb-4 text-2xl font-bold">
                      {item.coins.toLocaleString()} Total
                    </div>
                    <Link
                      className={`block w-full rounded-lg px-4 py-3 font-bold transition-colors ${
                        featured
                          ? "bg-primary text-background-dark hover:opacity-90"
                          : "bg-slate-200 text-slate-900 hover:bg-primary hover:text-background-dark dark:bg-slate-800 dark:text-white"
                      }`}
                      to={buildCheckoutHref({
                        kind: "coins",
                        productId: item.id,
                        returnTo,
                      })}
                    >
                      {formatPrice(item.price, currency)}
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            <Reveal className="flex gap-6 rounded-2xl border border-slate-200 bg-slate-100 p-8 dark:border-slate-700 dark:bg-slate-800/30">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-3xl">
                  verified_user
                </span>
              </div>
              <div>
                <h4 className="mb-2 text-lg font-bold">Secure Transactions</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  All purchases are processed securely through our partners. Your
                  payment information is never stored on TaleStead servers.
                </p>
              </div>
            </Reveal>

            <Reveal className="flex gap-6 rounded-2xl border border-slate-200 bg-slate-100 p-8 dark:border-slate-700 dark:bg-slate-800/30">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-3xl">redeem</span>
              </div>
              <div>
                <h4 className="mb-2 text-lg font-bold">Premium Alternative</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Need ongoing access instead of one-off coins? Compare premium
                  tiers and monthly bundles before you check out.
                </p>
                <Link
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary"
                  to={pricingHref}
                >
                  Compare premium plans
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>
        </main>

        <footer className="border-t border-primary/10 bg-background-light px-6 py-10 dark:bg-background-dark/50 md:px-20 lg:px-40">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/20">
                <span className="material-symbols-outlined text-xs font-bold text-primary">
                  menu_book
                </span>
              </div>
              <span className="text-sm font-bold text-slate-400">
                © 2024 TaleStead Reader. All rights reserved.
              </span>
            </div>
            <div className="flex gap-8">
              <Link className="text-sm text-slate-500 transition-colors hover:text-primary" to={returnTo}>
                Return to chapter
              </Link>
              <Link className="text-sm text-slate-500 transition-colors hover:text-primary" to={pricingHref}>
                Membership
              </Link>
              <a className="text-sm text-slate-500 transition-colors hover:text-primary" href="#">
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function MobileCoinStore({ coinBalance, currency, packages, returnTo }) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <nav className="sticky top-0 z-10 flex items-center border-b border-primary/10 bg-background-light px-3 py-2.5 dark:bg-background-dark">
        <Link
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-primary/10"
          to={returnTo}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h2 className="flex-1 text-center text-base font-bold tracking-tight">
          Coin Shop
        </h2>
        <div className="flex h-10 w-10 items-center justify-center">
          <Link
            className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-primary/10"
            to={pricingHref}
          >
            <span className="material-symbols-outlined text-primary">history</span>
          </Link>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto pb-20">
        <div className="px-3 py-4">
          <Reveal className="relative flex aspect-[3/1] w-full items-center justify-start overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-br from-primary/40 to-background-dark">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,214,90,0.32),_transparent_55%)] opacity-80" />
            <div className="relative z-10 flex items-center gap-3 px-4">
              <span className="material-symbols-outlined text-3xl text-primary shrink-0">
                stars
              </span>
              <div>
                <h1 className="text-lg font-bold text-slate-100 leading-tight">
                  Get TaleStead Coins
                </h1>
                <p className="text-xs text-primary/80">
                  Unlock premium chapters and exclusive art
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mx-3 mb-5 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/10 p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary">
              <span className="material-symbols-outlined text-lg font-bold text-background-dark">
                payments
              </span>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Your Balance
              </p>
              <p className="text-base font-bold text-primary">
                {coinBalance} <span className="text-xs font-normal text-slate-300">Coins</span>
              </p>
            </div>
          </div>
          <Link
            className="shrink-0 rounded-full border border-primary/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-tighter text-primary"
            to={pricingHref}
          >
            Details
          </Link>
        </div>

        <h3 className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-100 opacity-70">
          Available Packages
        </h3>

        <div className="grid grid-cols-2 gap-3 px-3">
          {packages.map((item) => {
            const featured = item.id === "box";

            return (
              <Reveal
                className={`relative flex flex-col items-center rounded-lg p-3 text-center transition-all ${
                  featured
                    ? "border-2 border-primary bg-primary/20 shadow-[0_0_20px_rgba(244,192,37,0.15)]"
                    : "border border-slate-700 bg-slate-800/40 hover:border-primary/30"
                }`}
                key={item.id}
              >
                {featured && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter text-background-dark">
                    Popular
                  </div>
                )}
                <div
                  className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg text-primary ${
                    featured ? "bg-primary/30" : "bg-slate-700/50"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {item.mobileIcon}
                  </span>
                </div>
                <h4 className="truncate w-full text-xs font-bold text-slate-100">{item.name}</h4>
                <p className="mb-2 text-[10px] font-medium text-primary">
                  {item.coins.toLocaleString()} Coins
                </p>
                <Link
                  className="w-full rounded-lg bg-primary px-3 py-1.5 text-[10px] font-bold text-background-dark transition-transform active:scale-95"
                  to={buildCheckoutHref({
                    kind: "coins",
                    productId: item.id,
                    returnTo,
                  })}
                >
                  {formatPrice(item.price, currency)}
                </Link>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-5 px-3 pb-2 text-center">
          <p className="text-[10px] leading-relaxed text-slate-400">
            By purchasing coins, you agree to our{" "}
            <Link className="text-primary underline" to="/terms">
              Terms of Service
            </Link>
            . Coins are virtual currency and cannot be refunded or exchanged for
            real money.
          </p>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around border-t border-primary/10 bg-background-dark/95 px-3 pb-safe pt-2 backdrop-blur-md">
        <Link className="flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-primary" to={readerLibraryHref}>
          <span className="material-symbols-outlined">menu_book</span>
          <p className="text-[10px] font-medium leading-none">Library</p>
        </Link>
        <Link
          className="flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-primary"
          to={buildSearchHref("Fantasy")}
        >
          <span className="material-symbols-outlined">explore</span>
          <p className="text-[10px] font-medium leading-none">Discover</p>
        </Link>
        <Link className="flex flex-col items-center gap-1 text-primary" to={buildCoinStoreHref(returnTo)}>
          <span className="material-symbols-outlined fill-1">storefront</span>
          <p className="text-[10px] font-medium leading-none">Shop</p>
        </Link>
        <Link className="flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-primary" to="/dashboard">
          <span className="material-symbols-outlined">person</span>
          <p className="text-[10px] font-medium leading-none">Profile</p>
        </Link>
      </div>
    </div>
  );
}

export default function CoinStorePage() {
  const {
    catalogError,
    coinBalance,
    coinPackages,
    currency,
    isCatalogLoading,
  } = useMonetization();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo") || lockedChapterHref;

  if (isCatalogLoading) {
    return <RouteLoadingScreen />;
  }

  if (catalogError || coinPackages.length === 0) {
    return (
      <ReaderStateScreen
        ctaLabel="Back to Reading"
        ctaTo={returnTo}
        description={
          catalogError?.message ||
          "Coin packages are unavailable right now. Try again after the store catalog refreshes."
        }
        secondaryLabel="See Membership Plans"
        secondaryTo={pricingHref}
        title="Coin Store Unavailable"
      />
    );
  }

  return (
    <>
      <DesktopCoinStore
        coinBalance={coinBalance}
        currency={currency}
        packages={coinPackages}
        returnTo={returnTo}
      />
      <MobileCoinStore
        coinBalance={coinBalance}
        currency={currency}
        packages={coinPackages}
        returnTo={returnTo}
      />
    </>
  );
}
