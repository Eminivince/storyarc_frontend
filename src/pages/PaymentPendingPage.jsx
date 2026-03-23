import { useSearchParams } from "react-router-dom";
import PaymentStatusLayout from "../components/PaymentStatusLayout";
import { useMonetization } from "../context/MonetizationContext";
import { billingSettingsHref } from "../data/accountFlow";
import { lockedChapterHref } from "../data/monetization";
import { getResumeReadingLabel } from "../monetization/paymentStatus";

export default function PaymentPendingPage() {
  const [searchParams] = useSearchParams();
  const { checkoutProvider, coinBalance } = useMonetization();
  const providerLabel = checkoutProvider === "flutterwave" ? "Flutterwave" : checkoutProvider === "cryptomus" ? "Cryptomus" : "Payment Provider";
  const returnTo = searchParams.get("returnTo") || lockedChapterHref;
  const resumeTo = searchParams.get("resumeTo") || returnTo;
  const reason = searchParams.get("reason") || null;
  const balanceLabel = `${coinBalance.toLocaleString()} coins available right now`;
  const note =
    reason === "verification-delay"
      ? `TaleStead could not get a final ${providerLabel} status yet. Resume reading and check your wallet again shortly.`
      : `Your payment is still pending confirmation. Resume reading now, then check your wallet again after ${providerLabel} settles the charge.`;

  return (
    <PaymentStatusLayout
      balanceLabel={balanceLabel}
      description={`${providerLabel} has not returned a final successful status yet, so TaleStead is keeping your wallet unchanged for now.`}
      icon="hourglass_top"
      note={note}
      primaryLabel={getResumeReadingLabel(resumeTo, returnTo)}
      primaryTo={resumeTo}
      secondaryTo={billingSettingsHref}
      title="Payment Pending"
      tone="pending"
    />
  );
}
