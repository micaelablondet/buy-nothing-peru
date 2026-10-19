import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { APP_NAME } from "@/lib/brand";
import { usePrototypeStore } from "@/store/prototypeStore";

type IconName = "settings" | "profile" | "donate" | "help" | "signout";

function MenuIcon({ name }: { name: IconName }) {
  const common = {
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" aria-hidden>
      {name === "settings" ? (
        <>
          <circle cx="12" cy="12" r="3" {...common} />
          <path
            d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"
            {...common}
          />
        </>
      ) : null}
      {name === "profile" ? (
        <>
          <circle cx="12" cy="12" r="9" {...common} />
          <circle cx="12" cy="10" r="3" {...common} />
          <path d="M6.2 18.4a6.5 6.5 0 0 1 11.6 0" {...common} />
        </>
      ) : null}
      {name === "donate" ? (
        <>
          <path d="M3 14h3l3.5 1.5H13a1.5 1.5 0 0 1 0 3H9.5M3 21h4l7-2 6.5-3.5a1.5 1.5 0 0 0-1.5-2.5L14 15.5" {...common} />
          <path d="M16 10.5s-3.5-2.2-3.5-4.5a2 2 0 0 1 3.5-1.3A2 2 0 0 1 19.5 6c0 2.3-3.5 4.5-3.5 4.5z" {...common} />
        </>
      ) : null}
      {name === "help" ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="4" {...common} />
          <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.2" {...common} />
          <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="currentColor" />
        </>
      ) : null}
      {name === "signout" ? (
        <>
          <path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4" {...common} />
          <path d="M14 8l4 4-4 4M18 12H9" {...common} />
        </>
      ) : null}
    </svg>
  );
}

export function SideMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const showToast = usePrototypeStore((s) => s.showToast);
  const signOut = usePrototypeStore((s) => s.signOut);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const go = (path: string) => {
    onClose();
    navigate(path);
  };
  const soon = (message: string) => {
    onClose();
    showToast(message);
  };

  const items: { icon: IconName; label: string; onClick: () => void }[] = [
    { icon: "settings", label: "Configuración", onClick: () => go("/ajustes") },
    { icon: "profile", label: "Perfil", onClick: () => go("/perfil") },
    {
      icon: "donate",
      label: "Haz una donación",
      onClick: () => soon("Próximamente: donaciones para mantener Barrio."),
    },
    {
      icon: "signout",
      label: "Salir",
      onClick: () => {
        onClose();
        signOut();
        navigate("/", { replace: true });
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 mx-auto max-w-[430px]">
      <button
        type="button"
        aria-label="Cerrar menú"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <nav
        aria-label="Menú"
        className="absolute inset-y-0 left-0 flex w-[82%] flex-col bg-surface-elevated px-5 pb-6 pt-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-2xl font-bold text-brand">{APP_NAME}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="rounded-full p-2 text-ink-muted"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                onClick={item.onClick}
                className="flex w-full items-center gap-4 rounded-xl px-2 py-3 text-left text-base font-medium text-ink active:bg-brand-soft"
              >
                <span className="text-ink-muted">
                  <MenuIcon name={item.icon} />
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
