export function isValidPeruMobile(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 9 && digits.startsWith("9")) {
    return true;
  }
  if (digits.length === 11 && digits.startsWith("51") && digits[2] === "9") {
    return true;
  }
  return false;
}

export function normalizePeruPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 9) {
    return `51${digits}`;
  }
  return digits;
}
