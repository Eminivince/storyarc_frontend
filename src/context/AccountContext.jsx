import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { updateCurrentUserProfile as updateCurrentUserProfileRequest } from "../auth/authApi";
import {
  claimDailyCheckIn as claimDailyCheckInRequest,
  claimMission as claimMissionRequest,
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
  const { showToast } = useToast();
  const engagementQueryKey = ["engagement", "overview", user?.id ?? "guest"];
  const engagementQuery = useQuery({
    queryKey: engagementQueryKey,
    queryFn: fetchEngagementOverview,
    enabled: Boolean(user),
    refetchInterval: user ? 30_000 : false,
    refetchIntervalInBackground: false,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (!user) {
      setProfile(buildProfileState(null, null));
      return;
    }

    setProfile(buildProfileState(user, engagementQuery.data?.profile ?? null));
  }, [engagementQuery.data?.profile, user]);

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
    overview?.notifications?.items ?? []
  ).map(cloneNotificationFeedItem);
  const unreadNotificationCount = overview?.notifications?.unreadCount ?? 0;
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

  function setMfaMethod(method) {
    setMfa((current) => ({
      ...current,
      method,
    }));
  }

  function completeMfaSetup() {
    setMfa((current) => ({
      ...current,
      enabled: true,
    }));
    showNotice("Multi-factor authentication is now active.");
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

    patchOverview((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        items: current.notifications.items.map((item) =>
          item.id === notificationId ? response.notification : item,
        ),
        unreadCount: Math.max((current.notifications.unreadCount ?? 1) - 1, 0),
      },
    }));
  }

  async function markAllNotificationsRead() {
    await markAllNotificationsReadMutation.mutateAsync();

    patchOverview((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        items: (current.notifications.items ?? []).map((item) => ({
          ...item,
          readAt: item.readAt ?? new Date().toISOString(),
        })),
        unreadCount: 0,
      },
    }));
    showNotice("All notifications marked as read.");
  }

  const value = {
    claimDailyCheckIn,
    claimMission,
    claimedMissionIds,
    completeMfaSetup,
    copyValue,
    currentReading,
    isAccountLoading: Boolean(user) && engagementQuery.isLoading,
    isNotificationsSaving: notificationPreferenceMutation.isPending,
    isProfileSaving: profileMutation.isPending,
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
    setMfaMethod,
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
