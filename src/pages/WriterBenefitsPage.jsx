import { useState } from "react";
import { Link } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import PublicNav from "../components/PublicNav";
import SeoMetadata from "../components/SeoMetadata";
import MaterialSymbol from "../components/MaterialSymbol";

const tools = [
  { icon: "schedule", label: "Scheduling" },
  { icon: "bar_chart", label: "Analytics" },
  { icon: "lightbulb", label: "Insights" },
  { icon: "account_balance_wallet", label: "Monetization" },
  { icon: "dashboard", label: "Dashboard" },
];

/** Full offer per contract path — revenue, bonuses, and path-specific payout notes where they apply. */
const writerPaths = [
  {
    id: "exclusive",
    label: "Exclusive",
    tagline: "The best path for high-growth serial authors looking for maximum support.",
    recommended: true,
    sections: [
      {
        title: "Revenue Share",
        bullets: [
          "Up to **70% net revenue share**.",
          "**Payouts:** Per-book balance; amounts below the **$100** minimum roll over month to month until the threshold is met.",
        ],
      },
      {
        title: "Platform growth",
        bullets: [
          "Priority placement in app and web discovery.",
          "Dedicated editor support.",
          "Allocated marketing spend for eligible titles.",
        ],
      },
      {
        title: "Signing bonus",
        bullets: [
          "One-time bonus for every newly signed book reaching **30,000+** published words.",
        ],
      },
      {
        title: "Daily update bonus",
        bullets: [
          "Earn monthly rewards for consistency: **50,000+ words/month** and **25+ valid update days** (see program terms for the first month after your contract starts).",
          "**Valid update day:** publish at least one new chapter with **1,000+ words**.",
          "**Streak rule:** no more than **4 consecutive inactive days** in a rolling year.",
          "If you run multiple exclusive serials, only **one book per month** can receive the Daily Update Bonus.",
          "After **3 consecutive months** of earning this bonus, month **4+** requires meeting update targets **and** at least **$20** monthly revenue split to continue.",
        ],
      },
      {
        title: "Completion bonuses",
        intro: "One-time tiered payouts when you finish long-form works:",
        bullets: [
          "**Tier 1:** ≥ 200,000 words",
          "**Tier 2:** 150,000 – 199,999 words",
          "**Tier 3:** 120,000 – 149,999 words",
        ],
      },
      {
        title: "Bonus rules (exclusive)",
        bullets: [
          "Signing and completion bonuses are **one-time per book** where applicable.",
          "Serials with **no updates for 6+ consecutive months** are treated as abandoned and lose **bonus** eligibility (revenue terms may still apply per contract).",
        ],
      },
    ],
    cta: { label: "Apply now", to: "/creator/apply", primary: true },
  },
  {
    id: "non-exclusive",
    label: "Non-exclusive",
    tagline: "Publish on multiple platforms while testing the TaleStead ecosystem.",
    recommended: false,
    sections: [
      {
        title: "Ultimate freedom",
        bullets: [
          "**No posting restrictions** and no lock-in—publish wherever you like.",
        ],
      },
      {
        title: "Revenue share",
        bullets: [
          "Up to **50% net revenue share** on **paid chapter unlocks** and **ad revenue**.",
          "**Payouts:** Per-book **$100 minimum** before withdrawal; smaller balances roll forward.",
        ],
      },
      {
        title: "Completion bonuses",
        intro: "Tiered payouts when you complete longer works:",
        bullets: [
          "**Tier 1:** ≥ 200,000 words",
          "**Tier 2:** 150,000 – 199,999 words",
        ],
      },
      {
        title: "Retention",
        bullets: [
          "To stay eligible for bonuses, a book must not remain **inactive for more than 6 consecutive months**.",
        ],
      },
      {
        title: "First-look preference",
        bullets: [
          "Publish new chapters—and complete books—on **TaleStead first** whenever possible to maximize platform momentum and reader growth.",
        ],
      },
    ],
    cta: { label: "Select path", to: "/creator/apply", primary: false },
  },
  {
    id: "early-author",
    label: "Early author",
    tagline: "For established creators transitioning an existing audience to TaleStead.",
    recommended: false,
    sections: [
      {
        title: "Bespoke contracts",
        bullets: [
          "Access to **custom signing bonuses** and advanced royalty structures tailored to your portfolio.",
        ],
      },
      {
        title: "Financial security",
        bullets: [
          "Negotiable **royalty advances** to support your transition to the platform.",
        ],
      },
      {
        title: "Brand expansion",
        bullets: [
          "**Brand partnership** opportunities and cross-platform promotion.",
        ],
      },
      {
        title: "Adaptation rights",
        bullets: [
          "Priority consideration for **film, TV, and short-video** adaptations with **shared royalties**.",
        ],
      },
      {
        title: "White-glove support",
        bullets: [
          "Direct line to the platform's **executive content** team for onboarding and strategy.",
        ],
      },
      {
        title: "Settlement (program)",
        bullets: [
          "Commercial terms are set in your **individual agreement**; standard TaleStead **$100 payout floor** and **monthly settlement cycle** typically apply unless your contract states otherwise.",
        ],
      },
    ],
    cta: { label: "Learn more", to: "/creator", primary: false },
  },
];

const globalSettlementRules = [
  "**Threshold:** Minimum **$100** payout per book; balances roll over monthly until the threshold is met.",
  "**Timeline:** Benefits are calculated in **UTC+0**; payment for a given month is issued at the **end of the following month**.",
  "**Activity:** Serials inactive for **6+ months** are marked abandoned and **lose bonus eligibility**.",
];

function renderInlineBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function PathSections({ sections }) {
  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <div key={section.title}>
          <h4 className="text-xs font-bold uppercase tracking-wide text-primary">{section.title}</h4>
          {section.intro ? (
            <p className="mt-1.5 text-xs text-slate-400 md:text-sm">{section.intro}</p>
          ) : null}
          <ul className="mt-2 space-y-2">
            {section.bullets.map((line) => (
              <li key={line} className="flex gap-2 text-xs leading-relaxed text-slate-300 md:text-sm">
                <MaterialSymbol name="check_circle" className="mt-0.5 shrink-0 text-sm text-primary" />
                <span>{renderInlineBold(line)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function PathCard({ path, className = "" }) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border bg-background-dark p-5 md:p-6 ${
        path.recommended ? "border-2 border-primary shadow-lg shadow-primary/10" : "border-neutral-border"
      } ${className}`}
    >
      {path.recommended ? (
        <div className="-mx-5 -mt-5 mb-4 rounded-t-2xl bg-primary/15 px-4 py-2 text-center md:-mx-6 md:-mt-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary md:text-xs">
            Recommended
          </span>
        </div>
      ) : null}
      <h3 className="text-lg font-bold text-white md:text-xl">{path.label}</h3>
      <p className="mt-2 text-sm text-slate-400">{path.tagline}</p>
      <div className="mt-5 flex-1">
        <PathSections sections={path.sections} />
      </div>
      <Link
        className={`mt-6 block w-full rounded-xl py-3 text-center text-sm font-bold transition-colors md:py-3.5 md:text-base ${
          path.cta.primary
            ? "bg-primary text-background-dark hover:brightness-110"
            : "border border-neutral-border text-slate-200 hover:bg-white/5"
        }`}
        to={path.cta.to}
      >
        {path.cta.label}
      </Link>
    </div>
  );
}

export default function WriterBenefitsPage() {
  const [activePathId, setActivePathId] = useState(writerPaths[0].id);
  const activePath = writerPaths.find((p) => p.id === activePathId) ?? writerPaths[0];

  return (
    <div className="min-h-screen bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-100 antialiased">
      <SeoMetadata
        title="Writer Benefits"
        description="Choose your TaleStead contract path: exclusive, non-exclusive, or early author. Clear revenue share, bonuses, Golden Quill rewards, and settlement terms."
      />
      <PublicNav compact ctaHref="/creator/apply" ctaLabel="Apply as Writer" variant="dark" />

      <main className="w-full pt-12 md:pt-0">
        {/* Hero */}
        <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden px-4 md:min-h-[72vh] md:px-6">
          <div className="absolute inset-0 z-0 opacity-40">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background-dark" />
            <div
              className="h-full w-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2000')",
              }}
            />
          </div>
          <div className="relative z-10 flex max-w-3xl flex-col items-center gap-4 text-center md:gap-6">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
              Write. Publish. <span className="text-primary">Earn.</span>
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-300 md:text-lg">
              One page. Three paths. Pick the contract that matches your career—each block is a complete offer with revenue,
              bonuses, and how you get paid.
            </p>
            <div className="flex w-full flex-row flex-wrap justify-center gap-3">
              <Link
                className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-background-dark transition-transform hover:scale-105 md:px-8 md:text-base"
                to="/creator/apply"
              >
                Apply as writer
              </Link>
              <Link
                className="rounded-xl border border-neutral-border bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10 md:text-base"
                to="/creator"
              >
                Writer guide
              </Link>
            </div>
          </div>
        </section>

        {/* Choose your path — tabs on mobile, 3 columns on desktop */}
        <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20 lg:px-20">
          <div className="mb-8 text-center md:mb-12">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary md:text-xs">
              Contract paths
            </span>
            <h2 className="mt-2 text-2xl font-bold text-white md:text-4xl">Choose your path</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 md:text-base">
              Compare exclusive, non-exclusive, and early-author programs side by side on desktop—or switch tabs on your phone.
            </p>
          </div>

          {/* Mobile: segmented tabs */}
          <div className="mb-6 lg:hidden">
            <div
              className="flex gap-1 rounded-2xl border border-neutral-border bg-neutral-dark/80 p-1"
              role="tablist"
              aria-label="Writer contract path"
            >
              {writerPaths.map((path) => (
                <button
                  key={path.id}
                  type="button"
                  role="tab"
                  aria-selected={activePathId === path.id}
                  onClick={() => setActivePathId(path.id)}
                  className={`min-w-0 flex-1 rounded-xl px-2 py-2.5 text-center text-[11px] font-bold leading-tight transition-colors sm:text-xs ${
                    activePathId === path.id
                      ? "bg-primary text-background-dark"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {path.label}
                </button>
              ))}
            </div>
            <PathCard path={activePath} />
          </div>

          {/* Desktop: three columns */}
          <div className="hidden gap-6 lg:grid lg:grid-cols-3">
            {writerPaths.map((path) => (
              <PathCard key={path.id} path={path} />
            ))}
          </div>
        </section>

        {/* Global settlement — small print */}
        <section className="border-t border-neutral-border/60 bg-neutral-dark/30 px-4 py-10 md:px-6 md:py-14 lg:px-20">
          <div className="mx-auto max-w-4xl">
            <h3 className="text-center text-xs font-bold uppercase tracking-widest text-slate-500">
              Global settlement rules
            </h3>
            <ul className="mt-6 space-y-3 text-xs leading-relaxed text-slate-400 md:text-sm">
              {globalSettlementRules.map((rule) => (
                <li key={rule} className="flex gap-2">
                  <MaterialSymbol name="info" className="mt-0.5 shrink-0 text-sm text-primary/80" />
                  <span>{renderInlineBold(rule)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-center text-[11px] text-slate-500 md:text-xs">
              Bonus eligibility for contracts effective on or after January 1, 2026 unless your written agreement states otherwise.
              TaleStead may update program details; your signed contract prevails.
            </p>
          </div>
        </section>

        {/* Keep your creative control */}
        <section className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-12 md:px-6 md:py-20 lg:flex-row lg:gap-16 lg:px-20">
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-neutral-border shadow-2xl md:rounded-2xl">
              <img
                alt="Professional writing workspace"
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCt2oziG3xhMh8HGuZlGp9KrNNK6UX64h0YOx56IXcJp4b56Qxd-T6dALNBEqr4x7VukkcDtS0MrKy5J5W0koD2zbucB5v7ytVBiceOknTaAZaC5PEWkLE0yqEIiSq1gf4N4Rfoh5Wbg2c-5EXuwFL2A0ReKlhMISOXL3g21kU6JS9rPVr6FIAa4rfvuP7xx54CSvlsHRW3Oq7U03XYiw_Ds5n5EXuG7ixy6gy3jOqJUJRhXAJfjgWD2D85VTGRCdvhMQpfReNi6Dk"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent" />
            </div>
          </div>
          <div className="space-y-5 lg:w-1/2 md:space-y-8">
            <h2 className="text-2xl font-bold leading-tight text-white md:text-4xl">
              Keep your <span className="text-primary">creative control</span>
            </h2>
            <p className="text-sm leading-relaxed text-slate-300 md:text-lg">
              You maintain intellectual property rights under our standard agreements—we license digital distribution, not your world.
            </p>
            <div className="space-y-4 md:space-y-6">
              <div className="flex gap-3 md:gap-4">
                <div className="mt-0.5 text-primary md:mt-1">
                  <MaterialSymbol name="gavel" className="text-2xl md:text-3xl" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white md:text-base">IP ownership</h4>
                  <p className="text-xs text-slate-400 md:text-sm">
                    Your characters, your world. We only license distribution on TaleStead.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 md:gap-4">
                <div className="mt-0.5 text-primary md:mt-1">
                  <MaterialSymbol name="palette" className="text-2xl md:text-3xl" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white md:text-base">Creative freedom</h4>
                  <p className="text-xs text-slate-400 md:text-sm">
                    We provide tools and readers; you provide the story.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Built for serialized storytelling */}
        <section className="bg-background-dark px-4 py-12 md:px-6 md:py-20 lg:px-20">
          <div className="mx-auto mb-8 max-w-7xl text-center md:mb-12">
            <h2 className="text-2xl font-bold text-white md:text-3xl lg:text-4xl">Built for serialized storytelling</h2>
            <p className="mt-2 text-sm text-slate-400 md:mt-4 md:text-base">
              Tools tuned for the rhythm of webnovels and long-running serials.
            </p>
          </div>
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 md:gap-4 lg:grid-cols-5 lg:gap-8">
            {tools.map((tool) => (
              <div
                key={tool.label}
                className="flex flex-col items-center gap-2 rounded-lg border border-neutral-border bg-neutral-dark p-4 text-center md:gap-3 md:rounded-xl md:p-6"
              >
                <MaterialSymbol name={tool.icon} className="text-2xl text-primary md:text-3xl" />
                <span className="text-xs font-bold text-white md:text-sm">{tool.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Audience + earnings */}
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 md:px-6 md:py-20 lg:grid-cols-2 lg:gap-12 lg:px-20">
          <div className="flex flex-col justify-center gap-8">
            <div className="space-y-2 md:space-y-4">
              <h2 className="text-2xl font-bold text-white md:text-3xl">Grow your audience</h2>
              <p className="text-sm text-slate-400 md:text-base">
                Featured placements, rankings, and recommendations connect you with readers who love your genre.
              </p>
            </div>
            <div className="space-y-2 border-t border-neutral-border pt-6 md:space-y-4 md:pt-8">
              <h2 className="text-2xl font-bold text-white md:text-3xl">Transparent earnings</h2>
              <p className="text-sm text-slate-400 md:text-base">
                Your dashboard shows chapter sales, gifts, and payouts so you always know what you earned.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-neutral-border bg-neutral-dark p-3 shadow-inner md:rounded-3xl md:p-4">
            <div className="overflow-hidden rounded-xl border border-neutral-border/50 bg-background-dark shadow-2xl md:rounded-2xl">
              <img
                alt="Analytics dashboard"
                className="h-auto w-full"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDbv6keSWqB3Om3-c-H5b56ICodNbZFdH9qa67io29NGwZSXPlCwauJAn8JAJRcJBYOnGvKx4rVirik_9ZDMv2uXbCHE2UIcZKV8QuVGwIiOWWfAOJVT4UlA0e3AtSCpBsdrf8TpBNEBMm1vORJ2WXDRXaSQma2grYQUNukOK7CARRHHaci0YSF8kMIa2Z4PsH7oB9dRPJ0l5P3xGNCoy-PSWC_XAvWhIIe0hg_CmwRlQQFUAigC9iLhxMahoAJB-YrYtJp_w3rjc"
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden px-4 py-12 md:px-6 md:py-20 lg:px-20">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-6 text-center md:rounded-3xl md:p-12 lg:p-16">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <h2 className="mb-4 text-2xl font-bold text-white md:mb-6 md:text-4xl lg:text-5xl">
              Start your writing journey
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-sm text-slate-300 md:mb-10 md:text-lg">
              Submit your application and publish to readers worldwide.
            </p>
            <Link
              className="inline-block rounded-xl bg-primary px-8 py-3 text-base font-bold text-background-dark shadow-xl shadow-primary/20 transition-transform hover:scale-105 md:px-12 md:py-5 md:text-xl"
              to="/creator/apply"
            >
              Apply as writer
            </Link>
          </div>
        </section>

        <AppFooter variant="full" />
      </main>
    </div>
  );
}
