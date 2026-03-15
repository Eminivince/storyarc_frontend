import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Reveal from "../components/Reveal";
import ReaderStateScreen from "../components/ReaderStateScreen";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import { useMonetization } from "../context/MonetizationContext";
import {
  buildCheckoutHref,
  formatPrice,
  lockedChapterHref,
  pricingHref,
} from "../data/monetization";

function DesktopSubscription({
  activePlanId,
  billing,
  currency,
  hasPremium,
  plan,
  returnTo,
  setBilling,
}) {
  const monthlyPrice =
    billing === "annual" && plan.yearlyPrice ? plan.yearlyPrice / 12 : plan.monthlyPrice;
  const cta = hasPremium && activePlanId === plan.id
    ? {
        label: "Manage Billing",
        to: "/account/settings/billing",
      }
    : {
        label: "Upgrade Now",
        to: buildCheckoutHref({
          billing,
          kind: "plan",
          productId: plan.id,
          returnTo,
        }),
      };

  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        <header className="flex items-center justify-between border-b border-primary/10 px-6 py-4 lg:px-20">
          <Link className="flex items-center gap-4" to="/dashboard">
            <span className="material-symbols-outlined text-3xl text-primary">
              auto_stories
            </span>
            <h2 className="text-xl font-bold tracking-tight">TaleStead</h2>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link className="text-sm font-medium transition-colors hover:text-primary" to="/dashboard">
              Explore
            </Link>
            <Link className="text-sm font-medium transition-colors hover:text-primary" to="/dashboard">
              Library
            </Link>
            <Link className="text-sm font-bold text-primary" to={pricingHref}>
              Arcane
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all hover:bg-primary/20" type="button">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all hover:bg-primary/20" type="button">
              <span className="material-symbols-outlined text-xl">person</span>
            </button>
            <div
              className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary/30 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAMkPBOr941gt2ruG0p7ZLY9VUTANekzQcTlNhkCrTNo31pEpzCJLFmQqdm2R4ZAos53fcDxnLYzxll18b7-0NsdKh9FJYJpkrJDHV923w9Zq98IKTAGSzHWgCoEoN1GNvh6Kru58rpceuxw5-J8B0Zy44Xqpb0btpyt03ujdXbGVT4yhu1Fn23a_rIx38HiyxemAZrs9q4EVVcjAYFCdyxeg1OE-5PQEJu4YNhWDQqFbAxvcyUJjTdl7bejF-Bg2AqLgq8Upj4CXU')",
              }}
            />
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-12 lg:py-20">
          <Reveal as="section" className="mb-16 text-center">
            <h1 className="mb-6 text-4xl font-black tracking-tight md:text-6xl">
              Unlock the <span className="text-primary">{plan.name}</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400">
              Elevate your reading experience with exclusive access, monthly
              rewards, and an ad-free journey through the finest stories.
            </p>
          </Reveal>

          <div className="flex flex-col items-center gap-12">
            <div className="flex h-12 w-full max-w-md items-center justify-center rounded-xl border border-primary/20 bg-primary/5 p-1">
              {[
                ["monthly", "Monthly"],
                ["annual", "Annual (20% Off)"],
              ].map(([value, label]) => (
                <button
                  className={`flex-1 rounded-lg px-4 text-sm font-bold transition-all ${
                    billing === value
                      ? "bg-primary text-background-dark"
                      : "text-slate-400"
                  }`}
                  key={value}
                  onClick={() => setBilling(value)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid w-full gap-8 lg:grid-cols-2">
              <Reveal className="flex flex-col justify-between rounded-xl border border-primary/30 bg-gradient-to-br from-primary/20 to-transparent p-8">
                <div>
                  <div className="mb-8 flex items-center justify-between">
                    <div className="rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wider text-background-dark">
                      {plan.id === "silver" ? "Reader Favorite" : "Most Popular"}
                    </div>
                    <span className="material-symbols-outlined text-4xl text-primary">
                      workspace_premium
                    </span>
                  </div>
                  <h3 className="mb-2 text-3xl font-bold">{plan.name} Premium</h3>
                  <div className="mb-8 flex items-baseline gap-2">
                    <span className="text-5xl font-black">
                      {formatPrice(monthlyPrice, currency)}
                    </span>
                    <span className="text-slate-400">/ month</span>
                  </div>
                  <ul className="mb-8 space-y-4">
                    {plan.perks.map((perk) => (
                      <li className="flex items-center gap-3" key={perk.title}>
                        <span className="material-symbols-outlined text-primary">
                          {perk.icon}
                        </span>
                        <span className="text-slate-200">{perk.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  className="w-full rounded-lg bg-primary py-4 text-center text-lg font-bold text-background-dark shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
                  to={cta.to}
                >
                  {cta.label}
                </Link>
              </Reveal>

              <div className="flex flex-col gap-6">
                <Reveal className="rounded-xl border border-primary/10 bg-primary/5 p-6">
                  <h4 className="mb-6 text-xl font-bold">Why go {plan.name}?</h4>
                  <div className="space-y-6">
                    {plan.reasons.map((reason) => (
                      <div className="flex gap-4" key={reason.title}>
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                          <span className="material-symbols-outlined">
                            {reason.icon}
                          </span>
                        </div>
                        <div>
                          <p className="mb-1 font-bold">{reason.title}</p>
                          <p className="text-sm text-slate-400">
                            {reason.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>

                <Reveal className="relative overflow-hidden rounded-xl border border-primary/10 bg-primary/5 p-6 italic">
                  <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl text-primary/5 opacity-50">
                    format_quote
                  </span>
                  <div className="mb-4 flex items-center gap-4">
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-primary/50 bg-primary/30">
                      <img
                        alt={plan.testimonial.name}
                        className="h-full w-full object-cover"
                        src={plan.testimonial.image}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold not-italic">
                        {plan.testimonial.name}
                      </p>
                      <p className="text-xs not-italic text-primary/70">
                        {plan.testimonial.meta}
                      </p>
                    </div>
                  </div>
                  <p className="relative z-10 text-slate-300">
                    "{plan.testimonial.quote}"
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileSubscription({
  activePlanId,
  billing,
  currency,
  hasPremium,
  plan,
  returnTo,
  setBilling,
}) {
  const price =
    billing === "annual" && plan.yearlyPrice ? plan.yearlyPrice : plan.monthlyPrice;
  const cta = hasPremium && activePlanId === plan.id
    ? {
        label: "Manage Billing",
        to: "/account/settings/billing",
      }
    : {
        label: `Unlock ${plan.name} Power`,
        to: buildCheckoutHref({
          billing,
          kind: "plan",
          productId: plan.id,
          returnTo,
        }),
      };

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        <div className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/10 bg-background-light/90 p-4 backdrop-blur-md dark:bg-background-dark/90">
          <Link className="flex h-10 w-10 items-center justify-center" to={returnTo}>
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h2 className="flex-1 text-center text-lg font-bold tracking-tight">
            {plan.name} Membership
          </h2>
          <div className="flex w-10 items-center justify-end">
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-transparent" type="button">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>

        <div className="relative h-[380px] w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDSC9RFDbi-VqchWJTtZYgpOE9c40WVFPV2wvVA1xP2R07Bd37pI0ddZouMm8of3tMlbojyN84NJ-q4BsedmXD87IQmOSd4UlYByyBRaQB7keflsKycgARclFKgrHpj9GSM-yxP7LidsIiBdp8au43yeR9CAZiNEUADsoI4hkTeiVzudwNvyn68LUg-1IP_l2q6pnnU_2ZALroHvHv4GXFD_lw7yOgqKC2QE1fpR759EtIlULIb6I3-EXh7K9tZzW2EhRp7b77uS3U')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-dark/80 to-background-dark" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-3 py-1">
              <span className="material-symbols-outlined text-sm text-primary">
                auto_awesome
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Premium Tier
              </span>
            </div>
            <h1 className="mb-2 text-4xl font-bold leading-tight text-slate-100">
              Step Into the {plan.name}
            </h1>
            <p className="mx-auto max-w-[280px] text-base text-slate-300">
              Experience TaleStead with premium mystical perks and stronger unlock power.
            </p>
          </div>
        </div>

        <div className="relative z-10 -mt-6 px-4">
          <div className="rounded-xl border border-primary/20 bg-background-light p-6 shadow-2xl backdrop-blur-sm dark:bg-slate-900/50">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  {billing === "annual" ? "Annual Plan" : "Monthly Plan"}
                </p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-primary">
                  {formatPrice(price, currency)}
                  <span className="text-sm font-normal text-slate-400">
                    {billing === "annual" ? "/yr" : "/mo"}
                  </span>
                </h3>
              </div>
              <div className="rounded bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-tighter text-background-dark">
                Best Value
              </div>
            </div>

            <div className="mb-4 flex h-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 p-1">
              {[
                ["monthly", "Monthly"],
                ["annual", "Annual"],
              ].map(([value, label]) => (
                <button
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold ${
                    billing === value
                      ? "bg-primary text-background-dark"
                      : "text-slate-400"
                  }`}
                  key={value}
                  onClick={() => setBilling(value)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>

            <Link
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 font-bold text-background-dark transition-colors hover:bg-primary/90"
              to={cta.to}
            >
              {cta.label}
              <span className="material-symbols-outlined">
                {hasPremium && activePlanId === plan.id ? "settings" : "bolt"}
              </span>
            </Link>
          </div>
        </div>

        <div className="space-y-8 p-6">
          <h4 className="border-l-4 border-primary pl-3 text-xl font-bold">
            Exclusive Perks
          </h4>
          <div className="grid grid-cols-1 gap-6">
            {plan.perks.map((perk) => (
              <div className="flex items-start gap-4" key={perk.title}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                  <span className="material-symbols-outlined text-2xl text-primary">
                    {perk.icon}
                  </span>
                </div>
                <div>
                  <h5 className="text-lg font-bold leading-tight">{perk.title}</h5>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  const {
    activePlanId,
    currency,
    catalogError,
    getDisplayPlan,
    hasPremium,
    isCatalogLoading,
    plans,
  } = useMonetization();
  const [searchParams] = useSearchParams();
  const [billing, setBilling] = useState("monthly");

  const returnTo = searchParams.get("returnTo") || lockedChapterHref;
  const defaultPlanId = plans[0]?.id ?? null;
  const selectedPlanId = searchParams.get("plan") || defaultPlanId;
  const plan = selectedPlanId ? getDisplayPlan(selectedPlanId) : null;

  if (isCatalogLoading) {
    return <RouteLoadingScreen />;
  }

  if (catalogError || !plan || plan.id === "free") {
    return (
      <ReaderStateScreen
        ctaLabel="View Pricing"
        ctaTo={pricingHref}
        description={
          catalogError?.message ||
          "That membership plan is not available in the live catalog right now."
        }
        secondaryLabel="Back to Reading"
        secondaryTo={returnTo}
        title="Plan Unavailable"
      />
    );
  }

  return (
    <>
      <DesktopSubscription
        activePlanId={activePlanId}
        billing={billing}
        currency={currency}
        hasPremium={hasPremium}
        plan={plan}
        returnTo={returnTo}
        setBilling={setBilling}
      />
      <MobileSubscription
        activePlanId={activePlanId}
        billing={billing}
        currency={currency}
        hasPremium={hasPremium}
        plan={plan}
        returnTo={returnTo}
        setBilling={setBilling}
      />
    </>
  );
}
