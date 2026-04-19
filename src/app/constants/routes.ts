/** Top-level app routes (no hash). Use with `withLangPath` / `localizePath` for locale query. */
export const ROUTES = {
  home: "/",
  collection: "/collection",
  contact: "/contact",
  landing: "/landing",
  product: (id: string) => `/product/${id}`,
} as const;
