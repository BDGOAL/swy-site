/** Top-level app routes (no hash). Use with `withLangPath` / `localizePath` (Chinese default omits `lang`; English uses `?lang=en`). */
export const ROUTES = {
  home: "/",
  collection: "/collection",
  contact: "/contact",
  landing: "/landing",
  product: (id: string) => `/product/${id}`,
} as const;
