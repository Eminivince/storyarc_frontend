import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "../context/AccountContext";
import {
  mfaChooseHref,
  notificationsHref,
  profileHref,
} from "../data/accountFlow";

function downloadCodesFile(codes) {
  const blob = new Blob([codes.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = "talestead-recovery-codes.txt";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function DesktopSuccess({
  mfa,
  onCopyCodes,
  onDone,
  onDownloadCodes,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(244,192,37,0.08),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(244,192,37,0.05),transparent_40%)]">
        <header className="flex items-center justify-between border-b border-primary/10 px-6 py-4 lg:px-40">
          <div className="flex items-center gap-4 text-primary">
            <div className="flex size-6 items-center justify-center">
              <span className="material-symbols-outlined text-3xl">auto_stories</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-100">TaleStead</h2>
          </div>
          <Link
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20"
            to={notificationsHref}
          >
            <span className="material-symbols-outlined">close</span>
          </Link>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
          <div className="w-full max-w-[560px] rounded-xl border border-primary/10 bg-background-dark/50 p-8 shadow-2xl backdrop-blur-sm">
            <div className="mb-10 mt-6 flex flex-col items-center text-center">
              <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-primary/20 ring-4 ring-primary/5">
                <span className="material-symbols-outlined text-5xl text-primary">check_circle</span>
              </div>
              <h1 className="mb-2 text-3xl font-black tracking-tight text-slate-100">
                MFA Setup Successful
              </h1>
              <p className="text-base text-slate-400">
                Multi-factor authentication is now active on your TaleStead account.
                Your data is now more secure.
              </p>
            </div>

            <div className="mb-8 overflow-hidden rounded-lg border border-primary/10">
              <img
                alt="Security background"
                className="h-36 w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQFoA87I3UUrmYEgwjvFcSvBUfsT2uw0D8cAe0VKzxWFvgnukY2EYbf8Kdv2ej07e_t-gzyPaTbTx1iASNn-0jt-KPr9tk-ZbActLR4G1LmtrQjoMl3U5kEU4DiVrqQm6btVfSyPdFhuHupEDVEylSSOct4Uy2m6IhSJadfgGceKM9cJFYhQWbFSTWM-nfl7rF8ShxkET_n3kaEUrlvHP60I0WG_2SrGI31zDk2fU03CvJ_3dZ-zmx81ABsUgHoArky0fNg1zf5lo"
              />
            </div>

            <div className="mb-8 flex flex-col gap-4">
              <div className="flex items-center gap-2 px-1">
                <span className="material-symbols-outlined text-xl text-primary">vpn_key</span>
                <h3 className="text-lg font-bold text-slate-100">Backup Recovery Codes</h3>
              </div>
              <p className="px-1 text-sm text-slate-400">
                Save these codes in a secure vault or print them out. You can use them
                to regain access if you lose your primary MFA device.
              </p>
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-primary/10 bg-primary/5 p-4 font-mono text-sm tracking-wider">
                {mfa.recoveryCodes.map((code) => (
                  <div
                    className="rounded border border-primary/5 bg-background-dark/40 px-3 py-2 text-slate-200"
                    key={code}
                  >
                    {code}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex gap-3">
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/10 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/20"
                  onClick={onCopyCodes}
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">content_copy</span>
                  Copy Codes
                </button>
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/10 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/20"
                  onClick={onDownloadCodes}
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">download</span>
                  Download PDF
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-primary/10 pt-4">
              <button
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-base font-bold text-background-dark transition-all hover:brightness-110"
                onClick={onDone}
                type="button"
              >
                Done
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <Link
                className="w-full py-2 text-center text-sm font-medium text-slate-400 transition-colors hover:text-primary"
                to={mfaChooseHref}
              >
                Back to Security Settings
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-slate-500">
            TaleStead Security Protocol v4.2 • Protected by End-to-End Encryption
          </p>
        </main>
      </div>
    </div>
  );
}

function MobileSuccess({
  mfa,
  onCopyCodes,
  onDone,
  onDownloadCodes,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-background-light p-4 pb-2 dark:bg-background-dark">
          <Link className="flex size-12 items-center justify-start text-slate-900 dark:text-slate-100" to={mfaChooseHref}>
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </Link>
          <h2 className="flex-1 pr-12 text-center text-lg font-bold">Security Setup</h2>
        </header>

        <div className="flex flex-col px-6 py-8">
          <div className="mb-8 mt-6 flex flex-col items-center gap-6">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 shadow-[0_0_20px_rgba(244,192,37,0.2)]">
                <span className="material-symbols-outlined text-5xl text-primary">verified_user</span>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight">MFA Setup Successful</h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Your TaleStead account is now protected with multi-factor authentication.
                Save your recovery codes in a safe place.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Backup Recovery Codes</h3>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {mfa.recoveryCodes.length} Codes
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {mfa.recoveryCodes.map((code) => (
                <div className="flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4" key={code}>
                  <span className="material-symbols-outlined text-xl text-primary">key</span>
                  <p className="font-mono text-base font-medium tracking-wider">{code}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/20"
                onClick={onCopyCodes}
                type="button"
              >
                <span className="material-symbols-outlined text-lg">content_copy</span>
                <span>Copy Codes</span>
              </button>
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/20"
                onClick={onDownloadCodes}
                type="button"
              >
                <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                <span>Download PDF</span>
              </button>
            </div>
            <button
              className="mt-4 flex h-14 w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-background-dark shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
              onClick={onDone}
              type="button"
            >
              Done
            </button>
          </div>

          <div className="mt-6 flex gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <span className="material-symbols-outlined shrink-0 text-red-500">warning</span>
            <p className="text-xs leading-normal text-red-500/90">
              Warning: These codes are the only way to access your account if you lose
              your MFA device. TaleStead cannot recover them for you.
            </p>
          </div>
        </div>

        <div className="h-8 bg-transparent" />
      </div>
    </div>
  );
}

export default function MfaSuccessPage() {
  const navigate = useNavigate();
  const { copyValue, mfa, showNotice } = useAccount();

  function handleDownloadCodes() {
    downloadCodesFile(mfa.recoveryCodes);
    showNotice("Recovery codes downloaded.");
  }

  function handleCopyCodes() {
    copyValue("Recovery codes", mfa.recoveryCodes.join(", "));
  }

  return (
    <>
      <DesktopSuccess
        mfa={mfa}
        onCopyCodes={handleCopyCodes}
        onDone={() => navigate(profileHref)}
        onDownloadCodes={handleDownloadCodes}
      />
      <MobileSuccess
        mfa={mfa}
        onCopyCodes={handleCopyCodes}
        onDone={() => navigate(profileHref)}
        onDownloadCodes={handleDownloadCodes}
      />
    </>
  );
}
