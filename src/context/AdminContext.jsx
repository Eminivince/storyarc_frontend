import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  fetchAdminActivity,
  fetchAdminMessages,
  fetchAdminMonetization,
  fetchAdminOverview,
  fetchAdminReports,
  fetchAdminSettings,
  fetchAdminUserDetails,
  fetchAdminUsers,
  releaseAdminPayout,
  replyAdminMessage,
  resetAdminUserPassword as resetAdminUserPasswordRequest,
  reviewAdminPayout,
  runAdminMaintenance,
  toggleAdminSetting as toggleAdminSettingRequest,
  updateAdminReport,
  updateAdminSetting as updateAdminSettingRequest,
  updateAdminUser as updateAdminUserRequest,
  updateAdminUserStatus as updateAdminUserStatusRequest,
} from "../admin/adminApi";
import { useAuth } from "./AuthContext";

const AdminContext = createContext(null);

const emptyFinancialHealth = {
  achieved: "0%",
  breakdown: [],
  monthlyTarget: "$0.00",
  width: "0%",
};

function getErrorMessage(error, fallbackMessage) {
  return error?.message || fallbackMessage;
}

function getReportActionStatus(actionLabel) {
  const normalized = actionLabel.trim().toLowerCase();

  if (normalized.includes("take")) {
    return "TAKEDOWN";
  }

  if (normalized.includes("dismiss")) {
    return "DISMISSED";
  }

  if (normalized.includes("review")) {
    return "IN_REVIEW";
  }

  return "RESOLVED";
}

export function AdminProvider({ children }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [adminNotice, setAdminNotice] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [userDetailsById, setUserDetailsById] = useState({});
  const isAdmin = user?.role === "ADMIN";
  const queryScope = user?.id ?? "guest";

  const overviewQuery = useQuery({
    enabled: isAdmin,
    queryKey: ["admin", "overview", queryScope],
    queryFn: fetchAdminOverview,
    staleTime: 30_000,
  });
  const usersQuery = useQuery({
    enabled: isAdmin,
    queryKey: ["admin", "users", queryScope],
    queryFn: fetchAdminUsers,
    staleTime: 30_000,
  });
  const reportsQuery = useQuery({
    enabled: isAdmin,
    queryKey: ["admin", "reports", queryScope],
    queryFn: fetchAdminReports,
    staleTime: 15_000,
  });
  const monetizationQuery = useQuery({
    enabled: isAdmin,
    queryKey: ["admin", "monetization", queryScope],
    queryFn: fetchAdminMonetization,
    staleTime: 30_000,
  });
  const settingsQuery = useQuery({
    enabled: isAdmin,
    queryKey: ["admin", "settings", queryScope],
    queryFn: fetchAdminSettings,
    staleTime: 30_000,
  });
  const activityQuery = useQuery({
    enabled: isAdmin,
    queryKey: ["admin", "activity", queryScope],
    queryFn: fetchAdminActivity,
    staleTime: 10_000,
  });
  const messagesQuery = useQuery({
    enabled: isAdmin,
    queryKey: ["admin", "messages", queryScope],
    queryFn: fetchAdminMessages,
    staleTime: 10_000,
  });

  useEffect(() => {
    if (isAdmin) {
      return;
    }

    setAdminNotice(null);
    setSelectedConversationId(null);
    setUserDetailsById({});
  }, [isAdmin]);

  const users = usersQuery.data?.users ?? [];
  const reports = reportsQuery.data?.reports ?? [];
  const settings = settingsQuery.data?.settings ?? [];
  const activityGroups = activityQuery.data?.activityGroups ?? [];
  const conversations = messagesQuery.data?.conversations ?? [];
  const overviewStats = overviewQuery.data?.overviewStats ?? [];
  const financialHealth = overviewQuery.data?.financialHealth ?? emptyFinancialHealth;
  const recentUsers = overviewQuery.data?.recentUsers ?? [];
  const recentReports = overviewQuery.data?.recentReports ?? [];
  const monetizationStats = monetizationQuery.data?.monetizationStats ?? [];
  const monetizationStreams = monetizationQuery.data?.monetizationStreams ?? [];
  const payoutQueue = monetizationQuery.data?.payoutQueue ?? [];
  const topCoinPackages = monetizationQuery.data?.topCoinPackages ?? [];

  useEffect(() => {
    if (!conversations.length) {
      setSelectedConversationId(null);
      return;
    }

    setSelectedConversationId((currentId) => {
      if (currentId && conversations.some((conversation) => conversation.id === currentId)) {
        return currentId;
      }

      return conversations[0]?.id ?? null;
    });
  }, [conversations]);

  function clearAdminNotice() {
    setAdminNotice(null);
  }

  function showAdminNotice(message, tone = "success") {
    setAdminNotice({
      message,
      tone,
    });
  }

  function syncUserCache(nextUser) {
    if (!nextUser?.id) {
      return;
    }

    setUserDetailsById((current) => ({
      ...current,
      [nextUser.id]: nextUser,
    }));
  }

  function invalidateAdminQueries(keys) {
    keys.forEach((key) => {
      queryClient.invalidateQueries({
        queryKey: key,
      });
    });
  }

  async function loadUserDetails(userId) {
    if (!userId || !isAdmin) {
      return null;
    }

    const response = await fetchAdminUserDetails(userId);

    syncUserCache(response.user);
    return response.user;
  }

  function getUser(userId) {
    return userDetailsById[userId] ?? users.find((item) => item.id === userId) ?? null;
  }

  const updateUserMutation = useMutation({
    mutationFn: ({ input, userId }) => updateAdminUserRequest(userId, input),
    onError: (error) => {
      showAdminNotice(
        getErrorMessage(error, "Could not save the user profile."),
        "info",
      );
    },
    onSuccess: (response) => {
      syncUserCache(response.user);
      showAdminNotice(response.message || "User profile saved.");
      invalidateAdminQueries([
        ["admin", "users"],
        ["admin", "overview"],
        ["admin", "activity"],
      ]);
    },
  });

  const updateUserStatusMutation = useMutation({
    mutationFn: ({ action, userId }) =>
      updateAdminUserStatusRequest(userId, action),
    onError: (error) => {
      showAdminNotice(
        getErrorMessage(error, "Could not update that user status."),
        "info",
      );
    },
    onSuccess: (response) => {
      syncUserCache(response.user);
      showAdminNotice(response.message || "User status updated.", "info");
      invalidateAdminQueries([
        ["admin", "users"],
        ["admin", "overview"],
        ["admin", "activity"],
      ]);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetAdminUserPasswordRequest,
    onError: (error) => {
      showAdminNotice(
        getErrorMessage(error, "Could not trigger a password reset."),
        "info",
      );
    },
    onSuccess: (response) => {
      showAdminNotice(response.message || "Password reset email sent.");
      invalidateAdminQueries([["admin", "activity"]]);
    },
  });

  const resolveReportMutation = useMutation({
    mutationFn: ({ input, reportId }) => updateAdminReport(reportId, input),
    onError: (error) => {
      showAdminNotice(
        getErrorMessage(error, "Could not update that moderation item."),
        "info",
      );
    },
    onSuccess: (response) => {
      showAdminNotice(response.message || "Moderation item updated.");
      invalidateAdminQueries([
        ["admin", "reports"],
        ["admin", "overview"],
        ["admin", "activity"],
      ]);
    },
  });

  const toggleSettingMutation = useMutation({
    mutationFn: toggleAdminSettingRequest,
    onError: (error) => {
      showAdminNotice(
        getErrorMessage(error, "Could not update that setting."),
        "info",
      );
    },
    onSuccess: (response) => {
      showAdminNotice(response.message || "Setting updated.");
      invalidateAdminQueries([
        ["admin", "settings"],
        ["admin", "overview"],
        ["admin", "activity"],
      ]);
    },
  });

  const updateSettingValueMutation = useMutation({
    mutationFn: ({ settingId, valueCents }) =>
      updateAdminSettingRequest(settingId, { valueCents }),
    onError: (error) => {
      showAdminNotice(
        getErrorMessage(error, "Could not update that setting value."),
        "info",
      );
    },
    onSuccess: (response) => {
      showAdminNotice(response.message || "Setting updated.");
      invalidateAdminQueries([
        ["admin", "settings"],
        ["admin", "overview"],
        ["admin", "activity"],
      ]);
    },
  });

  const maintenanceMutation = useMutation({
    mutationFn: runAdminMaintenance,
    onError: (error) => {
      showAdminNotice(
        getErrorMessage(error, "Could not start that maintenance action."),
        "info",
      );
    },
    onSuccess: (response) => {
      showAdminNotice(response.message || "Maintenance action started.");
      invalidateAdminQueries([["admin", "activity"]]);
    },
  });

  const releasePayoutMutation = useMutation({
    mutationFn: releaseAdminPayout,
    onError: (error) => {
      showAdminNotice(
        getErrorMessage(error, "Could not release that payout."),
        "info",
      );
    },
    onSuccess: (response) => {
      showAdminNotice(response.message || "Payout release started.");
      invalidateAdminQueries([
        ["admin", "monetization"],
        ["admin", "activity"],
      ]);
    },
  });

  const reviewPayoutMutation = useMutation({
    mutationFn: reviewAdminPayout,
    onError: (error) => {
      showAdminNotice(
        getErrorMessage(error, "Could not open payout review."),
        "info",
      );
    },
    onSuccess: (response) => {
      showAdminNotice(response.message || "Payout review opened.", "info");
      invalidateAdminQueries([
        ["admin", "monetization"],
        ["admin", "activity"],
      ]);
    },
  });

  const replyMessageMutation = useMutation({
    mutationFn: ({ body, ticketId }) => replyAdminMessage(ticketId, body),
    onError: (error) => {
      showAdminNotice(
        getErrorMessage(error, "Could not send that reply."),
        "info",
      );
    },
    onSuccess: (response) => {
      showAdminNotice(response.message || "Reply sent.");
      invalidateAdminQueries([
        ["admin", "messages"],
        ["admin", "activity"],
      ]);
    },
  });

  function saveUser(userId, nextFields) {
    updateUserMutation.mutate({
      input: nextFields,
      userId,
    });

    return true;
  }

  function changeUserRole(userId, role) {
    const userRecord = getUser(userId);

    if (!userRecord) {
      return false;
    }

    saveUser(userId, {
      bio: userRecord.bio ?? "",
      displayName: userRecord.displayName,
      email: userRecord.email,
      location: userRecord.location ?? "",
      role,
    });
    return true;
  }

  function suspendUser(userId) {
    const userRecord = getUser(userId);

    if (!userRecord) {
      return false;
    }

    updateUserStatusMutation.mutate({
      action: userRecord.status === "Suspended" ? "RESTORE" : "SUSPEND",
      userId,
    });
    return true;
  }

  function deleteUser(userId) {
    const userRecord = getUser(userId);

    if (!userRecord) {
      return false;
    }

    updateUserStatusMutation.mutate({
      action: "DELETE",
      userId,
    });
    return true;
  }

  function resetUserPassword(userId) {
    resetPasswordMutation.mutate(userId);
    return true;
  }

  function resolveModerationItem(itemId, actionLabel = "Resolved") {
    resolveReportMutation.mutate({
      input: {
        action: getReportActionStatus(actionLabel),
        notes: null,
      },
      reportId: itemId,
    });
    return true;
  }

  function toggleSystemSetting(settingId) {
    toggleSettingMutation.mutate(settingId);
    return true;
  }

  function updateSystemSetting(settingId, valueCents) {
    updateSettingValueMutation.mutate({
      settingId,
      valueCents,
    });
    return true;
  }

  function runMaintenanceAction(actionId) {
    maintenanceMutation.mutate(actionId);
    return true;
  }

  function selectConversation(conversationId) {
    setSelectedConversationId(conversationId);
  }

  function sendMessage(message, conversationId) {
    const trimmed = message.trim();

    if (!trimmed || !conversationId) {
      return false;
    }

    replyMessageMutation.mutate({
      body: trimmed,
      ticketId: conversationId,
    });
    return true;
  }

  function releasePayout(payoutId) {
    releasePayoutMutation.mutate(payoutId);
    return true;
  }

  function reviewPayout(payoutId) {
    reviewPayoutMutation.mutate(payoutId);
    return true;
  }

  const selectedConversation = useMemo(
    () =>
      conversations.find((conversation) => conversation.id === selectedConversationId) ??
      conversations[0] ??
      null,
    [conversations, selectedConversationId],
  );

  const value = {
    activityGroups,
    adminNotice,
    changeUserRole,
    clearAdminNotice,
    conversations,
    deleteUser,
    financialHealth,
    getUser,
    isAdminReady:
      !isAdmin ||
      (!overviewQuery.isPending &&
        !usersQuery.isPending &&
        !reportsQuery.isPending &&
        !monetizationQuery.isPending),
    isLoadingActivity: activityQuery.isPending,
    isLoadingConversations: messagesQuery.isPending,
    isLoadingMonetization: monetizationQuery.isPending,
    isLoadingOverview: overviewQuery.isPending,
    isLoadingReports: reportsQuery.isPending,
    isLoadingSettings: settingsQuery.isPending,
    isLoadingUsers: usersQuery.isPending,
    loadUserDetails,
    monetizationStats,
    monetizationStreams,
    overviewStats,
    payoutQueue,
    recentReports,
    recentUsers,
    releasePayout,
    reports,
    resolveModerationItem,
    resetUserPassword,
    reviewPayout,
    runMaintenanceAction,
    saveUser,
    selectConversation,
    selectedConversation,
    selectedConversationId,
    sendMessage,
    settings,
    showAdminNotice,
    suspendUser,
    toggleSystemSetting,
    topCoinPackages,
    updateSystemSetting,
    users,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }

  return context;
}
