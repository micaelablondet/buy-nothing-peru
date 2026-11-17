import { useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, Outlet, useNavigate, useOutletContext } from "react-router-dom";
import type { SessionOutletContext } from "@/app/RequireSession";
import { BellIcon } from "@/components/BellIcon";
import { InstallPrompt } from "@/components/InstallPrompt";
import { MenuIcon } from "@/components/MenuIcon";
import {
  HomeIcon,
  ProfileIcon,
  PublishIcon,
  SearchIcon,
} from "@/components/NavIcons";
import { copy } from "@/copy/es-PE";
import { fetchUnreadCount, logout } from "@/lib/api";
import { isInstallPromptArmed } from "@/lib/install";

export function AppShell() {
  const session = useOutletContext<SessionOutletContext>();
  const { me } = session;
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [installArmed, setInstallArmed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setInstallArmed(isInstallPromptArmed());
    fetchUnreadCount()
      .then(setUnread)
      .catch(() => setUnread(0));
    const timer = window.setInterval(() => {
      fetchUnreadCount()
        .then(setUnread)
        .catch(() => null);
      setInstallArmed(isInstallPromptArmed());
    }, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current?.contains(target) ||
        menuButtonRef.current?.contains(target)
      ) {
        return;
      }
      setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [menuOpen]);

  const onSignOut = async () => {
    setMenuOpen(false);
    await logout();
    navigate("/entrar", { replace: true });
  };

  const greeting = copy.shell.greeting.replace("{name}", me.displayName);

  return (
    <div className="app-shell">
      <nav className="app-shell__nav" aria-label={copy.shell.navAria}>
        <div className="app-shell__nav-brand">
          <p className="app-shell__brand">{copy.appName}</p>
          <p className="app-shell__user">{greeting}</p>
        </div>

        <div className="app-shell__nav-links">
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
        </div>
      </nav>

      <div className="app-shell__column">
        <header className="app-shell__header">
          <div className="app-shell__identity">
            <p className="app-shell__brand">{copy.appName}</p>
            <p className="app-shell__user">{greeting}</p>
          </div>
          <div className="app-shell__actions">
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
                <span className="app-shell__badge">
                  {unread > 9 ? "9+" : unread}
                </span>
              ) : null}
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              className="app-shell__menu-btn"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? copy.shell.menuClose : copy.shell.menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>

          {menuOpen ? (
            <div
              ref={menuRef}
              id={menuId}
              className="app-shell__menu"
              role="navigation"
              aria-label={copy.shell.menuAria}
            >
              <Link
                to="/legal/terminos"
                className="app-shell__menu-link"
                onClick={() => setMenuOpen(false)}
              >
                {copy.footer.terms}
              </Link>
              <Link
                to="/legal/privacidad"
                className="app-shell__menu-link"
                onClick={() => setMenuOpen(false)}
              >
                {copy.footer.privacy}
              </Link>
              <button
                type="button"
                className="app-shell__menu-link app-shell__menu-link--button"
                onClick={() => void onSignOut()}
              >
                {copy.shell.signOut}
              </button>
            </div>
          ) : null}
        </header>

        <main className="app-shell__main">
          <InstallPrompt armed={installArmed} />
          <Outlet context={session} />
        </main>
      </div>
    </div>
  );
}

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? "app-shell__nav-link is-active" : "app-shell__nav-link";
}
