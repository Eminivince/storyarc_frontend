export const adminContractFilters = [
  "All Contracts",
  "Pending Signature",
  "Active",
  "Draft",
  "Expired",
  "Terminated",
];

export const contractStatusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Pending Signature", value: "PENDING_SIGNATURE" },
  { label: "Active", value: "ACTIVE" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Terminated", value: "TERMINATED" },
];

export const contractExclusivityOptions = [
  { label: "Exclusive", value: "EXCLUSIVE" },
  { label: "Non-Exclusive", value: "NON_EXCLUSIVE" },
];

export const contractGeographicRightsOptions = [
  "Worldwide",
  "North America",
  "Europe & Asia",
  "Regional (Custom)",
];

export const contractTermOptions = [
  { label: "1 Year", value: 12 },
  { label: "2 Years", value: 24 },
  { label: "3 Years", value: 36 },
  { label: "5 Years", value: 60 },
  { label: "10 Years", value: 120 },
];

export const contractTemplatePlaceholders = [
  "{AUTHOR_NAME}",
  "{STORY_TITLE}",
  "{DATE}",
  "{REV_SHARE}",
  "{COMPANY_NAME}",
  "{ADVANCE_PAYMENT}",
];

export function getNeutralContractBody() {
  return `This Content Licensing Agreement ("Agreement") is entered into on {DATE} by and between {COMPANY_NAME} ("Company") and {AUTHOR_NAME} ("Creator") for the work titled {STORY_TITLE}.

1. RIGHTS
The Creator grants the rights described in this agreement subject to the selected exclusivity, territory, and term.

2. COMPENSATION
The Company will pay {ADVANCE_PAYMENT} as the agreed advance and {REV_SHARE}% as the revenue share for the covered work.

3. TERM
This agreement remains in effect for the selected term unless ended earlier under the agreement terms.`;
}

export function createEmptyContractTemplateDraft() {
  return {
    advancePayment: "",
    body: getNeutralContractBody(),
    companyName: "",
    description: "",
    exclusivity: "",
    geographicRights: "",
    revenueSharePercent: "",
    signingBonusCoins: "",
    templateName: "",
    termMonths: "",
  };
}

export function createEmptyContractDraft() {
  return {
    advancePayment: "",
    body: getNeutralContractBody(),
    companyName: "",
    contractType: "",
    geographicRights: "",
    partyRole: "",
    revenueSharePercent: "",
    signingBonusCoins: "",
    status: "DRAFT",
    storyId: "",
    storyTitle: "",
    templateId: "",
    templateName: "",
    termMonths: "",
    userId: "",
    userName: "",
  };
}

export function formatContractStatusLabel(status) {
  return (
    contractStatusOptions.find((option) => option.value === status)?.label || "Draft"
  );
}

export function formatContractTypeLabel(value) {
  return (
    contractExclusivityOptions.find((option) => option.value === value)?.label ||
    "Exclusive"
  );
}

export function formatTermMonthsLabel(value) {
  const numericValue = Number(value);

  if (!numericValue) {
    return "Term not set";
  }

  if (numericValue % 12 === 0) {
    const years = numericValue / 12;
    return `${years} ${years === 1 ? "Year" : "Years"}`;
  }

  return `${numericValue} ${numericValue === 1 ? "Month" : "Months"}`;
}

export function formatAdvancePaymentLabel(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return "$0.00";
  }

  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(numericValue);
}

export function buildContractPreview(body, input) {
  const replacements = {
    "{ADVANCE_PAYMENT}":
      input.advancePayment || input.advancePayment === 0
        ? formatAdvancePaymentLabel(input.advancePayment)
        : "[Advance Payment]",
    "{AUTHOR_NAME}": input.userName || "[Author Name]",
    "{COMPANY_NAME}": input.companyName || "[Company Name]",
    "{DATE}": input.date || new Date().toLocaleDateString("en-US"),
    "{REV_SHARE}":
      input.revenueSharePercent || input.revenueSharePercent === 0
        ? String(input.revenueSharePercent)
        : "[Revenue Share]",
    "{STORY_TITLE}": input.storyTitle || "[Story Title]",
  };

  return Object.entries(replacements).reduce(
    (current, [placeholder, replacement]) =>
      current.replaceAll(placeholder, replacement),
    body || "",
  );
}
