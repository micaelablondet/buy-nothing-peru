import { useNavigate } from "react-router-dom";
import { APP_NAME } from "@/lib/brand";

export function PrivacyPolicyPage() {
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

      <h1 className="text-3xl font-bold">Política de Privacidad</h1>
      <p className="text-sm text-emerald-100/90">Última actualización: octubre 2026</p>

      <article className="prose-legal space-y-4 rounded-2xl bg-white p-5 text-sm leading-relaxed text-ink ring-1 ring-border">
        <p>
          Esta política describe cómo <strong>{APP_NAME}</strong> (el “Servicio”)
          trata la información personal de vecinos en Perú. Es un borrador para el
          prototipo; el texto legal definitivo será revisado por asesoría local antes
          del lanzamiento.
        </p>

        <section>
          <h2 className="text-base font-bold text-ink">1. Responsable</h2>
          <p className="text-ink-muted">
            El responsable del tratamiento de datos es el equipo de {APP_NAME}.
            Contacto de privacidad: privacidad@barrio.app (placeholder).
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">2. Datos que recopilamos</h2>
          <ul className="list-disc space-y-1 pl-5 text-ink-muted">
            <li>Nombre o cómo te conocen en el barrio, distrito y foto de perfil.</li>
            <li>Número de celular verificado (Perú) para confianza y coordinación.</li>
            <li>Publicaciones (Regalos, Pedidos), fotos opcionales e interacciones.</li>
            <li>Datos técnicos: identificador de dispositivo, versión de app y registros de uso agregados.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">3. Para qué usamos tus datos</h2>
          <ul className="list-disc space-y-1 pl-5 text-ink-muted">
            <li>Mostrarte publicaciones de tu distrito y gestionar tu cuenta.</li>
            <li>Permitir que elijas o seas elegido para un regalo o pedido.</li>
            <li>
              Compartir tu WhatsApp solo después de que alguien te elija (o tú elijas
              a alguien), para coordinar la entrega fuera de la app.
            </li>
            <li>Moderación, reportes y cumplimiento de las reglas (sin ventas).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">4. Con quién compartimos</h2>
          <p className="text-ink-muted">
            No vendemos tus datos. Compartimos lo mínimo con proveedores de hosting,
            verificación de SMS y analítica agregada bajo contrato. Otros vecinos ven
            tu nombre, distrito y publicaciones; tu número no aparece en el feed.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">5. Tus derechos</h2>
          <p className="text-ink-muted">
            Puedes acceder, corregir o eliminar tu cuenta, y oponerte a ciertos
            tratamientos, escribiendo a privacidad@barrio.app. Aplican plazos según
            la Ley N.° 29733 y su reglamento.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">6. Seguridad y retención</h2>
          <p className="text-ink-muted">
            Usamos medidas razonables para proteger la información. Conservamos datos
            mientras mantengas la cuenta y el tiempo necesario para obligaciones
            legales o disputas.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">7. Cambios</h2>
          <p className="text-ink-muted">
            Publicaremos cambios en esta página y, si son relevantes, te avisaremos en
            la app.
          </p>
        </section>
      </article>
    </div>
  );
}
