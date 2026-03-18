import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { useSocket, useSocketEvent } from "./SocketContext";
import { updateCurrentUserProfile as updateCurrentUserProfileRequest } from "../auth/authApi";
import {
  claimDailyCheckIn as claimDailyCheckInRequest,
  claimMission as claimMissionRequest,
  fetchEngagementNotifications,
  fetchEngagementOverview,
  markAllNotificationsRead as markAllNotificationsReadRequest,
  markNotificationRead as markNotificationReadRequest,
  shareReferral as shareReferralRequest,
  updateNotificationPreferences as updateNotificationPreferencesRequest,
} from "../engagement/engagementApi";
import {
  initialClaimedMissionIds,
  initialMfa,
  initialNotifications,
  initialRewards,
  missions as initialMissions,
  referralHistory as initialReferralHistory,
  referrals as initialReferrals,
  rewardCalendar as initialRewardCalendar,
  streakRewards as initialStreakRewards,
} from "../data/accountFlow";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const AccountContext = createContext(null);
const defaultProfile = {
  allowMessages: false,
  avatar: null,
  banner: null,
  bio: "",
  contentFiltering: true,
  discord: "",
  displayLanguage: "English (US)",
  displayName: "TaleStead Reader",
  email: "",
  location: "",
  privateLibrary: true,
  showActivity: true,
  tagline: "",
  twitter: "",
  username: "",
  website: "",
};

function cloneNotificationFeedItem(item) {
  return {
    ...item,
    readAt: item.readAt ?? null,
  };
}

function deriveUsername(email = "") {
  return String(email).trim().toLowerCase().split("@")[0] || "";
}

function normalizeOptionalString(value) {
  const normalized = String(value ?? "").trim();
  return normalized ? normalized : null;
}

function buildProfileState(user, overviewProfile) {
  const email = overviewProfile?.email ?? user?.email ?? defaultProfile.email;

  return {
    ...defaultProfile,
    allowMessages: overviewProfile?.allowMessages ?? defaultProfile.allowMessages,
    avatar: overviewProfile?.avatarUrl ?? user?.avatarUrl ?? defaultProfile.avatar,
    bio: overviewProfile?.bio ?? defaultProfile.bio,
    contentFiltering:
      overviewProfile?.contentFiltering ?? defaultProfile.contentFiltering,
    discord: overviewProfile?.discord ?? defaultProfile.discord,
    displayLanguage:
      overviewProfile?.displayLanguage ?? defaultProfile.displayLanguage,
    displayName:
      overviewProfile?.displayName ?? user?.displayName ?? defaultProfile.displayName,
    email,
    location: overviewProfile?.location ?? defaultProfile.location,
    privateLibrary: overviewProfile?.privateLibrary ?? defaultProfile.privateLibrary,
    showActivity: overviewProfile?.showActivity ?? defaultProfile.showActivity,
    tagline: overviewProfile?.tagline ?? defaultProfile.tagline,
    twitter: overviewProfile?.twitter ?? defaultProfile.twitter,
    username: overviewProfile?.username ?? deriveUsername(email),
    website: overviewProfile?.website ?? defaultProfile.website,
  };
}

function mapProfileUpdatePayload(profile) {
  return {
    allowMessages: Boolean(profile.allowMessages),
    bio: normalizeOptionalString(profile.bio),
    contentFiltering: Boolean(profile.contentFiltering),
    discord: normalizeOptionalString(profile.discord),
    displayLanguage:
      normalizeOptionalString(profile.displayLanguage) ??
      defaultProfile.displayLanguage,
    displayName:
      normalizeOptionalString(profile.displayName) ??
      defaultProfile.displayName,
    location: normalizeOptionalString(profile.location),
    privateLibrary: Boolean(profile.privateLibrary),
    showActivity: Boolean(profile.showActivity),
    tagline: normalizeOptionalString(profile.tagline),
    twitter: normalizeOptionalString(profile.twitter),
    website: normalizeOptionalString(profile.website),
  };
}

export function AccountProvider({ children }) {
  const queryClient = useQueryClient();
  const { updateCurrentUser, user } = useAuth();
  const [profile, setProfile] = useState(() => buildProfileState(null, null));
  const [mfa, setMfa] = useState(initialMfa);
  const [lastWheelResult, setLastWheelResult] = useState(null);
  const { showToast } = useToast();
  const { isConnected: socketConnected } = useSocket();
  const engagementQueryKey = ["engagement", "overview", user?.id ?? "guest"];
  const notificationsQueryKey = ["engagement", "notifications", user?.id ?? "guest"];
  const engagementQuery = useQuery({
    queryKey: engagementQueryKey,
    queryFn: fetchEngagementOverview,
    enabled: Boolean(user),
    staleTime: 30 * 60 * 1000,
  });
  const notificationsQuery = useQuery({
    queryKey: notificationsQueryKey,
    queryFn: fetchEngagementNotifications,
    enabled: Boolean(user),
    refetchInterval: user && !socketConnected ? 10_000 : false,
    refetchIntervalInBackground: false,
    staleTime: socketConnected ? 60_000 : 10_000,
  });

  useSocketEvent("notification:new", () => {
    queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
  });

  useEffect(() => {
    if (!user) {
      setProfile(buildProfileState(null, null));
      setMfa(initialMfa);
      return;
    }

    setProfile(buildProfileState(user, engagementQuery.data?.profile ?? null));
  }, [engagementQuery.data?.profile, user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (typeof user.has2FA === "boolean") {
      setMfa((current) => ({
        ...current,
        enabled: user.has2FA,
      }));
    }
  }, [user]);

  const dailyCheckInMutation = useMutation({
    mutationFn: claimDailyCheckInRequest,
  });
  const missionClaimMutation = useMutation({
    mutationFn: claimMissionRequest,
  });
  const shareReferralMutation = useMutation({
    mutationFn: shareReferralRequest,
  });
  const notificationPreferenceMutation = useMutation({
    mutationFn: updateNotificationPreferencesRequest,
  });
  const profileMutation = useMutation({
    mutationFn: updateCurrentUserProfileRequest,
  });
  const markNotificationReadMutation = useMutation({
    mutationFn: markNotificationReadRequest,
  });
  const markAllNotificationsReadMutation = useMutation({
    mutationFn: markAllNotificationsReadRequest,
  });

  const overview = user ? engagementQuery.data : null;
  const notificationSnapshot = user
    ? notificationsQuery.data ?? overview?.notifications ?? null
    : null;
  const currentReading = overview?.currentReading ?? null;
  const rewards = overview?.rewards ?? initialRewards;
  const missions = overview?.missions ?? initialMissions;
  const profileStats = overview?.profileStats ?? [];
  const readingList = overview?.readingList ?? [];
  const recentActivity = overview?.recentActivity ?? [];
  const claimedMissionIds = overview?.claimedMissionIds ?? initialClaimedMissionIds;
  const notifications =
    overview?.notificationPreferences ?? initialNotifications;
  const notificationFeed = (
    notificationSnapshot?.items ?? []
  ).map(cloneNotificationFeedItem);
  const unreadNotificationCount = notificationSnapshot?.unreadCount ?? 0;
  const referrals = overview?.referrals
    ? {
        code: overview.referrals.code,
        mobileCode: overview.referrals.mobileCode,
        rewardLabel: overview.referrals.rewardLabel,
        totalEarned: overview.referrals.totalEarned,
      }
    : initialReferrals;
  const referralHistory =
    overview?.referrals?.history ?? initialReferralHistory;
  const rewardCalendar = overview?.rewardCalendar ?? initialRewardCalendar;
  const streakRewards = overview?.streakRewards ?? initialStreakRewards;

  function showNotice(message, tone = "success") {
    showToast(message, { tone });
  }

  function replaceOverview(nextOverview) {
    queryClient.setQueryData(engagementQueryKey, nextOverview);
  }

  function patchOverview(updater) {
    queryClient.setQueryData(engagementQueryKey, (current) =>
      current ? updater(current) : current,
    );
  }

  function patchNotifications(updater) {
    queryClient.setQueryData(notificationsQueryKey, (current) =>
      current ? updater(current) : current,
    );
  }

  async function refetchOverview() {
    if (!user) {
      return null;
    }

    const nextOverview = await queryClient.fetchQuery({
      queryKey: engagementQueryKey,
      queryFn: fetchEngagementOverview,
    });

    return nextOverview;
  }

  async function updateProfile(nextProfile) {
    if (!user) {
      return null;
    }

    try {
      const response = await profileMutation.mutateAsync(
        mapProfileUpdatePayload(nextProfile),
      );

      if (response.user) {
        updateCurrentUser(response.user);
      }

      if (response.profile) {
        setProfile(buildProfileState(response.user ?? user, response.profile));
        patchOverview((current) =>
          current
            ? {
                ...current,
                profile: response.profile,
              }
            : current,
        );
      }

      const refreshedOverview = await refetchOverview();

      if (refreshedOverview?.profile) {
        setProfile(
          buildProfileState(response.user ?? user, refreshedOverview.profile),
        );
      }

      showNotice(response.message || "Profile updated successfully.");

      return response.profile ?? null;
    } catch (error) {
      showNotice(
        error instanceof Error
          ? error.message
          : "Could not save your profile.",
        "info",
      );
      throw error;
    }
  }

  async function updateNotifications(nextNotifications) {
    const response = await notificationPreferenceMutation.mutateAsync(
      nextNotifications,
    );

    patchOverview((current) => ({
      ...current,
      notificationPreferences: response.notificationPreferences,
    }));
    showNotice("Notification settings saved.");
  }

  function saveNotifications() {
    showNotice("Notification settings saved.");
  }

  async function claimDailyCheckIn() {
    const response = await dailyCheckInMutation.mutateAsync();

    if (response.overview) {
      replaceOverview(response.overview);
    } else {
      await refetchOverview();
    }

    if (response.wheelResult) {
      setLastWheelResult(response.wheelResult);
      return response.wheelResult;
    }

    showNotice(response.message || "Daily check-in claimed.");
    return true;
  }

  async function claimMission(missionId) {
    const response = await missionClaimMutation.mutateAsync(missionId);

    if (response.overview) {
      replaceOverview(response.overview);
    } else {
      await refetchOverview();
    }

    showNotice(response.message || "Mission claimed.");
    return true;
  }

  async function copyValue(label, value) {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      }

      showNotice(`${label} copied.`);
    } catch {
      showNotice(`${label} is ready to copy: ${value}`, "info");
    }
  }

  function recordSupportAction(label) {
    showNotice(`${label} started. Support will meet you there.`);
  }

  function setMfaEnabled(enabled) {
    setMfa((current) => ({
      ...current,
      enabled: Boolean(enabled),
    }));
  }

  async function shareReferral(channel) {
    const response = await shareReferralMutation.mutateAsync({
      channel: channel || "Share Sheet",
    });

    if (response.overview) {
      replaceOverview(response.overview);
    } else {
      await refetchOverview();
    }

    showNotice(response.message || `Referral invite shared via ${channel}.`);
  }

  async function markNotificationRead(notificationId) {
    const response = await markNotificationReadMutation.mutateAsync(
      notificationId,
    );

    patchNotifications((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === notificationId ? response.notification : item,
      ),
      unreadCount: Math.max((current.unreadCount ?? 1) - 1, 0),
    }));
    patchOverview((current) => {
      if (!current?.notifications) {
        return current;
      }

      return {
        ...current,
        notifications: {
          ...current.notifications,
          items: current.notifications.items.map((item) =>
            item.id === notificationId ? response.notification : item,
          ),
          unreadCount: Math.max((current.notifications.unreadCount ?? 1) - 1, 0),
        },
      };
    });
  }

  async function markAllNotificationsRead() {
    await markAllNotificationsReadMutation.mutateAsync();

    patchNotifications((current) => ({
      ...current,
      items: (current.items ?? []).map((item) => ({
        ...item,
        readAt: item.readAt ?? new Date().toISOString(),
      })),
      unreadCount: 0,
    }));
    patchOverview((current) => {
      if (!current?.notifications) {
        return current;
      }

      return {
        ...current,
        notifications: {
          ...current.notifications,
          items: (current.notifications.items ?? []).map((item) => ({
            ...item,
            readAt: item.readAt ?? new Date().toISOString(),
          })),
          unreadCount: 0,
        },
      };
    });
    showNotice("All notifications marked as read.");
  }

  const value = {
    claimDailyCheckIn,
    claimMission,
    claimedMissionIds,
    copyValue,
    currentReading,
    isAccountLoading: Boolean(user) && engagementQuery.isLoading,
    isNotificationsSaving: notificationPreferenceMutation.isPending,
    isProfileSaving: profileMutation.isPending,
    lastWheelResult,
    markAllNotificationsRead,
    markNotificationRead,
    mfa,
    missions,
    notificationFeed,
    notifications,
    profile,
    profileStats,
    recordSupportAction,
    readingList,
    recentActivity,
    referralHistory,
    referrals,
    rewardCalendar,
    rewards,
    saveNotifications,
    setLastWheelResult,
    setMfaEnabled,
    shareReferral,
    showNotice,
    streakRewards,
    unreadNotificationCount,
    updateNotifications,
    updateProfile,
  };

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }

  return context;
}
