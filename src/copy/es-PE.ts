/** Peruvian Spanish (informal tú). SPEC §0 / AGENTS.md §4. */

export const copy = {
  appName: "Barrio",
  tagline: "Regala y pide entre vecinos, sin precio.",

  entrar: {
    title: "Tu barrio empieza contigo",
    body: "Entra con Google para regalar y pedir en tu edificio.",
    ctaGoogle: "Continuar con Google",
    ctaStub: "Continuar con cuenta seed (dev)",
    note: "Solo pedimos nombre, correo (Google) y luego tu WhatsApp.",
    terms: "Términos de uso",
    privacy: "Política de privacidad",
    oauthError: "No pudimos completar el ingreso con Google. Intenta de nuevo.",
    googleMissing:
      "Google no está configurado aún. Pide a Mica las credenciales o usa el modo seed en local.",
  },

  invite: {
    title: "Código de invitación",
    body: "Por ahora Barrio es solo para el piloto del edificio. Pide el código en el grupo de WhatsApp.",
    codeLabel: "Código",
    placeholder: "Ej. BARRIO-PILOTO",
    cta: "Entrar",
    invalid: "Código inválido",
  },

  onboarding: {
    title: "Completa tu perfil",
    body: "Necesitamos tu WhatsApp para coordinar entregas (no se muestra en el feed).",
    name: "Nombre",
    whatsapp: "WhatsApp",
    whatsappHint: "Celular peruano, 9 dígitos (ej. 987654321)",
    whatsappPlaceholder: "987654321",
    district: "Distrito",
    cta: "Guardar y continuar",
  },

  profile: {
    title: "Mi perfil",
    edit: "Guardar cambios",
    saved: "Perfil actualizado.",
    delete: "Eliminar mi cuenta",
    deleteConfirm:
      "Esto borra tus datos personales y retira tus publicaciones abiertas. ¿Continuar?",
    deleted: "Cuenta eliminada.",
  },

  shell: {
    home: "Inicio",
    search: "Busca",
    publish: "Publica",
    profile: "Perfil",
    greeting: "Hola, {name}",
    emptyHomeTitle: "Aquí verás el feed",
    emptyHomeBody:
      "M1: ya puedes entrar con Google e completar tu perfil. El feed llega en M2.",
    emptySearch: "La búsqueda llega más adelante.",
    emptyPublish: "Publicar Regalo o Pido llega en M2.",
    signOut: "Salir",
    seedLabel: "Datos seed",
    healthOk: "API lista",
  },

  legal: {
    termsTitle: "Términos de uso",
    privacyTitle: "Política de privacidad",
    back: "Volver",
    termsIntro:
      "Barrio es una app de regalo entre vecinos. No se vende ni se cobra por los objetos publicados. Al usar Barrio aceptas estas reglas de comunidad.",
    termsUseTitle: "Uso permitido",
    termsUseItems: [
      "Solo regalar o pedir cosas entre vecinos, sin plata.",
      "Coordinar la entrega por WhatsApp de forma respetuosa.",
      "No publicar armas, drogas, alcohol, medicinas, animales vivos, objetos robados o ilegales, ni comida perecible abierta.",
    ],
    termsAccountsTitle: "Cuentas",
    termsAccountsBody:
      "El acceso es con Google. Puedes eliminar tu cuenta desde el perfil; eso borra tus datos personales según la Política de privacidad.",
    privacyIntro:
      "Esta política explica qué datos guarda Barrio en el piloto y para qué.",
    privacyWhatTitle: "Qué guardamos",
    privacyWhatItems: [
      "Nombre y correo vía Google (inicio de sesión).",
      "Número de WhatsApp que tú declaras (para coordinar entregas).",
      "Distrito y publicaciones (texto y fotos que subas).",
    ],
    privacyWhyTitle: "Para qué",
    privacyWhyBody:
      "Operar el regalo y el pedido entre vecinos, mostrar tu nombre en el feed y revelar el WhatsApp solo a las dos personas de una entrega acordada.",
    privacyDeleteTitle: "Cómo borrar tus datos",
    privacyDeleteBody:
      "En Perfil → Eliminar mi cuenta borramos nombre, correo, WhatsApp y el vínculo con Google; retiramos publicaciones abiertas; en entregas ya cerradas tu nombre pasa a «Ex vecino».",
    meta: "Versión piloto · Barranco · 2026",
  },

  errors: {
    session: "No pudimos iniciar sesión.",
    network: "Sin conexión con el servidor.",
    forbidden: "No tienes permiso.",
  },
} as const;

export type Copy = typeof copy;
