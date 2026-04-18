// Shopify Storefront API Configuration
// 请在 Shopify Admin → Settings → Apps and sales channels → Develop apps 中获取
// 本地請設定 VITE_SHOPIFY_STORE_DOMAIN、VITE_SHOPIFY_STOREFRONT_TOKEN（勿提交 .env）

const DEFAULT_DOMAIN = 'YOUR_STORE.myshopify.com';
const DEFAULT_TOKEN = '<SHOPIFY_STOREFRONT_ACCESS_TOKEN>';

export const shopifyConfig = {
  storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || DEFAULT_DOMAIN,
  storefrontAccessToken:
    import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || DEFAULT_TOKEN,
  apiVersion: '2026-01',
};

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
