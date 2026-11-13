import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate, useOutletContext } from "react-router-dom";
import type { SessionOutletContext } from "@/app/RequireSession";
import { BellIcon } from "@/components/BellIcon";
import {
  HomeIcon,
  ProfileIcon,
  PublishIcon,
  SearchIcon,
} from "@/components/NavIcons";
import { copy } from "@/copy/es-PE";
import { fetchUnreadCount, logout } from "@/lib/api";

export function AppShell() {
  const { me } = useOutletContext<SessionOutletContext>();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetchUnreadCount()
      .then(setUnread)
      .catch(() => setUnread(0));
    const timer = window.setInterval(() => {
      fetchUnreadCount()
        .then(setUnread)
        .catch(() => null);
    }, 30_000);
    return () => window.clearInterval(timer);
  }, []);

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
        <Link
          to="/app/inbox"
          className="app-shell__bell"
          aria-label={
            unread > 0
              ? copy.shell.inboxUnread.replace("{count}", String(unread))
              : copy.shell.inbox
          }
        >
          <BellIcon />
          {unread > 0 ? (
            <span className="app-shell__badge">{unread > 9 ? "9+" : unread}</span>
          ) : null}
        </Link>
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

      <nav className="app-shell__nav" aria-label={copy.shell.navAria}>
        <NavLink to="/app" end className={navClass} aria-label={copy.shell.home}>
          <HomeIcon className="app-shell__nav-icon" />
          <span className="app-shell__nav-label">{copy.shell.home}</span>
        </NavLink>
        <NavLink
          to="/app/busca"
          className={navClass}
          aria-label={copy.shell.search}
        >
          <SearchIcon className="app-shell__nav-icon" />
          <span className="app-shell__nav-label">{copy.shell.search}</span>
        </NavLink>
        <NavLink
          to="/app/publica"
          className={navClass}
          aria-label={copy.shell.publish}
        >
          <PublishIcon className="app-shell__nav-icon" />
          <span className="app-shell__nav-label">{copy.shell.publish}</span>
        </NavLink>
        <NavLink
          to="/app/perfil"
          className={navClass}
          aria-label={copy.shell.profile}
        >
          <ProfileIcon className="app-shell__nav-icon" />
          <span className="app-shell__nav-label">{copy.shell.profile}</span>
        </NavLink>
      </nav>
    </div>
  );
}

function navClass({ isActive }: { isActive: boolean }) {
  return `app-shell__nav-link${isActive ? " is-active" : ""}`;
}
