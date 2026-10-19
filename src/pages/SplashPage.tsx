import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { splashFloatingIconsPaintOrder } from "@/data/splashIcons";
import { PILOT_DISTRICT } from "@/data/catalog";
import { APP_NAME } from "@/lib/brand";
import { DEMO_LOCATION_DETECT_MS, getDemoLocationFoundResult } from "@/lib/location";
import { usePrototypeStore } from "@/store/prototypeStore";

export function SplashPage() {
  const navigate = useNavigate();
  const setLocationDetection = usePrototypeStore((s) => s.setLocationDetection);
  const locationDetectStatus = usePrototypeStore((s) => s.locationDetectStatus);
  const locationDetectMessage = usePrototypeStore((s) => s.locationDetectMessage);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    setLocationDetection({
      status: "detecting",
      message: "Buscando tu ubicación…",
      district: null,
      firstName: null,
    });

    const timer = window.setTimeout(() => {
      const result = getDemoLocationFoundResult();
      setLocationDetection({
        status: result.status,
        district: result.district,
        message: result.message,
      });
      setReady(true);
    }, DEMO_LOCATION_DETECT_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [setLocationDetection]);

  const detecting = !ready || locationDetectStatus === "detecting";

  return (
    <div className="splash-root app-gradient-bg on-gradient relative mx-auto flex min-h-full w-full max-w-[430px] flex-col overflow-hidden shadow-2xl ring-1 ring-black/20">
      <div className="splash-glow pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative flex flex-1 flex-col px-6 pb-10 pt-14">
        <div className="splash-fade-in relative mx-auto h-44 w-full max-w-[280px] overflow-visible">
          {splashFloatingIconsPaintOrder.map((item) => (
            <div
              key={item.src}
              className="splash-float absolute flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl bg-white p-1.5 shadow-md ring-1 ring-border"
              style={{
                left: item.x,
                top: item.y,
                zIndex: item.zIndex,
                animationDelay: item.delay,
              }}
              title={`${item.label}: ${item.alt}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="h-full w-full object-contain drop-shadow-sm"
                loading="eager"
                decoding="async"
              />
            </div>
          ))}
          <div
            className={`splash-float absolute left-1/2 top-[36%] z-40 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-brand text-2xl shadow-lg ${detecting ? "splash-locate-pulse" : ""}`}
            style={{ animationDelay: "0.2s" }}
          >
            {detecting ? "📍" : "🏘️"}
          </div>
        </div>

        <div className="splash-fade-in splash-fade-in-delay mt-10 text-center">
          <h1 className="font-serif text-5xl font-bold tracking-tight text-ink">
            {APP_NAME}
          </h1>
          <p className="mx-auto mt-4 max-w-[280px] text-base leading-relaxed text-ink-muted">
            Lo que sobra en una casa puede ser justo lo que tu vecino necesita.
            Sin precio, sin vueltas. Puro <em>barrio</em>.
          </p>
        </div>

        <div
          className="splash-fade-in splash-fade-in-delay-2 mx-auto mt-8 w-full max-w-[320px] rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-border"
          role="status"
          aria-live="polite"
        >
          {detecting ? (
            <p className="flex items-center justify-center gap-2 text-ink-muted">
              <span className="splash-spinner inline-block h-4 w-4 rounded-full border-2 border-brand border-t-transparent" />
              Buscando tu ubicación para mostrarte lo cerca…
            </p>
          ) : (
            <div className="space-y-1 text-center">
              <p className="text-xl font-bold text-brand">{PILOT_DISTRICT}</p>
              <p className="text-sm leading-relaxed text-ink-muted">
                {locationDetectMessage}
              </p>
            </div>
          )}
        </div>

        <div className="splash-fade-in splash-fade-in-delay-3 mt-auto space-y-3 pt-10">
          <button
            type="button"
            disabled={!ready}
            onClick={() => navigate("/onboarding")}
            className="w-full rounded-2xl bg-brand py-4 text-base font-semibold text-white shadow-md transition enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {ready ? "Continuar" : "Un momento…"}
          </button>
          <p className="text-center text-xs text-ink-muted">
            {ready
              ? "Siguiente: confirma tu distrito y entra al feed de vecinos."
              : "Estamos ubicando tu barrio…"}
          </p>
        </div>
      </div>
    </div>
  );
}
