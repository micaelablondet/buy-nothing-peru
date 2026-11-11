/** Peruvian Spanish (informal tú). SPEC §0 / AGENTS.md §4. */

export const copy = {
  appName: "Barrio",
  tagline: "Regala y pide entre vecinos, sin precio.",

  entrar: {
    title: "Tu barrio empieza contigo",
    body: "En Phase 0 esto es una sesión de prueba. El ingreso con Google llega en M1.",
    cta: "Continuar como Mica (prueba)",
    note: "Solo desarrollo — no es una cuenta real.",
  },

  shell: {
    home: "Inicio",
    search: "Busca",
    publish: "Publica",
    profile: "Perfil",
    emptyHomeTitle: "Aquí verás el feed",
    emptyHomeBody:
      "M0: shell autenticado vacío. Regalos y Pedidos llegan en M2.",
    emptySearch: "La búsqueda llega más adelante.",
    emptyPublish: "Publicar Regalo o Pido llega en M2.",
    emptyProfile: "Perfil e invite code llegan en M1.",
    signOut: "Salir",
    seedLabel: "Datos seed",
    healthOk: "API lista",
  },

  errors: {
    session: "No pudimos iniciar la sesión de prueba.",
    network: "Sin conexión con el servidor.",
  },
} as const;

export type Copy = typeof copy;
