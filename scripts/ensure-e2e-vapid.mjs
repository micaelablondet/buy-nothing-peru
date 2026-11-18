/**
 * Write a fresh throwaway VAPID key pair into .dev.vars for Playwright e2e.
 * Empty VAPID_= lines override wrangler --var and hide the soft-ask; this
 * fills them at test time. Keys are never committed — .dev.vars is gitignored.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { generateVapidKeys } from "./vapid-keys.mjs";

const filePath = fileURLToPath(new URL("../.dev.vars", import.meta.url));
let text = existsSync(filePath) ? readFileSync(filePath, "utf8") : "";

function setKey(key, value) {
  const re = new RegExp(`^${key}=.*$`, "m");
  if (re.test(text)) {
    text = text.replace(re, `${key}=${value}`);
  } else {
    text = `${text.trimEnd()}\n${key}=${value}\n`;
  }
}

const { publicKey, privateKey } = await generateVapidKeys();
setKey("VAPID_PUBLIC_KEY", publicKey);
setKey("VAPID_PRIVATE_KEY", privateKey);
writeFileSync(filePath, text.endsWith("\n") ? text : `${text}\n`);
console.log("e2e: wrote fresh throwaway VAPID keys into .dev.vars (gitignored)");
