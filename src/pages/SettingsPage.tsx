import { useNavigate } from "react-router-dom";
import { shareAppInvite } from "@/lib/shareInvite";
import { usePrototypeStore } from "@/store/prototypeStore";

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-ink-muted" fill="none" aria-hidden>
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SettingsPage() {
  const navigate = useNavigate();
  const showToast = usePrototypeStore((s) => s.showToast);
  const signOut = usePrototypeStore((s) => s.signOut);

  const onInvite = async () => {
    const result = await shareAppInvite();
    if (result === "shared") {
      showToast("Listo — comparte el enlace con quien quieras.");
    } else if (result === "copied") {
      showToast("Copiamos el mensaje de invitación al portapapeles.");
    }
  };

  const rows: {
    label: string;
    onClick: () => void;
    danger?: boolean;
  }[] = [
    { label: "Invita a un amigx", onClick: onInvite },
    {
      label: "Política de Privacidad",
      onClick: () => navigate("/legal/privacidad"),
    },
    {
      label: "Términos de Uso",
      onClick: () => navigate("/legal/terminos"),
    },
    {
      label: "Salir",
      danger: true,
      onClick: () => {
        signOut();
        navigate("/", { replace: true });
      },
    },
  ];

  return (
    <div className="space-y-6 px-4 pb-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Volver"
        className="-ml-2 rounded-full p-2 text-emerald-50"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
          <path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <h1 className="text-3xl font-bold">Configuración</h1>

      <section className="space-y-3 rounded-2xl bg-white p-5 ring-1 ring-border">
        <h2 className="text-lg font-bold text-ink">Apoya a tu Barrio</h2>
        <p className="text-sm leading-relaxed text-ink-muted">
          Barrio es gratis y sin anuncios. Tu apoyo ayuda a mantenerlo funcionando
          para todos los vecinos.
        </p>
        <button
          type="button"
          onClick={() => navigate("/ajustes/apoya")}
          className="w-full rounded-xl bg-brand py-3 font-semibold text-white"
        >
          Apoya a tu Barrio
        </button>
      </section>

      <ul className="divide-y divide-border overflow-hidden rounded-2xl bg-white ring-1 ring-border">
        {rows.map((row) => (
          <li key={row.label}>
            <button
              type="button"
              onClick={row.onClick}
              className={`flex w-full items-center gap-3 px-4 py-4 text-left text-base font-medium ${
                row.danger ? "text-red-700" : "text-ink"
              }`}
            >
              <span className="flex-1">{row.label}</span>
              {row.danger ? null : <Chevron />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
