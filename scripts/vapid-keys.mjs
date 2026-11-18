/**
 * Generate VAPID keys for Web Push (NOTIF-02 / DEC-33).
 * Prints to the terminal only — never writes keys to a file.
 *
 * Public key: raw uncompressed P-256 point, base64url.
 * Private key: JWK "d" parameter, base64url.
 */
import { webcrypto } from "node:crypto";

const subtle = webcrypto.subtle;

function toBase64Url(bytes) {
  const bin = String.fromCharCode(...bytes);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

const pair = await subtle.generateKey(
  { name: "ECDSA", namedCurve: "P-256" },
  true,
  ["sign", "verify"],
);

const rawPub = new Uint8Array(await subtle.exportKey("raw", pair.publicKey));
const jwk = await subtle.exportKey("jwk", pair.privateKey);

if (!jwk.d) {
  throw new Error("VAPID private key export missing d");
}

console.log("VAPID_PUBLIC_KEY=" + toBase64Url(rawPub));
console.log("VAPID_PRIVATE_KEY=" + jwk.d);
console.log("");
console.log(
  "Copy into wrangler secret put / .dev.vars. Do not commit these values.",
);
