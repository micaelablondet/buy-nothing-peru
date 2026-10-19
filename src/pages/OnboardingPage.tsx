import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DistrictSearch } from "@/components/DistrictSearch";
import { districts } from "@/data/catalog";
import { APP_NAME } from "@/lib/brand";
import { isValidPeruMobile, normalizePeruPhone } from "@/lib/validators";
import { usePrototypeStore } from "@/store/prototypeStore";

export function OnboardingPage() {
  const navigate = useNavigate();
  const setProfile = usePrototypeStore((s) => s.setProfile);
  const completeOnboarding = usePrototypeStore((s) => s.completeOnboarding);
  const existing = usePrototypeStore((s) => s.profile);
  const suggestedDistrict = usePrototypeStore((s) => s.suggestedDistrict);
  const [step, setStep] = useState<1 | 2>(1);
  const [firstName, setFirstName] = useState(existing?.firstName ?? "");
  const [phone, setPhone] = useState(existing?.phone.replace(/^51/, "") ?? "");
  const [district, setDistrict] = useState(
    existing?.district ?? suggestedDistrict ?? "",
  );
  const [error, setError] = useState<string | null>(null);

  const onContinueStep1 = () => {
    if (!firstName.trim()) {
      setError("Escribe tu nombre o cómo te dicen en el barrio.");
      return;
    }
    if (!isValidPeruMobile(phone)) {
      setError("Usa un celular peruano (9 dígitos, empieza en 9).");
      return;
    }
    setError(null);
    setStep(2);
  };

  const onFinish = () => {
    const valid = districts.find((d) => d === district);
    if (!valid) {
      setError("Elige un distrito de la lista.");
      return;
    }
    setProfile({
      firstName: firstName.trim(),
      phone: normalizePeruPhone(phone),
      district: valid,
    });
    completeOnboarding();
    navigate("/rules");
  };

  return (
    <div className="app-gradient-bg on-gradient mx-auto min-h-full w-full max-w-[430px] px-5 py-8 shadow-2xl ring-1 ring-black/20">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand">
        {APP_NAME} · Regalo y Pido
      </p>
      <h1 className="mt-2 text-2xl font-bold text-ink">
        {step === 1 ? "Tu barrio empieza contigo" : "¿Dónde vives?"}
      </h1>
      {step === 2 ? (
        <p className="mt-2 text-sm text-ink-muted">
          Dinos en qué distrito vives para mostrarte lo que hay disponible.
        </p>
      ) : null}

      {step === 1 ? (
        <div className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Nombre</span>
            <input
              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-3 text-base outline-none ring-brand focus:ring-2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ej. Mica"
              autoComplete="given-name"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Celular</span>
            <input
              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-3 text-base outline-none ring-brand focus:ring-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="987 654 321"
              inputMode="tel"
              autoComplete="tel"
            />
          </label>
        </div>
      ) : (
        <div className="mt-8">
          <DistrictSearch
            value={district}
            onChange={setDistrict}
            suggestedDistrict={suggestedDistrict}
          />
        </div>
      )}

      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}

      <div className="mt-10 flex gap-3">
        {step === 2 ? (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="rounded-xl px-4 py-3 text-sm font-semibold text-ink-muted"
          >
            Atrás
          </button>
        ) : null}
        <button
          type="button"
          onClick={step === 1 ? onContinueStep1 : onFinish}
          className="flex-1 rounded-2xl bg-brand py-3.5 text-base font-semibold text-white"
        >
          {step === 1 ? "Continuar" : "Entrar"}
        </button>
      </div>
      <p className="mt-6 text-center text-xs text-ink-muted">
        Paso {step} de 2
      </p>
    </div>
  );
}
