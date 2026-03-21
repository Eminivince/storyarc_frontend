import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { useSocketEvent } from "./SocketContext";
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
  unlockChapterBatchWithCoinsApi,
  cancelSubscriptionApi,
  sendGiftApi,
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

export function MonetizationProvider({ children }) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

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

  useSocketEvent("wallet:updated", () => {
    queryClient.invalidateQueries({ queryKey: monetizationStatusQueryKey });
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
  const checkoutProvider =
    catalogQuery.data?.checkoutProvider ??
    statusQuery.data?.checkoutProvider ??
    "paystack";
  const coinBalance = statusQuery.data?.coinBalance ?? 0;
  const hasPremium = Boolean(statusQuery.data?.hasPremium);
  const accountTier = statusQuery.data?.subscription?.planName ?? "Free";
  const isCatalogReady = !catalogQuery.isLoading && !catalogQuery.error;

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
      queryClient.invalidateQueries({ queryKey: ["reader", "dashboard-personalization"] }),
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
      showToast(response?.message || "Chapter unlocked.", {
        title: "Access updated",
      });
    },
  });

  const unlockBatchWithCoinsMutation = useMutation({
    mutationFn: unlockChapterBatchWithCoinsApi,
    onSuccess: async (response, variables) => {
      applyStatusSnapshot(response?.status);
      await Promise.all([
        invalidateMonetizationState(),
        queryClient.invalidateQueries({
          queryKey: ["reader", "chapter", variables.storySlug, variables.chapterSlug],
        }),
      ]);
      showToast(response?.message || "Chapters unlocked.", {
        title: "Access updated",
      });
    },
  });

  const sendGiftMutation = useMutation({
    mutationFn: sendGiftApi,
    onSuccess: async (response) => {
      applyStatusSnapshot(response?.status);
      await invalidateMonetizationState();
      showToast(response?.message || "Gift sent.", {
        title: "Support sent",
      });
    },
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: cancelSubscriptionApi,
    onSuccess: async (response) => {
      applyStatusSnapshot(response?.status);
      await invalidateMonetizationState();
      showToast(response?.message || "Subscription cancellation scheduled.", {
        title: "Subscription updated",
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

  async function spendCoinsForChapterBatch(input) {
    return unlockBatchWithCoinsMutation.mutateAsync({
      ...input,
      idempotencyKey: createIdempotencyKey("chapter-batch-unlock", [
        input.storySlug,
        input.chapterSlug,
        input.mode,
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

  async function cancelSubscription() {
    return cancelSubscriptionMutation.mutateAsync();
  }

  const value = {
    accountTier,
    activePlanId,
    billingCycle,
    cancelSubscription,
    canUnlockWithCoins,
    catalogError: catalogQuery.error,
    chapterEntitlements,
    checkoutProvider,
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
    isCancellingSubscription: cancelSubscriptionMutation.isPending,
    isConfirmingCheckout: confirmCheckoutSessionMutation.isPending,
    isCreatingCheckoutSession: createCheckoutSessionMutation.isPending,
    isSendingGift: sendGiftMutation.isPending,
    isStatusLoading: statusQuery.isLoading,
    isUnlockingBatchWithCoins: unlockBatchWithCoinsMutation.isPending,
    isUnlockingWithCoins: unlockWithCoinsMutation.isPending,
    plans: displayPlans,
    refreshStatus: statusQuery.refetch,
    sendGift,
    spendCoinsForChapter,
    spendCoinsForChapterBatch,
    statusError: statusQuery.error,
    subscription: statusQuery.data?.subscription ?? null,
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
