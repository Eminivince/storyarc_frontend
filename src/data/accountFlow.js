import { adminDashboardHref } from "./adminFlow";

export const profileHref = "/account/profile";
export const editProfileHref = "/account/profile/edit";
export const notificationsHref = "/account/notifications";
export const notificationSettingsHref = "/account/settings/notifications";
export const accountSettingsHref = "/account/settings";
export const securitySettingsHref = "/account/settings/security";
export const billingSettingsHref = "/account/settings/billing";
export const helpHref = "/account/help";
export const rewardsHref = "/account/rewards";
export const missionsHref = "/account/missions";
export const referralsHref = "/account/referrals";
export const leaderboardHref = "/account/leaderboard";
export const mfaChooseHref = "/account/security/mfa";
export const mfaSetupHref = "/account/security/mfa/setup";
export const mfaSuccessHref = "/account/security/mfa/success";

export const accountAvatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBrufI0Of3xcMR30t_ex69yPWVBNZhxZ8w8Hsjn5AoRt6jj9UZ5qKiWKVsB1NOMFEjv_WH10e8VvR-TDveyOzK_DJ0w_ic77CgUOPakDoA-7S-hstqsfMAZCpudD2MrNqJOxDmAL6-xJ5rsWrfKvpqHJv5J13EkyfnMo6Txy9MD8luaFTiagopZ7BDg7RpqtxPyQpZT63Q3vJ5JQm-VgEk2Hu5zTvR-3UG7ssu-9TFEvhWCt1yOm1B2Fc7-fwDKj9JU_OW36I3jcIY";

export const profileTabs = ["Library", "My Stories", "Badges", "Social"];

export const initialNotifications = {
  emailNewComments: true,
  emailWeeklyDigest: true,
  emailSecurityAlerts: true,
  emailMarketing: false,
  pushNewStories: true,
  pushDirectMessages: false,
  pushStoryComments: true,
  pushCommentReplies: true,
  appAchievements: true,
  appSystemUpdates: true,
  appStreakAlerts: true,
  appMaintenance: true,
};

export const notificationSections = [
  {
    id: "email",
    title: "Email Notifications",
    icon: "mail",
    items: [
      {
        key: "emailNewComments",
        title: "New Comment Alerts",
        description: "Get notified when someone comments on your story",
      },
      {
        key: "emailWeeklyDigest",
        title: "Weekly Digest",
        description: "A summary of your stories' performance",
      },
      {
        key: "emailSecurityAlerts",
        title: "Account Security Alerts",
        description: "Essential alerts about logins from new devices and password changes.",
        locked: true,
      },
      {
        key: "emailMarketing",
        title: "Marketing & Promotions",
        description: "Stay informed about upcoming sales, events, and new features.",
      },
    ],
  },
  {
    id: "push",
    title: "Push Notifications",
    icon: "notifications_active",
    items: [
      {
        key: "pushNewStories",
        title: "New Story Published",
        description: "Immediate alert when authors you follow post",
      },
      {
        key: "pushDirectMessages",
        title: "Direct Messages",
        description: "Notifications for new private messages",
      },
      {
        key: "pushStoryComments",
        title: "New Comments on Your Stories",
        description: "Get notified immediately when readers leave feedback on your work.",
      },
      {
        key: "pushCommentReplies",
        title: "Replies to Your Comments",
        description: "Receive a ping when someone responds to your community discussions.",
      },
    ],
  },
  {
    id: "app",
    title: "In-App Alerts",
    icon: "notification_important",
    items: [
      {
        key: "appAchievements",
        title: "Achievement Unlocked",
        description: "Visual badges when you reach milestones",
      },
      {
        key: "appStreakAlerts",
        title: "Daily Reading Streak",
        description: "Reminders to keep your reading streak alive and earn rewards.",
      },
      {
        key: "appSystemUpdates",
        title: "System Updates",
        description: "Important maintenance and feature news",
      },
      {
        key: "appMaintenance",
        title: "System Maintenance",
        description: "Alerts about planned downtime or scheduled updates.",
      },
    ],
  },
];

export const accountSettingsTabs = [
  {
    id: "account",
    label: "Account",
    href: accountSettingsHref,
    icon: "person",
  },
  {
    id: "notification-settings",
    label: "Alerts",
    href: notificationSettingsHref,
    icon: "notifications_active",
  },
  {
    id: "security",
    label: "Security",
    href: securitySettingsHref,
    icon: "security",
  },
  {
    id: "billing",
    label: "Billing",
    href: billingSettingsHref,
    icon: "credit_card",
  },
];

export const linkedAccounts = [
  {
    id: "facebook",
    label: "Facebook",
    icon: "social_leaderboard",
    accent: "text-[#1877F2]",
    status: "Linked",
  },
  {
    id: "google",
    label: "Google",
    icon: "google",
    status: "Connect",
  },
];

export const displayLanguages = [
  "English (US)",
  "Spanish",
  "French",
  "German",
];

export const securityCheckItems = [
  {
    label: "Password strength",
    detail: "Strong and last updated 24 days ago",
  },
  {
    label: "2FA coverage",
    detail: "Add an authenticator app to protect premium purchases.",
  },
  {
    label: "Session review",
    detail: "You have 3 active devices in the last 7 days.",
  },
];

export const securitySessions = [
  {
    id: "current-device",
    device: "Chrome on macOS",
    location: "San Francisco, CA",
    lastActive: "Current Device",
    icon: "desktop_windows",
    current: true,
  },
  {
    id: "iphone",
    device: "Safari on iPhone 15",
    location: "Oakland, CA",
    lastActive: "Last active 2 hours ago",
    icon: "smartphone",
  },
  {
    id: "tablet",
    device: "iPad Reader App",
    location: "Remote session",
    lastActive: "Last active yesterday",
    icon: "tablet_mac",
  },
];

export const billingUsage = {
  used: 74,
  usedLabel: "74 GB used",
  totalLabel: "100 GB included",
};

export const paymentMethods = [
  {
    id: "visa",
    label: "Visa ending in 4242",
    detail: "Expires 10/2028",
    icon: "credit_card",
    primary: true,
  },
  {
    id: "cryptomus",
    label: "Cryptomus",
    detail: "Hosted crypto checkout",
    icon: "currency_bitcoin",
  },
];

export const initialRewards = {
  points: 2450,
  weeklyEarned: 250,
  streakDays: 5,
  checkedInToday: false,
  streakMultiplier: 1,
  streakShields: 0,
  nextMultiplierAt: 3,
  readerTitle: "New Reader",
};

export const rewardCalendar = {
  month: "October 2023",
  completedDays: [1, 2, 3, 4],
  today: 5,
  rewardDays: [10, 17],
};

export const streakRewards = [
  {
    title: "7 Day Streak",
    reward: "+200 Bonus",
    icon: "local_fire_department",
    unlocked: true,
  },
  {
    title: "14 Day Streak",
    reward: "+500 Bonus",
    icon: "lock",
    unlocked: false,
  },
  {
    title: "30 Day Streak",
    reward: "Mystery Box",
    icon: "card_giftcard",
    unlocked: false,
  },
];

export const missions = [
  {
    id: "daily-check-in",
    group: "Daily",
    title: "Daily Check-in",
    description: "Check in today to keep your reward streak alive.",
    icon: "event_available",
    reward: 50,
    current: 0,
    target: 1,
    type: "claim",
    actionLabel: "Claim",
  },
  {
    id: "deep-dive",
    group: "Reader",
    title: "Deep Dive",
    description: "Read 3 chapters of any featured story today.",
    icon: "menu_book",
    reward: 50,
    current: 1,
    target: 3,
    type: "link",
    href: "/read/wolvex/chapter-12",
    actionLabel: "Go",
  },
  {
    id: "active-critic",
    group: "Reader",
    title: "Active Critic",
    description: "Post a supportive comment on a new author's work.",
    icon: "chat_bubble",
    reward: 25,
    current: 1,
    target: 1,
    type: "claim",
    actionLabel: "Claim",
  },
  {
    id: "share-results",
    group: "Daily",
    title: "Share Results",
    description: "Share a reward or invite with your friends.",
    icon: "share",
    reward: 25,
    current: 1,
    target: 1,
    type: "claim",
    actionLabel: "Claim",
  },
  {
    id: "writer-flow",
    group: "Author",
    title: "Writer's Flow",
    description: "Write 1,000 words today to maintain your streak.",
    icon: "history_edu",
    reward: 150,
    current: 750,
    target: 1000,
    type: "link",
    href: "/creator",
    actionLabel: "Write",
  },
  {
    id: "profile-complete",
    group: "Quick",
    title: "Complete Profile",
    description: "Finish your public profile and unlock trust badges.",
    icon: "check_circle",
    reward: 100,
    current: 1,
    target: 1,
    type: "completed",
    actionLabel: "Done",
  },
];

export const initialClaimedMissionIds = ["profile-complete"];

export const referrals = {
  code: "ARC-WEAVER-77",
  mobileCode: "GOLD-VIP-99",
  rewardLabel: "500 Arc Points",
  totalEarned: 1500,
};

export const referralHistory = [
  {
    name: "Elena M.",
    joined: "Joined Oct 24, 2023",
    status: "completed",
    reward: "+500 Arc Points",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBPg18XdUkQFoENYwGOEpv7ycxq7ZvoZ3IK6bbnZ32s9ofeEig0aIqmtnozATtRR1MecWtcD4yJOn_dypHmASCY_8P47Z2_cpQnH-3BhFb-YAahyXYTkujY_3KGmGiVajrtt-W-aPyGVBjLZE1F3fYXkx2KMthUDaH9QNccwdDY2GkytX83kjG3k_yrRUoB1YxbH2xu4lUAzkoEokjW09kl62l8btGkEdr9WwkJ3odkCjNQRAh9WZ_u9vV6tqgLO44OhQsedozPGvU",
  },
  {
    name: "Silas Thorne",
    joined: "Joined Oct 20, 2023",
    status: "completed",
    reward: "+500 Arc Points",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDavQ538CaQs7rj9qc5hhbhJbqMp9UQnKMKDjjEeELRPdnHYBitF2dmIBybEn0BCVXhoR2D7vf3EKn9dkhmwzZgrSFuzVK5SHpiH-OdydcY4vuso8TG_txMYGvoDis_GUPM9PWpkAEReT3QL5PFqo1WfDBL-DUBGtzZ0G-gme9Y2qyYwG1wjUhBPWcHW-R4cl_6HCxq-OepyUKKN3qrWu-jpw_c43cXYhje5wGEOWT8COsmEbwDl1R-q5atFvXQVmkRO7aSK1MiBCY",
  },
  {
    name: "Lyra Vance",
    joined: "Joined Oct 18, 2023",
    status: "pending",
    reward: "Processing...",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCnSwCVKUWMhW7cS9bht5HO22gmXjqNf_CQw_PeKf5YLNVb3418mpTVggZmonrSYA7-tMkPWv3JO45UT5yV8D7diIxLgioGQYxScDOKnzhIpkD4_Q8b3djJ1YtdECnR0jSpWmcM95IN_EYsAcquoy3TfXdIYONL68-9XzbZ_MOzcvB-cTFNcMRnxt3tOeyZGDCJ-CAkw4Eb0IWsMEfCgK5Lt-mU9tUdsAg5WBHpZnLC6VwJoYYYtS2kYdHeROEzh8nX9MG7RAhDMS0",
  },
  {
    name: "Jax Miller",
    joined: "Joined Oct 12, 2023",
    status: "completed",
    reward: "+500 Arc Points",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJke_YKF5VKlyMUYdR2p6zTMiTAbE1j3GMiJsruAFFnZKsKs4dVLgulANNS32oLH7j4x36O-K8VMcyeN1WR-ZL5WdLXHe38vX9vlZ8CKLBq5-kvz2boe0cwi-hkLKlYmShHbDRXC5YgFbzYEM0ed1r0S11nqu_TO7nHNWchHoFBKdml8t8Rg3cnhJBp5s8sIRpygce4YKLmnPxuMH7vKquZLNjYC4DlQHkcHmeXoAa1UgZJi8QPpvl-RHGyo763Wc0a0gWpxPCN80",
  },
];

export const leaderboard = {
  tabs: ["Weekly", "Monthly", "All-Time"],
  podium: [
    {
      rank: 2,
      name: "LunarWriter",
      points: "12,450 Arc Points",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDYNtgpLl0l9cu3HBv1gXZH_Fmy9D-hyl0LldsqhamR_fWq-JbYNTekFa7mLkKfVziYNkbgq6cOC8267IcPnmhFllCScRC422X8jtpGCzW0l-e_Pf6zldS4EfTCd2PVgi38S4M_omArBoDds00uhdmIYtDlU3c2ChrWUiAr87WZf5WugWlUXl_1B0edZNzejv6jP2o_2rNFQAUOz9WTk0DfGBLZgnqpbV6G71nc3CRA9yJXQnapFSrGpYJeUplK02Ws3JxpASf0NCY",
    },
    {
      rank: 1,
      name: "Nova_Reader",
      points: "15,820 Arc Points",
      image: accountAvatar,
    },
    {
      rank: 3,
      name: "TaleSeeker",
      points: "10,120 Arc Points",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDn7hGPikC6wXzVvX-J5Saly41piO37-DMkcjONI8Dh4w8CiD22jTRTmRZlQOkp8dIQbC5tNqFNjn98A91Ozb8CV8XDZyQXN5NmxxNlXLYI7MaaOLzysBPd9-nVIbwBt_pLqHEcWo5GoTg8uQqtHCtGDAnm3-_I_JWns7I8GmtKs5-KllQzq4BKe0rwkDn178NnX1HCacGGPeYfSQwuZDb5wPuDxtJJQJ-vi8qnSOvzfM5H3bQz57WhnJnGkSv024Ic-jrRggGNapo",
    },
  ],
  userRank: {
    rank: 42,
    name: "You (Alex_Reads)",
    subtitle: "Level 42 Storyteller • Top 5% this week",
    points: "2,450 pts",
    mobileSubtitle: "Silver Tier • Top 15%",
  },
  entries: [
    { rank: 4, name: "MidnightBard", tier: "89", points: "9,420", image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBZZ7Z1xEoOKFoVuINJJRakfTjT1VmGNGgrqyqqlYXCFquzdXOKZz8oM8RD7L3WyaA6At3o7o1AYbqJmb6ingTHwh2qWSfSWtcNVxiNvicNg9DTY78YBpnqgK-_izJgiFZhh7DoICApICW0IGjVXBuaU4PhOv1yX7pGhTMrryHIo7EB1xqDKeBS-_Cg-MavPDowYUXdYKgAOBDSYK2Ue7QNi_U27V_KjpujJrC65ouKqHgsf72-Kqzow_EFt_VlBUCXyQpJZHufR2w" },
    { rank: 5, name: "InkDrinker", tier: "85", points: "8,950", image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA9zdZlbOhEAmDduqe-w3cNs5DjI2Dzle2HPUrLcJ16wot5UKt0AtX5TAKCYBiNOIjq99n7gnumDhMzkp-juuYaAVSRBQSRM1auOSxKh8-4gyk5lYq0aLhy5ro-twy3NKbLt2XUQWvk15rkjy9fkorW7sSefrmML4H7LhIIthtOZpjKLuGHogdXKq-V_CqZTRNVZEfcaotlhH5bT0d7r08wOFBR2cJ_QtuO59bpVtSHfXXfgTMYIK-JDjIPMTT5wOeCbIr52OMONXA" },
    { rank: 6, name: "Laila Omar", tier: "Gold Tier", points: "8,900", image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsY7h3gzqOdNbkOAhDPVGQmQrdopHgtaFfqikAhjvciXW3uJMuwC8GtmFWzW9bQQoDaA1X1qRQT2UCSTMZAI5-MeDEpaCrkpurg1C94AARH4guLmfAqcP2BusPnNeA1FoDsRR6ldQ5TxOt7FKst8YS4NiIKzcR4mt_OKI4KE_FJqX-TKdsfLbzOqWiBw-4KuwiubSXeBfyxq448FP-WYB9mhDWbf0ix5Pu-xrbBS_FrscHwwFkkdtWaxYX7Wu3YMn7ANQeMvi-k-Y" },
    { rank: 7, name: "Tom Harris", tier: "Gold Tier", points: "8,150", image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAuEyTjxCmOn5ow_6ZpOayyRZRRi89H5nmeTQkKupd_2Y-XA433XvUrV3Namr1c3xpLFvQcK3EaazcspkAIX0CKs3HN6UG4iMOUpSNWN8Qv8gC0vLT9vo4AiiYC3TnTSE3W1HNMCa1c5pWRFpI52nUdGZINe3abe2YgTAJMGep-lDRq1keGU1V9PtCaULFtqEyHOFBJJbLVHotTOKFl0XCh27D1Q1eHCaTNLqnJgcssEhArS99Ve_6CA3crtZ8OcikgDAFEa4ONTD4" },
  ],
};

export const initialMfa = {
  method: "app",
  enabled: false,
  secret: "",
  recoveryCodes: [],
};

export const mfaMethods = [
  {
    id: "app",
    title: "Authenticator App",
    description:
      "Use Google Authenticator, Authy, or Microsoft Authenticator to generate codes.",
    icon: "shield_lock",
    badge: "Recommended",
  },
  {
    id: "sms",
    title: "SMS / Text Message",
    description:
      "We'll send a one-time security code to your registered phone number.",
    icon: "sms",
  },
];

export const referralShareChannels = [
  { label: "WhatsApp", icon: "chat" },
  { label: "Twitter X", icon: "send" },
  { label: "Email", icon: "mail" },
  { label: "Others", icon: "more_horiz" },
];

export const accountQuickLinks = [
  { label: "Account Settings", href: accountSettingsHref, icon: "settings" },
  { label: "Notifications", href: notificationsHref, icon: "notifications" },
  { label: "Billing", href: billingSettingsHref, icon: "credit_card" },
  { label: "Admin Console", href: adminDashboardHref, icon: "admin_panel_settings" },
  { label: "Help & Support", href: helpHref, icon: "help" },
  { label: "Rewards Hub", href: rewardsHref, icon: "military_tech" },
  { label: "Referrals", href: referralsHref, icon: "share" },
  { label: "Leaderboard", href: leaderboardHref, icon: "emoji_events" },
  { label: "MFA Security", href: mfaChooseHref, icon: "verified_user" },
];
