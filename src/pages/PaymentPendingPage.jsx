import { useSearchParams } from "react-router-dom";
import PaymentStatusLayout from "../components/PaymentStatusLayout";
import { useMonetization } from "../context/MonetizationContext";
import { billingSettingsHref } from "../data/accountFlow";
import { lockedChapterHref } from "../data/monetization";
import { getResumeReadingLabel } from "../monetization/paymentStatus";

export default function PaymentPendingPage() {
  const [searchParams] = useSearchParams();
  const { coinBalance } = useMonetization();
  const returnTo = searchParams.get("returnTo") || lockedChapterHref;
  const resumeTo = searchParams.get("resumeTo") || returnTo;
  const reason = searchParams.get("reason") || null;
  const balanceLabel = `${coinBalance.toLocaleString()} coins available right now`;
  const note =
    reason === "verification-delay"
      ? "StoryArc could not get a final Paystack status yet. Resume reading and check your wallet again shortly."
      : "Your payment is still pending confirmation. Resume reading now, then check your wallet again after Paystack settles the charge.";

  return (
    <PaymentStatusLayout
      balanceLabel={balanceLabel}
      description="Paystack has not returned a final successful status yet, so StoryArc is keeping your wallet unchanged for now."
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
