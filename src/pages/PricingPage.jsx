import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Reveal from "../components/Reveal";
import ReaderStateScreen from "../components/ReaderStateScreen";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import { useMonetization } from "../context/MonetizationContext";
import {
  buildPlanHref,
  formatPrice,
  freePlanTier,
  lockedChapterHref,
} from "../data/monetization";

function getPlanCta(plan, { activePlanId, hasPremium, returnTo }) {
  if (plan.id === "free") {
    return {
      label: hasPremium ? "Back to Reading" : "Current Plan",
      to: returnTo,
    };
  }

  if (hasPremium && activePlanId === plan.id) {
    return {
      label: "Current Plan",
      to: "/account/settings/billing",
    };
  }

  return {
    label: plan.cta,
    to: buildPlanHref(plan.id, returnTo),
  };
}

function DesktopPricing({
  activePlanId,
  billing,
  currency,
  hasPremium,
  plans,
  returnTo,
  setBilling,
}) {
  return (
    <div className="hidden min-h-screen bg-background-dark font-display text-slate-100 md:block">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/20 bg-background-dark/50 px-6 py-4 backdrop-blur-md md:px-20">
          <Link className="flex items-center gap-3" to="/dashboard">
            <span className="material-symbols-outlined text-3xl text-primary">
              auto_stories
            </span>
            <h2 className="text-xl font-bold tracking-tight">StoryArc</h2>
          </Link>

          <div className="hidden flex-1 items-center justify-end gap-10 md:flex">
            <nav className="flex items-center gap-8">
              <Link className="text-sm font-medium text-slate-300 transition-colors hover:text-primary" to="/dashboard">
                Browse
              </Link>
              <a className="text-sm font-medium text-slate-300 transition-colors hover:text-primary" href="#">
                Originals
              </a>
              <Link className="text-sm font-medium text-slate-300 transition-colors hover:text-primary" to="/dashboard">
                Library
              </Link>
              <Link className="text-sm font-bold text-primary underline underline-offset-8" to="/pricing">
                Pricing
              </Link>
            </nav>
            <div className="flex items-center gap-4 border-l border-primary/20 pl-8">
              <Link className="flex min-w-[100px] items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-bold text-background-dark transition-transform hover:scale-105" to="/auth">
                Sign In
              </Link>
              <div
                className="h-10 w-10 rounded-full border-2 border-primary/30 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRqHtGwNRe6RLIf-gr26_2jXA6ye23ImJ3TyLsU7-PIoGiRC6q-_mnWpox8_vYYl0VBi1J16KX1GdQYheexCREIazQK6CcDzhqmV7_3_gn4ZrmjvJjZkCkGLnfockPYgYWG2fJ_7fhmQYgl_077Bs5JJqgHeIpexH811yshpp3q01fUFRnNXjAW2A1DjOtEe5DpQxJwLe5gsOqBvv3BqXcX1fXvf120rap8eAVg4g7bVYTfZSwtKRKftzHomvyvWgCvyioEDT99rU')",
                }}
              />
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center px-6 py-12 md:px-20 md:py-20">
          <div className="w-full max-w-6xl">
            <Reveal className="mb-16 flex flex-col items-center gap-4 text-center">
              <span className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                Membership Plans
              </span>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                Level Up Your Reading
              </h1>
              <p className="max-w-2xl text-lg text-slate-400 md:text-xl">
                Unlock exclusive early access, support your favorite authors,
                and dive deeper into the worlds you love with StoryArc Premium.
              </p>
              <div className="mt-6 flex items-center rounded-xl border border-primary/10 bg-primary/5 p-1">
                {[
                  ["monthly", "Monthly"],
                  ["annual", "Yearly (Save 20%)"],
                ].map(([value, label]) => (
                  <button
                    className={`rounded-lg px-6 py-2 text-sm font-bold ${
                      billing === value
                        ? "bg-primary text-background-dark"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                    key={value}
                    onClick={() => setBilling(value)}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Reveal>

            <Reveal className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
              {plans.map((plan, index) => {
                const price =
                  billing === "annual" && plan.yearlyPrice
                    ? plan.yearlyPrice / 12
                    : plan.monthlyPrice;
                const cta = getPlanCta(plan, {
                  activePlanId,
                  hasPremium,
                  returnTo,
                });

                const isSilver = plan.id === "silver";
                const isArcane = plan.id === "arcane";

                return (
                  <motion.article
                    className={`relative flex flex-col gap-8 rounded-2xl p-8 transition-all ${
                      isArcane
                        ? "z-10 border-2 border-primary bg-primary/10 shadow-[0_0_40px_rgba(244,192,37,0.15)] md:scale-105"
                        : isSilver
                          ? "border border-primary/30 bg-primary/5 hover:border-primary/50"
                          : "border border-primary/10 bg-primary/5 hover:border-primary/30"
                    }`}
                    initial={{ opacity: 0, y: 28 }}
                    key={plan.id}
                    transition={{ delay: index * 0.08, duration: 0.35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: 0.2, once: true }}
                  >
                    {plan.badge && !isArcane && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase text-background-dark">
                        {plan.badge}
                      </div>
                    )}

                    <div className={isArcane ? "flex items-start justify-between" : ""}>
                      <div className="flex flex-col gap-2">
                        <h3 className={`text-xl font-bold ${isArcane ? "text-primary font-black" : ""}`}>
                          {plan.name}
                        </h3>
                        <p className={`text-sm ${isArcane ? "text-slate-300" : "text-slate-400"}`}>
                          {plan.description}
                        </p>
                        <div className="mt-4 flex items-baseline gap-1">
                          <span className={`text-5xl font-black tracking-tight ${isArcane ? "text-6xl" : ""}`}>
                            {formatPrice(price, currency)}
                          </span>
                          <span className="text-lg font-medium text-slate-400">
                            /month
                          </span>
                        </div>
                      </div>
                      {isArcane && (
                        <span className="material-symbols-outlined text-3xl text-primary">
                          workspace_premium
                        </span>
                      )}
                    </div>

                    <Link
                      className={`w-full rounded-xl py-3 text-center font-bold transition-all ${
                        plan.id === "free"
                          ? "border-2 border-primary/20 text-slate-100 hover:bg-primary/10"
                          : isArcane
                            ? "bg-primary text-lg font-black text-background-dark hover:brightness-110 hover:scale-[1.02]"
                            : "border-2 border-primary/40 bg-primary/20 text-primary hover:bg-primary/30"
                      }`}
                      to={cta.to}
                    >
                      {cta.label}
                    </Link>

                    <div className="space-y-4">
                      {plan.features.map((feature) => (
                        <div className="flex items-center gap-3 text-sm" key={feature}>
                          <span className="material-symbols-outlined text-lg text-primary">
                            {plan.id === "free" && feature === "Ad-supported reading"
                              ? "check_circle"
                              : "check_circle"}
                          </span>
                          <span className={isArcane ? "text-slate-100" : "text-slate-300"}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.article>
                );
              })}
            </Reveal>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobilePricing({
  activePlanId,
  billing,
  currency,
  hasPremium,
  plans,
  returnTo,
  setBilling,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-background-light px-3 py-2.5 dark:bg-background-dark">
          <Link className="flex h-10 w-10 items-center justify-start" to={returnTo}>
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h2 className="flex-1 text-center text-base font-bold tracking-tight">
            StoryArc Premium
          </h2>
          <div className="flex w-10 items-center justify-end">
            <button className="flex h-10 w-10 items-center justify-center rounded-lg" type="button">
              <span className="material-symbols-outlined">info</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Reveal className="@container">
            <div className="px-3 py-2">
              <div
                className="relative flex min-h-[140px] flex-col justify-end overflow-hidden rounded-lg bg-background-dark"
                style={{
                  backgroundImage:
                    "linear-gradient(0deg, rgba(34, 30, 16, 0.9) 0%, rgba(34, 30, 16, 0.2) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAhrGQuQatYjRSSFgWqKclPj5KFfJ24lX4kOULWEHHmSm0-ZBUuZra12dNH2_oQ52BvUoYkn1eiRRbuKaRqOLcKwa3oyCHaCWWiwDxNmCg1kkUh6Gx4b62yEfNep1NtjRC5lN2dHIN1OyE3TKBroDJBNung5rweLCc_CPE2wXk0u9b3YG3omSKfDAIzEC9fg27RRHaX_NtfDQwpJQed7HnAMPD03yu23FKD8mLsYCYagWV0tfOKMeICa1zc1sOu2JQGrfS5D6165zE')",
                }}
              >
                <div className="flex flex-col gap-1 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    Elevate Your Reading
                  </p>
                  <p className="text-xl font-extrabold leading-tight text-slate-100">
                    Choose Your Journey
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <h4 className="px-3 py-3 text-center text-xs font-bold leading-normal tracking-[0.015em] text-primary/80">
            Unlock Unlimited Worlds and Exclusive Content
          </h4>

          <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-3 py-2 pb-20">
            <div className="grid grid-cols-2 gap-3">
            {plans.map((plan) => {
              const price =
                billing === "annual" && plan.yearlyPrice
                  ? plan.yearlyPrice / 12
                  : plan.monthlyPrice;
              const cta = getPlanCta(plan, {
                activePlanId,
                hasPremium,
                returnTo,
              });
              const isSilver = plan.id === "silver";
              const isArcane = plan.id === "arcane";

              return (
                <Reveal
                  className={`relative flex flex-col gap-3 rounded-lg p-4 ${
                    isSilver
                      ? "border-2 border-primary bg-primary/10"
                      : isArcane
                        ? "relative overflow-hidden border border-primary/30 bg-background-dark/80 shadow-xl"
                        : "border border-primary/10 bg-white/5 dark:bg-primary/5"
                  }`}
                  key={plan.id}
                >
                  {isSilver && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                      <p className="rounded-full bg-primary px-3 py-0.5 text-center text-[9px] font-bold uppercase tracking-wider text-background-dark shadow-lg">
                        Popular
                      </p>
                    </div>
                  )}
                  {isArcane && (
                    <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />
                  )}

                  <div className="relative z-10 flex flex-col gap-0.5">
                    <div className="flex min-w-0 items-center justify-between gap-2">
                      <h1 className={`min-w-0 truncate text-base font-bold ${isArcane ? "text-primary" : ""}`}>
                        {plan.name}
                      </h1>
                      {isSilver && (
                        <span className="material-symbols-outlined shrink-0 text-base text-primary">
                          military_tech
                        </span>
                      )}
                      {isArcane && (
                        <span className="material-symbols-outlined fill-1 shrink-0 text-base text-primary">
                          auto_awesome
                        </span>
                      )}
                    </div>
                    <p className="flex items-baseline gap-1">
                      <span className="text-xl font-black tracking-[-0.033em]">
                        {formatPrice(price, currency)}
                      </span>
                      <span className="text-xs font-medium opacity-70">/mo</span>
                    </p>
                  </div>

                  <Link
                    className={`relative z-10 flex h-9 w-full items-center justify-center rounded-lg px-3 text-[11px] font-bold ${
                      plan.id === "free"
                        ? "border border-transparent bg-slate-200 text-slate-900 dark:bg-primary/20 dark:text-slate-100"
                        : isSilver
                          ? "bg-primary text-background-dark shadow-lg shadow-primary/20"
                          : "border border-primary/50 bg-slate-900 text-primary dark:bg-primary/90 dark:text-background-dark"
                    }`}
                    to={cta.to}
                  >
                    {cta.label}
                  </Link>

                  <div className="relative z-10 mt-1 flex flex-col gap-1.5">
                    {plan.features.slice(0, 3).map((feature) => (
                      <div className="flex gap-2 text-xs leading-normal" key={feature}>
                        <span className="material-symbols-outlined text-base text-primary shrink-0">
                          check_circle
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </Reveal>
              );
            })}
            </div>

            <div className="flex items-center justify-center rounded-lg border border-primary/20 bg-primary/5 p-1">
              {[
                ["monthly", "Monthly"],
                ["annual", "Annual (20% Off)"],
              ].map(([value, label]) => (
                <button
                  className={`flex-1 rounded-md px-3 py-2 text-xs font-bold ${
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const {
    activePlanId,
    currency,
    catalogError,
    freePlan,
    hasPremium,
    isCatalogLoading,
    plans,
  } = useMonetization();
  const [searchParams] = useSearchParams();
  const [billing, setBilling] = useState("monthly");
  const returnTo = searchParams.get("returnTo") || lockedChapterHref;
  const displayPlans = useMemo(
    () => [freePlan ?? freePlanTier, ...plans],
    [freePlan, plans],
  );

  if (isCatalogLoading) {
    return <RouteLoadingScreen />;
  }

  if (catalogError || plans.length === 0) {
    return (
      <ReaderStateScreen
        ctaLabel="Back to Reading"
        ctaTo={returnTo}
        description={
          catalogError?.message ||
          "Membership products are unavailable right now. Try again after the catalog refreshes."
        }
        title="Pricing Unavailable"
      />
    );
  }

  return (
    <>
      <DesktopPricing
        activePlanId={activePlanId}
        billing={billing}
        currency={currency}
        hasPremium={hasPremium}
        plans={displayPlans}
        returnTo={returnTo}
        setBilling={setBilling}
      />
      <MobilePricing
        activePlanId={activePlanId}
        billing={billing}
        currency={currency}
        hasPremium={hasPremium}
        plans={displayPlans}
        returnTo={returnTo}
        setBilling={setBilling}
      />
    </>
  );
}
