function centsToDollars(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "";
  }

  const dollars = numericValue / 100;

  return Number.isInteger(dollars) ? String(dollars) : dollars.toFixed(2);
}

function toInteger(value) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return 0;
  }

  return Math.round(parsedValue);
}

function toCents(value) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return 0;
  }

  return Math.round(parsedValue * 100);
}

export function mapTemplateToDraft(template) {
  return {
    advancePayment: centsToDollars(template.advancePaymentCents),
    body: template.body ?? "",
    companyName: template.companyName ?? "",
    description: template.description ?? "",
    exclusivity: template.exclusivity ?? "",
    geographicRights: template.geographicRights ?? "",
    revenueSharePercent: String(template.revenueSharePercent ?? ""),
    signingBonusCoins: String(template.signingBonusCoins ?? ""),
    templateName: template.templateName ?? "",
    termMonths: String(template.termMonths ?? ""),
  };
}

export function buildTemplatePayload(form) {
  return {
    advancePaymentCents: toCents(form.advancePayment),
    body: form.body.trim(),
    companyName: form.companyName.trim(),
    description: form.description.trim() || null,
    exclusivity: form.exclusivity,
    geographicRights: form.geographicRights.trim(),
    revenueSharePercent: toInteger(form.revenueSharePercent),
    signingBonusCoins: toInteger(form.signingBonusCoins),
    templateName: form.templateName.trim(),
    termMonths: toInteger(form.termMonths),
  };
}

export function mapContractToDraft(contract) {
  return {
    advancePayment: centsToDollars(contract.advancePaymentCents),
    body: contract.body ?? "",
    companyName: contract.companyName ?? "",
    contractType: contract.contractType ?? "",
    geographicRights: contract.geographicRights ?? "",
    partyRole: contract.partyRole ?? "",
    revenueSharePercent: String(contract.revenueSharePercent ?? ""),
    signingBonusCoins: String(contract.signingBonusCoins ?? ""),
    status: contract.status ?? "DRAFT",
    storyId: contract.story?.id ?? "",
    storyTitle: contract.story?.title ?? "",
    templateId: contract.templateId ?? "",
    templateName: contract.templateName ?? "",
    termMonths: String(contract.termMonths ?? ""),
    userId: contract.user?.id ?? "",
    userName: contract.user?.displayName ?? "",
  };
}

export function buildContractPayload(form) {
  return {
    advancePaymentCents: toCents(form.advancePayment),
    body: form.body.trim(),
    companyName: form.companyName.trim(),
    contractType: form.contractType,
    geographicRights: form.geographicRights.trim(),
    partyRole: form.partyRole.trim(),
    revenueSharePercent: toInteger(form.revenueSharePercent),
    signingBonusCoins: toInteger(form.signingBonusCoins),
    status: form.status,
    storyId: form.storyId,
    templateId: form.templateId || null,
    templateName: form.templateName.trim(),
    termMonths: toInteger(form.termMonths),
    userId: form.userId,
  };
}

export function applyTemplateToContractDraft(current, template) {
  return {
    ...current,
    advancePayment: centsToDollars(template.advancePaymentCents),
    body: template.body ?? current.body,
    companyName: template.companyName ?? current.companyName,
    contractType: template.exclusivity ?? current.contractType,
    geographicRights: template.geographicRights ?? current.geographicRights,
    revenueSharePercent: String(template.revenueSharePercent ?? ""),
    signingBonusCoins: String(template.signingBonusCoins ?? ""),
    templateId: template.id,
    templateName: template.templateName ?? current.templateName,
    termMonths: String(template.termMonths ?? ""),
  };
}
