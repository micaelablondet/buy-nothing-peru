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
    myPosts: "Mis publicaciones",
  },

  shell: {
    home: "Inicio",
    search: "Busca",
    publish: "Publica",
    profile: "Perfil",
    navAria: "Principal",
    greeting: "Hola, {name}",
    emptySearch: "La búsqueda llega más adelante.",
    signOut: "Salir",
  },

  feed: {
    tabRegalos: "Regalos",
    tabPidos: "Pidos",
    emptyRegalos: "Aún no hay regalos abiertos en tu distrito.",
    emptyPidos: "Aún no hay pedidos abiertos en tu distrito.",
    allCategories: "Todas",
    by: "de {name}",
  },

  publish: {
    title: "Publica",
    chooseType: "¿Qué quieres publicar?",
    regalo: "Regalo",
    pido: "Pido",
    regaloHint: "Algo que das gratis a un vecino.",
    pidoHint: "Algo que necesitas; un vecino puede ofrecerlo.",
    titleLabel: "Título",
    descriptionLabel: "Descripción",
    categoryLabel: "Categoría",
    photosLabel: "Fotos",
    photosHintRegalo: "1 a 3 fotos (obligatorio).",
    photosHintPido: "Foto de referencia opcional (máx. 1).",
    addPhotos: "Agregar fotos",
    photosSelected: "{count} foto(s)",
    submit: "Publicar",
    publishing: "Publicando…",
  },

  post: {
    back: "Volver",
    withdraw: "Retirar publicación",
    withdrawConfirm: "¿Retirar esta publicación? Dejará de verse en el feed.",
    verInteresados: "Ver interesados",
    verOfertas: "Ver ofertas",
    meInteresa: "Me interesa",
    yoTengo: "Yo tengo",
    responsesEmpty: "Aún no hay respuestas. Llegan en el siguiente paso (M3).",
    respondSoon: "Responder llega en el siguiente paso.",
    status: {
      open: "Abierto",
      chosen: "Elegido",
      delivered: "Entregado",
      withdrawn: "Retirado",
      expired: "Venció",
      removed: "Removido",
      closed: "Cerrado",
    },
    yaResuelto: "Ya resuelto",
    vencio: "Venció",
  },

  myPosts: {
    title: "Mis publicaciones",
    empty: "Todavía no has publicado nada.",
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
    notFound: "No encontramos esa publicación.",
  },
} as const;

export type Copy = typeof copy;
