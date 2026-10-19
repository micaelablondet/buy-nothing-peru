import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  requestNativeSubscription,
  subscriptionPlans,
  type SubscriptionPlan,
} from "@/lib/subscription";
import { usePrototypeStore } from "@/store/prototypeStore";

const benefits = [
  "Tus posts van arriba",
  "Guarda 5 distritos",
  "Crea comunidades privadas",
] as const;

const planOrder: SubscriptionPlan[] = ["anual", "mensual"];

function PlanRadio({
  checked,
  onLight = false,
}: {
  checked: boolean;
  onLight?: boolean;
}) {
  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
        checked
          ? "border-[#2d6a4f] bg-[#2d6a4f]/10"
          : onLight
            ? "border-[#52796f]"
            : "border-emerald-200/35"
      }`}
      aria-hidden
    >
      {checked ? (
        <span className="h-2.5 w-2.5 rounded-full bg-[#2d6a4f]" />
      ) : null}
    </span>
  );
}

export function ApoyaBarrioPage() {
  const navigate = useNavigate();
  const showToast = usePrototypeStore((s) => s.showToast);
  const [selected, setSelected] = useState<SubscriptionPlan>("anual");
  const [busy, setBusy] = useState(false);

  const runPurchase = async (plan: SubscriptionPlan) => {
    if (busy) {
      return;
    }
    setBusy(true);
    const result = await requestNativeSubscription(plan);
    setBusy(false);

    if (result === "success") {
      showToast("Gracias — apoyo registrado (demo). En producción: suscripción activa.");
      navigate(-1);
      return;
    }
    if (result === "cancelled") {
      showToast("Pago cancelado.");
      return;
    }
    showToast("Compra en app no disponible en este navegador.");
  };

  const selectPlan = (plan: SubscriptionPlan) => {
    setSelected(plan);
    void runPurchase(plan);
  };

  return (
    <div className="space-y-6 px-4 pb-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Volver"
        className="-ml-2 rounded-full p-2 text-emerald-50"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
          <path
            d="M19 12H5m6-6-6 6 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Apoya a tu Barrio</h1>
        <p className="text-sm leading-relaxed text-emerald-100/90">
          Recibe acceso a más funcionalidades apoyando a este proyecto de tu
          barrio.
        </p>
      </header>

      <ul className="space-y-2 rounded-2xl bg-white p-4 ring-1 ring-border">
        {benefits.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-ink">
            <span className="mt-0.5 text-brand" aria-hidden>
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Plan de apoyo">
        {planOrder.map((plan) => {
          const { label, price, detail } = subscriptionPlans[plan];
          const active = selected === plan;
          const isAnnual = plan === "anual";

          return (
            <button
              key={plan}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={busy}
              onClick={() => selectPlan(plan)}
              className={`relative flex min-h-[132px] flex-col rounded-2xl p-3.5 text-left transition active:scale-[0.98] disabled:opacity-60 ${
                isAnnual
                  ? "border-2 border-[#52b788] bg-[#0d2818]/90 shadow-[0_0_0_1px_rgb(82_183_136_/_0.35)]"
                  : active
                    ? "border-2 border-[#52b788] bg-white ring-1 ring-border"
                    : "border border-border bg-white ring-1 ring-border"
              }`}
            >
              {isAnnual ? (
                <span className="mb-2 inline-flex w-fit rounded-full bg-[#52b788]/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#95d5b2]">
                  Mejor valor
                </span>
              ) : (
                <span className="mb-2 block h-[18px]" aria-hidden />
              )}

              <div className="flex items-start justify-between gap-2">
                <p
                  className={`text-base font-bold leading-tight ${
                    isAnnual ? "text-emerald-50" : "text-[#1b4332]"
                  }`}
                >
                  {label}
                </p>
                <PlanRadio checked={active} onLight={!isAnnual} />
              </div>

              <p className="mt-auto pt-3">
                <span
                  className={`text-lg font-bold leading-none ${
                    isAnnual ? "text-[#95d5b2]" : "text-[#1b4332]"
                  }`}
                >
                  {price}
                </span>
                <span
                  className={`text-sm font-medium ${
                    isAnnual ? "text-[#95d5b2]/90" : "text-[#52796f]"
                  }`}
                >
                  {detail}
                </span>
              </p>
            </button>
          );
        })}
      </div>

      <div className="space-y-3 pt-2">
        <button
          type="button"
          disabled={busy || !selected}
          onClick={() => void runPurchase(selected)}
          className="w-full rounded-2xl bg-brand py-3.5 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Apoya a tu Barrio
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => navigate(-1)}
          className="w-full py-3 text-base font-semibold text-emerald-100"
        >
          No ahora
        </button>
      </div>
    </div>
  );
}
