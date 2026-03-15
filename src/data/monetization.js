import { readerLibraryHref } from "./readerFlow";

export const pricingHref = "/pricing";
export const premiumPlanHref = "/pricing/plan";
export const coinStoreHref = "/coins";
export const checkoutHref = "/checkout";
export const checkoutStatusHref = "/checkout/status";
export const paymentSuccessHref = "/checkout/success";
export const paymentPendingHref = "/checkout/pending";
export const paymentFailedHref = "/checkout/failed";
export const lockedChapterKey = "reader-default";
export const lockedChapterHref = readerLibraryHref;
export const lockedChapterCost = 50;

export const freePlanTier = {
  accent: "default",
  cta: "Current Plan",
  description: "For the casual reader exploring new worlds.",
  features: [
    "Standard reading access",
    "Community forum access",
    "Daily check-in coins",
    "Ad-supported reading",
  ],
  id: "free",
  monthlyCoins: 0,
  monthlyPrice: 0,
  name: "Free",
  yearlyPrice: null,
};

const planPresentationById = {
  silver: {
    accent: "silver",
    badge: "Most Popular",
    cta: "Subscribe Now",
    features: [
      "Everything in Free",
      "Ad-free reading",
      "500 Monthly Coins",
      "Early access (2 chapters)",
      "Exclusive Silver badge",
    ],
    perks: [
      {
        description:
          "Unlock chapters, support authors, and keep a permanent stash ready for new releases.",
        icon: "toll",
        title: "500 Monthly Coins",
      },
      {
        description:
          "Stay immersed through every story without interruptions or forced pauses.",
        icon: "visibility_off",
        title: "Ad-free Reading Experience",
      },
      {
        description:
          "Read ahead of the public release schedule on your favorite series.",
        icon: "bolt",
        title: "2 Early-access Chapters",
      },
      {
        description:
          "Show your supporter status with a premium badge across TaleStead.",
        icon: "verified",
        title: "Silver Badge",
      },
    ],
    reasons: [
      {
        description:
          "Keep long reading sessions focused without interruptions in the middle of chapters.",
        icon: "auto_graph",
        title: "Ad-free immersion",
      },
      {
        description:
          "Get a steady coin refill every billing cycle so premium chapters stay within reach.",
        icon: "rocket_launch",
        title: "Monthly rewards",
      },
      {
        description:
          "Badges, themes, and premium discussion spaces inside the TaleStead community.",
        icon: "verified_user",
        title: "Community perks",
      },
    ],
    testimonial: {
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCbTlq5lmDh6pWNcix4s4MgWPPkVnHjQxafVna97SPYN-GFwpKeWyq42wBe4y7FPoG6foQX2-nzu14TSf7U8u6wRz90t5qQaQ8mLC0mqGsC0TkDjOYuYt82GxV6jeUGcCwcL2hiAcggSKyHCim3L_i4Qia9X-6yKhnOdc5zEiJ_sb9GTwebzb3XOaOZVUQYbpBpugNKl6keehxlPpSWMMwyZzV88Kp6HISqhwQwYaBc8LtrH-vIh2MwL8ssE0zQBUHeFI2JPClbUgc",
      meta: "Silver Member since 2024",
      name: "Mira Stone",
      quote:
        "The ad-free flow and monthly coins make the Silver plan the easiest upgrade on the app. It feels lightweight, but it changes how often I can keep reading premium stories.",
    },
  },
  arcane: {
    accent: "arcane",
    cta: "Go Arcane",
    features: [
      "Everything in Silver",
      "1200 Monthly Coins",
      "Priority early access (5+ chapters)",
      "Exclusive Arcane badge & avatar",
      "Unlimited offline downloads",
      "Direct support to creators",
    ],
    perks: [
      {
        description:
          "Unlock chapters, support authors, and buy exclusive digital collectibles every month.",
        icon: "toll",
        title: "1200 Monthly Coins",
      },
      {
        description:
          "Read new releases 48 hours before anyone else. Stay ahead of the lore.",
        icon: "priority_high",
        title: "Priority Early Access",
      },
      {
        description:
          "A glowing profile badge that identifies you as a high mage of the community.",
        icon: "verified",
        title: "Arcane Badge",
      },
      {
        description:
          "Download your library and read anywhere, even without signal.",
        icon: "download_for_offline",
        title: "Offline Reading",
      },
    ],
    reasons: [
      {
        description:
          "A direct portion of your subscription goes to the creators you love reading.",
        icon: "auto_graph",
        title: "Support Authors",
      },
      {
        description:
          "Get ahead of the crowd with early releases only available to Arcane members.",
        icon: "rocket_launch",
        title: "First to Read",
      },
      {
        description:
          "Badges, unique themes, and private channels for premium discussion.",
        icon: "verified_user",
        title: "Community Perks",
      },
    ],
    testimonial: {
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCbTlq5lmDh6pWNcix4s4MgWPPkVnHjQxafVna97SPYN-GFwpKeWyq42wBe4y7FPoG6foQX2-nzu14TSf7U8u6wRz90t5qQaQ8mLC0mqGsC0TkDjOYuYt82GxV6jeUGcCwcL2hiAcggSKyHCim3L_i4Qia9X-6yKhnOdc5zEiJ_sb9GTwebzb3XOaOZVUQYbpBpugNKl6keehxlPpSWMMwyZzV88Kp6HISqhwQwYaBc8LtrH-vIh2MwL8ssE0zQBUHeFI2JPClbUgc",
      meta: "Arcane Member since 2023",
      name: "Lia Rivers",
      quote:
        "The early access alone is worth it. Being able to read the next chapters before the spoilers hit social media is a game changer, and the ad-free experience makes binge-reading much better.",
    },
  },
};

const coinPackagePresentationById = {
  pouch: {
    description: "Essential starter",
    icon: "filter_1",
    mobileIcon: "account_balance_wallet",
  },
  bag: {
    bonus: "+25 bonus",
    description: "+10% Bonus",
    icon: "payments",
    mobileIcon: "shopping_bag",
  },
  box: {
    badge: "Most Popular",
    bonus: "+100 bonus",
    description: "+15% Bonus",
    icon: "inventory_2",
    mobileIcon: "inventory_2",
  },
  chest: {
    bonus: "+350 bonus",
    description: "+25% Bonus",
    icon: "lock_open",
    mobileIcon: "key",
  },
  vault: {
    bonus: "+1,000 bonus",
    description: "+40% Bonus",
    icon: "savings",
    mobileIcon: "lock",
  },
};

export const pricingTiers = [freePlanTier].concat(
  Object.entries(planPresentationById).map(([id, item]) => ({
    ...item,
    id,
    monthlyCoins: id === "arcane" ? 1200 : 500,
    monthlyPrice: id === "arcane" ? 19.99 : 9.99,
    name: id === "arcane" ? "Arcane" : "Silver",
    yearlyPrice: id === "arcane" ? 191.9 : 95.9,
  })),
);

export const coinPackages = Object.entries(coinPackagePresentationById).map(
  ([id, item]) => ({
    ...item,
    id,
  }),
);

function buildGenericPlanFeatures(plan) {
  return [
    "Ad-free reading",
    `${plan.monthlyCoinGrant ?? 0} monthly coins`,
    "Premium chapter access",
    "Direct support to creators",
  ];
}

function buildGenericPlanPerks(plan) {
  return [
    {
      description: "A recurring coin balance to unlock premium stories every month.",
      icon: "toll",
      title: `${plan.monthlyCoinGrant ?? 0} Monthly Coins`,
    },
    {
      description: "Read without interruptions and keep momentum through long sessions.",
      icon: "visibility_off",
      title: "Ad-free Reading",
    },
    {
      description: "Use your membership to access premium releases and support authors directly.",
      icon: "workspace_premium",
      title: "Premium Access",
    },
  ];
}

function buildGenericPlanReasons(plan) {
  return [
    {
      description: `A steady ${plan.monthlyCoinGrant ?? 0}-coin grant each billing cycle.`,
      icon: "rocket_launch",
      title: "Monthly value",
    },
    {
      description: "Unlock more chapters without relying on one-off purchases every week.",
      icon: "menu_book",
      title: "More reading momentum",
    },
    {
      description: "Support the writers and series you keep coming back to.",
      icon: "favorite",
      title: "Creator support",
    },
  ];
}

function buildGenericPlanTestimonial(plan) {
  return {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCbTlq5lmDh6pWNcix4s4MgWPPkVnHjQxafVna97SPYN-GFwpKeWyq42wBe4y7FPoG6foQX2-nzu14TSf7U8u6wRz90t5qQaQ8mLC0mqGsC0TkDjOYuYt82GxV6jeUGcCwcL2hiAcggSKyHCim3L_i4Qia9X-6yKhnOdc5zEiJ_sb9GTwebzb3XOaOZVUQYbpBpugNKl6keehxlPpSWMMwyZzV88Kp6HISqhwQwYaBc8LtrH-vIh2MwL8ssE0zQBUHeFI2JPClbUgc",
    meta: `${plan.name} member`,
    name: "TaleStead Reader",
    quote: `${plan.name} keeps premium reading simple. I get membership access, monthly coins, and a better reading rhythm without having to think about it.`,
  };
}

export function buildDisplayPlan(catalogPlan) {
  const preset = planPresentationById[catalogPlan.code] ?? {};

  return {
    accent: preset.accent ?? "default",
    badge: preset.badge ?? null,
    cta: preset.cta ?? `Choose ${catalogPlan.name}`,
    description: catalogPlan.description,
    features: preset.features ?? buildGenericPlanFeatures(catalogPlan),
    id: catalogPlan.code,
    monthlyCoins: catalogPlan.monthlyCoinGrant ?? 0,
    monthlyPrice: catalogPlan.monthlyPriceCents / 100,
    name: catalogPlan.name,
    perks: preset.perks ?? buildGenericPlanPerks(catalogPlan),
    reasons: preset.reasons ?? buildGenericPlanReasons(catalogPlan),
    testimonial: preset.testimonial ?? buildGenericPlanTestimonial(catalogPlan),
    yearlyPrice: catalogPlan.yearlyPriceCents
      ? catalogPlan.yearlyPriceCents / 100
      : null,
  };
}

export function buildDisplayCoinPackage(catalogPackage) {
  const preset = coinPackagePresentationById[catalogPackage.code] ?? {};

  return {
    badge: preset.badge ?? null,
    bonus:
      preset.bonus ??
      (catalogPackage.bonusCoins > 0
        ? `+${catalogPackage.bonusCoins.toLocaleString()} bonus`
        : null),
    bonusCoins: catalogPackage.bonusCoins,
    coins: catalogPackage.totalCoins,
    description: preset.description ?? catalogPackage.description,
    icon: preset.icon ?? "payments",
    id: catalogPackage.code,
    mobileIcon: preset.mobileIcon ?? "payments",
    name: catalogPackage.name,
    price: catalogPackage.priceCents / 100,
    totalCoins: catalogPackage.totalCoins,
  };
}

export function getPlanById(planId) {
  if (planId === "free") {
    return freePlanTier;
  }

  const preset = planPresentationById[planId];

  if (!preset) {
    return null;
  }

  return {
    ...preset,
    id: planId,
    monthlyCoins: 0,
    monthlyPrice: 0,
    name: planId,
    perks: preset.perks ?? [],
    reasons: preset.reasons ?? [],
    testimonial: preset.testimonial ?? buildGenericPlanTestimonial({ name: planId }),
    yearlyPrice: null,
  };
}

export function getCoinPackageById(packageId) {
  const preset = coinPackagePresentationById[packageId];

  if (!preset) {
    return null;
  }

  return {
    ...preset,
    id: packageId,
  };
}

export function buildPathWithParams(path, params) {
  const search = new URLSearchParams(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  ).toString();

  return search ? `${path}?${search}` : path;
}

export function buildPlanHref(planId = "arcane", returnTo = lockedChapterHref) {
  return buildPathWithParams(premiumPlanHref, { plan: planId, returnTo });
}

export function buildCoinStoreHref(returnTo = lockedChapterHref) {
  return buildPathWithParams(coinStoreHref, { returnTo });
}

export function buildCheckoutHref({
  billing = "monthly",
  kind,
  productId,
  returnTo = lockedChapterHref,
}) {
  return buildPathWithParams(checkoutHref, {
    billing,
    kind,
    productId,
    returnTo,
  });
}

export function buildCheckoutStatusHref(params = {}) {
  return buildPathWithParams(checkoutStatusHref, params);
}

export function buildPaymentSuccessHref(params = {}) {
  return buildPathWithParams(paymentSuccessHref, params);
}

export function buildPaymentPendingHref(params = {}) {
  return buildPathWithParams(paymentPendingHref, params);
}

export function buildPaymentFailedHref(params = {}) {
  return buildPathWithParams(paymentFailedHref, params);
}

export function formatPrice(amount, currency = "USD") {
  const numericAmount = Number(amount ?? 0);

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(numericAmount);
  } catch {
    return `${currency} ${numericAmount.toFixed(2)}`;
  }
}
