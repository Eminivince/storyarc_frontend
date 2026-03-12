import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function DesktopPasswordResetSuccess() {
  return (
    <div className="hidden min-h-screen flex-col bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:flex">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/10 bg-background-light px-6 py-4 backdrop-blur-md dark:bg-background-dark/50 md:px-20 lg:px-40">
          <div className="flex items-center gap-3 text-primary">
            <div className="size-6">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              StoryArc
            </h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="hidden items-center gap-9 md:flex">
              <Link
                className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300"
                to="/search"
              >
                Browse
              </Link>
              <Link
                className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300"
                to="/stories/wolvex"
              >
                Library
              </Link>
              <Link
                className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300"
                to="/about"
              >
                Write
              </Link>
            </div>
            <Link
              className="flex min-w-[84px] items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold tracking-wide text-background-dark transition-all hover:brightness-110"
              to="/auth"
            >
              Login
            </Link>
          </div>
        </header>

        <main className="relative flex flex-1 items-center justify-center overflow-hidden p-6">
          <div className="pointer-events-none absolute inset-0 opacity-20 dark:opacity-30">
            <div className="absolute left-[-5%] top-[-10%] h-96 w-96 rounded-full bg-primary/20 blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-5%] h-80 w-80 rounded-full bg-primary/10 blur-[80px]" />
          </div>

          <div className="z-10 w-full max-w-[520px]">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-2xl backdrop-blur-sm dark:border-primary/20 dark:bg-background-dark/80 md:p-12"
              initial={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.35 }}
            >
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 scale-125 rounded-full bg-primary/20 blur-xl" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
                    <span className="material-symbols-outlined text-5xl font-bold text-primary">
                      verified_user
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                Password Reset Successful!
              </h1>
              <div className="mb-10 space-y-4">
                <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                  Your account security is our priority. You can now log in with your new
                  password and continue your reading journey.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Link
                  className="flex h-14 items-center justify-center rounded-lg bg-primary text-lg font-bold tracking-wide text-background-dark shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                  to="/auth"
                >
                  Back to Login
                </Link>
                <Link
                  className="text-sm font-medium text-slate-500 transition-colors hover:text-primary dark:text-slate-500 dark:hover:text-primary"
                  to="/account/help"
                >
                  Need help? Contact Support
                </Link>
              </div>
            </motion.div>

            <div className="mt-8 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                <span className="material-symbols-outlined text-sm">lock</span>
                <span className="text-xs font-semibold uppercase tracking-widest">
                  Secure Encryption
                </span>
              </div>
              <div className="h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-700" />
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                <span className="material-symbols-outlined text-sm">verified</span>
                <span className="text-xs font-semibold uppercase tracking-widest">
                  Identity Verified
                </span>
              </div>
            </div>
          </div>
        </main>

        <footer className="flex flex-col gap-8 border-t border-primary/5 bg-background-light px-6 py-12 text-center dark:bg-background-dark/80">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <Link
              className="text-sm font-medium text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
              to="/terms"
            >
              Terms of Service
            </Link>
            <Link
              className="text-sm font-medium text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
              to="/privacy"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-sm font-medium text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
              to="/account/help"
            >
              Help Center
            </Link>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4 text-slate-400 dark:text-slate-600">
              <span className="material-symbols-outlined text-xl transition-colors hover:text-primary">
                social_leaderboard
              </span>
              <span className="material-symbols-outlined text-xl transition-colors hover:text-primary">
                language
              </span>
              <span className="material-symbols-outlined text-xl transition-colors hover:text-primary">
                share
              </span>
            </div>
            <p className="text-sm font-normal text-slate-500 dark:text-slate-500">
              © 2024 StoryArc Webnovels. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function MobilePasswordResetSuccess() {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="sticky top-0 z-10 flex items-center bg-background-light p-4 pb-2 dark:bg-background-dark">
        <Link className="flex size-12 items-center justify-start" to="/auth">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </Link>
        <h2 className="flex-1 pr-12 text-center text-lg font-bold tracking-tight">
          Password Reset
        </h2>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-sm flex-col items-center gap-10">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-48 w-48 animate-pulse rounded-full bg-primary/10" />
            <div className="absolute h-36 w-36 rounded-full bg-primary/20" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary shadow-[0_0_30px_rgba(244,192,37,0.4)]">
              <span className="material-symbols-outlined text-5xl font-bold text-background-dark">
                check
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Success!</h1>
            <p className="max-w-[280px] text-base leading-relaxed text-slate-600 dark:text-slate-400">
              Your password has been successfully reset. You can now use your new
              password to log in to your StoryArc account.
            </p>
          </div>

          <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
            <span className="material-symbols-outlined text-6xl text-primary/40">
              verified_user
            </span>
          </div>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-sm p-6 pb-10">
        <Link
          className="flex h-14 w-full items-center justify-center rounded-xl bg-primary text-background-dark shadow-lg transition-colors active:scale-[0.98] hover:bg-primary/90"
          to="/auth"
        >
          <span className="text-lg font-bold tracking-tight">Back to Login</span>
        </Link>
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            Having trouble?{" "}
            <Link className="font-medium text-primary hover:underline" to="/account/help">
              Contact Support
            </Link>
          </p>
        </div>
      </footer>

      <div className="h-4 bg-background-light dark:bg-background-dark" />
    </div>
  );
}

export default function PasswordResetSuccessPage() {
  return (
    <>
      <DesktopPasswordResetSuccess />
      <MobilePasswordResetSuccess />
    </>
  );
}
