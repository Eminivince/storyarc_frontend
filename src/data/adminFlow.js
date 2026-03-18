export const adminDashboardHref = "/admin";
export const adminBooksHref = "/admin/books";
export const adminContractsHref = "/admin/contracts";
export const adminNewContractHref = "/admin/contracts/new";
export const adminContractTemplatesHref = "/admin/contracts/templates";
export const adminCreateContractTemplateHref = "/admin/contracts/templates/new";
export const adminUsersHref = "/admin/users";
export const adminModerationHref = "/admin/moderation";
export const adminMonetizationHref = "/admin/monetization";
export const adminMessagesHref = "/admin/messages";
export const adminHelpCenterHref = "/admin/help-center";
export const adminSettingsHref = "/admin/settings";
export const adminActivityHref = "/admin/activity";

export function buildAdminUserDetailsHref(userId) {
  return `/admin/users/${userId}`;
}

export function buildAdminBookDetailsHref(bookId) {
  return `/admin/books/${bookId}`;
}

export function buildAdminContractDetailsHref(contractId = "contract-id") {
  return `/admin/contracts/${contractId}`;
}

export function buildAdminContractEditHref(contractId = "contract-id") {
  return `/admin/contracts/${contractId}/edit`;
}

export function buildAdminContractTemplateEditHref(templateId = "template-id") {
  return `/admin/contracts/templates/${templateId}/edit`;
}

export const adminQuickLinks = [
  {
    title: "Book Management",
    detail: "Control visibility, release timing, and chapter lock policies",
    href: adminBooksHref,
    icon: "auto_stories",
  },
  {
    title: "Contract Management",
    detail: "Review creator agreements and build new templates",
    href: adminContractsHref,
    icon: "description",
  },
  {
    title: "User Management",
    detail: "Review roles, access, and account health",
    href: adminUsersHref,
    icon: "group",
  },
  {
    title: "Moderation Queue",
    detail: "Resolve pending reports and author reviews",
    href: adminModerationHref,
    icon: "gavel",
  },
  {
    title: "Monetization",
    detail: "Check revenue, payouts, and wallet health",
    href: adminMonetizationHref,
    icon: "payments",
  },
  {
    title: "Messages",
    detail: "Answer creator and support conversations",
    href: adminMessagesHref,
    icon: "chat_bubble",
  },
  {
    title: "Help Center",
    detail: "Publish and retire support articles shown on the account help page",
    href: adminHelpCenterHref,
    icon: "help",
  },
];

export const adminUserRoleFilters = [
  "All",
  "Admins",
  "Editors",
  "Authors",
  "Readers",
];

export const maintenanceActions = [
  { id: "clear-cache", label: "Clear System Cache" },
  { id: "reindex-search", label: "Rebuild Search Index" },
  { id: "run-backup", label: "Run Backup Snapshot" },
];
