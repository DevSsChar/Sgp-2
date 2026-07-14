const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

function getEncryptionKey() {
  const secret = process.env.SCAN_AUTH_ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("SCAN_AUTH_ENCRYPTION_KEY or NEXTAUTH_SECRET is required for secure auth storage");
  }
  return crypto.createHash("sha256").update(secret).digest();
}

function encryptPayload(data) {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const plaintext = typeof data === "string" ? data : JSON.stringify(data);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

function decryptPayload(ciphertext) {
  const key = getEncryptionKey();
  const buf = Buffer.from(ciphertext, "base64");
  const iv = buf.subarray(0, IV_LENGTH);
  const tag = buf.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const encrypted = buf.subarray(IV_LENGTH + TAG_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
  try {
    return JSON.parse(decrypted);
  } catch {
    return decrypted;
  }
}

function redactForLogs(value) {
  if (!value || typeof value !== "object") return value;
  const clone = { ...value };
  for (const key of ["password", "cookies", "localStorage", "sessionStorage", "encryptedPayload"]) {
    if (key in clone) clone[key] = "[REDACTED]";
  }
  if (clone.username) clone.username = "[REDACTED]";
  return clone;
}

module.exports = { encryptPayload, decryptPayload, redactForLogs };
