import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { fetchMe, type MeResponse } from "@/lib/api";

export type SessionOutletContext = { me: MeResponse };

export function RequireSession() {
  const location = useLocation();
  const [me, setMe] = useState<MeResponse | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetchMe()
      .then((user) => {
        if (!cancelled) {
          setMe(user);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMe(null);
        }
      });
    return () => {
      cancelled = true;
    };
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

  return <Outlet context={{ me } satisfies SessionOutletContext} />;
}
