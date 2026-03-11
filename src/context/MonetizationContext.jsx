import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import {
  buildDisplayCoinPackage,
  buildDisplayPlan,
  freePlanTier,
} from "../data/monetization";
import {
  confirmMonetizationCheckoutSession,
  createMonetizationCheckoutSession,
  fetchMonetizationCatalog,
  fetchMonetizationStatus,
  sendGiftApi,
  unlockChapterWithAdApi,
  unlockChapterWithCoinsApi,
} from "../monetization/monetizationApi";

const MonetizationContext = createContext(null);
const monetizationStatusQueryKey = ["monetization", "status"];

function createIdempotencyKey(scope, parts = []) {
  const suffix = globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return [scope, ...parts, suffix].filter(Boolean).join(":");
}

function mergePlanCatalog(catalogPlans) {
  return (catalogPlans ?? []).map((plan) => buildDisplayPlan(plan));
}

function mergeCoinCatalog(catalogCoinPackages) {
  return (catalogCoinPackages ?? []).map((item) => buildDisplayCoinPackage(item));
}

function mergeGiftCatalog(catalogGifts) {
  return (catalogGifts ?? []).map((gift) => ({
    coins: gift.coins,
    description: gift.description,
    icon: gift.icon,
    id: gift.code,
    name: gift.name,
  }));
}

function getNoticeToneFromMessage(message) {
  if (!message) {
    return "success";
  }

  return /not enough|already|need/i.test(message) ? "info" : "success";
}

export function MonetizationProvider({ children }) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [lastNotice, setLastNotice] = useState(null);

  const catalogQuery = useQuery({
    enabled: isAuthenticated,
    queryKey: ["monetization", "catalog"],
    queryFn: fetchMonetizationCatalog,
    staleTime: 5 * 60 * 1000,
  });

  const statusQuery = useQuery({
    enabled: isAuthenticated,
    queryKey: monetizationStatusQueryKey,
    queryFn: fetchMonetizationStatus,
  });

  const displayPlans = useMemo(
    () => mergePlanCatalog(catalogQuery.data?.plans),
    [catalogQuery.data?.plans],
  );
  const displayCoinPackages = useMemo(
    () => mergeCoinCatalog(catalogQuery.data?.coinPackages),
    [catalogQuery.data?.coinPackages],
  );
  const displayGiftCatalog = useMemo(
    () => mergeGiftCatalog(catalogQuery.data?.gifts),
    [catalogQuery.data?.gifts],
  );
  const chapterEntitlements = statusQuery.data?.chapterEntitlements ?? [];
  const unlockedChapterKeys = useMemo(
    () => new Set(chapterEntitlements.map((item) => item.chapterKey)),
    [chapterEntitlements],
  );
  const activePlanId = statusQuery.data?.activePlanId ?? "free";
  const billingCycle = statusQuery.data?.billingCycle ?? "monthly";
  const currency =
    catalogQuery.data?.currency ?? statusQuery.data?.currency ?? "USD";
  const coinBalance = statusQuery.data?.coinBalance ?? 0;
  const hasPremium = Boolean(statusQuery.data?.hasPremium);
  const isCatalogReady = !catalogQuery.isLoading && !catalogQuery.error;

  function setNotice(message, options = {}) {
    const nextNotice = {
      message,
      tone: options.tone ?? getNoticeToneFromMessage(message),
    };

    setLastNotice(nextNotice);
    return nextNotice;
  }

  function clearNotice() {
    setLastNotice(null);
  }

  function applyStatusSnapshot(status) {
    if (!status) {
      return null;
    }

    queryClient.setQueryData(monetizationStatusQueryKey, status);

    return status;
  }

  async function invalidateMonetizationState() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["monetization"] }),
      queryClient.invalidateQueries({ queryKey: ["reader", "dashboard"] }),
      queryClient.invalidateQueries({ queryKey: ["reader", "story"] }),
      queryClient.invalidateQueries({ queryKey: ["reader", "chapter"] }),
    ]);
  }

  const createCheckoutSessionMutation = useMutation({
    mutationFn: createMonetizationCheckoutSession,
  });

  const confirmCheckoutSessionMutation = useMutation({
    mutationFn: confirmMonetizationCheckoutSession,
    onSuccess: async (response) => {
      applyStatusSnapshot(response?.status);
      await invalidateMonetizationState();
      const checkoutStatus = response?.checkoutStatus ?? "success";
      const title =
        checkoutStatus === "success"
          ? "Payment successful"
          : checkoutStatus === "pending"
            ? "Payment pending"
            : "Payment failed";
      const tone =
        checkoutStatus === "success"
          ? "success"
          : checkoutStatus === "pending"
            ? "info"
            : "error";

      setNotice(response?.message || "Payment status updated.", { tone });
      showToast(response?.message || "Payment status updated.", {
        title,
        tone,
      });
    },
  });

  const unlockWithCoinsMutation = useMutation({
    mutationFn: unlockChapterWithCoinsApi,
    onSuccess: async (response, variables) => {
      applyStatusSnapshot(response?.status);
      await Promise.all([
        invalidateMonetizationState(),
        queryClient.invalidateQueries({
          queryKey: ["reader", "chapter", variables.storySlug, variables.chapterSlug],
        }),
      ]);
      setNotice(response?.message || "Chapter unlocked.");
      showToast(response?.message || "Chapter unlocked.", {
        title: "Access updated",
      });
    },
  });

  const unlockWithAdMutation = useMutation({
    mutationFn: unlockChapterWithAdApi,
    onSuccess: async (response, variables) => {
      applyStatusSnapshot(response?.status);
      await Promise.all([
        invalidateMonetizationState(),
        queryClient.invalidateQueries({
          queryKey: ["reader", "chapter", variables.storySlug, variables.chapterSlug],
        }),
      ]);
      setNotice(response?.message || "Ad unlock recorded.");
      showToast(response?.message || "Ad unlock recorded.", {
        title: "Access updated",
      });
    },
  });

  const sendGiftMutation = useMutation({
    mutationFn: sendGiftApi,
    onSuccess: async (response) => {
      applyStatusSnapshot(response?.status);
      await invalidateMonetizationState();
      setNotice(response?.message || "Gift sent.");
      showToast(response?.message || "Gift sent.", {
        title: "Support sent",
      });
    },
  });

  function isChapterUnlocked(chapterKey) {
    return hasPremium || unlockedChapterKeys.has(chapterKey);
  }

  function canUnlockWithCoins(cost) {
    return coinBalance >= cost;
  }

  function getDisplayPlan(planId) {
    if (planId === "free") {
      return freePlanTier;
    }

    return displayPlans.find((plan) => plan.id === planId) ?? null;
  }

  function getDisplayCoinPackage(packageId) {
    return displayCoinPackages.find((item) => item.id === packageId) ?? null;
  }

  function hasCatalogProduct(kind, productId) {
    if (kind === "coins") {
      return displayCoinPackages.some((item) => item.id === productId);
    }

    return displayPlans.some((plan) => plan.id === productId);
  }

  async function createCheckoutSession(input) {
    if (!hasCatalogProduct(input.kind, input.productId)) {
      throw new Error(
        input.kind === "coins"
          ? "This coin package is unavailable right now."
          : "This membership plan is unavailable right now.",
      );
    }

    return createCheckoutSessionMutation.mutateAsync({
      ...input,
      idempotencyKey: createIdempotencyKey("checkout", [
        input.kind,
        input.productId,
        input.billing,
      ]),
    });
  }

  async function confirmCheckoutSession(input) {
    return confirmCheckoutSessionMutation.mutateAsync(input);
  }

  async function spendCoinsForChapter(input) {
    return unlockWithCoinsMutation.mutateAsync({
      ...input,
      idempotencyKey: createIdempotencyKey("chapter-unlock", [
        input.storySlug,
        input.chapterSlug,
        "coins",
      ]),
    });
  }

  async function unlockWithAd(input) {
    return unlockWithAdMutation.mutateAsync({
      ...input,
      idempotencyKey: createIdempotencyKey("chapter-unlock", [
        input.storySlug,
        input.chapterSlug,
        "ad",
      ]),
    });
  }

  async function sendGift(input) {
    return sendGiftMutation.mutateAsync({
      ...input,
      idempotencyKey: createIdempotencyKey("gift", [
        input.storySlug,
        input.giftCode,
      ]),
    });
  }

  const value = {
    activePlanId,
    billingCycle,
    canUnlockWithCoins,
    catalogError: catalogQuery.error,
    chapterEntitlements,
    clearNotice,
    coinBalance,
    coinPackages: displayCoinPackages,
    freePlan: freePlanTier,
    confirmCheckoutSession,
    createCheckoutSession,
    currency,
    giftCatalog: displayGiftCatalog,
    hasCatalogProduct,
    getDisplayCoinPackage,
    getDisplayPlan,
    hasPremium,
    isCatalogReady,
    isCatalogLoading: catalogQuery.isLoading,
    isChapterUnlocked,
    isConfirmingCheckout: confirmCheckoutSessionMutation.isPending,
    isCreatingCheckoutSession: createCheckoutSessionMutation.isPending,
    isSendingGift: sendGiftMutation.isPending,
    isStatusLoading: statusQuery.isLoading,
    isUnlockingWithAd: unlockWithAdMutation.isPending,
    isUnlockingWithCoins: unlockWithCoinsMutation.isPending,
    lastNotice,
    plans: displayPlans,
    refreshStatus: statusQuery.refetch,
    sendGift,
    spendCoinsForChapter,
    statusError: statusQuery.error,
    subscription: statusQuery.data?.subscription ?? null,
    unlockWithAd,
  };

  return (
    <MonetizationContext.Provider value={value}>
      {children}
    </MonetizationContext.Provider>
  );
}

export function useMonetization() {
  const context = useContext(MonetizationContext);

  if (!context) {
    throw new Error("useMonetization must be used within a MonetizationProvider");
  }

  return context;
}
