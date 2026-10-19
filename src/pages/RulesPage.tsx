import { useNavigate } from "react-router-dom";
import { communityRules, pickupTips } from "@/data/catalog";
import { usePrototypeStore } from "@/store/prototypeStore";

export function RulesPage() {
  const navigate = useNavigate();
  const acceptRules = usePrototypeStore((s) => s.acceptRules);

  return (
    <div className="app-gradient-bg on-gradient mx-auto min-h-full w-full max-w-[430px] px-5 py-8 shadow-2xl ring-1 ring-black/20">
      <h1 className="text-2xl font-bold">Reglas de la comunidad</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Para que esto se sienta vecinal y funcione bien, algunas reglas.
      </p>

      <ul className="mt-6 space-y-3">
        {communityRules.map((rule) => (
          <li
            key={rule}
            className="rounded-xl bg-white px-4 py-3 text-sm leading-relaxed ring-1 ring-border"
          >
            {rule}
          </li>
        ))}
      </ul>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-ink-muted">
        Entrega segura (ideas)
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink">
        {pickupTips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => {
          acceptRules();
          navigate("/feed");
        }}
        className="mt-10 w-full rounded-2xl bg-brand py-3.5 text-base font-semibold text-white"
      >
        Acepto
      </button>
    </div>
  );
}
