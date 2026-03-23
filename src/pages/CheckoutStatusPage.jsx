import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReaderStateScreen from "../components/ReaderStateScreen";
import { useMonetization } from "../context/MonetizationContext";
import { useToast } from "../context/ToastContext";
import {
  buildCheckoutStatusHref,
  buildPaymentFailedHref,
  buildPaymentPendingHref,
  buildPaymentSuccessHref,
  lockedChapterHref,
} from "../data/monetization";
import { parseLockedChapterTarget } from "../monetization/paymentStatus";

function buildBaseParams({ billing, kind, productId, reference, returnTo }) {
  return {
    billing,
    kind,
    productId,
    reference,
    returnTo,
  };
}

export default function CheckoutStatusPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkoutProvider, confirmCheckoutSession, spendCoinsForChapter } =
    useMonetization();
  const { showToast } = useToast();
  const providerLabel = checkoutProvider === "flutterwave" ? "Flutterwave" : checkoutProvider === "cryptomus" ? "Cryptomus" : "Payment Provider";
  const billing = searchParams.get("billing") === "annual" ? "annual" : "monthly";
  const kind = searchParams.get("kind") === "coins" ? "coins" : "plan";
  const productId = searchParams.get("productId") || "";
  const reference =
    searchParams.get("reference") || searchParams.get("trxref") || "";
  const returnTo = searchParams.get("returnTo") || lockedChapterHref;

  useEffect(() => {
    let cancelled = false;

    async function resolveCheckout() {
      const baseParams = buildBaseParams({
        billing,
        kind,
        productId,
        reference,
        returnTo,
      });

      if (!reference) {
        navigate(
          buildPaymentFailedHref({
            ...baseParams,
            reason: "missing-reference",
            resumeTo: returnTo,
          }),
          { replace: true },
        );
        return;
      }

      try {
        const response = await confirmCheckoutSession({ reference });

        if (cancelled) {
          return;
        }

        const checkoutStatus = response?.checkoutStatus ?? "pending";

        if (checkoutStatus === "success") {
          let resumeTo = returnTo;
          let autoUnlock = "none";
          const lockedTarget = parseLockedChapterTarget(returnTo);

          if (lockedTarget) {
            if (kind === "coins") {
              try {
                await spendCoinsForChapter({
                  chapterSlug: lockedTarget.chapterSlug,
                  storySlug: lockedTarget.storySlug,
                });
                resumeTo = lockedTarget.chapterHref;
                autoUnlock = "unlocked";
              } catch (unlockError) {
                autoUnlock = "failed";
                showToast(
                  unlockError?.message ||
                    "Coins were credited, but the chapter needs to be unlocked manually.",
                  {
                    title: "Unlock not completed",
                    tone: "error",
                  },
                );
              }
            } else {
              resumeTo = lockedTarget.chapterHref;
              autoUnlock = "subscription";
            }
          }

          navigate(
            buildPaymentSuccessHref({
              ...baseParams,
              autoUnlock,
              resumeTo,
            }),
            { replace: true },
          );
          return;
        }

        if (checkoutStatus === "failed") {
          navigate(
            buildPaymentFailedHref({
              ...baseParams,
              resumeTo: returnTo,
            }),
            { replace: true },
          );
          return;
        }

        navigate(
          buildPaymentPendingHref({
            ...baseParams,
            resumeTo: returnTo,
          }),
          { replace: true },
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        const statusCode = Number(error?.status ?? 500);
        const targetHref =
          statusCode >= 500 || statusCode === 408
            ? buildPaymentPendingHref({
                ...baseParams,
                resumeTo: returnTo,
                reason: "verification-delay",
              })
            : buildPaymentFailedHref({
                ...baseParams,
                resumeTo: returnTo,
                reason: "verification-failed",
              });

        navigate(targetHref, { replace: true });
      }
    }

    resolveCheckout();

    return () => {
      cancelled = true;
    };
  }, [
    billing,
    confirmCheckoutSession,
    kind,
    navigate,
    productId,
    reference,
    returnTo,
    showToast,
    spendCoinsForChapter,
  ]);

  return (
    <ReaderStateScreen
      description={`We are verifying your ${providerLabel} payment and updating your wallet, plan access, and chapter entitlements.`}
      title="Finalizing Payment"
      tone="loading"
    />
  );
}
