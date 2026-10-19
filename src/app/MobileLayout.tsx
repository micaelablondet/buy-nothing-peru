import { NavLink, Outlet } from "react-router-dom";
import { Toast } from "@/components/Toast";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium ${
    isActive ? "text-[#95d5b2]" : "text-emerald-200/70"
  }`;

export function MobileLayout() {
  return (
    <div className="app-gradient-bg relative mx-auto flex min-h-full w-full max-w-[430px] flex-col shadow-2xl ring-1 ring-black/20">
      <main className="on-gradient flex-1 overflow-y-auto pb-20 pt-2">
        <Outlet />
      </main>
      <nav
        className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-[430px] -translate-x-1/2 gap-1 border-t border-white/10 bg-black/85 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 text-emerald-50 backdrop-blur-md"
        aria-label="Principal"
      >
        <NavLink to="/feed" className={navClass} end>
          <span aria-hidden className="text-lg">
            🏠
          </span>
          Inicio
        </NavLink>
        <NavLink to="/encuentra" className={navClass}>
          <span aria-hidden className="flex h-7 items-center text-lg">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          Busca
        </NavLink>
        <NavLink to="/publicar" className={navClass}>
          <span aria-hidden className="text-lg">
            ➕
          </span>
          Publica
        </NavLink>
        <NavLink to="/perfil" className={navClass}>
          <span aria-hidden className="text-lg">
            👤
          </span>
          Perfil
        </NavLink>
      </nav>
      <Toast />
    </div>
  );
}
