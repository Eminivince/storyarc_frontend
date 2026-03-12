import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Reveal from "../components/Reveal";
import { useCreator } from "../context/CreatorContext";
import {
  creatorBenefits,
  creatorTimeline,
} from "../data/creatorFlow";

function getCreatorCtaLabel(status) {
  if (status === "approved") {
    return "Open Creator Suite";
  }

  if (status === "pending") {
    return "View Application Status";
  }

  if (status === "draft") {
    return "Resume Application";
  }

  return "Start Application";
}

function DesktopCreatorOnboarding({ onStart, status }) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-primary/20 bg-background-light px-6 py-4 dark:bg-background-dark md:px-20">
          <div className="flex items-center gap-4 text-primary">
            <div className="flex size-6 items-center justify-center">
              <span className="material-symbols-outlined text-3xl">auto_stories</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              StoryArc
            </h2>
          </div>
          <div className="flex flex-1 items-center justify-end gap-8">
            <nav className="hidden items-center gap-9 md:flex">
              <Link
                className="text-sm font-medium text-slate-700 transition-colors hover:text-primary dark:text-slate-300"
                to="/search"
              >
                Explore
              </Link>
              <Link
                className="text-sm font-medium text-slate-700 transition-colors hover:text-primary dark:text-slate-300"
                to="/about"
              >
                Community
              </Link>
              <Link
                className="text-sm font-medium text-slate-700 transition-colors hover:text-primary dark:text-slate-300"
                to="/account/help"
              >
                Resources
              </Link>
            </nav>
            <Link
              className="flex min-w-[100px] items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-background-dark transition-opacity hover:opacity-90"
              to="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="size-10 rounded-full border border-primary/30 bg-cover bg-center"
              to="/account/profile"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAZgyod7YvMRHZWC9_MsImUwcjGVon3tqhBdeqDUORTmUC6grkopIDq6X4xdkCuUkE1_GtAW0MloAfEFUalyDkur5hRdz9IRJhx5HLqDjB55Iwh_jEfog3kgHWvwnpKknz7qxiAxDFczn_gx9xHJaRTZMXbdGlL3C1Lg4s84SI4hawI9QW8RRo2ttcrCUWzARSU0MUqbu5vHvgy3eDfuApy7rrSmlBbGY4azq1iSnuBfVKtJ3fUSbhW2BnzaLwCrHa9gMWGBS2V1xY')",
              }}
            />
          </div>
        </header>

        <main className="flex flex-1 justify-center px-4 py-10">
          <div className="flex max-w-[1000px] flex-1 flex-col gap-8">
            <Reveal>
              <div
                className="relative flex min-h-[400px] flex-col justify-end overflow-hidden rounded-xl border border-primary/10 shadow-2xl"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, rgba(34, 30, 16, 0.2) 0%, rgba(34, 30, 16, 0.9) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAXgVd2YpqGrSOe-nLi73qY4GikqKwVeAcKWv_bO4coefMM6_cs7AARL2BAXZtYT8i0o-nF76Z61njbKfcDZqX7re99g331TAsskfcNX5mxHfIZpRoKJFYgche3ZKne8tNxLezYKqkScpGqyViFlneoIpNLhmB5k8coAHWV8WUZasLiGddwUrY5EWaaqW05V7c8fbA-deH3gLOjLRtFUY-sNY9kG9tyxOQyXsmddU5q_7uiwlryI3-p-OMDFTwsEnGFAGhw9-wooVo')",
                }}
              >
                <div className="flex flex-col gap-4 p-8">
                  <h1 className="text-5xl font-black leading-tight tracking-tight text-white">
                    Your story deserves an audience.
                  </h1>
                  <p className="text-xl font-medium text-primary">
                    Join the StoryArc Circle of Creators.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="flex max-w-2xl flex-col gap-4 px-2">
              <h2 className="text-3xl font-bold">Welcome to the inner circle.</h2>
              <p className="text-lg leading-relaxed text-slate-600 dark:text-primary/70">
                StoryArc isn&apos;t just a platform; it&apos;s a sanctuary for high-fidelity
                digital narratives. We&apos;re looking for writers who push boundaries,
                craft deep lore, and engage readers in ways never seen before.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {creatorBenefits.map((benefit) => (
                <Reveal
                  className="group flex flex-col gap-4 rounded-xl border border-primary/20 bg-background-light p-6 transition-all hover:border-primary/50 dark:bg-white/5"
                  key={benefit.title}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-3xl">{benefit.icon}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold transition-colors group-hover:text-primary">
                      {benefit.title}
                    </h3>
                    <p className="text-sm leading-normal text-slate-600 dark:text-slate-400">
                      {benefit.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-8 flex flex-col gap-6 rounded-xl border border-primary/10 bg-primary/5 p-8">
              <h3 className="flex items-center gap-3 text-2xl font-bold">
                <span className="material-symbols-outlined text-primary">format_list_numbered</span>
                Application Timeline
              </h3>
              <div className="space-y-0">
                {creatorTimeline.map((step, index) => (
                  <div className="grid grid-cols-[48px_1fr] gap-x-4" key={step.step}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex size-10 items-center justify-center rounded-full text-lg font-bold ${
                          index === 0
                            ? "border-4 border-background-dark bg-primary text-background-dark"
                            : "border-2 border-primary/50 bg-background-dark text-primary"
                        }`}
                      >
                        {step.step}
                      </div>
                      {index !== creatorTimeline.length - 1 ? (
                        <div className="h-full w-1 bg-primary/20" />
                      ) : null}
                    </div>
                    <div className={`${index !== creatorTimeline.length - 1 ? "pb-8" : ""} pt-1`}>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        {step.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="my-10 flex flex-col items-center justify-between gap-6 rounded-xl bg-primary p-10 text-background-dark md:flex-row">
              <div className="flex flex-col gap-2 text-center md:text-left">
                <h2 className="text-3xl font-black">Ready to begin your arc?</h2>
                <p className="font-medium text-background-dark/80">
                  Join 5,000+ elite writers worldwide.
                </p>
              </div>
              <button
                className="flex items-center gap-2 rounded-lg bg-background-dark px-8 py-4 text-lg font-bold text-primary transition-transform hover:scale-105"
                onClick={onStart}
                type="button"
              >
                {getCreatorCtaLabel(status)}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </Reveal>
          </div>
        </main>

        <footer className="flex flex-col items-center gap-4 border-t border-primary/10 bg-background-light py-10 text-sm text-slate-500 dark:bg-background-dark">
          <div className="flex gap-6">
            <Link className="transition-colors hover:text-primary" to="/about">
              Privacy
            </Link>
            <Link className="transition-colors hover:text-primary" to="/about">
              Terms
            </Link>
            <Link className="transition-colors hover:text-primary" to="/account/help">
              Support
            </Link>
          </div>
          <p>© 2024 StoryArc Circle. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

function MobileCreatorOnboarding({ onStart, status }) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-20">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-background-light px-4 py-3 dark:bg-background-dark">
          <Link
            className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-primary/20"
            to="/dashboard"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </Link>
          <h2 className="flex-1 pr-9 text-center text-base font-bold tracking-tight">
            Creator Program
          </h2>
        </header>


        <section className="px-4 py-3">
          <Reveal
            className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-2xl shadow-primary/5"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDAl8IKyuwz6jKgeeI8XIQOo9RWbbtlWSv---yEM4ZqCAyfQp5G6-3jj0kAoLzFNPTs0VS36tgxCXZp8k7kXLSoqCcKX_lnzFKSSWxGP-d8W-h5aZ4SvmcgP7nOyXrRP-Vf8m8ZBf2i9WaDeK8tdZqhTKc4-cNMUCab7Z86mbOlC2PJNISOZK-D3BpfcrEaPZ3IyO4Z9ncLHw47Y7AA108z8XoQqPqN2rksJJYXhYgaGVLQoOcNKL1-3fkQsBhu14rXD39phtBz2wY')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent" />
            <div className="relative p-4">
              <h1 className="mb-1.5 text-2xl font-bold leading-tight text-white">
                Your story deserves an audience
              </h1>
              <p className="text-[10px] font-medium uppercase tracking-wide text-primary">
                Welcome to the inner circle
              </p>
            </div>
          </Reveal>
        </section>

        <section className="mt-3 space-y-3 px-4">
          {creatorBenefits.map((benefit) => (
            <Reveal
              className="flex items-center gap-3 rounded-xl border border-primary/10 bg-white p-3 dark:bg-primary/5"
              key={benefit.title}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-xl">{benefit.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-none">{benefit.title}</p>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                  {benefit.description}
                </p>
              </div>
            </Reveal>
          ))}
        </section>

        <section className="mb-6 mt-6 px-4">
          <h3 className="mb-4 text-base font-bold">Application Timeline</h3>
          <div className="relative ml-3 space-y-6">
            <div className="absolute bottom-1.5 left-[11px] top-1.5 w-0.5 bg-primary/20" />
            {creatorTimeline.map((step, index) => (
              <div className="relative flex gap-3" key={step.step}>
                <div
                  className={`z-10 flex size-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    index === 0 ? "bg-primary text-background-dark" : "bg-primary/30 text-primary"
                  }`}
                >
                  {step.step}
                </div>
                <div>
                  <p className="text-sm font-bold">{step.title}</p>
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background-light via-background-light to-transparent p-4 pt-8 dark:from-background-dark dark:via-background-dark">
          <button
            className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-background-dark shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            onClick={onStart}
            type="button"
          >
            {getCreatorCtaLabel(status)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CreatorOnboardingPage() {
  const navigate = useNavigate();
  const {
    creatorStatus,
    enterWriterMode,
    getCreatorNextStepHref,
  } = useCreator();

  useEffect(() => {
    enterWriterMode();
  }, []);

  function handleStart() {
    navigate(getCreatorNextStepHref());
  }

  return (
    <>
      <DesktopCreatorOnboarding
        onStart={handleStart}
        status={creatorStatus}
      />
      <MobileCreatorOnboarding
        onStart={handleStart}
        status={creatorStatus}
      />
    </>
  );
}
