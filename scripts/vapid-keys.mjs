/**
 * Generate VAPID keys for Web Push (NOTIF-02 / DEC-33).
 * Public key: raw uncompressed P-256 point, base64url.
 * Private key: JWK "d" parameter, base64url.
 *
 * CLI (`npm run vapid:keys`): prints to the terminal only — never writes keys to a file.
 * Also exportable for e2e throwaway keys (ensure-e2e-vapid.mjs).
 */
import { webcrypto } from "node:crypto";
import { pathToFileURL } from "node:url";

const subtle = webcrypto.subtle;

function toBase64Url(bytes) {
  const bin = String.fromCharCode(...bytes);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

/** @returns {Promise<{ publicKey: string, privateKey: string }>} */
export async function generateVapidKeys() {
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

  return {
    publicKey: toBase64Url(rawPub),
    privateKey: jwk.d,
  };
}

const isCli =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCli) {
  const { publicKey, privateKey } = await generateVapidKeys();
  console.log("VAPID_PUBLIC_KEY=" + publicKey);
  console.log("VAPID_PRIVATE_KEY=" + privateKey);
  console.log("");
  console.log(
    "Copy into wrangler secret put / .dev.vars. Do not commit these values.",
  );
}
