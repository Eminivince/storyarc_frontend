import { Link } from "react-router-dom";
import AccountNotice from "../components/AccountNotice";
import AccountSettingsNav from "../components/AccountSettingsNav";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import Reveal from "../components/Reveal";
import { useAccount } from "../context/AccountContext";
import { useMonetization } from "../context/MonetizationContext";
import {
  billingHistory,
  billingSettingsHref,
  billingUsage,
  paymentMethods,
  profileHref,
} from "../data/accountFlow";
import {
  buildCoinStoreHref,
  buildPlanHref,
  formatPrice,
  freePlanTier,
} from "../data/monetization";

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
    <section className="overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Current Plan
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">{planLabel}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Next billing date: {getNextBillingLabel(hasPremium)}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            className="rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-background-dark"
            to={hasPremium ? buildPlanHref("arcane", billingSettingsHref) : buildPlanHref("silver", billingSettingsHref)}
          >
            {hasPremium ? "Change Plan" : "Upgrade Plan"}
          </Link>
          <Link
            className="rounded-2xl border border-primary/30 px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-background-dark"
            to={buildCoinStoreHref(billingSettingsHref)}
          >
            Buy Coins
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-primary/10 bg-white/70 p-4 dark:bg-background-dark/50">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Price</p>
          <p className="mt-2 text-2xl font-black">{planPrice}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {hasPremium ? `Billed ${billingCycle}` : "Reader tier"}
          </p>
        </div>
        <div className="rounded-2xl border border-primary/10 bg-white/70 p-4 dark:bg-background-dark/50">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Wallet</p>
          <p className="mt-2 text-2xl font-black">{coinBalance}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Available coins</p>
        </div>
        <div className="rounded-2xl border border-primary/10 bg-white/70 p-4 dark:bg-background-dark/50">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Monthly Coins
          </p>
          <p className="mt-2 text-2xl font-black">{currentPlan.monthlyCoins ?? 0}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {hasPremium ? "Included with membership" : "Upgrade to unlock"}
          </p>
        </div>
      </div>
    </section>
  );
}

function BillingSections({ onManagePayment }) {
  return (
    <>
      {/* <section className="rounded-3xl border border-primary/10 bg-white/80 p-6 dark:bg-primary/5">
        <div className="mb-5 flex items-center justify-between gap-4">
          
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            {billingUsage.usedLabel}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-background-dark/70">
          <div className="h-full rounded-full bg-primary" style={{ width: `${billingUsage.used}%` }} />
        </div>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{billingUsage.totalLabel}</p>
      </section> */}

      <section className="rounded-3xl mb-6 border border-primary/10 bg-white/80 p-6 dark:bg-primary/5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold">Payment Methods</h2>
          <button
            className="text-sm font-bold text-primary transition-opacity hover:opacity-80"
            onClick={() => onManagePayment("Adding a new payment method")}
            type="button"
          >
            Add Method
          </button>
        </div>

        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition-colors hover:border-primary/30 hover:bg-primary/5 dark:border-primary/10 dark:bg-background-dark/50"
              key={method.id}
              onClick={() => onManagePayment(`Managing ${method.label}`)}
              type="button"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <span className="material-symbols-outlined">{method.icon}</span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold">{method.label}</p>
                    {method.primary ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                        Primary
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{method.detail}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-primary/10 bg-white/80 p-6 dark:bg-primary/5">
        <h2 className="text-xl font-bold">Billing History</h2>
        <div className="mt-5 space-y-3">
          {billingHistory.map((invoice) => (
            <div
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-primary/10 dark:bg-background-dark/50"
              key={invoice.id}
            >
              <div>
                <p className="font-bold">{invoice.description}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{invoice.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{invoice.amount}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-500">
                  {invoice.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function DesktopBillingSettings({
  notice,
  onDismiss,
  onManagePayment,
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
        <AppDesktopSidebar avatar={profile.avatar} memberName={profile.displayName} />

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
                  Review your active membership, payment methods, and billing history without
                  leaving the main account shell.
                </p>
              </div>
            </Reveal>

            <AccountNotice notice={notice} onDismiss={onDismiss} />

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
                  <BillingSections onManagePayment={onManagePayment} />
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
  notice,
  onDismiss,
  onManagePayment,
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
        <header className="flex items-center border-b border-primary/10 px-4 py-4">
          <Link
            className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-primary/10"
            to={profileHref}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="ml-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
              Monetization
            </p>
            <h1 className="text-xl font-bold">Billing & Subscriptions</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-28">
          <div className="space-y-6 px-4 py-5">
            <AccountNotice notice={notice} onDismiss={onDismiss} />
            <AccountSettingsNav />
            <PlanCard
              activePlanId={activePlanId}
              billingCycle={billingCycle}
              coinBalance={coinBalance}
              currency={currency}
              getDisplayPlan={getDisplayPlan}
              hasPremium={hasPremium}
            />
            <BillingSections onManagePayment={onManagePayment} />
          </div>
        </main>

        <AppMobileTabBar />
      </div>
    </div>
  );
}

export default function BillingSettingsPage() {
  const {
    clearNotice: clearAccountNotice,
    notice: accountNotice,
    profile,
    showNotice,
  } = useAccount();
  const {
    activePlanId,
    billingCycle,
    clearNotice: clearBillingNotice,
    coinBalance,
    currency,
    getDisplayPlan,
    hasPremium,
    lastNotice,
  } = useMonetization();

  const notice = lastNotice ?? accountNotice;

  function handleDismiss() {
    if (lastNotice) {
      clearBillingNotice();
      return;
    }

    clearAccountNotice();
  }

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
        notice={notice}
        onDismiss={handleDismiss}
        onManagePayment={handleManagePayment}
        profile={profile}
      />
      <MobileBillingSettings
        activePlanId={activePlanId}
        billingCycle={billingCycle}
        coinBalance={coinBalance}
        currency={currency}
        getDisplayPlan={getDisplayPlan}
        hasPremium={hasPremium}
        notice={notice}
        onDismiss={handleDismiss}
        onManagePayment={handleManagePayment}
      />
    </>
  );
}
