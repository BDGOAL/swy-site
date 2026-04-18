/**
 * ==========================================
 * 💡 Shopify 集成使用示例
 * ==========================================
 * 
 * 本文件展示如何在现有组件中添加 Shopify 购物车功能
 * 复制相关代码到实际组件中使用
 */

// ==========================================
// 示例 1: 在产品详情页添加购买按钮
// ==========================================

import { AddToCartButton } from './components/AddToCartButton';

function UnboxingExperienceExample() {
  const product = {
    id: 'the-last-snow',
    nameEn: 'The Last Snow',
    // TODO: 从 Shopify Admin 获取真实的 Variant ID
    shopifyVariantId: 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_HERE',
  };

  return (
    <div className="product-details">
      {/* 产品信息展示... */}
      
      {/* 添加购买按钮 */}
      <AddToCartButton
        variantId={product.shopifyVariantId || 'gid://shopify/ProductVariant/123456'}
        productName={product.nameEn}
        className="mt-8"
        onSuccess={() => {
          console.log('Product added to cart!');
          // 可选：显示通知、打开购物车等
        }}
      />
    </div>
  );
}


// ==========================================
// 示例 2: 在产品列表中添加快速购买
// ==========================================

import { products } from './data/products';
import { AddToCartButton } from './components/AddToCartButton';

function CollectionGridExample() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <h3>{product.nameEn}</h3>
          <p>{product.themeEn}</p>
          
          {/* 快速购买按钮 */}
          {product.shopifyVariantId && (
            <AddToCartButton
              variantId={product.shopifyVariantId}
              productName={product.nameEn}
              className="w-full mt-4"
            />
          )}
        </div>
      ))}
    </div>
  );
}


// ==========================================
// 示例 3: 显示实时 Shopify 产品价格
// ==========================================

import { useShopifyProduct } from './shopify/hooks/useShopifyProduct';

function ProductPriceExample() {
  const productId = 'the-last-snow'; // 必须与 Shopify Handle 匹配
  const { product, loading } = useShopifyProduct(productId);

  if (loading) return <p>Loading price...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div>
      <h2>{product.title}</h2>
      <p className="price">
        {product.currency} ${parseFloat(product.price).toFixed(2)}
      </p>
      
      {/* 库存状态 */}
      {product.availableForSale ? (
        <span className="in-stock">In Stock</span>
      ) : (
        <span className="out-of-stock">Sold Out</span>
      )}
      
      {/* 购买按钮 */}
      {product.variants[0] && (
        <AddToCartButton
          variantId={product.variants[0].id}
          productName={product.title}
        />
      )}
    </div>
  );
}


// ==========================================
// 示例 4: 显示购物车商品数量徽章
// ==========================================

import { useShopifyCart } from './shopify/hooks/useShopifyCart';
import { ShoppingBag } from 'lucide-react';

function CartBadgeExample() {
  const { itemCount } = useShopifyCart();

  return (
    <button className="cart-button relative">
      <ShoppingBag size={20} />
      
      {/* 商品数量徽章 */}
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {itemCount}
        </span>
      )}
    </button>
  );
}


// ==========================================
// 示例 5: 在 products.ts 中添加 Shopify 字段
// ==========================================

/**
 * 更新步骤：
 * 
 * 1. 在 Shopify Admin 创建产品
 *    - 确保产品 Handle 与代码中的 id 匹配（例如：'the-last-snow'）
 * 
 * 2. 获取 Variant ID
 *    - 进入产品详情页 → 点击变体
 *    - 复制 Variant ID（格式：gid://shopify/ProductVariant/12345678）
 * 
 * 3. 更新 products.ts
 */

const productsWithShopify = [
  {
    id: 'the-last-snow', // 必须与 Shopify Handle 完全一致
    nameEn: 'The Last Snow',
    // ... 其他字段
    
    // 添加 Shopify 字段
    shopifyVariantId: 'gid://shopify/ProductVariant/48012345678901',
    price: '1980', // 可选：硬编码价格或从 Shopify 实时获取
  },
  {
    id: 'the-first-rose',
    nameEn: 'The First Rose',
    // ...
    shopifyVariantId: 'gid://shopify/ProductVariant/48012345678902',
  },
  // ...
];


// ==========================================
// 示例 6: 完整的产品详情页集成
// ==========================================

import { useShopifyProduct } from './shopify/hooks/useShopifyProduct';
import { AddToCartButton } from './components/AddToCartButton';
import { products } from './data/products';

function CompleteProductPageExample({ productId }: { productId: string }) {
  // 本地设计数据（主题、故事、情境图）
  const localProduct = products.find(p => p.id === productId);
  
  // Shopify 实时数据（价格、库存）
  const { product: shopifyProduct, loading } = useShopifyProduct(productId);

  if (!localProduct) return <div>Product not found</div>;

  return (
    <div className="product-page">
      {/* 使用本地数据展示设计内容 */}
      <h1>{localProduct.nameEn}</h1>
      <p className="theme">{localProduct.themeEn}</p>
      <p className="story">{localProduct.storyEn}</p>

      {/* 使用 Shopify 数据展示价格和库存 */}
      {loading ? (
        <p>Loading...</p>
      ) : shopifyProduct ? (
        <>
          <p className="price">
            {shopifyProduct.currency} ${parseFloat(shopifyProduct.price).toFixed(2)}
          </p>
          
          {shopifyProduct.availableForSale ? (
            <AddToCartButton
              variantId={shopifyProduct.variants[0].id}
              productName={shopifyProduct.title}
            />
          ) : (
            <button disabled>Sold Out</button>
          )}
        </>
      ) : (
        // Fallback: 使用本地硬编码的 Variant ID
        localProduct.shopifyVariantId && (
          <AddToCartButton
            variantId={localProduct.shopifyVariantId}
            productName={localProduct.nameEn}
          />
        )
      )}

      {/* 香调金字塔等设计内容 */}
      <div className="notes">
        <h3>Note Pyramid</h3>
        <div>Top: {localProduct.notes.top.join(', ')}</div>
        <div>Middle: {localProduct.notes.middle.join(', ')}</div>
        <div>Base: {localProduct.notes.base.join(', ')}</div>
      </div>
    </div>
  );
}


// ==========================================
// 💡 快速上手步骤
// ==========================================

/**
 * 1. 完成 Shopify 设置（参考 SHOPIFY_SETUP.md）
 *    - 创建 Shopify 商店
 *    - 获取 Storefront API token
 *    - 配置 .env 文件
 * 
 * 2. 在 Shopify Admin 添加产品
 *    - 产品 Handle 必须与代码中的 id 匹配
 *    - 例如：代码中 'the-last-snow' → Shopify Handle 'the-last-snow'
 * 
 * 3. 获取 Variant ID
 *    - 进入产品详情 → 复制 Variant ID
 *    - 格式：gid://shopify/ProductVariant/12345678
 * 
 * 4. 更新 products.ts
 *    - 添加 shopifyVariantId 字段到每个产品
 * 
 * 5. 在组件中添加 AddToCartButton
 *    - 复制上方示例代码
 *    - 传入正确的 variantId
 * 
 * 6. 测试购物车功能
 *    - 点击 "Add to Cart"
 *    - 打开购物车侧边栏
 *    - 点击 "Proceed to Checkout"
 */


// ==========================================
// ⚠️ 常见错误和解决方法
// ==========================================

/**
 * 错误 1: "Product not found"
 * 解决: 确保 Shopify 产品 Handle 与代码中的 id 完全匹配
 * 
 * 错误 2: "Failed to add to cart"
 * 解决: 检查 Variant ID 格式是否正确（必须以 gid:// 开头）
 * 
 * 错误 3: API 调用失败
 * 解决: 检查 .env 文件中的配置是否正确
 * 
 * 错误 4: 购物车为空
 * 解决: 确保 ShopifyProvider 已正确包裹在 App.tsx 中
 */

export {
  UnboxingExperienceExample,
  CollectionGridExample,
  ProductPriceExample,
  CartBadgeExample,
  CompleteProductPageExample,
};
