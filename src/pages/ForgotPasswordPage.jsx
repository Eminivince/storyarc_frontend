import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../auth/authApi";
import { LogoBrand } from "../components/LogoBrand";
import { sanitizeEmail } from "../lib/formSanitize";
import { persistPendingVerification } from "../auth/authFlowStorage";
import { useToast } from "../context/ToastContext";

const verifyCodeHref = "/auth/verify-code";

function getErrorMessage(error) {
  if (error?.status === 429) {
    const retryAfterSeconds =
      typeof error.retryAfterSeconds === "number" ? error.retryAfterSeconds : null;
    return retryAfterSeconds
      ? `Too many attempts. Please wait ${retryAfterSeconds} seconds.`
      : "Too many attempts. Please wait a moment.";
  }

  return error?.message || "Could not send a reset code. Please try again.";
}

function DesktopForgotPassword({ email, error, onChange, onSubmit, pending }) {
  return (
    <div className="hidden min-h-screen flex-col bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:flex">
      <header className="flex items-center justify-between border-b border-primary/10 px-6 py-4 lg:px-20">
        <LogoBrand />
        <div className="flex items-center gap-6">
          <Link className="text-sm font-medium transition-colors hover:text-primary" to="/auth">
            Sign In
          </Link>
          <Link
            className="text-sm font-medium transition-colors hover:text-primary"
            to="/account/help"
          >
            Help
          </Link>
        </div>
      </header>

      <main className="relative flex flex-1 items-center justify-center p-6">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-20">
          <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-primary/10 blur-[120px]" />
        </div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-xl border border-primary/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm dark:bg-primary/5"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35 }}
        >
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/20">
              <span className="material-symbols-outlined text-3xl text-primary">lock_reset</span>
            </div>
            <h1 className="mb-2 text-2xl font-bold">Forgot Password?</h1>
            <p className="max-w-[280px] text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              No worries, it happens. Enter your email and we&apos;ll send you a link to
              reset your account.
            </p>
          </div>

          <form className="space-y-6" onSubmit={onSubmit}>
            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
                <span className="material-symbols-outlined shrink-0 text-xl">error</span>
                <p className="text-base font-medium">{error}</p>
              </div>
            )}
            <div className="space-y-2">
              <label
                className="ml-1 text-base font-medium text-slate-700 dark:text-slate-300"
                htmlFor="forgot-email-desktop"
              >
                Email Address
              </label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-primary">
                  <span className="material-symbols-outlined text-lg">mail</span>
                </div>
                <input
                  className="w-full rounded-lg border border-primary/20 bg-background-light py-3.5 pl-11 pr-4 text-base text-slate-900 outline-none transition-all placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/40 dark:bg-background-dark dark:text-slate-100"
                  id="forgot-email-desktop"
                  onChange={(event) => onChange(sanitizeEmail(event.target.value))}
                  placeholder="name@example.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
            </div>

            <button
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 font-bold text-background-dark shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={pending}
              type="submit"
            >
              <span>{pending ? "Sending Code..." : "Send Reset Link"}</span>
              <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
              to="/auth"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              <span>Back to Login</span>
            </Link>
          </div>
        </motion.div>
      </main>

      <footer className="flex flex-col gap-4 px-6 py-8 text-center">
        <div className="flex flex-wrap items-center justify-center gap-8">
          <Link
            className="text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
            to="/privacy"
          >
            Privacy Policy
          </Link>
          <Link
            className="text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
            to="/terms"
          >
            Terms of Service
          </Link>
          <Link
            className="text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
            to="/account/help"
          >
            Contact Us
          </Link>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>© 2024 TaleStead.</span>
          <div className="size-1 rounded-full bg-primary/40" />
          <span>Crafted for creators.</span>
        </div>
      </footer>
    </div>
  );
}

function MobileForgotPassword({ email, error, onChange, onSubmit, pending }) {
  return (
    <div className="flex min-h-screen justify-center bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex min-h-screen w-full max-w-[480px] flex-col overflow-x-hidden border-x border-primary/10 bg-background-light shadow-2xl dark:bg-background-dark">
        <header className="flex items-center justify-between bg-background-light p-4 pb-2 dark:bg-background-dark">
          <Link
            className="flex size-12 items-center justify-center rounded-full transition-colors hover:bg-primary/10"
            to="/auth"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </Link>
          <h2 className="flex-1 pr-12 text-center text-lg font-bold tracking-[-0.015em]">
            Forgot Password
          </h2>
        </header>

        <div>
          <div className="px-4 py-3">
            <div className="flex min-h-[200px] w-full flex-col items-center justify-center rounded-lg bg-background-light py-8 dark:bg-background-dark">
              <div className="flex flex-col items-center gap-4">
                <div className="flex size-20 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-5xl font-bold text-background-dark">
                    menu_book
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-primary">TaleStead</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-6">
          <h2 className="pt-2 text-center text-[28px] font-bold leading-tight tracking-tight">
            Forgot Password?
          </h2>
          <p className="px-2 text-center text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Enter your email address and we&apos;ll send you a link to reset your password
            and get you back to your stories.
          </p>
        </div>

        <form className="flex flex-col gap-6 px-6 py-8" onSubmit={onSubmit}>
          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
              <span className="material-symbols-outlined shrink-0 text-xl">error</span>
              <p className="text-base font-medium">{error}</p>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label
              className="text-base font-semibold uppercase tracking-wider"
              htmlFor="forgot-email-mobile"
            >
              Email Address
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-slate-400">
                mail
              </span>
              <input
                className="form-input h-14 w-full rounded-lg border border-primary/20 bg-white pl-12 pr-4 text-base font-normal text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-primary/5 dark:text-slate-100"
                id="forgot-email-mobile"
                onChange={(event) => onChange(sanitizeEmail(event.target.value))}
                placeholder="yourname@example.com"
                required
                type="email"
                value={email}
              />
            </div>
          </div>

          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-background-dark shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={pending}
            type="submit"
          >
            <span>{pending ? "Sending Code..." : "Send Reset Link"}</span>
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>

        <div className="mt-auto flex flex-col items-center pb-8 pt-4">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Remember your password?{" "}
            <Link className="font-bold text-primary hover:underline" to="/auth">
              Log in
            </Link>
          </p>
          <div className="mt-8 opacity-20">
            <div className="h-1 w-24 rounded-full bg-primary" />
          </div>
        </div>

        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute right-[-96px] top-1/2 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const forgotPasswordMutation = useMutation({
    mutationFn: requestPasswordReset,
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedEmail = sanitizeEmail(email);
    setError(null);

    try {
      const response = await forgotPasswordMutation.mutateAsync({ email: trimmedEmail });

      showToast(response.message, {
        title: "Reset code sent",
      });
      persistPendingVerification({
        email: trimmedEmail,
        flow: "password-reset",
      });
      navigate(verifyCodeHref, {
        replace: true,
        state: {
          email: trimmedEmail,
          flow: "password-reset",
        },
      });
    } catch (error) {
      const message = getErrorMessage(error);
      setError(message);
      showToast(message, {
        tone: "error",
        title: "Could not continue",
      });
    }
  }

  return (
    <>
      <DesktopForgotPassword
        email={email}
        error={error}
        onChange={setEmail}
        onSubmit={handleSubmit}
        pending={forgotPasswordMutation.isPending}
      />
      <MobileForgotPassword
        email={email}
        error={error}
        onChange={setEmail}
        onSubmit={handleSubmit}
        pending={forgotPasswordMutation.isPending}
      />
    </>
  );
}
