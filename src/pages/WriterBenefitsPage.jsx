import { Link } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import PublicNav from "../components/PublicNav";
import SeoMetadata from "../components/SeoMetadata";

const monetizationFeatures = [
  {
    icon: "payments",
    title: "Premium Purchases",
    description:
      "Unlock consistent revenue through the pay-per-chapter model used by thousands of subscribers.",
  },
  {
    icon: "favorite",
    title: "Tips",
    description:
      "Receive direct support from your most dedicated fans who want to show extra appreciation for your work.",
  },
  {
    icon: "trending_up",
    title: "Promotions",
    description:
      "Earn visibility bonuses through platform-wide marketing events and seasonal reading campaigns.",
  },
  {
    icon: "emoji_events",
    title: "Milestone Rewards",
    description:
      "Celebrate your growth with cash bonuses for hitting word count and readership milestones.",
  },
];

const tools = [
  { icon: "schedule", label: "Scheduling" },
  { icon: "bar_chart", label: "Analytics" },
  { icon: "lightbulb", label: "Insights" },
  { icon: "account_balance_wallet", label: "Monetization" },
  { icon: "dashboard", label: "Dashboard" },
];

export default function WriterBenefitsPage() {
  return (
    <div className="min-h-screen bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-100 antialiased">
      <SeoMetadata
        title="Writer Benefits"
        description="Write, publish, and earn. Join TaleStead's community of webnovel creators. Premium purchases, tips, promotions, and milestone rewards. Flexible contracts and full creative control."
      />
      <PublicNav compact ctaHref="/creator/apply" ctaLabel="Apply as Writer" variant="dark" />

      <main className="w-full pt-12 md:pt-0">
        {/* Hero */}
        <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden px-4 md:min-h-[80vh] md:px-6">
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
          <div className="relative z-10 flex max-w-4xl flex-col items-center gap-4 text-center md:gap-8">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-7xl">
              Write. Publish. <span className="text-primary">Earn.</span>
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-300 md:text-lg lg:text-xl">
              Your stories deserve readers—and real rewards. Join the
              fastest-growing community of webnovel creators and turn your
              passion into a career.
            </p>
            <div className="flex w-full flex-row justify-center gap-3 sm:gap-4">
              <Link
                className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-background-dark transition-transform hover:scale-105 md:px-10 md:py-4 md:text-lg"
                to="/creator/apply"
              >
                Start Writing
              </Link>
              <Link
                className="rounded-xl border border-neutral-border bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10 md:px-10 md:py-4 md:text-lg"
                to="/creator"
              >
                View Writer Guide
              </Link>
            </div>
          </div>
        </section>

        {/* Earn From Your Stories */}
        <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-24 lg:px-20">
          <div className="mb-8 flex flex-col items-center text-center md:mb-16">
            <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary md:mb-4 md:text-xs">
              Monetization
            </span>
            <h2 className="mb-4 text-2xl font-bold text-white md:mb-6 md:text-3xl lg:text-4xl">
              Earn From Your Stories
            </h2>
            <div className="h-1 w-16 rounded-full bg-primary md:w-20" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {monetizationFeatures.map((feature) => (
              <div
                key={feature.title}
                className="glass-card group flex flex-col gap-3 rounded-xl p-5 transition-all hover:border-primary/40 md:gap-4 md:rounded-2xl md:p-8"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-background-dark md:h-12 md:w-12 md:rounded-xl">
                  <span className="material-symbols-outlined text-2xl md:text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-base font-bold text-white md:text-xl">{feature.title}</h3>
                <p className="text-xs leading-relaxed text-slate-400 md:text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Flexible Publishing Contracts */}
        <section className="bg-neutral-dark/50 px-4 py-12 md:px-6 md:py-24 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center md:mb-16">
              <h2 className="mb-2 text-2xl font-bold text-white md:mb-4 md:text-3xl lg:text-4xl">
                Flexible Publishing Contracts
              </h2>
              <p className="mx-auto max-w-2xl text-sm text-slate-400 md:text-base">
                We offer options that suit every stage of your writing journey.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 md:gap-8 lg:grid-cols-3">
              {/* Non-Exclusive */}
              <div className="flex flex-col rounded-xl border border-neutral-border bg-background-dark p-5 md:rounded-2xl md:p-8">
                <h3 className="mb-1 text-base font-bold text-white md:mb-2 md:text-xl">
                  Non-Exclusive
                </h3>
                <p className="mb-4 text-xs text-slate-400 md:mb-6 md:text-sm">
                  Publish on multiple platforms while testing TaleStead's
                  ecosystem.
                </p>
                <ul className="mb-5 flex-grow space-y-2 md:mb-8 md:space-y-4">
                  <li className="flex items-center gap-2 text-xs text-slate-300 md:gap-3 md:text-sm">
                    <span className="material-symbols-outlined text-xs text-primary md:text-sm">
                      check_circle
                    </span>
                    30% Net Revenue Share
                  </li>
                  <li className="flex items-center gap-2 text-xs text-slate-300 md:gap-3 md:text-sm">
                    <span className="material-symbols-outlined text-xs text-primary md:text-sm">
                      check_circle
                    </span>
                    Keep all IP rights
                  </li>
                  <li className="flex items-center gap-2 text-xs text-slate-300 md:gap-3 md:text-sm">
                    <span className="material-symbols-outlined text-xs text-primary md:text-sm">
                      check_circle
                    </span>
                    No posting restrictions
                  </li>
                </ul>
                <Link
                  className="w-full rounded-lg border border-primary py-2.5 text-center text-sm font-bold text-primary transition-all hover:bg-primary hover:text-background-dark md:py-3 md:text-base"
                  to="/creator/apply"
                >
                  Select Path
                </Link>
              </div>

              {/* Exclusive */}
              <div className="relative flex flex-col transform rounded-xl border-2 border-primary bg-neutral-dark p-5 shadow-2xl shadow-primary/5 md:rounded-2xl md:p-8 lg:scale-105">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-background-dark md:-top-4 md:px-4 md:py-1 md:text-xs">
                  Recommended
                </div>
                <h3 className="mb-1 text-base font-bold text-white md:mb-2 md:text-xl">Exclusive</h3>
                <p className="mb-4 text-xs text-slate-400 md:mb-6 md:text-sm">
                  The best path for high-growth serial authors looking for
                  maximum support.
                </p>
                <ul className="mb-5 flex-grow space-y-2 md:mb-8 md:space-y-4">
                  <li className="flex items-center gap-2 text-xs text-slate-300 md:gap-3 md:text-sm">
                    <span className="material-symbols-outlined text-xs text-primary md:text-sm">
                      check_circle
                    </span>
                    50% Net Revenue Share
                  </li>
                  <li className="flex items-center gap-2 text-xs text-slate-300 md:gap-3 md:text-sm">
                    <span className="material-symbols-outlined text-xs text-primary md:text-sm">
                      check_circle
                    </span>
                    Priority platform placement
                  </li>
                  <li className="flex items-center gap-2 text-xs text-slate-300 md:gap-3 md:text-sm">
                    <span className="material-symbols-outlined text-xs text-primary md:text-sm">
                      check_circle
                    </span>
                    Dedicated Editor support
                  </li>
                  <li className="flex items-center gap-2 text-xs text-slate-300 md:gap-3 md:text-sm">
                    <span className="material-symbols-outlined text-xs text-primary md:text-sm">
                      check_circle
                    </span>
                    Marketing spend allocation
                  </li>
                </ul>
                <Link
                  className="w-full rounded-lg bg-primary py-2.5 text-center text-sm font-bold text-background-dark transition-all hover:brightness-110 md:py-3 md:text-base"
                  to="/creator/apply"
                >
                  Apply Now
                </Link>
              </div>

              {/* Early Author Program */}
              <div className="flex flex-col rounded-xl border border-neutral-border bg-background-dark p-5 md:rounded-2xl md:p-8">
                <h3 className="mb-1 text-base font-bold text-white md:mb-2 md:text-xl">
                  Early Author Program
                </h3>
                <p className="mb-4 text-xs text-slate-400 md:mb-6 md:text-sm">
                  For established creators transitioning their audience to
                  TaleStead.
                </p>
                <ul className="mb-5 flex-grow space-y-2 md:mb-8 md:space-y-4">
                  <li className="flex items-center gap-2 text-xs text-slate-300 md:gap-3 md:text-sm">
                    <span className="material-symbols-outlined text-xs text-primary md:text-sm">
                      check_circle
                    </span>
                    Custom signing bonuses
                  </li>
                  <li className="flex items-center gap-2 text-xs text-slate-300 md:gap-3 md:text-sm">
                    <span className="material-symbols-outlined text-xs text-primary md:text-sm">
                      check_circle
                    </span>
                    Advanced royalty advances
                  </li>
                  <li className="flex items-center gap-2 text-xs text-slate-300 md:gap-3 md:text-sm">
                    <span className="material-symbols-outlined text-xs text-primary md:text-sm">
                      check_circle
                    </span>
                    Brand partnership access
                  </li>
                </ul>
                <Link
                  className="w-full rounded-lg border border-neutral-border py-2.5 text-center text-sm font-bold text-slate-300 transition-all hover:bg-white/5 md:py-3 md:text-base"
                  to="/creator"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Keep Your Creative Control */}
        <section className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-12 md:px-6 md:py-24 lg:flex-row lg:gap-16 lg:px-20">
          <div className="w-full lg:w-1/2">
            <div className="relative overflow-hidden rounded-xl border border-neutral-border shadow-2xl aspect-[4/3] md:rounded-2xl">
              <img
                alt="High-end laptop displaying a professional writing workspace"
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCt2oziG3xhMh8HGuZlGp9KrNNK6UX64h0YOx56IXcJp4b56Qxd-T6dALNBEqr4x7VukkcDtS0MrKy5J5W0koD2zbucB5v7ytVBiceOknTaAZaC5PEWkLE0yqEIiSq1gf4N4Rfoh5Wbg2c-5EXuwFL2A0ReKlhMISOXL3g21kU6JS9rPVr6FIAa4rfvuP7xx54CSvlsHRW3Oq7U03XYiw_Ds5n5EXuG7ixy6gy3jOqJUJRhXAJfjgWD2D85VTGRCdvhMQpfReNi6Dk"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent" />
            </div>
          </div>
          <div className="space-y-5 lg:w-1/2 md:space-y-8">
            <h2 className="text-2xl font-bold leading-tight text-white md:text-4xl">
              Keep Your <span className="text-primary">Creative Control</span>
            </h2>
            <p className="text-sm leading-relaxed text-slate-300 md:text-lg">
              At TaleStead, we believe the creator is the soul of the platform.
              Unlike traditional publishing, you maintain full intellectual
              property rights under our standard agreements.
            </p>
            <div className="space-y-4 md:space-y-6">
              <div className="flex gap-3 md:gap-4">
                <div className="mt-0.5 text-primary md:mt-1">
                  <span className="material-symbols-outlined text-2xl md:text-3xl">gavel</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white md:text-base">IP Ownership</h4>
                  <p className="text-xs text-slate-400 md:text-sm">
                    Your characters, your world, your rights. We only license the
                    digital distribution.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 md:gap-4">
                <div className="mt-0.5 text-primary md:mt-1">
                  <span className="material-symbols-outlined text-2xl md:text-3xl">palette</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white md:text-base">Creative Freedom</h4>
                  <p className="text-xs text-slate-400 md:text-sm">
                    Write the stories you want to tell. We provide the tools, you
                    provide the vision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Built For Serialized Storytelling */}
        <section className="bg-background-dark px-4 py-12 md:px-6 md:py-24 lg:px-20">
          <div className="mx-auto max-w-7xl text-center mb-8 md:mb-16">
            <h2 className="text-2xl font-bold text-white md:text-3xl lg:text-4xl">
              Built For Serialized Storytelling
            </h2>
            <p className="mt-2 text-sm text-slate-400 md:mt-4 md:text-base">
              Powerful tools designed specifically for the unique rhythm of
              webnovels.
            </p>
          </div>
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 md:gap-4 lg:grid-cols-5 lg:gap-8">
            {tools.map((tool) => (
              <div
                key={tool.label}
                className="flex flex-col items-center gap-2 rounded-lg border border-neutral-border bg-neutral-dark p-4 text-center md:gap-3 md:rounded-xl md:p-6"
              >
                <span className="material-symbols-outlined text-2xl text-primary md:text-3xl">
                  {tool.icon}
                </span>
                <span className="text-xs font-bold text-white md:text-sm">{tool.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Grow Your Audience & Dashboard */}
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 md:px-6 md:py-24 lg:grid-cols-2 lg:gap-12 lg:px-20">
          <div className="flex flex-col justify-center gap-5 md:gap-8">
            <div className="space-y-2 md:space-y-4">
              <h2 className="text-2xl font-bold text-white md:text-3xl">
                Grow Your Audience
              </h2>
              <p className="text-sm text-slate-400 md:text-base">
                Our algorithm is designed to surface quality talent. Through
                featured placements, daily rankings, and personalized
                recommendations, we connect you with readers who love your
                genre.
              </p>
            </div>
            <div className="space-y-2 border-t border-neutral-border pt-5 md:space-y-4 md:pt-8">
              <h2 className="text-2xl font-bold text-white md:text-3xl">
                Transparent Earnings
              </h2>
              <p className="text-sm text-slate-400 md:text-base">
                Never wonder about your payouts. Our real-time dashboard
                provides granular data on every penny earned, from chapter sales
                to global gifts, ensuring total clarity.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-neutral-border bg-neutral-dark p-3 shadow-inner md:rounded-3xl md:p-4">
            <div className="overflow-hidden rounded-xl border border-neutral-border/50 bg-background-dark shadow-2xl md:rounded-2xl">
              <img
                alt="Professional analytics dashboard showing readership growth and earnings"
                className="h-auto w-full"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDbv6keSWqB3Om3-c-H5b56ICodNbZFdH9qa67io29NGwZSXPlCwauJAn8JAJRcJBYOnGvKx4rVirik_9ZDMv2uXbCHE2UIcZKV8QuVGwIiOWWfAOJVT4UlA0e3AtSCpBsdrf8TpBNEBMm1vORJ2WXDRXaSQma2grYQUNukOK7CARRHHaci0YSF8kMIa2Z4PsH7oB9dRPJ0l5P3xGNCoy-PSWC_XAvWhIIe0hg_CmwRlQQFUAigC9iLhxMahoAJB-YrYtJp_w3rjc"
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden px-4 py-12 md:px-6 md:py-24 lg:px-20">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-6 text-center md:rounded-3xl md:p-12 lg:p-20">
            <div className="absolute -mt-10 -mr-10 right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -mb-10 -ml-10 bottom-0 left-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <h2 className="mb-4 text-2xl font-bold text-white md:mb-6 md:text-4xl lg:text-5xl">
              Start Your Writing Journey
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-sm text-slate-300 md:mb-10 md:text-lg">
              Submit your writer application today and begin publishing your
              story to a global audience of hungry readers.
            </p>
            <Link
              className="inline-block rounded-xl bg-primary px-8 py-3 text-base font-bold text-background-dark shadow-xl shadow-primary/20 transition-transform hover:scale-105 md:px-12 md:py-5 md:text-xl"
              to="/creator/apply"
            >
              Apply as Writer
            </Link>
          </div>
        </section>

        <AppFooter variant="full" />
      </main>

      <style>{`
        .glass-card {
          background: rgba(28, 26, 22, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(244, 192, 37, 0.1);
        }
      `}</style>
    </div>
  );
}
