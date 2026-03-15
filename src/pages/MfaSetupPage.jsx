import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "../context/AccountContext";
import {
  helpHref,
  mfaChooseHref,
  mfaSuccessHref,
} from "../data/accountFlow";

const desktopQrCode =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCsolAStqSmdzjsQ79Dx8hFjxvMmGf8Ty-bvs_ZsVS0WcMO6y0SEy9dVhmFhySvwNZWsuQJ04osf6PfbhBW7CY14V0Asbmm_q4TlDTWTHq7DUnqPw176K9PIw26YzovKPCMYPkZzikNLtpb7A-84jJx9AIzFOE7oQInQFvDtBTULEtz7cuYeHu9J4O29t5ThkZIcfU8Ss1p8IV5Jtkeo7wkY4ikkqbzrZUtPK2jiwic7vw0BSr3zayNmScN_ZncxhjCZxq5ZJSENok";
const mobileQrCode =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDmhLv8JccSF8jY0aB7030FlDmUMIXHPLFy_j7Xb_VXptW3OUKa3WNienqld6eCYYGBEoo2bbw15oqHcj61DYxmvS4sekRheVoZjPg02lieKtRUBTWkFSiSmSfLJqB04KinA-nDuWpjP8xj3BOUgDhskBHLgbSAaF_Froukkdyk3Ld2EMSc5Yza7gGTKSqZwQQt2nthNxDzY9M8gOIei06lHco1QIl4szxD7yVlKwdlgbm9wRAxweM8qKPwFJgN4rXZ1Us1CP1biHI";

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
  mfa,
  onChange,
  onComplete,
  onCopySecret,
  onKeyDown,
}) {
  const usingSms = mfa.method === "sms";

  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between border-b border-primary/10 px-6 py-4 lg:px-40">
          <div className="flex items-center gap-4 text-primary">
            <div className="size-6">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              TaleStead
            </h2>
          </div>
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
                {usingSms ? "Verify Phone Protection" : "Setup Authenticator"}
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
                <h3 className="text-xl font-bold">
                  {usingSms ? "Open Your Messages" : "Scan QR Code"}
                </h3>
              </div>

              {usingSms ? (
                <div className="w-full rounded-2xl border border-primary/20 bg-background-light p-6 text-center dark:bg-background-dark/60">
                  <span className="material-symbols-outlined mb-4 text-6xl text-primary">
                    sms
                  </span>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    We sent a one-time security code to your registered phone number.
                    Enter the six digits below to confirm setup.
                  </p>
                </div>
              ) : (
                <>
                  <div className="rounded-lg bg-white p-4">
                    <img alt="Authenticator QR code" className="h-48 w-48" src={desktopQrCode} />
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
                        {mfa.secret}
                      </code>
                      <button
                        className="flex items-center gap-1 text-xs font-bold text-primary transition-colors hover:text-primary/80"
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

              <button
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-background-dark shadow-lg shadow-primary/20 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!allDigitsFilled}
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
  mfa,
  onChange,
  onComplete,
  onCopySecret,
  onKeyDown,
}) {
  const usingSms = mfa.method === "sms";

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="flex items-center justify-between bg-transparent p-4">
        <Link className="flex size-12 items-center justify-start text-slate-900 dark:text-slate-100" to={mfaChooseHref}>
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </Link>
        <h2 className="flex-1 pr-12 text-center text-lg font-bold">Two-Factor Auth</h2>
      </header>

      <div className="flex w-full items-center justify-center gap-3 py-5">
        <div className="h-2 w-2 rounded-full bg-primary/30" />
        <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(244,192,37,0.6)]" />
        <div className="h-2 w-2 rounded-full bg-primary/30" />
      </div>

      <main className="flex-1 overflow-y-auto px-6 pb-12">
        <div className="pb-8 pt-4 text-center">
          <h3 className="text-3xl font-bold tracking-tight">
            {usingSms ? "Verify SMS MFA" : "Setup MFA for TaleStead"}
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Protect your account with a secondary layer of security.
          </p>
        </div>

        <section className="mb-10 mt-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-background-dark">
              1
            </span>
            <h3 className="text-lg font-bold">{usingSms ? "Receive Code" : "Scan QR Code"}</h3>
          </div>
          <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {usingSms
              ? "Use the 6-digit security code delivered to your phone to continue."
              : "Open your authenticator app and scan the QR code below to link your account."}
          </p>

          {usingSms ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
              <span className="material-symbols-outlined mb-3 text-5xl text-primary">sms</span>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                A verification text has been sent to your registered number.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-center">
                <div className="rounded-xl border-4 border-primary/20 bg-white p-4 shadow-lg">
                  <img alt="QR Code for MFA Setup" className="h-48 w-48" src={mobileQrCode} />
                </div>
              </div>
              <button
                className="w-full rounded-lg border border-primary/30 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
                onClick={onCopySecret}
                type="button"
              >
                Can&apos;t scan? Copy manual code
              </button>
            </>
          )}
        </section>

        <div className="mb-10 h-px w-full bg-primary/10" />

        <section className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-background-dark">
              2
            </span>
            <h3 className="text-lg font-bold">Verify Setup</h3>
          </div>
          <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Enter the 6-digit verification code to complete the process.
          </p>
          <div className="mx-auto mb-8 flex max-w-xs justify-between gap-2">
            {digits.map((digit, index) => (
              <input
                className="h-14 w-12 rounded-lg border-2 border-primary/20 bg-background-light text-center text-xl font-bold text-slate-900 outline-none focus:border-primary dark:bg-primary/5 dark:text-white"
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
        </section>

        <div className="mb-8 rounded-xl border border-primary/10 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-xl text-primary">help_outline</span>
            <div>
              <h4 className="text-sm font-bold">Having trouble?</h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Ensure your app&apos;s time is synchronized with your device. If the code
                still does not work, try refreshing the QR code or contacting support.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-primary/10 bg-background-light p-6 dark:bg-background-dark">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-background-dark shadow-[0_4px_20px_rgba(244,192,37,0.3)] transition-all disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!allDigitsFilled}
          onClick={onComplete}
          type="button"
        >
          Complete Setup
          <span className="material-symbols-outlined">check_circle</span>
        </button>
        <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-500">
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
  const { completeMfaSetup, copyValue, mfa } = useAccount();

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

  function handleComplete() {
    completeMfaSetup();
    navigate(mfaSuccessHref);
  }

  const allDigitsFilled = digits.every(Boolean);

  return (
    <>
      <DesktopSetup
        allDigitsFilled={allDigitsFilled}
        digits={digits}
        inputRefs={desktopInputRefs}
        mfa={mfa}
        onChange={(index, value) => handleDigitChange(desktopInputRefs, index, value)}
        onComplete={handleComplete}
        onCopySecret={() => copyValue("Setup code", mfa.secret)}
        onKeyDown={(index, event) => handleDigitKeyDown(desktopInputRefs, index, event)}
      />
      <MobileSetup
        allDigitsFilled={allDigitsFilled}
        digits={digits}
        inputRefs={mobileInputRefs}
        mfa={mfa}
        onChange={(index, value) => handleDigitChange(mobileInputRefs, index, value)}
        onComplete={handleComplete}
        onCopySecret={() => copyValue("Setup code", mfa.secret)}
        onKeyDown={(index, event) => handleDigitKeyDown(mobileInputRefs, index, event)}
      />
    </>
  );
}
