import { useNavigate } from "react-router-dom";
import { APP_NAME } from "@/lib/brand";

export function TermsOfUsePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 px-4 pb-10">
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

      <h1 className="text-3xl font-bold">Términos de Uso</h1>
      <p className="text-sm text-emerald-100/90">Última actualización: octubre 2026</p>

      <article className="space-y-4 rounded-2xl bg-white p-5 text-sm leading-relaxed text-ink ring-1 ring-border">
        <p className="text-ink-muted">
          Al usar <strong className="text-ink">{APP_NAME}</strong> aceptas estos
          términos. Son un borrador para el prototipo; la versión final será revisada
          legalmente antes del lanzamiento en Perú.
        </p>

        <section>
          <h2 className="text-base font-bold text-ink">1. Qué es {APP_NAME}</h2>
          <p className="text-ink-muted">
            {APP_NAME} es una comunidad hiperlocal para regalar y pedir cosas entre
            vecinos, sin precio ni trueque en el MVP. No somos marketplace, tienda ni
            servicio de mensajería.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">2. Reglas de la comunidad</h2>
          <ul className="list-disc space-y-1 pl-5 text-ink-muted">
            <li>No se vende, no se cambia por dinero ni se usa para negocios.</li>
            <li>Quien publica un Regalo elige a quién se lo da; quien publica un Pedido elige la oferta.</li>
            <li>Coordinación de entrega por WhatsApp u otros medios acordados entre vecinos.</li>
            <li>Entregas seguras: portería, lugar público o acuerdo entre partes.</li>
            <li>Reporta conducta abusiva, estafas o pedidos de pago.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">3. Tu cuenta</h2>
          <p className="text-ink-muted">
            Debes ser mayor de edad, dar información veraz y mantener tu celular
            verificado. Eres responsable de lo que publicas y de cumplir la ley
            peruana.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">4. Contenido</h2>
          <p className="text-ink-muted">
            Conservas derechos sobre tus fotos y textos; nos concedes licencia para
            mostrarlos en el Servicio. Podemos retirar publicaciones que violen
            reglas o la ley.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">5. Suscripción de apoyo</h2>
          <p className="text-ink-muted">
            Funciones opcionales de “Apoya a tu Barrio” se facturan por las tiendas
            Apple/Google según sus términos. Los precios y beneficios se muestran antes
            de confirmar la compra.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">6. Limitación de responsabilidad</h2>
          <p className="text-ink-muted">
            {APP_NAME} no garantiza la calidad, seguridad o legalidad de los objetos
            intercambiados. Los acuerdos son entre vecinos; usa tu criterio y reporta
            problemas graves.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">7. Ley aplicable</h2>
          <p className="text-ink-muted">
            Estos términos se rigen por las leyes de la República del Perú. Foro:
            Lima, salvo norma imperativa en favor del consumidor.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">8. Contacto</h2>
          <p className="text-ink-muted">
            Dudas: legal@barrio.app (placeholder).
          </p>
        </section>
      </article>
    </div>
  );
}
