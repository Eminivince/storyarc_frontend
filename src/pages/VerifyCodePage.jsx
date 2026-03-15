import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  clearPendingPasswordReset,
  clearPendingVerification,
  getPendingVerification,
  persistPendingPasswordReset,
  persistPendingVerification,
} from "../auth/authFlowStorage";
import { resolvePostLoginPath } from "../auth/authRouting";
import {
  resendRegistrationCode,
  requestPasswordReset,
  verifyPasswordResetCode,
} from "../auth/authApi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const passwordCreateHref = "/auth/create-new-password";
const forgotPasswordHref = "/auth/forgot-password";

function getErrorMessage(error) {
  return error?.message || "The verification code could not be confirmed.";
}

function getOtpFromDigits(digits) {
  return digits.join("");
}

function DesktopOtpInputs({ digits, onDigitChange, onKeyDown }) {
  const inputsRef = useRef([]);

  return digits.map((digit, index) => (
    <input
      autoFocus={index === 0}
      className="h-14 w-full rounded-lg border-b-2 border-slate-300 bg-slate-50 text-center text-2xl font-bold outline-none transition-colors focus:border-primary focus:ring-0 dark:border-primary/20 dark:bg-zinc-800"
      inputMode="numeric"
      key={index}
      maxLength={1}
      onChange={(event) => {
        onDigitChange(index, event.target.value, inputsRef);
      }}
      onKeyDown={(event) => onKeyDown(index, event, inputsRef)}
      ref={(element) => {
        inputsRef.current[index] = element;
      }}
      type="text"
      value={digit}
    />
  ));
}

function MobileOtpInputs({ digits, onDigitChange, onKeyDown }) {
  const inputsRef = useRef([]);

  return digits.map((digit, index) => (
    <input
      autoFocus={index === 0}
      className="h-10 w-9 border-0 border-b-2 border-slate-300 bg-transparent text-center text-base font-bold transition-colors [appearance:textfield] placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-slate-700 sm:w-10"
      inputMode="numeric"
      key={index}
      maxLength={1}
      onChange={(event) => {
        onDigitChange(index, event.target.value, inputsRef);
      }}
      onKeyDown={(event) => onKeyDown(index, event, inputsRef)}
      placeholder="-"
      ref={(element) => {
        inputsRef.current[index] = element;
      }}
      type="text"
      value={digit}
    />
  ));
}

function DesktopVerifyCode({
  digits,
  email,
  flow,
  onDigitChange,
  onKeyDown,
  onResend,
  onSubmit,
  pending,
  resendPending,
}) {
  return (
    <div className="hidden min-h-screen flex-col bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:flex">
      <header className="flex items-center justify-between border-b border-primary/10 bg-background-light px-6 py-4 dark:bg-background-dark lg:px-20">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-3xl">layers</span>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">TaleStead</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-primary/30 bg-primary/10">
            <img
              alt="User profile"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx-DxVyI3iPp2QCzO4VZYMDcdCAhRjfytx2KwHR6eefdImZz9FHX-gLQSkeJ9-wfEXcnQrUt6IbQLNON5zP7SMmb4WKkjbPo8uJdzYLv5MAwDYLmSBwokBTrGHz6Yg4q22X3N2AtN0Rf07Hvc5ZxU2UKiYclTOM4814yZ1cP-KGmS9OXCErnek6lLw73tyZmWwqDvfert-A9eVTUfBqd7A94jAtEvMGIgNSJn26LAFl3Z4TgDAKDgw_IJoUr_Ap8oNV1kyj5Syc1Y"
            />
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent p-6">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-2xl backdrop-blur-sm dark:border-primary/10 dark:bg-zinc-900/50 lg:p-12"
          initial={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.35 }}
        >
          <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="material-symbols-outlined text-4xl text-primary">mark_email_read</span>
            </div>
            <h1 className="mb-3 text-3xl font-bold tracking-tight">Verify Your Email</h1>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              We&apos;ve sent a 6-digit {flow === "register" ? "verification" : "security"} code to{" "}
              <span className="font-medium text-slate-900 dark:text-slate-200">{email}</span>. Please enter it below.
            </p>
          </div>

          <form className="space-y-8" onSubmit={onSubmit}>
            <div className="flex justify-between gap-2 lg:gap-3">
              <DesktopOtpInputs
                digits={digits}
                onDigitChange={onDigitChange}
                onKeyDown={onKeyDown}
              />
            </div>

            <div className="space-y-4">
              <button
                className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-primary text-lg font-bold text-background-dark shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={pending}
                type="submit"
              >
                {pending
                  ? "Verifying..."
                  : flow === "register"
                    ? "Verify Account"
                    : "Verify Code"}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <div className="text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Didn&apos;t receive the code?
                  <button
                    className="ml-1 font-semibold text-primary hover:underline disabled:opacity-60"
                    disabled={resendPending}
                    onClick={onResend}
                    type="button"
                  >
                    {resendPending ? "Resending..." : "Resend Code"}
                  </button>
                </p>
              </div>
            </div>
          </form>

          <div className="mt-12 flex items-center justify-center gap-6 border-t border-slate-200 pt-8 text-sm text-slate-400 dark:border-primary/10">
            <Link className="flex items-center gap-1 transition-colors hover:text-primary" to="/account/help">
              <span className="material-symbols-outlined text-sm">help</span>
              Support
            </Link>
            <Link className="flex items-center gap-1 transition-colors hover:text-primary" to="/about">
              <span className="material-symbols-outlined text-sm">lock</span>
              Privacy
            </Link>
          </div>
        </motion.div>
      </main>

      <footer className="p-6 text-center text-xs text-slate-500">
        © 2024 TaleStead Inc. All rights reserved. Premium content delivery for modern storytellers.
      </footer>
    </div>
  );
}

function MobileVerifyCode({
  backHref,
  backState,
  digits,
  email,
  flow,
  onDigitChange,
  onKeyDown,
  onResend,
  onSubmit,
  pending,
  resendPending,
}) {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="flex shrink-0 items-center justify-between border-b border-primary/10 px-4 py-3">
        <Link
          className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-primary/20"
          state={backState}
          to={backHref}
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </Link>
        <h2 className="flex-1 text-center text-base font-bold leading-tight tracking-tight">
          {flow === "register" ? "Verify Account" : "Reset Password"}
        </h2>
        <div className="w-9" />
      </header>

      <div className="flex flex-1 flex-col px-4 py-4">
        <div className="rounded-xl border border-primary/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h1 className="text-xl font-bold">Verify Your Email</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            We&apos;ve sent a 6-digit code to <span className="font-semibold text-primary">{email}</span>. Enter it below.
          </p>

          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <fieldset className="flex w-full justify-center gap-1.5 sm:gap-2">
              <MobileOtpInputs
                digits={digits}
                onDigitChange={onDigitChange}
                onKeyDown={onKeyDown}
              />
            </fieldset>

            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              Didn&apos;t receive a code?{" "}
              <button
                className="font-semibold text-primary hover:underline disabled:opacity-60"
                disabled={resendPending}
                onClick={onResend}
                type="button"
              >
                {resendPending ? "Resending..." : "Resend"}
              </button>
            </p>

            <button
              className="h-10 w-full rounded-lg bg-primary text-base font-semibold text-background-dark transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={pending}
              type="submit"
            >
              {pending ? "Verifying..." : flow === "register" ? "Verify Account" : "Verify"}
            </button>
          </form>
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-0 right-0 -z-10 opacity-10">
        <div className="-mb-32 -mr-32 h-64 w-64 rounded-full bg-primary blur-[100px]" />
      </div>
    </div>
  );
}

export default function VerifyCodePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isVerifyingRegistration, verifyRegistration } = useAuth();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const pendingVerification = getPendingVerification();
  const email = location.state?.email || pendingVerification?.email || "";
  const flow =
    location.state?.flow ||
    (pendingVerification?.flow === "register" ? "register" : "password-reset");
  const isRegisterFlow = flow === "register";
  const backHref = isRegisterFlow ? "/auth" : forgotPasswordHref;
  const backState = isRegisterFlow ? { email, mode: "signup" } : undefined;
  const verifyResetCodeMutation = useMutation({
    mutationFn: verifyPasswordResetCode,
  });
  const resendCodeMutation = useMutation({
    mutationFn: flow === "register" ? resendRegistrationCode : requestPasswordReset,
  });
  const isSubmitting = flow === "register"
    ? isVerifyingRegistration
    : verifyResetCodeMutation.isPending;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    if (!email) {
      navigate(backHref, {
        replace: true,
        state: isRegisterFlow ? { mode: "signup" } : undefined,
      });
    }
  }, [backHref, email, isRegisterFlow, navigate]);

  useEffect(() => {
    if (!email) {
      return;
    }

    persistPendingVerification({
      email,
      flow,
    });
  }, [email, flow]);

  function handleDigitChange(index, rawValue, inputsRef) {
    const nextValue = rawValue.replace(/\D/g, "").slice(-1);

    setDigits((currentDigits) => {
      const nextDigits = [...currentDigits];
      nextDigits[index] = nextValue;
      return nextDigits;
    });

    if (nextValue && index < digits.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, event, inputsRef) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const code = getOtpFromDigits(digits);

    if (code.length !== 6) {
      showToast("Enter the full 6-digit code before continuing.", {
        tone: "error",
        title: "Code incomplete",
      });
      return;
    }

    try {
      if (flow === "register") {
        const response = await verifyRegistration({
          code,
          email,
        });
        clearPendingVerification();
        clearPendingPasswordReset();

        showToast(`Welcome to TaleStead, ${response.user.displayName}.`, {
          title: "Account verified",
        });
        navigate(resolvePostLoginPath(response.user), { replace: true });
      } else {
        const response = await verifyResetCodeMutation.mutateAsync({
          code,
          email,
        });
        clearPendingVerification();
        persistPendingPasswordReset({
          email,
          resetToken: response.resetToken,
        });

        showToast("Code verified. Create your new password next.", {
          title: "Verification complete",
        });
        navigate(passwordCreateHref, {
          replace: true,
          state: {
            email,
            resetToken: response.resetToken,
          },
        });
      }
    } catch (error) {
      showToast(getErrorMessage(error), {
        tone: "error",
        title: "Verification failed",
      });
    }
  }

  async function handleResend() {
    try {
      const response = await resendCodeMutation.mutateAsync({ email });

      setDigits(["", "", "", "", "", ""]);
      showToast(response.message, {
        title: flow === "register" ? "Verification code sent" : "New code sent",
      });
    } catch (error) {
      showToast(getErrorMessage(error), {
        tone: "error",
        title: "Resend failed",
      });
    }
  }

  return (
    <>
      <DesktopVerifyCode
        digits={digits}
        email={email}
        flow={flow}
        onDigitChange={handleDigitChange}
        onKeyDown={handleKeyDown}
        onResend={handleResend}
        onSubmit={handleSubmit}
        pending={isSubmitting}
        resendPending={resendCodeMutation.isPending}
      />
      <MobileVerifyCode
        backHref={backHref}
        backState={backState}
        digits={digits}
        email={email}
        flow={flow}
        onDigitChange={handleDigitChange}
        onKeyDown={handleKeyDown}
        onResend={handleResend}
        onSubmit={handleSubmit}
        pending={isSubmitting}
        resendPending={resendCodeMutation.isPending}
      />
    </>
  );
}
