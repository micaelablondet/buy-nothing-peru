const ARMED_KEY = "barrio_install_armed";
const DISMISS_KEY = "barrio_install_dismissed";

export function armInstallPrompt(): void {
  sessionStorage.setItem(ARMED_KEY, "1");
}

export function isInstallPromptArmed(): boolean {
  return sessionStorage.getItem(ARMED_KEY) === "1";
}

export function isInstallDismissed(): boolean {
  return localStorage.getItem(DISMISS_KEY) === "1";
}

export function dismissInstallPrompt(): void {
  localStorage.setItem(DISMISS_KEY, "1");
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  const media = window.matchMedia("(display-mode: standalone)").matches;
  const ios =
    "standalone" in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return media || ios;
}
