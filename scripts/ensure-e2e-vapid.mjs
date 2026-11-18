/**
 * Ensure .dev.vars has non-empty test VAPID keys for Playwright soft-ask e2e.
 * Empty VAPID_= lines in .dev.vars override wrangler --var and hide the soft-ask.
 * These keys are for local/CI only — never use in production.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const PUB =
  "BN6IUD9Hogh604Kh_X6zOPP4XfG6QMtRBVcgLAR-tn7BpNGrzjdtTKnPtI7qj2-izavCrk185CyLAxyeGKqJOGY";
const PRIV = "IcFvzq8OljMa4BfJzRC_675ooayujX1tJ2vuXQmwpHI";

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

setKey("VAPID_PUBLIC_KEY", PUB);
setKey("VAPID_PRIVATE_KEY", PRIV);
writeFileSync(filePath, text.endsWith("\n") ? text : `${text}\n`);
console.log("e2e: wrote test VAPID keys into .dev.vars (gitignored)");
