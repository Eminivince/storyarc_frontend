import { lazy } from "react";

const AboutPage = lazy(() => import("../pages/AboutPage"));
const AccountSettingsPage = lazy(() => import("../pages/AccountSettingsPage"));
const AdminActivityLogPage = lazy(() => import("../pages/AdminActivityLogPage"));
const AdminBookDetailsPage = lazy(() => import("../pages/AdminBookDetailsPage"));
const AdminBookManagementPage = lazy(() => import("../pages/AdminBookManagementPage"));
const AdminContractManagementPage = lazy(() =>
  import("../pages/AdminContractManagementPage"),
);
const AdminContractDetailsPage = lazy(() =>
  import("../pages/AdminContractDetailsPage"),
);
const AdminContractEditorPage = lazy(() =>
  import("../pages/AdminContractEditorPage"),
);
const AdminContractTemplatesPage = lazy(() =>
  import("../pages/AdminContractTemplatesPage"),
);
const AdminContentModerationPage = lazy(() =>
  import("../pages/AdminContentModerationPage"),
);
const AdminCreateContractTemplatePage = lazy(() =>
  import("../pages/AdminCreateContractTemplatePage"),
);
const AdminDashboardPage = lazy(() => import("../pages/AdminDashboardPage"));
const AdminMessagingPage = lazy(() => import("../pages/AdminMessagingPage"));
const AdminMonetizationPage = lazy(() => import("../pages/AdminMonetizationPage"));
const AdminSystemSettingsPage = lazy(() =>
  import("../pages/AdminSystemSettingsPage"),
);
const AdminUserDetailsPage = lazy(() => import("../pages/AdminUserDetailsPage"));
const AdminUserManagementPage = lazy(() =>
  import("../pages/AdminUserManagementPage"),
);
const AuthPage = lazy(() => import("../pages/AuthPage"));
const AuthorDashboardPage = lazy(() => import("../pages/AuthorDashboardPage"));
const BillingSettingsPage = lazy(() => import("../pages/BillingSettingsPage"));
const BrowsePage = lazy(() => import("../pages/BrowsePage"));
const ChapterCompletePage = lazy(() => import("../pages/ChapterCompletePage"));
const ChapterEditorPage = lazy(() => import("../pages/ChapterEditorPage"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const CheckoutStatusPage = lazy(() => import("../pages/CheckoutStatusPage"));
const CoinStorePage = lazy(() => import("../pages/CoinStorePage"));
const CreateNewPasswordPage = lazy(() =>
  import("../pages/CreateNewPasswordPage"),
);
const CreatorApplicationPage = lazy(() =>
  import("../pages/CreatorApplicationPage"),
);
const CreatorApplicationSubmittedPage = lazy(() =>
  import("../pages/CreatorApplicationSubmittedPage"),
);
const CreatorOnboardingPage = lazy(() =>
  import("../pages/CreatorOnboardingPage"),
);
const CreateStoryPage = lazy(() => import("../pages/CreateStoryPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const EditProfilePage = lazy(() => import("../pages/EditProfilePage"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage"));
const GenreSelectionPage = lazy(() => import("../pages/GenreSelectionPage"));
const GiftSendingPage = lazy(() => import("../pages/GiftSendingPage"));
const GoogleAuthCallbackPage = lazy(() =>
  import("../pages/GoogleAuthCallbackPage"),
);
const HelpSupportPage = lazy(() => import("../pages/HelpSupportPage"));
const HomePage = lazy(() => import("../pages/HomePage"));
const LeaderboardPage = lazy(() => import("../pages/LeaderboardPage"));
const LockedChapterPage = lazy(() => import("../pages/LockedChapterPage"));
const MfaChooseMethodPage = lazy(() => import("../pages/MfaChooseMethodPage"));
const MfaSetupPage = lazy(() => import("../pages/MfaSetupPage"));
const MfaSuccessPage = lazy(() => import("../pages/MfaSuccessPage"));
const MissionsPage = lazy(() => import("../pages/MissionsPage"));
const NotificationSettingsPage = lazy(() =>
  import("../pages/NotificationSettingsPage"),
);
const PasswordResetSuccessPage = lazy(() =>
  import("../pages/PasswordResetSuccessPage"),
);
const PaymentFailedPage = lazy(() => import("../pages/PaymentFailedPage"));
const PaymentPendingPage = lazy(() => import("../pages/PaymentPendingPage"));
const PaymentSuccessPage = lazy(() => import("../pages/PaymentSuccessPage"));
const PollsAnnouncementsPage = lazy(() =>
  import("../pages/PollsAnnouncementsPage"),
);
const PricingPage = lazy(() => import("../pages/PricingPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const PublishedChaptersPage = lazy(() => import("../pages/PublishedChaptersPage"));
const ReadingPage = lazy(() => import("../pages/ReadingPage"));
const ReaderLibraryPage = lazy(() => import("../pages/ReaderLibraryPage"));
const ReadingPreferencesPage = lazy(() =>
  import("../pages/ReadingPreferencesPage"),
);
const ReferralsPage = lazy(() => import("../pages/ReferralsPage"));
const ReportChapterPage = lazy(() => import("../pages/ReportChapterPage"));
const RewardsPage = lazy(() => import("../pages/RewardsPage"));
const ScheduledChaptersPage = lazy(() =>
  import("../pages/ScheduledChaptersPage"),
);
const SearchResultsPage = lazy(() => import("../pages/SearchResultsPage"));
const SecuritySettingsPage = lazy(() =>
  import("../pages/SecuritySettingsPage"),
);
const StoryDetailsPage = lazy(() => import("../pages/StoryDetailsPage"));
const StoryManagementPage = lazy(() => import("../pages/StoryManagementPage"));
const SubscriptionPage = lazy(() => import("../pages/SubscriptionPage"));
const TermsPage = lazy(() => import("../pages/TermsPage"));
const VerifyCodePage = lazy(() => import("../pages/VerifyCodePage"));
const VolumeManagerPage = lazy(() => import("../pages/VolumeManagerPage"));

export const workingProductSurface = Object.freeze({
  lockReason:
    "The current Stitch-derived page set is the working product surface until real APIs replace the mock contexts.",
  mode: "freeze-current-routes",
});

export const serverBackedContextRoadmap = Object.freeze([
  {
    context: "OnboardingContext",
    futureModules: ["auth", "profiles", "preferences"],
    reason:
      "Genre selection and reading preferences belong to the signed-in user profile.",
  },
  {
    context: "AccountContext",
    futureModules: ["me", "profiles", "notifications", "rewards", "referrals", "mfa"],
    reason:
      "Account profile, notifications, missions, referrals, and MFA must persist per user.",
  },
  {
    context: "MonetizationContext",
    futureModules: [
      "wallet",
      "subscriptions",
      "coin-packages",
      "checkout",
      "entitlements",
      "gifts",
    ],
    reason:
      "Coins, premium access, gifts, and locked chapter entitlements must come from billing APIs.",
  },
  {
    context: "CreatorContext",
    futureModules: [
      "creator-applications",
      "creator-dashboard",
      "stories",
      "chapters",
      "volumes",
      "schedules",
    ],
    reason:
      "Creator state should be backed by studio data, not local mock drafts only.",
  },
  {
    context: "AdminContext",
    futureModules: [
      "admin-users",
      "admin-moderation",
      "admin-messages",
      "admin-settings",
      "admin-activity",
    ],
    reason:
      "Admin actions must operate on shared server state and produce auditable changes.",
  },
]);

export const appRouteGroups = [
  {
    id: "marketing",
    label: "Marketing",
    flow: "Entry funnel into auth and creator interest.",
    routes: [
      { path: "/", component: HomePage, page: "HomePage" },
      { path: "/about", component: AboutPage, page: "AboutPage" },
      { path: "/terms", component: TermsPage, page: "TermsPage" },
    ],
  },
  {
    id: "auth",
    label: "Auth",
    flow: "Sign up, sign in, and password recovery.",
    routes: [
      { path: "/auth", component: AuthPage, page: "AuthPage" },
      {
        path: "/auth/google/callback",
        component: GoogleAuthCallbackPage,
        page: "GoogleAuthCallbackPage",
      },
      {
        path: "/auth/forgot-password",
        component: ForgotPasswordPage,
        page: "ForgotPasswordPage",
      },
      {
        path: "/auth/verify-code",
        component: VerifyCodePage,
        page: "VerifyCodePage",
      },
      {
        path: "/auth/create-new-password",
        component: CreateNewPasswordPage,
        page: "CreateNewPasswordPage",
      },
      {
        path: "/auth/password-reset-success",
        component: PasswordResetSuccessPage,
        page: "PasswordResetSuccessPage",
      },
    ],
  },
  {
    id: "onboarding",
    label: "Onboarding",
    flow: "Personalize the initial reader experience after account creation.",
    routes: [
      {
        path: "/onboarding/genres",
        component: GenreSelectionPage,
        page: "GenreSelectionPage",
      },
      {
        path: "/onboarding/preferences",
        component: ReadingPreferencesPage,
        page: "ReadingPreferencesPage",
      },
    ],
  },
  {
    id: "reader",
    label: "Reader",
    flow: "Dashboard to search, detail, reading, report, completion, and locked access.",
    routes: [
      { path: "/dashboard", component: DashboardPage, page: "DashboardPage" },
      { path: "/browse", component: BrowsePage, page: "BrowsePage" },
      { path: "/library", component: ReaderLibraryPage, page: "ReaderLibraryPage" },
      { path: "/search", component: SearchResultsPage, page: "SearchResultsPage" },
      { path: "/stories/:storySlug", component: StoryDetailsPage, page: "StoryDetailsPage" },
      { path: "/stories/:storySlug/gift", component: GiftSendingPage, page: "GiftSendingPage" },
      { path: "/read/:storySlug/:chapterSlug", component: ReadingPage, page: "ReadingPage" },
      {
        path: "/read/:storySlug/:chapterSlug/complete",
        component: ChapterCompletePage,
        page: "ChapterCompletePage",
      },
      {
        path: "/read/:storySlug/:chapterSlug/locked",
        component: LockedChapterPage,
        page: "LockedChapterPage",
      },
      {
        path: "/read/:storySlug/:chapterSlug/report",
        component: ReportChapterPage,
        page: "ReportChapterPage",
      },
    ],
  },
  {
    id: "account",
    label: "Account",
    flow: "Retention, trust, profile, support, and security tools for active readers.",
    routes: [
      { path: "/account/profile", component: ProfilePage, page: "ProfilePage" },
      {
        path: "/account/profile/edit",
        component: EditProfilePage,
        page: "EditProfilePage",
      },
      {
        path: "/account/notifications",
        component: NotificationSettingsPage,
        page: "NotificationSettingsPage",
      },
      {
        path: "/account/settings",
        component: AccountSettingsPage,
        page: "AccountSettingsPage",
      },
      {
        path: "/account/settings/security",
        component: SecuritySettingsPage,
        page: "SecuritySettingsPage",
      },
      {
        path: "/account/settings/billing",
        component: BillingSettingsPage,
        page: "BillingSettingsPage",
      },
      { path: "/account/help", component: HelpSupportPage, page: "HelpSupportPage" },
      { path: "/account/rewards", component: RewardsPage, page: "RewardsPage" },
      { path: "/account/missions", component: MissionsPage, page: "MissionsPage" },
      { path: "/account/referrals", component: ReferralsPage, page: "ReferralsPage" },
      {
        path: "/account/leaderboard",
        component: LeaderboardPage,
        page: "LeaderboardPage",
      },
      {
        path: "/account/security/mfa",
        component: MfaChooseMethodPage,
        page: "MfaChooseMethodPage",
      },
      {
        path: "/account/security/mfa/setup",
        component: MfaSetupPage,
        page: "MfaSetupPage",
      },
      {
        path: "/account/security/mfa/success",
        component: MfaSuccessPage,
        page: "MfaSuccessPage",
      },
    ],
  },
  {
    id: "monetization",
    label: "Monetization",
    flow: "Plans, coins, and checkout that unlock premium reading paths.",
    routes: [
      { path: "/pricing", component: PricingPage, page: "PricingPage" },
      { path: "/pricing/plan", component: SubscriptionPage, page: "SubscriptionPage" },
      { path: "/coins", component: CoinStorePage, page: "CoinStorePage" },
      { path: "/checkout", component: CheckoutPage, page: "CheckoutPage" },
      {
        path: "/checkout/status",
        component: CheckoutStatusPage,
        page: "CheckoutStatusPage",
      },
      {
        path: "/checkout/success",
        component: PaymentSuccessPage,
        page: "PaymentSuccessPage",
      },
      {
        path: "/checkout/pending",
        component: PaymentPendingPage,
        page: "PaymentPendingPage",
      },
      {
        path: "/checkout/failed",
        component: PaymentFailedPage,
        page: "PaymentFailedPage",
      },
    ],
  },
  {
    id: "creator",
    label: "Creator",
    flow: "Writer onboarding, application, studio, planning, scheduling, and publishing.",
    routes: [
      { path: "/creator", component: CreatorOnboardingPage, page: "CreatorOnboardingPage" },
      {
        path: "/creator/apply",
        component: CreatorApplicationPage,
        page: "CreatorApplicationPage",
      },
      {
        path: "/creator/application-submitted",
        component: CreatorApplicationSubmittedPage,
        page: "CreatorApplicationSubmittedPage",
      },
      {
        path: "/creator/dashboard",
        component: AuthorDashboardPage,
        page: "AuthorDashboardPage",
      },
      {
        path: "/creator/community",
        component: PollsAnnouncementsPage,
        page: "PollsAnnouncementsPage",
      },
      {
        path: "/creator/stories/new",
        component: CreateStoryPage,
        page: "CreateStoryPage",
      },
      {
        path: "/creator/stories/:storySlug",
        component: StoryManagementPage,
        page: "StoryManagementPage",
      },
      {
        path: "/creator/stories/:storySlug/chapters/new",
        component: ChapterEditorPage,
        page: "ChapterEditorPage",
      },
      {
        path: "/creator/stories/:storySlug/structure",
        component: VolumeManagerPage,
        page: "VolumeManagerPage",
      },
      {
        path: "/creator/stories/:storySlug/schedule",
        component: ScheduledChaptersPage,
        page: "ScheduledChaptersPage",
      },
      {
        path: "/creator/stories/:storySlug/published",
        component: PublishedChaptersPage,
        page: "PublishedChaptersPage",
      },
    ],
  },
  {
    id: "admin",
    label: "Admin",
    flow:
      "Operational controls for books, contracts, moderation, users, monetization, settings, activity, and messaging.",
    routes: [
      { path: "/admin", component: AdminDashboardPage, page: "AdminDashboardPage" },
      {
        path: "/admin/books",
        component: AdminBookManagementPage,
        page: "AdminBookManagementPage",
      },
      {
        path: "/admin/books/:bookId",
        component: AdminBookDetailsPage,
        page: "AdminBookDetailsPage",
      },
      {
        path: "/admin/contracts",
        component: AdminContractManagementPage,
        page: "AdminContractManagementPage",
      },
      {
        path: "/admin/contracts/new",
        component: AdminContractEditorPage,
        page: "AdminContractEditorPage",
      },
      {
        path: "/admin/contracts/:contractId",
        component: AdminContractDetailsPage,
        page: "AdminContractDetailsPage",
      },
      {
        path: "/admin/contracts/:contractId/edit",
        component: AdminContractEditorPage,
        page: "AdminContractEditorPage",
      },
      {
        path: "/admin/contracts/templates",
        component: AdminContractTemplatesPage,
        page: "AdminContractTemplatesPage",
      },
      {
        path: "/admin/contracts/templates/new",
        component: AdminCreateContractTemplatePage,
        page: "AdminCreateContractTemplatePage",
      },
      {
        path: "/admin/contracts/templates/:templateId/edit",
        component: AdminCreateContractTemplatePage,
        page: "AdminCreateContractTemplatePage",
      },
      {
        path: "/admin/users",
        component: AdminUserManagementPage,
        page: "AdminUserManagementPage",
      },
      {
        path: "/admin/users/:userId",
        component: AdminUserDetailsPage,
        page: "AdminUserDetailsPage",
      },
      {
        path: "/admin/moderation",
        component: AdminContentModerationPage,
        page: "AdminContentModerationPage",
      },
      {
        path: "/admin/monetization",
        component: AdminMonetizationPage,
        page: "AdminMonetizationPage",
      },
      {
        path: "/admin/messages",
        component: AdminMessagingPage,
        page: "AdminMessagingPage",
      },
      {
        path: "/admin/settings",
        component: AdminSystemSettingsPage,
        page: "AdminSystemSettingsPage",
      },
      {
        path: "/admin/activity",
        component: AdminActivityLogPage,
        page: "AdminActivityLogPage",
      },
    ],
  },
];

export const appRoutes = appRouteGroups.flatMap((group) =>
  group.routes.map((route) => ({
    ...route,
    groupId: group.id,
    groupLabel: group.label,
    flow: group.flow,
  })),
);
