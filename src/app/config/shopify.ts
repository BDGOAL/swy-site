// Shopify Storefront API Configuration
// 请在 Shopify Admin → Settings → Apps and sales channels → Develop apps 中获取
// 本地請設定 VITE_SHOPIFY_STORE_DOMAIN、VITE_SHOPIFY_STOREFRONT_TOKEN（勿提交 .env）

const DEFAULT_DOMAIN = 'YOUR_STORE.myshopify.com';
const DEFAULT_TOKEN = '<SHOPIFY_STOREFRONT_ACCESS_TOKEN>';

/** Storefront `LanguageCode` for `@inContext` (cart / localized prices). */
function resolveStorefrontLanguageCode(): 'EN' | 'ZH_TW' {
  const raw = String(import.meta.env.VITE_SHOPIFY_LANGUAGE_CODE || '')
    .toUpperCase()
    .replace(/-/g, '_');
  if (raw === 'ZH_TW' || raw === 'ZH' || raw.includes('ZH')) return 'ZH_TW';
  return 'EN';
}

/** Storefront `CountryCode` for markets (HK, TW, US, …). */
function resolveBuyerCountryCode(): string {
  const raw = String(import.meta.env.VITE_SHOPIFY_COUNTRY_CODE || 'HK')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
  return raw.length === 2 ? raw : 'HK';
}

export const shopifyConfig = {
  storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || DEFAULT_DOMAIN,
  storefrontAccessToken:
    import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || DEFAULT_TOKEN,
  apiVersion: '2026-01',
  /** Align cart & checkout money with the storefront market (set `VITE_SHOPIFY_COUNTRY_CODE`, e.g. HK or TW). */
  buyerCountryCode: resolveBuyerCountryCode(),
  /** Match PDP / buyer locale (`VITE_SHOPIFY_LANGUAGE_CODE`, e.g. zh-TW → ZH_TW). */
  storefrontLanguageCode: resolveStorefrontLanguageCode(),
};

/** Append to Storefront queries/mutations so pricing & currency match the configured market. */
export function storefrontInContextDirective(): string {
  return `@inContext(language: ${shopifyConfig.storefrontLanguageCode}, country: ${shopifyConfig.buyerCountryCode})`;
}

const PLACEHOLDER_DOMAINS = new Set([DEFAULT_DOMAIN, '']);

const PLACEHOLDER_TOKENS = new Set([
  '',
  DEFAULT_TOKEN,
  'YOUR_STOREFRONT_ACCESS_TOKEN',
  'YOUR_SHOPIFY_ACCESS_TOKEN',
]);

// 验证配置是否完成
export const isShopifyConfigured = () => {
  const domain = (shopifyConfig.storeDomain ?? '').trim();
  const token = (shopifyConfig.storefrontAccessToken ?? '').trim();
  if (PLACEHOLDER_DOMAINS.has(domain)) return false;
  if (PLACEHOLDER_TOKENS.has(token)) return false;
  return true;
};
