import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { resetPasswordWithToken } from "../auth/authApi";
import {
  clearPendingPasswordReset,
  getPendingPasswordReset,
  persistPendingPasswordReset,
} from "../auth/authFlowStorage";
import { useToast } from "../context/ToastContext";

const passwordResetSuccessHref = "/auth/password-reset-success";
const verifyCodeHref = "/auth/verify-code";

function getPasswordChecks(password) {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

function getStrengthLabel(checks) {
  const score = Object.values(checks).filter(Boolean).length;

  if (score >= 4) {
    return "Strong";
  }

  if (score >= 2) {
    return "Medium";
  }

  return "Weak";
}

function getErrorMessage(error) {
  return error?.message || "The password reset could not be completed.";
}

function DesktopCreateNewPassword({ email, onSubmit, pending, resetToken }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const checks = getPasswordChecks(password);
  const strength = getStrengthLabel(checks);

  return (
    <div className="hidden min-h-screen flex-col bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:flex">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-background-light/80 backdrop-blur-md dark:border-primary/20 dark:bg-background-dark/50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">StoryArc</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-500 dark:text-slate-400 md:block">Need help?</span>
            <Link className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-background-dark transition-colors hover:bg-primary/90" to="/auth">
              Log In
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-grow items-center justify-center bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent p-6">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[520px] rounded-xl border border-slate-200 bg-white p-8 shadow-2xl backdrop-blur-sm dark:border-primary/10 dark:bg-background-dark/80 md:p-10"
          initial={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.35 }}
        >
          <div className="mb-8 text-center md:text-left">
            <h2 className="mb-3 text-3xl font-black text-slate-900 dark:text-white md:text-4xl">Create New Password</h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              Enter your new credentials below to secure your StoryArc account.
            </p>
          </div>

          <form
            className="space-y-6"
            onSubmit={(event) => onSubmit(event, { confirmPassword, password, resetToken })}
          >
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="new-password-desktop">
                New Password
              </label>
              <div className="group relative flex items-center">
                <input
                  className="h-14 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 pr-12 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/50 dark:border-primary/20 dark:bg-background-dark dark:text-white dark:placeholder:text-slate-600"
                  id="new-password-desktop"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  className="absolute right-4 text-slate-400 transition-colors hover:text-primary dark:text-slate-500"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="confirm-password-desktop">
                Confirm Password
              </label>
              <div className="group relative flex items-center">
                <input
                  className="h-14 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 pr-12 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/50 dark:border-primary/20 dark:bg-background-dark dark:text-white dark:placeholder:text-slate-600"
                  id="confirm-password-desktop"
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                />
                <button
                  className="absolute right-4 text-slate-400 transition-colors hover:text-primary dark:text-slate-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  type="button"
                >
                  <span className="material-symbols-outlined">{showConfirmPassword ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-5 dark:border-primary/10 dark:bg-primary/5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Password Requirements</p>
              {[
                ["At least 8 characters", checks.minLength],
                ["Contains an uppercase letter", checks.uppercase],
                ["Contains a number", checks.number],
                ["Contains a special character", checks.special],
              ].map(([label, met]) => (
                <div className={`flex items-center gap-3 ${met ? "" : "opacity-50"}`} key={label}>
                  <div className={`flex h-5 w-5 items-center justify-center rounded border-2 ${met ? "border-primary bg-primary text-background-dark" : "border-slate-300 bg-white dark:border-primary/30 dark:bg-background-dark"}`}>
                    {met ? <span className="material-symbols-outlined text-[14px]">check</span> : null}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
                </div>
              ))}
              <div className="pt-1 text-xs font-semibold text-primary">Password strength: {strength}</div>
            </div>

            <button
              className="h-14 w-full rounded-xl bg-primary text-lg font-black text-background-dark shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={pending}
              type="submit"
            >
              {pending ? "Resetting Password..." : "Reset Password"}
            </button>

            <div className="text-center">
              <Link className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-primary dark:text-primary/70" to="/auth">
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Back to Login
              </Link>
            </div>
          </form>
        </motion.div>
      </main>

      <footer className="w-full border-t border-slate-200 px-6 py-8 text-center dark:border-primary/10">
        <p className="text-sm text-slate-500 dark:text-slate-400">© 2024 StoryArc Inc. All rights reserved. Secure Cloud Storage.</p>
      </footer>
    </div>
  );
}

function MobileCreateNewPassword({ email, onSubmit, pending, resetToken }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const checks = getPasswordChecks(password);
  const strength = getStrengthLabel(checks);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light font-display text-slate-900 antialiased dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="flex items-center justify-between bg-transparent p-4">
        <Link className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-primary/10" to={verifyCodeHref}>
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div className="flex-1 px-4">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wider opacity-70">Security</h2>
        </div>
        <div className="h-10 w-10" />
      </div>

      <div className="flex flex-1 flex-col px-6 pb-10">
        <div className="mb-10 mt-8">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-primary/20 p-4">
              <span className="material-symbols-outlined text-4xl text-primary">lock_reset</span>
            </div>
          </div>
          <h1 className="text-center text-3xl font-bold leading-tight">Create New Password</h1>
          <p className="mt-4 text-center text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Your new password must be different from previous passwords used with your StoryArc account.
          </p>
        </div>

        <form
          className="mx-auto w-full max-w-md space-y-6"
          onSubmit={(event) => onSubmit(event, { confirmPassword, password, resetToken })}
        >
          <div className="mb-2 flex items-center gap-2 px-1">
            <div className="h-1 flex-1 rounded-full bg-primary" />
            <div className="h-1 flex-1 rounded-full bg-primary" />
            <div className="h-1 flex-1 rounded-full bg-primary" />
            <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-primary">Step 3 of 3</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="px-1 text-sm font-semibold" htmlFor="new-password-mobile">New Password</label>
            <div className="group relative flex w-full items-stretch">
              <input
                className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-primary/20 dark:bg-background-dark/50 dark:text-slate-100 dark:placeholder:text-slate-500"
                id="new-password-mobile"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your new password"
                required
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-primary dark:text-slate-500"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
            <div className="flex items-center gap-1 px-1">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-primary/30">
                <div className={`h-full bg-primary ${strength === "Strong" ? "w-full" : strength === "Medium" ? "w-2/3" : "w-1/3"}`} />
              </div>
              <span className="text-[10px] font-medium text-slate-500">Password strength: {strength}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="px-1 text-sm font-semibold" htmlFor="confirm-password-mobile">Confirm New Password</label>
            <div className="group relative flex w-full items-stretch">
              <input
                className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-primary/20 dark:bg-background-dark/50 dark:text-slate-100 dark:placeholder:text-slate-500"
                id="confirm-password-mobile"
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm your new password"
                required
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-primary dark:text-slate-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                type="button"
              >
                <span className="material-symbols-outlined">{showConfirmPassword ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider">Requirements</p>
            <ul className="space-y-2">
              {[
                ["At least 8 characters", checks.minLength],
                ["One uppercase & one number", checks.uppercase && checks.number],
                ["One special character", checks.special],
              ].map(([label, met]) => (
                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400" key={label}>
                  <span className={`material-symbols-outlined text-lg ${met ? "text-primary" : "text-slate-400 dark:text-slate-600"}`}>
                    {met ? "check_circle" : "radio_button_unchecked"}
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6">
            <button
              className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-slate-900 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={pending}
              type="submit"
            >
              {pending ? "Resetting Password..." : "Reset Password"}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </form>

        <div className="mt-auto flex justify-center pt-10">
          <div className="relative h-1 w-full max-w-[200px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">
          Need help?{" "}
          <Link className="font-semibold text-primary" to="/account/help">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function CreateNewPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const pendingPasswordReset = getPendingPasswordReset();
  const email = location.state?.email || pendingPasswordReset?.email || "";
  const resetToken =
    location.state?.resetToken || pendingPasswordReset?.resetToken || "";
  const resetPasswordMutation = useMutation({
    mutationFn: resetPasswordWithToken,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    if (!email || !resetToken) {
      navigate(verifyCodeHref, { replace: true });
    }
  }, [email, navigate, resetToken]);

  useEffect(() => {
    if (!email || !resetToken) {
      return;
    }

    persistPendingPasswordReset({
      email,
      resetToken,
    });
  }, [email, resetToken]);

  async function handleSubmit(event, { confirmPassword, password, resetToken: token }) {
    event.preventDefault();

    if (password !== confirmPassword) {
      showToast("Passwords do not match.", {
        tone: "error",
        title: "Check your password",
      });
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        password,
        resetToken: token,
      });
      clearPendingPasswordReset();

      showToast("Your password has been reset successfully.", {
        title: "Password updated",
      });
      navigate(passwordResetSuccessHref, {
        replace: true,
        state: { email },
      });
    } catch (error) {
      showToast(getErrorMessage(error), {
        tone: "error",
        title: "Reset failed",
      });
    }
  }

  return (
    <>
      <DesktopCreateNewPassword
        email={email}
        onSubmit={handleSubmit}
        pending={resetPasswordMutation.isPending}
        resetToken={resetToken}
      />
      <MobileCreateNewPassword
        email={email}
        onSubmit={handleSubmit}
        pending={resetPasswordMutation.isPending}
        resetToken={resetToken}
      />
    </>
  );
}
