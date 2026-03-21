export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export function getPasswordChecks(password) {
  const value = typeof password === "string" ? password : "";

  return {
    lowercase: /[a-z]/.test(value),
    maxLength: value.length <= PASSWORD_MAX_LENGTH,
    minLength: value.length >= PASSWORD_MIN_LENGTH,
    noSpaces: !/\s/.test(value),
    number: /\d/.test(value),
    special: /[^A-Za-z0-9]/.test(value),
    uppercase: /[A-Z]/.test(value),
  };
}

export function isStrongPassword(password) {
  const checks = getPasswordChecks(password);

  return (
    checks.minLength &&
    checks.maxLength &&
    checks.lowercase &&
    checks.uppercase &&
    checks.number &&
    checks.special &&
    checks.noSpaces
  );
}

export function getPasswordStrengthLabel(checks) {
  const score = [
    checks.minLength,
    checks.lowercase,
    checks.uppercase,
    checks.number,
    checks.special,
    checks.noSpaces,
  ].filter(Boolean).length;

  if (score >= 6) {
    return "Strong";
  }

  if (score >= 4) {
    return "Medium";
  }

  return "Weak";
}

export function getPasswordPolicyErrorMessage(password) {
  const checks = getPasswordChecks(password);

  if (!checks.noSpaces) {
    return "Password cannot contain spaces.";
  }

  return `Password must be ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} characters and include uppercase, lowercase, number, and special character.`;
}
