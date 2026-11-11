import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { fetchMe, type MeResponse } from "@/lib/api";

export type SessionOutletContext = { me: MeResponse; refreshMe: () => Promise<void> };

export function RequireSession({
  requireProfile = true,
}: {
  requireProfile?: boolean;
}) {
  const location = useLocation();
  const [me, setMe] = useState<MeResponse | null | undefined>(undefined);

  const load = async () => {
    try {
      setMe(await fetchMe());
    } catch {
      setMe(null);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (me === undefined) {
    return (
      <div className="shell-loading" role="status">
        …
      </div>
    );
  }

  if (!me) {
    return <Navigate to="/entrar" replace state={{ from: location }} />;
  }

  if (requireProfile && !me.profileComplete) {
    return (
      <Navigate
        to="/onboarding/perfil"
        replace
        state={{ from: location }}
      />
    );
  }

  return (
    <Outlet
      context={
        {
          me,
          refreshMe: load,
        } satisfies SessionOutletContext
      }
    />
  );
}
