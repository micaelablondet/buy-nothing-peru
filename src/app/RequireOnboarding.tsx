import { Navigate, Outlet, useLocation } from "react-router-dom";
import { usePrototypeStore } from "@/store/prototypeStore";

export function RequireOnboarding() {
  const onboardingComplete = usePrototypeStore((s) => s.onboardingComplete);
  const rulesAccepted = usePrototypeStore((s) => s.rulesAccepted);
  const location = useLocation();

  if (!onboardingComplete) {
    // Welcome screen first (also where "Salir" lands); it links to onboarding.
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  if (!rulesAccepted) {
    return <Navigate to="/rules" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
