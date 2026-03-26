import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import AccountSettingsNav from "../components/AccountSettingsNav";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import Reveal from "../components/Reveal";
import SkeletonBlock from "../components/SkeletonBlock";
import { useAuth } from "../context/AuthContext";
import { useAccount } from "../context/AccountContext";
import { useMonetization } from "../context/MonetizationContext";
import MaterialSymbol from "../components/MaterialSymbol";
import {
  billingSettingsHref,
  profileHref,
} from "../data/accountFlow";
import {
  buildCoinStoreHref,
  buildPlanHref,
  formatPrice,
  freePlanTier,
} from "../data/monetization";
import { fetchMonetizationPurchases } from "../monetization/monetizationApi";

const BILLING_HISTORY_DISPLAY_LIMIT = 4;

function formatPurchaseDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getPurchaseStatusLabel(status) {
  switch (String(status ?? "").toUpperCase()) {
    case "COMPLETED":
      return "Paid";
    case "PENDING":
      return "Pending";
    case "FAILED":
      return "Failed";
    case "EXPIRED":
      return "Expired";
    case "CANCELED":
      return "Canceled";
    case "REFUNDED":
      return "Refunded";
    default:
      return "Unknown";
  }
}

function getPurchaseStatusClassName(status) {
  switch (String(status ?? "").toUpperCase()) {
    case "COMPLETED":
      return "text-emerald-500";
    case "PENDING":
      return "text-amber-500";
    case "FAILED":
    case "EXPIRED":
    case "CANCELED":
      return "text-rose-500";
    case "REFUNDED":
      return "text-slate-500";
    default:
      return "text-slate-400";
  }
}

function BillingHistorySkeleton({ compact = false }) {
  return (
    <div className={compact ? "mt-4 space-y-2" : "mt-5 space-y-3"}>
      {Array.from({ length: BILLING_HISTORY_DISPLAY_LIMIT }).map((_, index) => (
        <div
          className={`flex items-center justify-between border border-slate-200 bg-slate-50 dark:border-primary/10 dark:bg-background-dark/50 ${
            compact ? "rounded-lg px-3 py-3" : "rounded-2xl px-4 py-4"
          }`}
          key={index}>
          <div className="space-y-2">
            <SkeletonBlock className={compact ? "h-4 w-36" : "h-4 w-48"} />
            <SkeletonBlock className={compact ? "h-3 w-20" : "h-3 w-24"} />
          </div>
          <div className="space-y-2 text-right">
            <SkeletonBlock className={compact ? "ml-auto h-4 w-16" : "ml-auto h-4 w-20"} />
            <SkeletonBlock className={compact ? "ml-auto h-3 w-12" : "ml-auto h-3 w-14"} />
          </div>
        </div>
      ))}
    </div>
  );
}

function getNextBillingLabel(hasPremium, subscription) {
  if (!hasPremium) {
    return "Upgrade to activate recurring billing";
  }

  if (subscription?.cancelAtPeriodEnd) {
    const cancelDate = subscription.currentPeriodEnd
      ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "end of current period";
    return `Cancels on ${cancelDate}`;
  }

  if (subscription?.currentPeriodEnd) {
    return new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  const nextDate = new Date();
  nextDate.setMonth(nextDate.getMonth() + 1);
  return nextDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function PlanCard({
  activePlanId,
  billingCycle,
  coinBalance,
  compact = false,
  currency,
  getDisplayPlan,
  hasPremium,
  subscription,
}) {
  const currentPlan = getDisplayPlan(activePlanId) ?? freePlanTier;
  const planLabel = hasPremium ? currentPlan.name : "Free Reader";
  const planPrice = hasPremium
    ? billingCycle === "annual" && currentPlan.yearlyPrice
      ? formatPrice(currentPlan.yearlyPrice, currency)
      : formatPrice(currentPlan.monthlyPrice ?? 0, currency)
    : formatPrice(0, currency);

  return (
    <section
      className={`overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent ${
        compact ? "p-4" : "rounded-3xl p-6"
      }`}>
      <div
        className={`flex flex-col lg:flex-row lg:items-end lg:justify-between ${
          compact ? "gap-4" : "gap-6"
        }`}>
        <div>
          <p
            className={`font-bold uppercase tracking-[0.3em] text-primary ${
              compact ? "text-[10px]" : "text-xs"
            }`}>
            Current Plan
          </p>
          <h2
            className={`font-black tracking-tight ${
              compact ? "mt-2 text-xl" : "mt-3 text-3xl"
            }`}>
            {planLabel}
          </h2>
          <p
            className={`text-slate-600 dark:text-slate-300 ${
              compact ? "mt-1 text-xs" : "mt-2 text-sm"
            }`}>
            Next billing date: {getNextBillingLabel(hasPremium, subscription)}
          </p>
        </div>

        <div className={`flex flex-wrap ${compact ? "gap-2" : "gap-3"}`}>
          <Link
            className={`rounded-xl bg-primary font-bold text-background-dark ${
              compact ? "px-3 py-2 text-xs" : "rounded-2xl px-4 py-3 text-sm"
            }`}
            to={
              hasPremium
                ? buildPlanHref("arcane", billingSettingsHref)
                : buildPlanHref("silver", billingSettingsHref)
            }>
            {hasPremium ? "Change Plan" : "Upgrade Plan"}
          </Link>
          <Link
            className={`rounded-xl border border-primary/30 font-bold text-primary transition-colors hover:bg-primary hover:text-background-dark ${
              compact ? "px-3 py-2 text-xs" : "rounded-2xl px-4 py-3 text-sm"
            }`}
            to={buildCoinStoreHref(billingSettingsHref)}>
            Buy Coins
          </Link>
        </div>
      </div>

      <div
        className={`grid md:grid-cols-3 ${compact ? "mt-4 gap-3" : "mt-6 gap-4"}`}>
        <div
          className={`rounded-xl border border-primary/10 bg-white/70 dark:bg-background-dark/50 ${
            compact ? "p-3" : "rounded-2xl p-4"
          }`}>
          <p
            className={`font-bold uppercase tracking-widest text-slate-400 ${
              compact ? "text-[10px]" : "text-xs"
            }`}>
            Price
          </p>
          <p
            className={`font-black ${compact ? "mt-1 text-lg" : "mt-2 text-2xl"}`}>
            {planPrice}
          </p>
          <p
            className={
              compact
                ? "text-xs text-slate-500"
                : "text-sm text-slate-500 dark:text-slate-400"
            }>
            {hasPremium ? `Billed ${billingCycle}` : "Reader tier"}
          </p>
        </div>
        <div
          className={`rounded-xl border border-primary/10 bg-white/70 dark:bg-background-dark/50 ${
            compact ? "p-3" : "rounded-2xl p-4"
          }`}>
          <p
            className={`font-bold uppercase tracking-widest text-slate-400 ${
              compact ? "text-[10px]" : "text-xs"
            }`}>
            Wallet
          </p>
          <p
            className={`font-black ${compact ? "mt-1 text-lg" : "mt-2 text-2xl"}`}>
            {coinBalance}
          </p>
          <p
            className={
              compact
                ? "text-xs text-slate-500"
                : "text-sm text-slate-500 dark:text-slate-400"
            }>
            Available coins
          </p>
        </div>
        <div
          className={`rounded-xl border border-primary/10 bg-white/70 dark:bg-background-dark/50 ${
            compact ? "p-3" : "rounded-2xl p-4"
          }`}>
          <p
            className={`font-bold uppercase tracking-widest text-slate-400 ${
              compact ? "text-[10px]" : "text-xs"
            }`}>
            Monthly Coins
          </p>
          <p
            className={`font-black ${compact ? "mt-1 text-lg" : "mt-2 text-2xl"}`}>
            {currentPlan.monthlyCoins ?? 0}
          </p>
          <p
            className={
              compact
                ? "text-xs text-slate-500"
                : "text-sm text-slate-500 dark:text-slate-400"
            }>
            {hasPremium ? "Included with membership" : "Upgrade to unlock"}
          </p>
        </div>
      </div>
    </section>
  );
}

function BillingSections({
  cancelSubscription,
  checkoutProvider,
  compact = false,
  hasPremium,
  isCancellingSubscription,
  onCancelConfirm,
  purchaseHistoryError,
  purchases,
  purchasesLoading,
  showCancelConfirm,
  subscription,
}) {
  return (
    <>
      {hasPremium && (
        <section
          className={`rounded-xl border border-primary/10 bg-white/80 dark:bg-primary/5 ${
            compact ? "mb-4 p-4" : "mb-6 rounded-3xl p-6"
          }`}>
          <h2 className={compact ? "text-base font-bold" : "text-xl font-bold"}>
            Payment Provider
          </h2>
          <div className={`flex items-center gap-3 ${compact ? "mt-3" : "mt-4"}`}>
            <div className={`rounded-xl bg-primary/10 text-primary ${compact ? "p-2" : "rounded-2xl p-3"}`}>
              <MaterialSymbol name="payments" className={`${compact ? "text-lg" : ""}`} />
            </div>
            <div>
              <p className={compact ? "text-sm font-bold" : "font-bold"}>
                {checkoutProvider === "flutterwave" ? "Flutterwave" : checkoutProvider === "paystack" ? "Paystack" : checkoutProvider === "polar" ? "Polar" : checkoutProvider === "cryptomus" ? "Cryptomus" : "Payment Provider"}
              </p>
              <p className={compact ? "text-xs text-slate-500" : "text-sm text-slate-500 dark:text-slate-400"}>
                Managed by {checkoutProvider === "flutterwave" ? "Flutterwave" : checkoutProvider === "paystack" ? "Paystack" : checkoutProvider === "polar" ? "Polar" : checkoutProvider === "cryptomus" ? "Cryptomus" : "provider"}
              </p>
            </div>
          </div>

          {!subscription?.cancelAtPeriodEnd && (
            <div className={compact ? "mt-4" : "mt-6"}>
              {showCancelConfirm ? (
                <div className={`rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10 ${compact ? "p-3" : "p-4"}`}>
                  <p className={`font-bold text-rose-700 dark:text-rose-200 ${compact ? "text-sm" : ""}`}>
                    Are you sure you want to cancel?
                  </p>
                  <p className={`text-rose-600 dark:text-rose-300 ${compact ? "mt-1 text-xs" : "mt-2 text-sm"}`}>
                    You'll retain access until the end of your current billing period.
                  </p>
                  <div className={`flex gap-3 ${compact ? "mt-3" : "mt-4"}`}>
                    <button
                      className={`rounded-lg bg-rose-600 font-bold text-white disabled:opacity-50 ${compact ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"}`}
                      disabled={isCancellingSubscription}
                      onClick={cancelSubscription}
                      type="button"
                    >
                      {isCancellingSubscription ? "Cancelling..." : "Confirm Cancel"}
                    </button>
                    <button
                      className={`rounded-lg border border-slate-200 font-bold dark:border-primary/20 ${compact ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"}`}
                      onClick={() => onCancelConfirm(false)}
                      type="button"
                    >
                      Keep Plan
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className={`font-bold text-rose-500 transition-opacity hover:opacity-80 ${compact ? "text-xs" : "text-sm"}`}
                  onClick={() => onCancelConfirm(true)}
                  type="button"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          )}

          {subscription?.cancelAtPeriodEnd && (
            <div className={`rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10 ${compact ? "mt-4 p-3" : "mt-6 p-4"}`}>
              <p className={`font-bold text-amber-700 dark:text-amber-200 ${compact ? "text-sm" : ""}`}>
                Subscription cancellation scheduled
              </p>
              <p className={`text-amber-600 dark:text-amber-300 ${compact ? "mt-1 text-xs" : "mt-2 text-sm"}`}>
                Your plan remains active until {subscription.currentPeriodEnd
                  ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                  : "the end of the current period"}.
              </p>
            </div>
          )}
        </section>
      )}

      <section
        className={`rounded-xl border border-primary/10 bg-white/80 dark:bg-primary/5 ${
          compact ? "p-4" : "rounded-3xl p-6"
        }`}>
        <h2 className={compact ? "text-base font-bold" : "text-xl font-bold"}>
          Billing History
        </h2>
        {purchasesLoading ? <BillingHistorySkeleton compact={compact} /> : null}
        {!purchasesLoading && purchaseHistoryError ? (
          <div
            className={`rounded-2xl border border-dashed border-rose-200 bg-rose-50 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200 ${
              compact ? "mt-4 p-3" : "mt-5 p-4"
            }`}>
            {purchaseHistoryError.message || "Billing history could not be loaded right now."}
          </div>
        ) : null}
        {!purchasesLoading && !purchaseHistoryError && !purchases.length ? (
          <div
            className={`rounded-2xl border border-dashed border-primary/20 bg-primary/5 text-sm text-slate-500 dark:text-slate-400 ${
              compact ? "mt-4 p-3" : "mt-5 p-4"
            }`}>
            No payments yet. Coin purchases and memberships will appear here after checkout.
          </div>
        ) : null}
        {!purchasesLoading && !purchaseHistoryError && purchases.length ? (
          <div className={compact ? "mt-4 space-y-2" : "mt-5 space-y-3"}>
            {purchases.slice(0, BILLING_HISTORY_DISPLAY_LIMIT).map((purchase) => (
              <div
                className={`flex items-center justify-between border border-slate-200 bg-slate-50 dark:border-primary/10 dark:bg-background-dark/50 ${
                  compact ? "rounded-lg px-3 py-3" : "rounded-2xl px-4 py-4"
                }`}
                key={purchase.id}>
                <div>
                  <p className={compact ? "text-sm font-bold" : "font-bold"}>
                    {purchase.description}
                  </p>
                  <p
                    className={
                      compact
                        ? "text-xs text-slate-500"
                        : "text-sm text-slate-500 dark:text-slate-400"
                    }>
                    {formatPurchaseDate(purchase.occurredAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={compact ? "text-sm font-bold" : "font-bold"}>
                    {formatPrice((purchase.amountCents ?? 0) / 100, purchase.currency)}
                  </p>
                  <p
                    className={`font-bold uppercase tracking-widest ${getPurchaseStatusClassName(
                      purchase.status,
                    )} ${compact ? "text-[10px]" : "text-xs"}`}>
                    {getPurchaseStatusLabel(purchase.status)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </>
  );
}

function DesktopBillingSettings({
  cancelSubscription,
  checkoutProvider,
  isCancellingSubscription,
  onCancelConfirm,
  purchaseHistoryError,
  purchases,
  purchasesLoading,
  profile,
  billingCycle,
  coinBalance,
  currency,
  activePlanId,
  getDisplayPlan,
  hasPremium,
  showCancelConfirm,
  subscription,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex min-h-screen">
        <AppDesktopSidebar
          avatar={profile.avatar}
          memberName={profile.displayName}
        />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-6xl space-y-8">
            <Reveal>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
                  Monetization
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-tight">
                  Billing & Subscriptions
                </h1>
                <p className="mt-2 max-w-2xl text-base text-slate-500 dark:text-slate-400">
                  Review your active membership, payment methods, and billing
                  history without leaving the main account shell.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
              <AccountSettingsNav />

              <div className="space-y-6">
                <Reveal>
                  <PlanCard
                    activePlanId={activePlanId}
                    billingCycle={billingCycle}
                    coinBalance={coinBalance}
                    currency={currency}
                    getDisplayPlan={getDisplayPlan}
                    hasPremium={hasPremium}
                    subscription={subscription}
                  />
                </Reveal>
                <Reveal>
                  <BillingSections
                    cancelSubscription={cancelSubscription}
                    checkoutProvider={checkoutProvider}
                    hasPremium={hasPremium}
                    isCancellingSubscription={isCancellingSubscription}
                    onCancelConfirm={onCancelConfirm}
                    purchaseHistoryError={purchaseHistoryError}
                    purchases={purchases}
                    purchasesLoading={purchasesLoading}
                    showCancelConfirm={showCancelConfirm}
                    subscription={subscription}
                  />
                </Reveal>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileBillingSettings({
  cancelSubscription,
  checkoutProvider,
  isCancellingSubscription,
  onCancelConfirm,
  purchaseHistoryError,
  purchases,
  purchasesLoading,
  billingCycle,
  coinBalance,
  currency,
  activePlanId,
  getDisplayPlan,
  hasPremium,
  showCancelConfirm,
  subscription,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex h-screen flex-col overflow-hidden">
        <header className="flex shrink-0 items-center border-b border-primary/10 bg-background-light px-4 py-3 dark:bg-background-dark">
          <Link
            className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-primary/20"
            to={profileHref}>
            <MaterialSymbol name="arrow_back" className="text-xl" />
          </Link>
          <div className="ml-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Monetization
            </p>
            <h1 className="text-base font-bold">Billing & Subscriptions</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-24">
          <div className="space-y-3 px-4 pt-3">
            <AccountSettingsNav compact />
            <PlanCard
              activePlanId={activePlanId}
              billingCycle={billingCycle}
              coinBalance={coinBalance}
              compact
              currency={currency}
              getDisplayPlan={getDisplayPlan}
              hasPremium={hasPremium}
              subscription={subscription}
            />
            <BillingSections
              cancelSubscription={cancelSubscription}
              checkoutProvider={checkoutProvider}
              compact
              hasPremium={hasPremium}
              isCancellingSubscription={isCancellingSubscription}
              onCancelConfirm={onCancelConfirm}
              purchaseHistoryError={purchaseHistoryError}
              purchases={purchases}
              purchasesLoading={purchasesLoading}
              showCancelConfirm={showCancelConfirm}
              subscription={subscription}
            />
          </div>
        </main>

        <AppMobileTabBar />
      </div>
    </div>
  );
}

export default function BillingSettingsPage() {
  const { isAuthenticated } = useAuth();
  const { profile } = useAccount();
  const {
    activePlanId,
    billingCycle,
    cancelSubscription,
    checkoutProvider,
    coinBalance,
    currency,
    getDisplayPlan,
    hasPremium,
    isCancellingSubscription,
    subscription,
  } = useMonetization();
  const purchaseHistoryQuery = useQuery({
    enabled: isAuthenticated,
    queryFn: fetchMonetizationPurchases,
    queryKey: ["monetization", "purchases"],
  });
  const purchases = purchaseHistoryQuery.data?.purchases ?? [];
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  return (
    <>
      <DesktopBillingSettings
        activePlanId={activePlanId}
        billingCycle={billingCycle}
        cancelSubscription={cancelSubscription}
        checkoutProvider={checkoutProvider}
        coinBalance={coinBalance}
        currency={currency}
        getDisplayPlan={getDisplayPlan}
        hasPremium={hasPremium}
        isCancellingSubscription={isCancellingSubscription}
        onCancelConfirm={setShowCancelConfirm}
        purchaseHistoryError={purchaseHistoryQuery.error}
        purchases={purchases}
        purchasesLoading={purchaseHistoryQuery.isLoading}
        profile={profile}
        showCancelConfirm={showCancelConfirm}
        subscription={subscription}
      />
      <MobileBillingSettings
        activePlanId={activePlanId}
        billingCycle={billingCycle}
        cancelSubscription={cancelSubscription}
        checkoutProvider={checkoutProvider}
        coinBalance={coinBalance}
        currency={currency}
        getDisplayPlan={getDisplayPlan}
        hasPremium={hasPremium}
        isCancellingSubscription={isCancellingSubscription}
        onCancelConfirm={setShowCancelConfirm}
        purchaseHistoryError={purchaseHistoryQuery.error}
        purchases={purchases}
        purchasesLoading={purchaseHistoryQuery.isLoading}
        showCancelConfirm={showCancelConfirm}
        subscription={subscription}
      />
    </>
  );
}
