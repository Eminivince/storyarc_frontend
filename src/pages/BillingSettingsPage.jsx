import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import AccountSettingsNav from "../components/AccountSettingsNav";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import Reveal from "../components/Reveal";
import SkeletonBlock from "../components/SkeletonBlock";
import { useAuth } from "../context/AuthContext";
import { useAccount } from "../context/AccountContext";
import { useMonetization } from "../context/MonetizationContext";
import {
  billingSettingsHref,
  paymentMethods,
  profileHref,
} from "../data/accountFlow";
import {
  buildCoinStoreHref,
  buildPlanHref,
  formatPrice,
  freePlanTier,
} from "../data/monetization";
import { fetchMonetizationPurchases } from "../monetization/monetizationApi";

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
      {Array.from({ length: 3 }).map((_, index) => (
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

function getNextBillingLabel(hasPremium) {
  if (!hasPremium) {
    return "Upgrade to activate recurring billing";
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
            Next billing date: {getNextBillingLabel(hasPremium)}
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
  compact = false,
  onManagePayment,
  purchaseHistoryError,
  purchases,
  purchasesLoading,
}) {
  return (
    <>
      <section
        className={`rounded-xl border border-primary/10 bg-white/80 dark:bg-primary/5 ${
          compact ? "mb-4 p-4" : "mb-6 rounded-3xl p-6"
        }`}>
        <div
          className={`flex items-center justify-between gap-4 ${compact ? "mb-4" : "mb-5"}`}>
          <h2 className={compact ? "text-base font-bold" : "text-xl font-bold"}>
            Payment Methods
          </h2>
          <button
            className={`font-bold text-primary transition-opacity hover:opacity-80 ${
              compact ? "text-xs" : "text-sm"
            }`}
            onClick={() => onManagePayment("Adding a new payment method")}
            type="button">
            Add Method
          </button>
        </div>

        <div className={compact ? "space-y-2" : "space-y-3"}>
          {paymentMethods.map((method) => (
            <button
              className={`flex w-full items-center justify-between text-left transition-colors hover:border-primary/30 hover:bg-primary/5 dark:border-primary/10 dark:bg-background-dark/50 ${
                compact
                  ? "rounded-lg border border-slate-200 bg-slate-50 px-3 py-3"
                  : "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
              }`}
              key={method.id}
              onClick={() => onManagePayment(`Managing ${method.label}`)}
              type="button">
              <div
                className={`flex items-center ${compact ? "gap-3" : "gap-4"}`}>
                <div
                  className={`rounded-xl bg-primary/10 text-primary ${
                    compact ? "p-2" : "rounded-2xl p-3"
                  }`}>
                  <span
                    className={`material-symbols-outlined ${compact ? "text-lg" : ""}`}>
                    {method.icon}
                  </span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className={compact ? "text-sm font-bold" : "font-bold"}>
                      {method.label}
                    </p>
                    {method.primary ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase text-primary">
                        Primary
                      </span>
                    ) : null}
                  </div>
                  <p
                    className={
                      compact
                        ? "text-xs text-slate-500"
                        : "text-sm text-slate-500 dark:text-slate-400"
                    }>
                    {method.detail}
                  </p>
                </div>
              </div>
              <span
                className={`material-symbols-outlined text-slate-400 ${compact ? "text-lg" : ""}`}>
                chevron_right
              </span>
            </button>
          ))}
        </div>
      </section>

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
            {purchases.map((purchase) => (
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
  onManagePayment,
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
                  />
                </Reveal>
                <Reveal>
                  <BillingSections
                    onManagePayment={onManagePayment}
                    purchaseHistoryError={purchaseHistoryError}
                    purchases={purchases}
                    purchasesLoading={purchasesLoading}
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
  onManagePayment,
  purchaseHistoryError,
  purchases,
  purchasesLoading,
  billingCycle,
  coinBalance,
  currency,
  activePlanId,
  getDisplayPlan,
  hasPremium,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex h-screen flex-col overflow-hidden">
        <header className="flex shrink-0 items-center border-b border-primary/10 bg-background-light px-4 py-3 dark:bg-background-dark">
          <Link
            className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-primary/20"
            to={profileHref}>
            <span className="material-symbols-outlined text-xl">
              arrow_back
            </span>
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
            />
            <BillingSections
              compact
              onManagePayment={onManagePayment}
              purchaseHistoryError={purchaseHistoryError}
              purchases={purchases}
              purchasesLoading={purchasesLoading}
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
  const { profile, showNotice } = useAccount();
  const {
    activePlanId,
    billingCycle,
    coinBalance,
    currency,
    getDisplayPlan,
    hasPremium,
  } = useMonetization();
  const purchaseHistoryQuery = useQuery({
    enabled: isAuthenticated,
    queryFn: fetchMonetizationPurchases,
    queryKey: ["monetization", "purchases"],
  });
  const purchases = purchaseHistoryQuery.data?.purchases ?? [];

  function handleManagePayment(message) {
    showNotice(`${message} is available in the next secure billing step.`);
  }

  return (
    <>
      <DesktopBillingSettings
        activePlanId={activePlanId}
        billingCycle={billingCycle}
        coinBalance={coinBalance}
        currency={currency}
        getDisplayPlan={getDisplayPlan}
        hasPremium={hasPremium}
        onManagePayment={handleManagePayment}
        purchaseHistoryError={purchaseHistoryQuery.error}
        purchases={purchases}
        purchasesLoading={purchaseHistoryQuery.isLoading}
        profile={profile}
      />
      <MobileBillingSettings
        activePlanId={activePlanId}
        billingCycle={billingCycle}
        coinBalance={coinBalance}
        currency={currency}
        getDisplayPlan={getDisplayPlan}
        hasPremium={hasPremium}
        onManagePayment={handleManagePayment}
        purchaseHistoryError={purchaseHistoryQuery.error}
        purchases={purchases}
        purchasesLoading={purchaseHistoryQuery.isLoading}
      />
    </>
  );
}
