import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAccount } from "../context/AccountContext";
import { LogoBrand } from "../components/LogoBrand";
import MaterialSymbol from "../components/MaterialSymbol";
import {
  helpHref,
  mfaChooseHref,
  mfaSetupHref,
  notificationsHref,
  profileHref,
} from "../data/accountFlow";
import { disable2FA } from "../auth/authApi";

const mfaMethod = {
  id: "app",
  title: "Authenticator App (TOTP)",
  description: "Use Google Authenticator, Authy, or Microsoft Authenticator to generate codes.",
  icon: "shield_lock",
  badge: "Recommended",
};

function DisableMfaModal({
  isOpen,
  isSubmitting,
  onClose,
  onConfirm,
  password,
  setPassword,
  code,
  setCode,
  error,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark/80 p-4 backdrop-blur-sm"
      onClick={isSubmitting ? undefined : onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="disable-mfa-title"
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-primary/10 bg-white p-6 shadow-2xl dark:bg-[#221c10]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center gap-3">
          <MaterialSymbol name="shield_lock" className="text-2xl text-primary" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100" id="disable-mfa-title">
            Disable Two-Factor Authentication
          </h2>
        </div>
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
          Enter your password and a current 6-digit code to disable 2FA.
        </p>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onConfirm();
          }}
        >
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="disable-mfa-password">
              Password
            </label>
            <input
              className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-primary/20 dark:bg-[#1c170d] dark:text-slate-100"
              id="disable-mfa-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              type="password"
              value={password}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="disable-mfa-code">
              6-digit code
            </label>
            <input
              className="w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-primary/20 dark:bg-[#1c170d] dark:text-slate-100"
              id="disable-mfa-code"
              inputMode="numeric"
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              required
              type="text"
              value={code}
            />
          </div>
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
              {error}
            </div>
          ) : null}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-600/40 dark:text-slate-300 dark:hover:bg-slate-700/30"
              disabled={isSubmitting}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Disabling..." : "Disable 2FA"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DesktopChooseMethod({
  isEnabled,
  onDisable,
  onContinue,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex min-h-screen">
        <aside className="flex w-72 flex-col justify-between border-r border-primary/10 bg-background-light p-6 dark:bg-background-dark">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <LogoBrand suffix=" Premium" size="sm" textClassName="text-slate-900 dark:text-slate-100" />
              <p className="text-xs font-medium uppercase tracking-wider text-primary">
                Golden Member
              </p>
            </div>

            <nav className="flex flex-col gap-2">
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 transition-colors hover:bg-primary/10 hover:text-primary dark:text-slate-400"
                to="/dashboard"
              >
                <MaterialSymbol name="dashboard" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 transition-colors hover:bg-primary/10 hover:text-primary dark:text-slate-400"
                to={profileHref}
              >
                <MaterialSymbol name="book_5" />
                <span className="text-sm font-medium">Stories</span>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg bg-primary/20 px-3 py-2.5 text-primary"
                to={mfaChooseHref}
              >
                <MaterialSymbol name="shield_lock" />
                <span className="text-sm font-medium">Security</span>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 transition-colors hover:bg-primary/10 hover:text-primary dark:text-slate-400"
                to={notificationsHref}
              >
                <MaterialSymbol name="settings" />
                <span className="text-sm font-medium">Settings</span>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 transition-colors hover:bg-primary/10 hover:text-primary dark:text-slate-400"
                to={helpHref}
              >
                <MaterialSymbol name="help" />
                <span className="text-sm font-medium">Help Center</span>
              </Link>
            </nav>
          </div>

          <Link
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-background-dark"
            to="/pricing/plan"
          >
            <MaterialSymbol name="workspace_premium" className="text-sm" />
            Manage Subscription
          </Link>
        </aside>

        <main className="flex flex-1 flex-col items-center justify-center bg-background-light p-8 dark:bg-background-dark">
          <div className="w-full max-w-xl">
            <div className="mb-10 text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MaterialSymbol name="verified_user" className="text-4xl" />
              </div>
              <h2 className="mb-4 text-3xl font-black">Secure Your Account</h2>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                Add an extra layer of protection to your TaleStead library. Multi-factor
                authentication ensures only you can access your creative works.
              </p>
            </div>

            <div className="mb-10 space-y-4">
              <label
                className="group relative flex cursor-pointer items-start gap-4 rounded-xl border-2 border-primary/40 bg-primary/5 p-5 transition-all"
              >
                <div className="mt-1">
                  <input
                    checked
                    className="h-5 w-5 border-2 border-primary/30 bg-transparent text-primary focus:ring-primary"
                    name="mfa-method"
                    onChange={() => null}
                    type="radio"
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-bold">{mfaMethod.title}</span>
                    <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-black uppercase text-background-dark">
                      {mfaMethod.badge}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {mfaMethod.description}
                  </p>
                </div>
                <div className="text-primary transition-colors">
                  <MaterialSymbol name={mfaMethod.icon} />
                </div>
              </label>
            </div>

            <div className="flex flex-col gap-4">
              <button
                className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-background-dark shadow-lg shadow-primary/10 transition-transform active:scale-[0.98]"
                disabled={isEnabled}
                onClick={onContinue}
                type="button"
              >
                {isEnabled ? "2FA Enabled" : "Continue Setup"}
              </button>
              {isEnabled ? (
                <button
                  className="w-full rounded-xl border border-red-500/30 bg-red-500/10 py-4 text-sm font-bold text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-300"
                  onClick={onDisable}
                  type="button"
                >
                  Disable 2FA
                </button>
              ) : null}
              <Link
                className="w-full py-2 text-center text-sm font-medium text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
                to={profileHref}
              >
                Maybe Later
              </Link>
            </div>

            <div className="mt-12 border-t border-slate-200 pt-8 text-center dark:border-primary/10">
              <details className="group cursor-pointer">
                <summary className="flex list-none items-center justify-center gap-2 text-sm font-semibold text-primary">
                  <MaterialSymbol name="info" className="text-sm" />
                  Why is MFA important?
                  <MaterialSymbol name="expand_more" className="text-sm transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-4 px-6 text-left text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  MFA blocks the vast majority of account takeover attacks. Even if
                  someone discovers your password, they still need your second factor
                  to access your TaleStead account.
                </div>
              </details>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileChooseMethod({
  isEnabled,
  onDisable,
  onContinue,
  selectedMethod,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="flex items-center justify-between px-3 py-2">
        <Link className="flex size-10 items-center justify-start text-slate-900 dark:text-slate-100" to={profileHref}>
          <MaterialSymbol name="arrow_back" className="text-xl" />
        </Link>
        <h2 className="flex-1 pr-10 text-center text-base font-bold">Two-Factor Authentication</h2>
      </header>

      <main className="flex min-h-[calc(100vh-52px)] flex-col">
        <div className="px-4 pt-4 pb-2">
          <div className="mb-3 inline-flex rounded-lg bg-primary/20 p-2 text-primary">
            <MaterialSymbol name="shield_lock" className="text-2xl" />
          </div>
          <h3 className="mb-1.5 text-xl font-bold leading-tight">Protect your account</h3>
          <p className="text-sm leading-snug text-slate-600 dark:text-slate-400">
            Choose how you want to receive your security codes to keep TaleStead secure.
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-3 px-4">
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-primary bg-primary/5 p-3 transition-all">
            <div className="flex grow flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold">{mfaMethod.title}</p>
                <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-background-dark">
                  {mfaMethod.badge}
                </span>
              </div>
              <p className="text-xs leading-snug text-slate-600 dark:text-slate-400">
                {mfaMethod.description}
              </p>
            </div>
            <input
              checked={selectedMethod === mfaMethod.id}
              className="h-5 w-5 shrink-0 appearance-none rounded-full border-2 border-slate-400 bg-transparent checked:border-primary checked:bg-primary"
              name="mfa-method"
              onChange={() => null}
              type="radio"
            />
          </label>

          <div className="flex items-start gap-2 rounded-lg bg-slate-100 p-3 dark:bg-slate-800/50">
            <MaterialSymbol name="info" className="text-lg text-primary" />
            <p className="text-[11px] leading-normal text-slate-500 dark:text-slate-400">
              Authenticator apps are more secure than SMS because they do not rely on
              cellular networks and help prevent SIM-swapping attacks.
            </p>
          </div>
        </div>

        <div className="px-4 py-4 pb-6">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-background-dark shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]"
            disabled={isEnabled}
            onClick={onContinue}
            type="button"
          >
            <span>{isEnabled ? "2FA Enabled" : "Continue"}</span>
            {isEnabled ? null : (
              <MaterialSymbol name="arrow_forward" className="text-lg" />
            )}
          </button>
          {isEnabled ? (
            <button
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-3 text-xs font-bold text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-300"
              onClick={onDisable}
              type="button"
            >
              Disable 2FA
            </button>
          ) : null}
          <p className="mt-3 text-center text-[11px] text-slate-500 dark:text-slate-500">
            Step 1 of 3: Security Configuration
          </p>
        </div>
      </main>
    </div>
  );
}

export default function MfaChooseMethodPage() {
  const navigate = useNavigate();
  const { mfa, setMfaEnabled, showNotice } = useAccount();
  const selectedMethod = "app";
  const [isDisableOpen, setIsDisableOpen] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [disableError, setDisableError] = useState(null);
  const [isDisabling, setIsDisabling] = useState(false);
  const isEnabled = Boolean(mfa?.enabled);

  function handleOpenDisable() {
    setDisablePassword("");
    setDisableCode("");
    setDisableError(null);
    setIsDisableOpen(true);
  }

  function handleCloseDisable() {
    if (isDisabling) {
      return;
    }

    setIsDisableOpen(false);
  }

  async function handleDisableConfirm() {
    if (!disablePassword.trim() || disableCode.trim().length < 6) {
      setDisableError("Please enter your password and a valid 6-digit code.");
      return;
    }

    setDisableError(null);
    setIsDisabling(true);

    try {
      const response = await disable2FA({
        password: disablePassword.trim(),
        code: disableCode.trim(),
      });
      setMfaEnabled(false);
      showNotice(response?.message || "Two-factor authentication disabled.");
      setIsDisableOpen(false);
    } catch (error) {
      setDisableError(error?.message || "Could not disable 2FA.");
      showNotice(error?.message || "Could not disable 2FA.", "info");
    } finally {
      setIsDisabling(false);
    }
  }

  return (
    <>
      <DesktopChooseMethod
        isEnabled={isEnabled}
        onDisable={handleOpenDisable}
        onContinue={() => navigate(mfaSetupHref)}
      />
      <MobileChooseMethod
        isEnabled={isEnabled}
        onDisable={handleOpenDisable}
        onContinue={() => navigate(mfaSetupHref)}
        selectedMethod={selectedMethod}
      />
      <DisableMfaModal
        code={disableCode}
        error={disableError}
        isOpen={isDisableOpen}
        isSubmitting={isDisabling}
        onClose={handleCloseDisable}
        onConfirm={handleDisableConfirm}
        password={disablePassword}
        setCode={setDisableCode}
        setPassword={setDisablePassword}
      />
    </>
  );
}
