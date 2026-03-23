import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaymentStatusLayout from "../components/PaymentStatusLayout";
import { useMonetization } from "../context/MonetizationContext";
import { billingSettingsHref } from "../data/accountFlow";
import { buildCheckoutStatusHref, lockedChapterHref } from "../data/monetization";
import { getResumeReadingLabel } from "../monetization/paymentStatus";

export default function PaymentFailedPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifyReference, setVerifyReference] = useState("");
  const { checkoutProvider, coinBalance } = useMonetization();
  const providerLabel = checkoutProvider === "flutterwave" ? "Flutterwave" : checkoutProvider === "cryptomus" ? "Cryptomus" : "Payment Provider";
  const returnTo = searchParams.get("returnTo") || lockedChapterHref;
  const resumeTo = searchParams.get("resumeTo") || returnTo;
  const reason = searchParams.get("reason") || null;
  const kind = searchParams.get("kind") === "coins" ? "coins" : "plan";
  const productId = searchParams.get("productId") || "";
  const billing = searchParams.get("billing") === "annual" ? "annual" : "monthly";
  const balanceLabel = `${coinBalance.toLocaleString()} coins available`;
  const note =
    reason === "missing-reference"
      ? `${providerLabel} did not return a usable payment reference, so TaleStead could not verify the charge. If you completed payment, enter your reference below to verify.`
      : reason === "verification-failed"
        ? "TaleStead could not verify this charge against the signed-in account."
        : "No wallet credit was applied. You can resume reading, return to the dashboard, or review your wallet before trying again.";

  const handleVerifyPayment = (e) => {
    e.preventDefault();
    const ref = verifyReference.trim();
    if (ref) {
      navigate(
        buildCheckoutStatusHref({ reference: ref, returnTo, kind, productId, billing }),
      );
    }
  };

  const showVerifyForm = reason === "missing-reference";

  return (
    <PaymentStatusLayout
      extraContent={
        showVerifyForm ? (
          <form
            className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={handleVerifyPayment}
          >
            <div className="flex-1">
              <label
                className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400"
                htmlFor="verify-reference"
              >
                {providerLabel} reference
              </label>
              <input
                className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                id="verify-reference"
                onChange={(e) => setVerifyReference(e.target.value)}
                placeholder={`Enter your ${providerLabel} reference`}
                type="text"
                value={verifyReference}
              />
            </div>
            <button
              className="rounded-xl border border-primary/40 bg-primary/20 px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/30 disabled:opacity-50"
              disabled={!verifyReference.trim()}
              type="submit"
            >
              Verify payment
            </button>
          </form>
        ) : null
      }
      balanceLabel={balanceLabel}
      description="The payment was not completed successfully, so your wallet and access state were left unchanged."
      icon="cancel"
      note={note}
      primaryLabel={getResumeReadingLabel(resumeTo, returnTo)}
      primaryTo={resumeTo}
      secondaryTo={billingSettingsHref}
      title="Payment Failed"
      tone="failed"
    />
  );
}
