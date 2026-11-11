import { NavLink, Outlet, useNavigate, useOutletContext } from "react-router-dom";
import type { SessionOutletContext } from "@/app/RequireSession";
import { copy } from "@/copy/es-PE";
import { logout } from "@/lib/api";

export function AppShell() {
  const { me } = useOutletContext<SessionOutletContext>();
  const navigate = useNavigate();

  const onSignOut = async () => {
    await logout();
    navigate("/entrar", { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <p className="app-shell__brand">{copy.appName}</p>
        <p className="app-shell__user">
          {copy.shell.greeting.replace("{name}", me.displayName)}
        </p>
        <button
          type="button"
          className="app-shell__signout"
          onClick={() => void onSignOut()}
        >
          {copy.shell.signOut}
        </button>
      </header>

      <main className="app-shell__main">
        <Outlet />
      </main>

      <nav className="app-shell__nav" aria-label="Principal">
        <NavLink to="/app" end className={navClass}>
          {copy.shell.home}
        </NavLink>
        <NavLink to="/app/busca" className={navClass}>
          {copy.shell.search}
        </NavLink>
        <NavLink to="/app/publica" className={navClass}>
          {copy.shell.publish}
        </NavLink>
        <NavLink to="/app/perfil" className={navClass}>
          {copy.shell.profile}
        </NavLink>
      </nav>
    </div>
  );
}

function navClass({ isActive }: { isActive: boolean }) {
  return `app-shell__nav-link${isActive ? " is-active" : ""}`;
}
