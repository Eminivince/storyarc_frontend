import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "../context/AccountContext";
import {
  helpHref,
  mfaChooseHref,
  mfaSuccessHref,
} from "../data/accountFlow";
import { setup2FA, verifySetup2FA } from "../auth/authApi";
import { QRCodeSVG } from "qrcode.react";
import { LogoBrand } from "../components/LogoBrand";


function CodeInputs({ digits, inputRefs, onChange, onKeyDown }) {
  return (
    <>
      {digits.map((digit, index) => (
        <input
          className="aspect-square w-full rounded-lg border-2 border-primary/20 bg-white text-center text-2xl font-bold text-primary outline-none transition-all focus:border-primary dark:bg-background-dark"
          inputMode="numeric"
          key={index}
          maxLength="1"
          onChange={(event) => onChange(index, event.target.value)}
          onKeyDown={(event) => onKeyDown(index, event)}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          value={digit}
        />
      ))}
    </>
  );
}

function DesktopSetup({
  allDigitsFilled,
  digits,
  inputRefs,
  isLoading,
  qrUri,
  secret,
  setupError,
  verificationError,
  onChange,
  onComplete,
  onCopySecret,
  onKeyDown,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between border-b border-primary/10 px-6 py-4 lg:px-40">
          <LogoBrand textClassName="text-slate-900 dark:text-slate-100" />
          <div className="flex items-center gap-6">
            <Link
              className="flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-400"
              to={mfaChooseHref}
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back
            </Link>
            <Link
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20"
              to={helpHref}
            >
              <span className="material-symbols-outlined">help</span>
            </Link>
          </div>
        </header>

        <main className="flex flex-1 justify-center px-6 py-10">
          <div className="flex w-full max-w-[520px] flex-col gap-8">
              <div className="flex flex-col gap-2 text-center">
              <h1 className="text-3xl font-black tracking-tight lg:text-4xl">
                Setup Authenticator
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-400">
                Secure your account with two-factor authentication by following these
                simple steps.
              </p>
            </div>

            <div className="flex flex-col items-center gap-6 rounded-xl border border-primary/20 bg-primary/5 p-8">
              <div className="flex flex-col items-center gap-2">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-background-dark">
                  Step 1
                </span>
                <h3 className="text-xl font-bold">Scan QR Code</h3>
              </div>

              {setupError ? (
                <div className="w-full rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-sm text-red-600 dark:text-red-300">
                  {setupError}
                </div>
              ) : (
                <>
                  <div className="rounded-lg bg-white p-4">
                    {isLoading ? (
                      <div className="flex h-48 w-48 items-center justify-center text-sm text-slate-500">
                        Generating QR code...
                      </div>
                    ) : qrUri ? (
                      <QRCodeSVG value={qrUri} size={192} />
                    ) : (
                      <div className="flex h-48 w-48 items-center justify-center text-sm text-slate-500">
                        QR code unavailable.
                      </div>
                    )}
                  </div>
                  <p className="max-w-sm text-center text-sm text-slate-600 dark:text-slate-400">
                    Open your authenticator app and scan the QR code above to link
                    your account.
                  </p>
                  <div className="w-full space-y-3">
                    <div className="flex items-center gap-2 text-center text-xs text-slate-500 dark:text-slate-400">
                      <span className="h-px grow bg-primary/20" />
                      <span>OR ENTER MANUALLY</span>
                      <span className="h-px grow bg-primary/20" />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-background-light p-3 dark:bg-background-dark/50">
                      <code className="font-mono text-sm font-bold tracking-widest text-primary">
                        {secret || "Unavailable"}
                      </code>
                      <button
                        className="flex items-center gap-1 text-xs font-bold text-primary transition-colors hover:text-primary/80 disabled:opacity-60"
                        disabled={!secret}
                        onClick={onCopySecret}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                        COPY
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-background-dark">
                  Step 2
                </span>
                <h3 className="text-xl font-bold">Enter Verification Code</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Type the 6-digit code generated by your app below.
                </p>
              </div>

              <div className="mx-auto grid w-full max-w-sm grid-cols-6 gap-2 sm:gap-4">
                <CodeInputs
                  digits={digits}
                  inputRefs={inputRefs}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                />
              </div>
              {verificationError ? (
                <p className="text-center text-sm text-red-600 dark:text-red-300">
                  {verificationError}
                </p>
              ) : null}

              <button
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-background-dark shadow-lg shadow-primary/20 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!allDigitsFilled || Boolean(setupError) || isLoading}
                onClick={onComplete}
                type="button"
              >
                Complete Setup
                <span className="material-symbols-outlined">verified_user</span>
              </button>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/10 p-4">
              <span className="material-symbols-outlined text-primary">security</span>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                <strong className="text-primary">Important:</strong> Save your backup
                recovery codes in a secure place. If you lose access to your device,
                these codes will be the only way to recover your TaleStead account.
              </p>
            </div>

            <div className="flex justify-center pb-10">
              <Link className="text-sm font-medium text-slate-500 transition-colors hover:text-primary" to={mfaChooseHref}>
                I&apos;m having trouble, try another method
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileSetup({
  allDigitsFilled,
  digits,
  inputRefs,
  isLoading,
  qrUri,
  secret,
  setupError,
  verificationError,
  onChange,
  onComplete,
  onCopySecret,
  onKeyDown,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="flex items-center justify-between bg-transparent px-3 py-2">
        <Link className="flex size-10 items-center justify-start text-slate-900 dark:text-slate-100" to={mfaChooseHref}>
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </Link>
        <h2 className="flex-1 pr-10 text-center text-base font-bold">Two-Factor Auth</h2>
      </header>

      <div className="flex w-full items-center justify-center gap-2 py-2">
        <div className="h-1.5 w-1.5 rounded-full bg-primary/30" />
        <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(244,192,37,0.6)]" />
        <div className="h-1.5 w-1.5 rounded-full bg-primary/30" />
      </div>

      <main className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="pb-4 pt-2 text-center">
          <h3 className="text-xl font-bold tracking-tight">
            Setup MFA for TaleStead
          </h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Protect your account with a secondary layer of security.
          </p>
        </div>

        <section className="mb-6 mt-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-background-dark">
              1
            </span>
            <h3 className="text-base font-bold">Scan QR Code</h3>
          </div>
          <p className="mb-3 text-xs leading-snug text-slate-600 dark:text-slate-300">
            Open your authenticator app and scan the QR code below to link your account.
          </p>

          {setupError ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-xs text-red-600 dark:text-red-300">
              {setupError}
            </div>
          ) : (
            <>
              <div className="mb-3 flex justify-center">
                <div className="rounded-lg border-2 border-primary/20 bg-white p-3 shadow">
                  {isLoading ? (
                    <div className="flex h-40 w-40 items-center justify-center text-xs text-slate-500">
                      Generating QR code...
                    </div>
                  ) : qrUri ? (
                    <QRCodeSVG value={qrUri} size={160} />
                  ) : (
                    <div className="flex h-40 w-40 items-center justify-center text-xs text-slate-500">
                      QR code unavailable.
                    </div>
                  )}
                </div>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <p className="text-center text-[11px] text-slate-500 dark:text-slate-400">
                  Can&apos;t scan? Enter this setup code manually:
                </p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <code className="font-mono text-xs font-semibold tracking-wider text-primary">
                    {secret || "Unavailable"}
                  </code>
                  <button
                    className="flex items-center gap-1 text-[11px] font-bold text-primary disabled:opacity-60"
                    disabled={!secret}
                    onClick={onCopySecret}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    Copy
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        <div className="mb-6 h-px w-full bg-primary/10" />

        <section className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-background-dark">
              2
            </span>
            <h3 className="text-base font-bold">Verify Setup</h3>
          </div>
          <p className="mb-3 text-xs leading-snug text-slate-600 dark:text-slate-300">
            Enter the 6-digit verification code to complete the process.
          </p>
          <div className="mx-auto mb-4 flex max-w-[280px] justify-between gap-1">
            {digits.map((digit, index) => (
              <input
                className="h-12 w-10 rounded-lg border-2 border-primary/20 bg-background-light text-center text-lg font-bold text-slate-900 outline-none focus:border-primary dark:bg-primary/5 dark:text-white"
                inputMode="numeric"
                key={index}
                maxLength="1"
                onChange={(event) => onChange(index, event.target.value)}
                onKeyDown={(event) => onKeyDown(index, event)}
                placeholder="·"
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                value={digit}
              />
            ))}
          </div>
          {verificationError ? (
            <p className="text-center text-xs text-red-600 dark:text-red-300">
              {verificationError}
            </p>
          ) : null}
        </section>

        <div className="mb-4 rounded-lg border border-primary/10 bg-primary/5 p-3">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-lg text-primary">help_outline</span>
            <div>
              <h4 className="text-xs font-bold">Having trouble?</h4>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Ensure your app&apos;s time is synchronized with your device. If the code
                still does not work, try refreshing the QR code or contacting support.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-primary/10 bg-background-light px-4 py-4 dark:bg-background-dark">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-background-dark shadow-[0_4px_16px_rgba(244,192,37,0.3)] transition-all disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!allDigitsFilled || Boolean(setupError) || isLoading}
          onClick={onComplete}
          type="button"
        >
          Complete Setup
          <span className="material-symbols-outlined text-lg">check_circle</span>
        </button>
        <p className="mt-2 text-center text-[11px] text-slate-500 dark:text-slate-500">
          Security powered by TaleStead Gold standard
        </p>
      </footer>
    </div>
  );
}

export default function MfaSetupPage() {
  const navigate = useNavigate();
  const desktopInputRefs = useRef([]);
  const mobileInputRefs = useRef([]);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [setupState, setSetupState] = useState({ qrUri: "", secret: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [setupError, setSetupError] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  const { copyValue, setMfaEnabled, showNotice } = useAccount();

  useEffect(() => {
    let isActive = true;

    async function loadSetup() {
      setIsLoading(true);
      setSetupError(null);
      setVerificationError(null);

      try {
        const response = await setup2FA();
        if (!isActive) return;
        setSetupState({
          qrUri: response.qrUri ?? "",
          secret: response.secret ?? "",
        });
      } catch (error) {
        if (!isActive) return;
        setSetupError(error?.message || "Could not start MFA setup.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadSetup();

    return () => {
      isActive = false;
    };
  }, []);

  function handleDigitChange(refs, index, value) {
    const nextValue = value.replace(/\D/g, "").slice(-1);

    setDigits((current) => {
      const next = [...current];
      next[index] = nextValue;
      return next;
    });

    if (nextValue && index < refs.current.length - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  function handleDigitKeyDown(refs, index, event) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  async function handleComplete() {
    const code = digits.join("");

    if (!code || code.length < 6) {
      setVerificationError("Enter the 6-digit code to continue.");
      return;
    }

    setVerificationError(null);

    try {
      await verifySetup2FA({ code });
      setMfaEnabled(true);
      showNotice("Multi-factor authentication is now active.");
      navigate(mfaSuccessHref);
    } catch (error) {
      setVerificationError(error?.message || "Invalid verification code.");
    }
  }

  const allDigitsFilled = digits.every(Boolean);

  return (
    <>
      <DesktopSetup
        allDigitsFilled={allDigitsFilled}
        digits={digits}
        inputRefs={desktopInputRefs}
        isLoading={isLoading}
        qrUri={setupState.qrUri}
        secret={setupState.secret}
        setupError={setupError}
        verificationError={verificationError}
        onChange={(index, value) => handleDigitChange(desktopInputRefs, index, value)}
        onComplete={handleComplete}
        onCopySecret={() => copyValue("Setup code", setupState.secret)}
        onKeyDown={(index, event) => handleDigitKeyDown(desktopInputRefs, index, event)}
      />
      <MobileSetup
        allDigitsFilled={allDigitsFilled}
        digits={digits}
        inputRefs={mobileInputRefs}
        isLoading={isLoading}
        qrUri={setupState.qrUri}
        secret={setupState.secret}
        setupError={setupError}
        verificationError={verificationError}
        onChange={(index, value) => handleDigitChange(mobileInputRefs, index, value)}
        onComplete={handleComplete}
        onCopySecret={() => copyValue("Setup code", setupState.secret)}
        onKeyDown={(index, event) => handleDigitKeyDown(mobileInputRefs, index, event)}
      />
    </>
  );
}
