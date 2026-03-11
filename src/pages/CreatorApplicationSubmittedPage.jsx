import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccountNotice from "../components/AccountNotice";
import Reveal from "../components/Reveal";
import { useCreator } from "../context/CreatorContext";
import { creatorSubmissionSteps } from "../data/creatorFlow";

function DesktopCreatorApplicationSubmitted({
  clearNotice,
  notice,
  onReturn,
  onViewDetails,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-[#181611] dark:text-slate-100 md:block">
      <div className="relative flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/20 bg-background-light px-6 py-4 dark:bg-[#181611] md:px-20 lg:px-40">
          <div className="flex items-center gap-4">
            <div className="text-primary">
              <svg className="size-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" fill="currentColor" />
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight">StoryArc</h2>
          </div>
          <div className="flex flex-1 items-center justify-end gap-8">
            <nav className="hidden items-center gap-9 md:flex">
              <Link className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300" to="/dashboard">
                Dashboard
              </Link>
              <Link className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300" to="/account/profile">
                My Stories
              </Link>
              <Link className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300" to="/account/help">
                Guidelines
              </Link>
            </nav>
            <Link
              className="size-10 rounded-full border-2 border-primary/30 bg-cover bg-center"
              to="/account/profile"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAtAYMTs6sq14_M-2ujDxwVzpmN4FZbllIKWEWHADO93jiNVJbwTrhfM_wqJQ5T2cbxQJJRyvMRpukTRV3MyfPZn8dwxQLwaTtIHoYtNgp72JUmcM5Qi9F8qG_fayKJkPg1lbgEiXGEIRkiyN_pVT7uKyoFovQhfnMbtqEAQr3KBNGKEGZXMECAkJPyRK26Ukfk1M8KFnhvCpXQgBRzviI_8MyLMBsYfTbLvOyxtKZk7hglUvY_KGpdJ4a50esk-MtBRkBoGSCH0nE')",
              }}
            />
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:py-24">
          <div className="flex w-full max-w-[800px] flex-col items-center text-center">
            <AccountNotice notice={notice} onDismiss={clearNotice} />

            <Reveal className="relative mb-12 mt-6">
              <div className="absolute inset-0 scale-75 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative aspect-[4/3] w-full max-w-[500px] overflow-hidden rounded-2xl border border-primary/20 bg-background-light shadow-2xl dark:bg-[#181611]">
                <div
                  className="flex h-full w-full items-center justify-center bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(24, 22, 17, 0.6), rgba(24, 22, 17, 0.6)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuANzy7kjQ0LVHOvx89WEMj9sHzI1jAFP5MM7ghxnziXY7AKm9SQNGDX99q4HTUe_NXQ_F76HUwg7BNjXLTZiP4u9L8OQWq_njTU2yWcyO1ndTaQyxNE77VR0DgDPWP6U7GxaVkiD_Kc0VHbAMrMjuckLgbeGICgChUacX-Br8p73gwCKdsYOqRdGXQxlfTv13KEaFywMd4qb9OtVjgI7An_umlYDjkvlJZM6ACd90khz21QNIw72_vvMG8nNuiDHCWTR2qaVP-ZlEQ')",
                  }}
                >
                  <div className="flex size-24 items-center justify-center rounded-full bg-primary text-background-dark shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-5xl font-bold">check_circle</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="mb-10 flex flex-col gap-4">
              <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
                Thank You for Applying!
              </h1>
              <p className="mx-auto max-w-2xl text-lg font-normal leading-relaxed text-slate-600 dark:text-slate-400 md:text-xl">
                Your application to become a <span className="font-semibold text-primary">StoryArc Author</span> has
                been successfully received and added to our review queue.
              </p>
            </div>

            <div className="mb-12 w-full max-w-lg rounded-xl border border-slate-200 bg-slate-100 p-6 md:p-8 dark:border-primary/10 dark:bg-slate-900/50">
              <div className="mb-4 flex items-center justify-center gap-3">
                <span className="material-symbols-outlined text-primary">schedule</span>
                <h3 className="text-sm font-bold uppercase tracking-widest">Review Process</h3>
              </div>
              <p className="text-base leading-normal text-slate-700 dark:text-slate-300">
                Our editorial team will review your portfolio and writing samples. This
                process typically takes <span className="font-bold text-primary">3-5 business days</span>. We
                will notify you via email once a final decision has been reached.
              </p>
            </div>

            <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                className="flex min-w-[240px] items-center justify-center rounded-lg bg-primary px-8 py-4 text-base font-bold tracking-wide text-background-dark transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 active:scale-95"
                onClick={onReturn}
                type="button"
              >
                <span className="material-symbols-outlined mr-2">dashboard</span>
                <span className="truncate">Return to Dashboard</span>
              </button>
              <button
                className="flex min-w-[240px] items-center justify-center rounded-lg border border-primary/20 bg-primary/10 px-8 py-4 text-base font-semibold text-primary transition-colors hover:bg-primary/20"
                onClick={onViewDetails}
                type="button"
              >
                Review Submission
              </button>
            </div>
          </div>
        </main>

        <footer className="border-t border-primary/10 px-6 py-10 md:px-20 lg:px-40">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-sm text-slate-500 dark:text-slate-500">
              © 2024 StoryArc Media. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link className="text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-500" to="/about">
                Privacy Policy
              </Link>
              <Link className="text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-500" to="/about">
                Terms of Service
              </Link>
              <Link className="text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-500" to="/account/help">
                Contact Support
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function MobileCreatorApplicationSubmitted({
  clearNotice,
  notice,
  onReturn,
  onViewDetails,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="flex items-center justify-between border-b border-primary/10 p-4">
        <Link className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary/10" to="/dashboard">
          <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">arrow_back</span>
        </Link>
        <h1 className="text-lg font-bold tracking-tight">Application Status</h1>
        <div className="w-10" />
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-6 py-10">
        <AccountNotice notice={notice} onDismiss={clearNotice} />

        <div className="mb-10 mt-6 flex w-full flex-col items-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-primary/30 bg-primary/20">
            <span className="material-symbols-outlined text-5xl text-primary">check_circle</span>
          </div>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">Success!</h2>
          <h3 className="mb-4 text-2xl font-bold">Application Submitted</h3>
          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
            Thank you for applying to StoryArc. Your application has been successfully
            received and is now under review by our editorial team.
          </p>
        </div>

        <div className="mb-10 w-full">
          <div className="relative aspect-video overflow-hidden rounded-xl border border-primary/10 bg-primary/5">
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent" />
            <img
              alt="Writer working on a manuscript"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtkv4YHLl2RMJhWOq51G5mAnYOzN1PcT7Z0hjH6Hq_Xz04C9Ofo9iyIkMWsjm-O-KKRyotIWqBH0S75JsDKg-LWmqCTNkUpr7KTy-rxhDHEsjNES2Mc_h-0Cx28fa0qpQBWM2sORdFm2rZwIN9XaQTRVVxf_dTUUfvfbIKUE7MvCq7EgCMbrOoCzZI9LDfdWWH4sD0PUTlsKEo7wE4rZDh0e3ZxVHakKtzNzukIlx5WZOcChMudYOdwfCC09LPfurT2XFTR5W13ZI"
            />
          </div>
        </div>

        <div className="mb-12 w-full">
          <h4 className="mb-6 text-center text-xl font-bold">What happens next?</h4>
          <div className="space-y-0">
            {creatorSubmissionSteps.map((step, index) => (
              <div className="grid grid-cols-[48px_1fr] gap-x-4" key={step.title}>
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      step.complete
                        ? "bg-primary text-background-dark"
                        : "border border-primary/50 text-primary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">{step.icon}</span>
                  </div>
                  {index !== creatorSubmissionSteps.length - 1 ? (
                    <div className="my-1 h-10 w-px bg-primary/30" />
                  ) : null}
                </div>
                <div className={`${index !== creatorSubmissionSteps.length - 1 ? "pb-6" : "pb-2"}`}>
                  <p className="font-bold">{step.title}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-primary/10 bg-background-light p-6 backdrop-blur-md dark:bg-background-dark/90">
        <div className="mx-auto max-w-md space-y-3">
          <button
            className="w-full rounded-xl bg-primary py-4 font-bold text-background-dark shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
            onClick={onReturn}
            type="button"
          >
            Back to Dashboard
          </button>
          <button
            className="w-full rounded-xl border border-primary/20 bg-primary/10 py-4 font-semibold text-primary transition-all hover:bg-primary/20"
            onClick={onViewDetails}
            type="button"
          >
            View Submission Details
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function CreatorApplicationSubmittedPage() {
  const navigate = useNavigate();
  const {
    clearCreatorNotice,
    creatorStatus,
    creatorNotice,
    enterReaderMode,
    enterWriterMode,
    getCreatorEntryHref,
    refreshCreatorState,
  } = useCreator();

  useEffect(() => {
    enterWriterMode();
    refreshCreatorState();
  }, []);

  useEffect(() => {
    if (creatorStatus === "approved") {
      navigate("/creator/dashboard", { replace: true });
      return;
    }

    if (creatorStatus !== "pending") {
      navigate(getCreatorEntryHref(), { replace: true });
    }
  }, [creatorStatus, getCreatorEntryHref, navigate]);

  function handleReturn() {
    enterReaderMode();
    navigate("/dashboard");
  }

  function handleViewDetails() {
    navigate("/creator/apply");
  }

  return (
    <>
      <DesktopCreatorApplicationSubmitted
        clearNotice={clearCreatorNotice}
        notice={creatorNotice}
        onReturn={handleReturn}
        onViewDetails={handleViewDetails}
      />
      <MobileCreatorApplicationSubmitted
        clearNotice={clearCreatorNotice}
        notice={creatorNotice}
        onReturn={handleReturn}
        onViewDetails={handleViewDetails}
      />
    </>
  );
}
