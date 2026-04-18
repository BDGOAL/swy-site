import { useEffect, useState } from 'react';
import { shopifyConfig, isShopifyConfigured } from '../config/shopify';

/**
 * Shopify 连接测试组件
 * 
 * 用于验证 Shopify Storefront API 是否正常工作
 * 仅用于开发测试，生产环境请删除
 */
export function ShopifyConnectionTest() {
  const [status, setStatus] = useState<'testing' | 'success' | 'error' | 'not-configured'>('testing');
  const [shopName, setShopName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (isShopifyConfigured()) {
      testConnection();
    } else {
      setStatus('not-configured');
    }
  }, []);

  const testConnection = async () => {
    setStatus('testing');
    
    try {
      const response = await fetch(
        `https://${shopifyConfig.storeDomain}/api/${shopifyConfig.apiVersion}/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontAccessToken,
          },
          body: JSON.stringify({
            query: `
              {
                shop {
                  name
                  description
                  primaryDomain {
                    url
                  }
                }
                products(first: 3) {
                  edges {
                    node {
                      id
                      title
                      handle
                    }
                  }
                }
              }
            `,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(JSON.stringify(data.errors[0], null, 2));
      }

      if (!data.data || !data.data.shop) {
        throw new Error('Invalid response: missing shop data');
      }

      setShopName(data.data.shop.name);
      setStatus('success');
      
      console.log('✅ Shopify 连接成功！', data);
    } catch (error) {
      setStatus('error');
      const errorMsg = error instanceof Error ? error.message : String(error);
      setErrorMessage(errorMsg);
      console.error('❌ Shopify 连接失败：', error);
    }
  };

  return (
    <div
      className="fixed bottom-8 left-8 z-50 p-6 max-w-md"
      style={{
        border: '0.5px solid rgba(242,240,237,0.2)',
        backgroundColor: 'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3
            className="text-[#F2F0ED]"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              letterSpacing: '0.3em',
            }}
          >
            SHOPIFY CONNECTION TEST
          </h3>
          <button
            onClick={() => document.getElementById('shopify-test')?.remove()}
            className="text-[#F2F0ED] opacity-50 hover:opacity-100 transition-opacity"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Status */}
        <div className="space-y-2">
          {status === 'testing' && (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span
                className="text-[#F2F0ED] opacity-70"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '9px',
                  letterSpacing: '0.2em',
                }}
              >
                Testing connection...
              </span>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span
                  className="text-[#F2F0ED] opacity-70"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                  }}
                >
                  ✅ CONNECTED
                </span>
              </div>
              <div
                className="text-[#F2F0ED] opacity-50"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '9px',
                }}
              >
                Shop: {shopName}
              </div>
              <div
                className="text-[#F2F0ED] opacity-30 text-[8px]"
                style={{
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Check console for full response
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span
                  className="text-[#F2F0ED] opacity-70"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                  }}
                >
                  ❌ CONNECTION FAILED
                </span>
              </div>
              <div
                className="text-red-400 opacity-70 text-[8px] max-w-xs break-words"
                style={{
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {errorMessage}
              </div>
              <div
                className="text-yellow-400 opacity-70 text-[8px] mt-3 max-w-xs"
                style={{
                  fontFamily: 'var(--font-sans)',
                }}
              >
                ⚠️ 提示: Storefront API token 不应以 "shpat_" 开头。
                <br/>
                请在 Shopify Admin → Settings → Apps and sales channels → Develop apps 
                → 创建自定义应用 → Storefront API → 获取 Access Token
              </div>
              <button
                onClick={testConnection}
                className="text-[#F2F0ED] opacity-50 hover:opacity-100 transition-opacity text-[8px] mt-3"
                style={{
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '0.2em',
                }}
              >
                RETRY
              </button>
            </div>
          )}

          {status === 'not-configured' && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span
                  className="text-[#F2F0ED] opacity-70"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                  }}
                >
                  ❌ NOT CONFIGURED
                </span>
              </div>
              <div
                className="text-red-400 opacity-70 text-[8px] max-w-xs break-words"
                style={{
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Shopify 配置未完成，请检查配置文件。
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}