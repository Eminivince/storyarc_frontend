export const adminBookInventoryTabs = [
  "All Inventory",
  "Review Queue",
  "Flagged Content",
];

export const adminBookStatusFilters = [
  "All Books",
  "Live",
  "Pending",
  "Hidden",
];

export const adminBookLockWindowOptions = [
  { label: "Forever", value: -1 },
  { label: "Immediate", value: 0 },
  { label: "24h Delay", value: 24 },
  { label: "72h Delay", value: 72 },
  { label: "7 Days", value: 24 * 7 },
  { label: "14 Days", value: 24 * 14 },
  { label: "30 Days", value: 24 * 30 },
];

export const adminBookReleaseModeOptions = [
  {
    label: "Delayed (Premium Window)",
    value: "PREMIUM_WINDOW",
  },
  {
    label: "Manual Review Required",
    value: "MANUAL",
  },
];

export const adminBookVisibilityModes = [
  {
    label: "Pending Review",
    value: "PENDING_APPROVAL",
  },
  {
    label: "Live",
    value: "LIVE",
  },
  {
    label: "Hidden",
    value: "HIDDEN",
  },
];

export function getAdminLockWindowLabel(hours) {
  const parsedHours = Number(hours);
  const normalizedHours = Number.isFinite(parsedHours)
    ? parsedHours < 0
      ? -1
      : parsedHours
    : 0;
  const option = adminBookLockWindowOptions.find(
    (item) => item.value === normalizedHours,
  );

  if (option) {
    return option.label;
  }

  if (normalizedHours === -1) {
    return "Forever";
  }

  if (normalizedHours === 0) {
    return "Immediate";
  }

  if (normalizedHours % 24 === 0) {
    const days = normalizedHours / 24;
    return days === 1 ? "1 Day" : `${days} Days`;
  }

  return `${normalizedHours}h Delay`;
}
