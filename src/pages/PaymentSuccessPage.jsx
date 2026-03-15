import { useSearchParams } from "react-router-dom";
import PaymentStatusLayout from "../components/PaymentStatusLayout";
import { useMonetization } from "../context/MonetizationContext";
import { billingSettingsHref } from "../data/accountFlow";
import { lockedChapterHref } from "../data/monetization";
import { getResumeReadingLabel } from "../monetization/paymentStatus";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const { coinBalance } = useMonetization();
  const returnTo = searchParams.get("returnTo") || lockedChapterHref;
  const resumeTo = searchParams.get("resumeTo") || returnTo;
  const autoUnlock = searchParams.get("autoUnlock") || "none";
  const kind = searchParams.get("kind") === "coins" ? "coins" : "plan";
  const balanceLabel = `${coinBalance.toLocaleString()} coins available`;

  let note = null;

  if (autoUnlock === "unlocked") {
    note =
      "Your wallet was credited and the locked chapter was unlocked automatically. Resume reading to continue immediately.";
  } else if (autoUnlock === "subscription") {
    note =
      "Your membership is active. Resume reading to continue past the paywall.";
  } else if (autoUnlock === "failed") {
    note =
      "Your payment was successful and your wallet was updated, but the locked chapter still needs a manual unlock.";
  } else if (kind === "coins") {
    note = "Your coin purchase is complete and ready to use.";
  } else {
    note = "Your membership purchase is active across the reading experience.";
  }

  return (
    <PaymentStatusLayout
      balanceLabel={balanceLabel}
      description="Your payment has been confirmed and TaleStead has refreshed your live wallet and access state."
      icon="check_circle"
      note={note}
      primaryLabel={getResumeReadingLabel(resumeTo, returnTo)}
      primaryTo={resumeTo}
      secondaryTo={billingSettingsHref}
      title="Payment Successful"
      tone="success"
    />
  );
}
