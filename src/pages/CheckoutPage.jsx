import { Link, Navigate, useLocation, useSearchParams } from "react-router-dom";
import ReaderStateScreen from "../components/ReaderStateScreen";
import Reveal from "../components/Reveal";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import { useMonetization } from "../context/MonetizationContext";
import { useToast } from "../context/ToastContext";
import {
  buildCheckoutStatusHref,
  buildCoinStoreHref,
  buildPlanHref,
  coinStoreHref,
  formatPrice,
  lockedChapterHref,
  pricingHref,
} from "../data/monetization";

function getCheckoutProviderMeta(checkoutProvider) {
  if (checkoutProvider === "cryptomus") {
    return {
      description:
        "You will finish payment on Cryptomus, where you can pick your supported coin, wallet, and network securely.",
      icon: "currency_bitcoin",
      label: "Cryptomus",
      note: "Wallet selection happens on the hosted checkout page.",
    };
  }

  return {
    description:
      "You will finish payment on Paystack's hosted checkout page. TaleStead never collects your payment details directly.",
    icon: "payments",
    label: "Paystack",
    note: "Payment details are handled on the provider page.",
  };
}

function getOrderDetails({
  billing,
  getCoinPackage,
  getPlan,
  kind,
  productId,
  returnTo,
}) {
  if (kind === "coins") {
    const packageData = getCoinPackage(productId);

    if (!packageData) {
      return null;
    }

    const subtotal = packageData.price ?? 0;

    return {
      category: "Coin Purchase",
      headline: "Secure Checkout",
      description: "Complete your coin purchase and return to your locked chapter with an updated wallet balance.",
      name: packageData.name,
      subtitle: `${packageData.coins.toLocaleString()} Coin Package`,
      detail: "One-time purchase",
      subtotal,
      feeLabel: "Fees",
      serviceFee: 0,
      total: subtotal,
      accent: `${packageData.coins.toLocaleString()} Coins`,
      returnLink: buildCoinStoreHref(returnTo),
    };
  }

  const plan = getPlan(productId);

  if (!plan) {
    return null;
  }

  const subtotal =
    billing === "annual" && plan.yearlyPrice ? plan.yearlyPrice : plan.monthlyPrice;

  return {
    category: "Membership Upgrade",
    headline: "Secure Checkout",
    description: "Complete your subscription to unlock premium story tools and immediate access to locked chapters.",
    name: `${plan.name} Membership`,
    subtitle: billing === "annual" ? "Annual Membership Plan" : "Monthly Membership Plan",
    detail:
      billing === "annual"
        ? `${plan.monthlyCoins || 0} coins per month, billed annually`
        : `${plan.monthlyCoins || 0} coins every billing cycle`,
    subtotal,
    feeLabel: "Fees",
    serviceFee: 0,
    total: subtotal,
    accent:
      billing === "annual"
        ? `${plan.name} billed yearly`
        : `${plan.name} billed monthly`,
    returnLink: buildPlanHref(plan.id, returnTo),
  };
}

function DesktopCheckout({
  currency,
  details,
  isBusy,
  onSubmit,
  providerMeta,
  returnTo,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        <header className="flex items-center justify-between border-b border-primary/20 bg-background-light px-6 py-4 dark:bg-background-dark md:px-20">
          <Link className="flex items-center gap-3 text-primary" to="/dashboard">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"
                fill="currentColor"
              />
            </svg>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              TaleStead
            </h2>
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-8 md:flex">
              <Link className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-400" to={pricingHref}>
                Plans
              </Link>
              <Link className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-400" to={coinStoreHref}>
                Shop
              </Link>
              <Link className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-400" to={returnTo}>
                Return
              </Link>
            </nav>
            <div className="h-10 w-10 rounded-full border border-primary/30 bg-primary/10" />
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10">
          <div className="mb-10">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">
              {details.category}
            </p>
            <h1 className="mb-2 text-4xl font-black tracking-tight">
              {details.headline}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {details.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-5">
              <Reveal className="rounded-xl border border-primary/20 bg-primary/5 p-6 dark:bg-primary/10">
                <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
                  <span className="material-symbols-outlined text-primary">
                    shopping_bag
                  </span>
                  Order Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-semibold">{details.name}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {details.subtitle}
                      </span>
                    </div>
                    <span className="font-medium">
                      {formatPrice(details.subtotal, currency)}
                    </span>
                  </div>
                  <div className="my-4 h-px bg-slate-200 dark:bg-slate-700" />
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                    <span>{formatPrice(details.subtotal, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      {details.feeLabel}
                    </span>
                    <span>{formatPrice(details.serviceFee, currency)}</span>
                  </div>
                  <div className="my-4 h-px bg-slate-200 dark:bg-slate-700" />
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold">Total Due</span>
                    <span className="text-2xl font-black text-primary">
                      {formatPrice(details.total, currency)}
                    </span>
                  </div>
                </div>
              </Reveal>

              <div className="flex flex-wrap items-center justify-center gap-6 rounded-xl border border-dashed border-slate-300 p-4 dark:border-slate-700">
                {[
                  ["verified_user", "SSL Secure"],
                  ["payments", "PCI DSS"],
                  ["shield", "AES-256"],
                ].map(([icon, label]) => (
                  <div
                    className="flex items-center gap-2 text-slate-500 opacity-70 grayscale dark:text-slate-400"
                    key={label}
                  >
                    <span className="material-symbols-outlined">{icon}</span>
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <Reveal className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-background-dark/50">
                <h3 className="mb-6 text-xl font-bold">Payment Gateway</h3>

                <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 dark:bg-primary/10">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                      <span className="material-symbols-outlined">
                        {providerMeta.icon}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
                        {providerMeta.label}
                      </p>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        Hosted checkout
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {providerMeta.description}
                      </p>
                    </div>
                  </div>
                </div>

                <form className="space-y-6" onSubmit={onSubmit}>
                  <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-background-dark/70">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary">
                        verified_user
                      </span>
                      <div>
                        <p className="font-semibold">Provider-hosted flow</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          TaleStead redirects you to {providerMeta.label} to complete the charge securely.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary">
                        account_balance_wallet
                      </span>
                      <div>
                        <p className="font-semibold">Choose payment details there</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {providerMeta.note}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary">
                        sync_lock
                      </span>
                      <div>
                        <p className="font-semibold">Automatic access refresh</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Your wallet, membership, and premium access will refresh after the provider confirms payment.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-background-dark shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isBusy}
                    type="submit"
                  >
                    <span className="material-symbols-outlined">lock</span>
                    {isBusy
                      ? `Redirecting to ${providerMeta.label}...`
                      : `Continue to ${providerMeta.label} • ${formatPrice(details.total, currency)}`}
                  </button>

                  <p className="px-8 text-center text-xs text-slate-500 dark:text-slate-400">
                    By clicking Pay Now, you agree to TaleStead&apos;s{" "}
                    <Link className="underline" to="/terms">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link className="underline" to="/privacy">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </form>
              </Reveal>
            </div>
          </div>
        </main>

        <footer className="border-t border-primary/10 px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
            <p>© 2024 TaleStead Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="transition-colors hover:text-primary" href="#">
                Help Center
              </a>
              <a className="transition-colors hover:text-primary" href="#">
                Security Details
              </a>
              <Link className="transition-colors hover:text-primary" to={details.returnLink}>
                Back
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function MobileCheckout({
  currency,
  details,
  isBusy,
  onSubmit,
  providerMeta,
  returnTo,
}) {
  return (
    <div className="min-h-screen max-w-md bg-background-light font-display text-slate-900 antialiased dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden border-x border-slate-200 dark:border-primary/10">
        <div className="flex items-center justify-between bg-background-light p-4 pb-2 dark:bg-background-dark">
          <Link
            className="flex h-12 w-12 items-center justify-start text-slate-900 dark:text-slate-100"
            to={returnTo}
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </Link>
          <h2 className="flex-1 text-center text-lg font-bold tracking-tight">
            Checkout
          </h2>
          <div className="h-12 w-12 shrink-0" />
        </div>

        <div className="px-4 py-4">
          <h3 className="mb-4 text-lg font-bold">Order Summary</h3>
          <Reveal className="rounded-xl border border-slate-200 bg-white/5 p-4 dark:border-primary/10 dark:bg-primary/5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex flex-col justify-center">
                <p className="line-clamp-1 text-base font-semibold">{details.name}</p>
                <p className="text-sm text-slate-500 dark:text-primary/60">
                  {details.subtitle}
                </p>
              </div>
              <div className="shrink-0">
                <p className="text-base font-bold">
                  {formatPrice(details.subtotal, currency)}
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between gap-4 border-t border-slate-200 py-2 dark:border-primary/10">
              <p className="flex-1 text-sm text-slate-600 dark:text-slate-400">
                {details.feeLabel}
              </p>
              <div className="shrink-0">
                <p className="text-sm">{formatPrice(details.serviceFee, currency)}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-primary/10">
              <p className="text-lg font-bold">Total</p>
              <p className="text-xl font-bold text-primary">
                {formatPrice(details.total, currency)}
              </p>
            </div>
          </Reveal>
        </div>

        <div className="px-4 py-2">
          <h3 className="mb-4 text-lg font-bold">Payment Gateway</h3>
          <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 dark:border-primary/30 dark:bg-primary/10">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">
                {providerMeta.icon}
              </span>
              <div>
                <p className="font-semibold">{providerMeta.label}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {providerMeta.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form className="space-y-4 px-4 pb-10" onSubmit={onSubmit}>
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white px-4 py-4 dark:border-primary/20 dark:bg-primary/5">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">
                verified_user
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                TaleStead will redirect you to {providerMeta.label} to complete the payment securely.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">
                account_balance_wallet
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {providerMeta.note}
              </p>
            </div>
          </div>

          <div className="sticky bottom-0 border-t border-slate-200 bg-background-light p-4 dark:border-primary/10 dark:bg-background-dark">
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm text-slate-400 dark:text-primary/60">
                lock
              </span>
              <span className="text-xs text-slate-400 dark:text-primary/60">
                Secure SSL Encrypted Payment
              </span>
            </div>
            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-background-dark shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isBusy}
              type="submit"
            >
              <span>
                {isBusy
                  ? `Redirecting to ${providerMeta.label}...`
                  : `Continue to ${providerMeta.label} • ${formatPrice(details.total, currency)}`}
              </span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </form>
        <div className="h-6 bg-background-light dark:bg-background-dark" />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const location = useLocation();
  const { showToast } = useToast();
  const {
    catalogError,
    checkoutProvider,
    coinPackages,
    createCheckoutSession,
    currency,
    getDisplayCoinPackage,
    getDisplayPlan,
    hasCatalogProduct,
    isCatalogLoading,
    isCreatingCheckoutSession,
    plans,
  } = useMonetization();
  const [searchParams] = useSearchParams();
  const kind = searchParams.get("kind") === "coins" ? "coins" : "plan";
  const billing = searchParams.get("billing") === "annual" ? "annual" : "monthly";
  const defaultProductId =
    kind === "coins" ? coinPackages[0]?.id ?? null : plans[0]?.id ?? null;
  const productId = searchParams.get("productId") || defaultProductId;
  const isCanceled = searchParams.get("canceled") === "1";
  const returnTo = searchParams.get("returnTo") || lockedChapterHref;
  const reference =
    searchParams.get("reference") || searchParams.get("trxref");
  const isCheckoutBusy = isCreatingCheckoutSession;
  const isProductAvailable = productId
    ? hasCatalogProduct(kind, productId)
    : false;
  const details =
    productId && isProductAvailable
      ? getOrderDetails({
          billing,
          getCoinPackage: getDisplayCoinPackage,
          getPlan: getDisplayPlan,
          kind,
          productId,
          returnTo,
        })
      : null;
  const providerMeta = getCheckoutProviderMeta(checkoutProvider);
  const unavailableReturnLink =
    kind === "coins" ? buildCoinStoreHref(returnTo) : pricingHref;

  if (reference) {
    return (
      <Navigate
        replace
        to={buildCheckoutStatusHref(
          Object.fromEntries(new URLSearchParams(location.search)),
        )}
      />
    );
  }

  if (!reference && isCatalogLoading) {
    return <RouteLoadingScreen />;
  }

  if (!reference && (catalogError || !productId || !details)) {
    return (
      <ReaderStateScreen
        ctaLabel={kind === "coins" ? "Back to Coin Store" : "Back to Pricing"}
        ctaTo={unavailableReturnLink}
        description={
          catalogError?.message ||
          "That checkout product is not available in the live catalog right now."
        }
        secondaryLabel="Back to Reading"
        secondaryTo={returnTo}
        title="Product Unavailable"
      />
    );
  }

  if (isCanceled) {
    return (
      <ReaderStateScreen
        ctaLabel="Return to Checkout"
        ctaTo={details?.returnLink ?? unavailableReturnLink}
        description="Your payment was not completed. No charge was made, and you can restart whenever you're ready."
        secondaryLabel="Back to Reading"
        secondaryTo={returnTo}
        title="Checkout Canceled"
      />
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isCheckoutBusy) {
      return;
    }

    try {
      const response = await createCheckoutSession({
        billing,
        kind,
        productId,
        returnTo,
      });

      if (!response?.checkoutUrl) {
        throw new Error(`${providerMeta.label} checkout URL was not returned.`);
      }

      window.location.assign(response.checkoutUrl);
    } catch (error) {
      showToast(error?.message || "Could not start checkout.", {
        title: "Checkout unavailable",
        tone: "error",
      });
    }
  }

  return (
    <>
      <DesktopCheckout
        currency={currency}
        details={details}
        isBusy={isCheckoutBusy}
        onSubmit={handleSubmit}
        providerMeta={providerMeta}
        returnTo={returnTo}
      />
      <MobileCheckout
        currency={currency}
        details={details}
        isBusy={isCheckoutBusy}
        onSubmit={handleSubmit}
        providerMeta={providerMeta}
        returnTo={returnTo}
      />
    </>
  );
}
