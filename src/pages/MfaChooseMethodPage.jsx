import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "../context/AccountContext";
import {
  helpHref,
  mfaChooseHref,
  mfaMethods,
  mfaSetupHref,
  notificationsHref,
  profileHref,
} from "../data/accountFlow";

function DesktopChooseMethod({
  onContinue,
  onMethodChange,
  selectedMethod,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex min-h-screen">
        <aside className="flex w-72 flex-col justify-between border-r border-primary/10 bg-background-light p-6 dark:bg-background-dark">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-background-dark">
                <span className="material-symbols-outlined font-bold">auto_stories</span>
              </div>
              <div>
                <h1 className="text-base font-bold leading-tight">StoryArc Premium</h1>
                <p className="text-xs font-medium uppercase tracking-wider text-primary">
                  Golden Member
                </p>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 transition-colors hover:bg-primary/10 hover:text-primary dark:text-slate-400"
                to="/dashboard"
              >
                <span className="material-symbols-outlined">dashboard</span>
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 transition-colors hover:bg-primary/10 hover:text-primary dark:text-slate-400"
                to={profileHref}
              >
                <span className="material-symbols-outlined">book_5</span>
                <span className="text-sm font-medium">Stories</span>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg bg-primary/20 px-3 py-2.5 text-primary"
                to={mfaChooseHref}
              >
                <span className="material-symbols-outlined">shield_lock</span>
                <span className="text-sm font-medium">Security</span>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 transition-colors hover:bg-primary/10 hover:text-primary dark:text-slate-400"
                to={notificationsHref}
              >
                <span className="material-symbols-outlined">settings</span>
                <span className="text-sm font-medium">Settings</span>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 transition-colors hover:bg-primary/10 hover:text-primary dark:text-slate-400"
                to={helpHref}
              >
                <span className="material-symbols-outlined">help</span>
                <span className="text-sm font-medium">Help Center</span>
              </Link>
            </nav>
          </div>

          <Link
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-background-dark"
            to="/pricing/plan"
          >
            <span className="material-symbols-outlined text-sm">workspace_premium</span>
            Manage Subscription
          </Link>
        </aside>

        <main className="flex flex-1 flex-col items-center justify-center bg-background-light p-8 dark:bg-background-dark">
          <div className="w-full max-w-xl">
            <div className="mb-10 text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-4xl">verified_user</span>
              </div>
              <h2 className="mb-4 text-3xl font-black">Secure Your Account</h2>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                Add an extra layer of protection to your StoryArc library. Multi-factor
                authentication ensures only you can access your creative works.
              </p>
            </div>

            <div className="mb-10 space-y-4">
              {mfaMethods.map((method) => {
                const selected = method.id === selectedMethod;

                return (
                  <label
                    className={`group relative flex cursor-pointer items-start gap-4 rounded-xl border-2 p-5 transition-all ${
                      selected
                        ? "border-primary/40 bg-primary/5"
                        : "border-slate-200 hover:border-primary/40 dark:border-primary/10"
                    }`}
                    key={method.id}
                  >
                    <div className="mt-1">
                      <input
                        checked={selected}
                        className="h-5 w-5 border-2 border-primary/30 bg-transparent text-primary focus:ring-primary"
                        name="mfa-method"
                        onChange={() => onMethodChange(method.id)}
                        type="radio"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-bold">{method.title}</span>
                        {method.badge ? (
                          <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-black uppercase text-background-dark">
                            {method.badge}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{method.description}</p>
                    </div>
                    <div className={`${selected ? "text-primary" : "text-primary/40"} transition-colors`}>
                      <span className="material-symbols-outlined">{method.icon}</span>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="flex flex-col gap-4">
              <button
                className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-background-dark shadow-lg shadow-primary/10 transition-transform active:scale-[0.98]"
                onClick={onContinue}
                type="button"
              >
                Continue Setup
              </button>
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
                  <span className="material-symbols-outlined text-sm">info</span>
                  Why is MFA important?
                  <span className="material-symbols-outlined text-sm transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="mt-4 px-6 text-left text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  MFA blocks the vast majority of account takeover attacks. Even if
                  someone discovers your password, they still need your second factor
                  to access your StoryArc account.
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
  onContinue,
  onMethodChange,
  selectedMethod,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="flex items-center justify-between p-4 pb-2">
        <Link className="flex size-12 items-center justify-start text-slate-900 dark:text-slate-100" to={profileHref}>
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h2 className="flex-1 pr-12 text-center text-lg font-bold">Two-Factor Authentication</h2>
      </header>

      <main className="flex min-h-[calc(100vh-72px)] flex-col">
        <div className="px-6 pt-8 pb-4">
          <div className="mb-6 inline-flex rounded-xl bg-primary/20 p-3 text-primary">
            <span className="material-symbols-outlined text-3xl">shield_lock</span>
          </div>
          <h3 className="mb-3 text-2xl font-bold leading-tight">Protect your account</h3>
          <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Choose how you want to receive your security codes to keep StoryArc secure.
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          {mfaMethods.map((method) => {
            const selected = method.id === selectedMethod;

            return (
              <label
                className={`flex cursor-pointer items-center gap-4 rounded-xl p-5 transition-all ${
                  selected
                    ? "border-2 border-primary bg-primary/5"
                    : "border border-slate-200 bg-white/5 hover:border-primary/50 dark:border-slate-800"
                }`}
                key={method.id}
              >
                <div className="flex grow flex-col">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="text-base font-bold">{method.title}</p>
                    {method.badge ? (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background-dark">
                        {method.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm leading-snug text-slate-600 dark:text-slate-400">
                    {method.description}
                  </p>
                </div>
                <input
                  checked={selected}
                  className="h-6 w-6 appearance-none rounded-full border-2 border-slate-400 bg-transparent checked:border-primary checked:bg-primary"
                  name="mfa-method"
                  onChange={() => onMethodChange(method.id)}
                  type="radio"
                />
              </label>
            );
          })}

          <div className="mt-4 flex items-start gap-3 rounded-lg bg-slate-100 p-4 dark:bg-slate-800/50">
            <span className="material-symbols-outlined text-xl text-primary">info</span>
            <p className="text-xs leading-normal text-slate-500 dark:text-slate-400">
              Authenticator apps are more secure than SMS because they do not rely on
              cellular networks and help prevent SIM-swapping attacks.
            </p>
          </div>
        </div>

        <div className="p-6 pb-10">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-background-dark shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]"
            onClick={onContinue}
            type="button"
          >
            <span>Continue</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-500">
            Step 1 of 3: Security Configuration
          </p>
        </div>
      </main>
    </div>
  );
}

export default function MfaChooseMethodPage() {
  const navigate = useNavigate();
  const { mfa, setMfaMethod } = useAccount();

  return (
    <>
      <DesktopChooseMethod
        onContinue={() => navigate(mfaSetupHref)}
        onMethodChange={setMfaMethod}
        selectedMethod={mfa.method}
      />
      <MobileChooseMethod
        onContinue={() => navigate(mfaSetupHref)}
        onMethodChange={setMfaMethod}
        selectedMethod={mfa.method}
      />
    </>
  );
}
