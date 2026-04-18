# 🛍️ SWY Shopify Headless 集成指南

## ✅ 配置状态：已完成！

**商店域名：** `your-store.myshopify.com`  
**API Token：** 已配置并启用  
**配置日期：** 2026-02-28  
**Token 过期时间：** 约 24 小时后（需重新生成）

---

## 📋 总览

本项目使用 **Shopify Headless** 架构：
- ✅ 前端：完全自定义的 React 应用（保留所有精美交互）
- ✅ 后端：Shopify 管理产品、订单、支付、库存
- ✅ 连接：通过 Storefront API 实时同步数据

---

## 💰 费用说明

### 必需费用
- **Shopify 订阅**：$39-105 USD/月（约 ¥280-750/月）
  - Basic Plan ($39/月)：足够小型品牌使用
  - Shopify Plan ($105/月)：更多功能和更低手续费
  
### 免费部分
- ✅ Storefront API 使用：**完全免费**，无调用次数限制
- ✅ Headless 架构：**不需额外付费**

### 交易手续费
- 使用 Shopify Payments：2.0-2.9%（取决于订阅计划）
- 使用第三方支付：额外 0.5-2% 手续费

---

## 🔧 设置步骤

### 1️⃣ 创建 Shopify 商店

1. 访问 [Shopify 官网](https://www.shopify.com/tw)
2. 注册账号并创建商店
3. 选择订阅计划（建议从 Basic Plan 开始）
4. 填写商店信息（商店名称、地址、支付设置等）

---

### 2️⃣ 创建 Storefront API 应用

#### 步骤：

1. **登录 Shopify Admin**  
   访问：`https://admin.shopify.com/store/YOUR_STORE_NAME`

2. **导航到应用开发**  
   Settings → Apps and sales channels → **Develop apps**

3. **创建新应用**  
   点击 **"Create an app"**  
   应用名称：`SWY Headless Frontend`

4. **配置 Storefront API 权限**  
   点击 **"Configure Storefront API scopes"**  
   勾选以下权限：
   ```
   ✓ unauthenticated_read_product_listings    （读取产品列表）
   ✓ unauthenticated_read_product_inventory   （读取库存）
   ✓ unauthenticated_write_checkouts          （创建结账）
   ✓ unauthenticated_read_checkouts           （读取结账信息）
   ```

5. **保存并安装**  
   点击 **"Save"** → **"Install app"**

6. **获取 Access Token**  
   安装后，在 **"API credentials"** 标签页找到：
   - **Storefront API access token**  
   - 复制此 token（以 `shpat_` 开头）

---

### 3️⃣ 配置本地环境变量

1. **复制环境变量模板**
   ```bash
   cp .env.example .env
   ```

2. **编辑 `.env` 文件**
   ```env
   # 您的商店域名（例如：swy-brand.myshopify.com）
   VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   
   # 刚才复制的 Storefront API token
   VITE_SHOPIFY_STOREFRONT_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **保存文件**  
   ⚠️ 确保 `.env` 已加入 `.gitignore`，不要提交到 Git

---

### 4️⃣ 在 Shopify 添加产品

#### 产品设置要求：

1. **Handle（产品别名）**  
   必须与您的代码中的 `id` 匹配：
   ```
   代码中的 ID      →  Shopify Handle
   'the-last-snow'  →  the-last-snow
   'midnight-tide'  →  midnight-tide
   'amber-ritual'   →  amber-ritual
   ```

2. **产品信息填写**
   - **Title**：产品标题（例如：The Last Snow）
   - **Description**：产品描述
   - **Price**：价格（例如：NT$1,980）
   - **Images**：上传产品图片
   - **Inventory**：设置库存数量

3. **获取 Variant ID（变体 ID）**  
   创建产品后：
   - 进入产品详情页
   - 点击产品变体（Variants）
   - 复制 Variant ID（格式：`gid://shopify/ProductVariant/123456789`）
   - 这个 ID 将用于 "Add to Cart" 功能

---

### 5️⃣ 集成到现有组件

#### 方法 1：在产品详情页添加购买按钮

编辑 `/src/app/components/UnboxingExperience.tsx`：

```tsx
import { AddToCartButton } from './AddToCartButton';

// 在产品展示区域添加：
<AddToCartButton
  variantId="gid://shopify/ProductVariant/YOUR_VARIANT_ID"
  productName={product.nameEn}
  className="mt-8"
  onSuccess={() => {
    // 可选：显示成功提示或打开购物车
  }}
/>
```

#### ���法 2：在 Archive Grid 添加快速购买

编辑 `/src/app/components/CollectionGrid.tsx`：

```tsx
import { AddToCartButton } from './AddToCartButton';

// 在产品卡片中添加：
<AddToCartButton
  variantId={product.shopifyVariantId}
  productName={product.nameEn}
  className="w-full"
/>
```

---

### 6️⃣ 添加购物车功能

#### 在主应用中集成购物车：

编辑 `/src/app/App.tsx`：

```tsx
import { ShopifyProvider } from './shopify/ShopifyProvider';
import { ShoppingCart } from './components/ShoppingCart';
import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  return (
    <ShopifyProvider>
      {/* 购物车按钮（固定在右上角） */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed top-8 right-8 z-40 p-3 border border-[#F2F0ED]/30 hover:bg-[#F2F0ED]/10 transition-all"
      >
        <ShoppingBag size={20} color="#F2F0ED" />
      </button>

      {/* 购物车侧边栏 */}
      <ShoppingCart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      {/* 现有路由 */}
      <RouterProvider router={router} />
    </ShopifyProvider>
  );
}
```

---

## 📦 产品数据映射

### 当前本地数据 → Shopify 同步方案

您目前的产品数据在 `/src/app/data/products.ts`。有两种方式处理：

#### 方案 A：保留本地数据 + Shopify 补充（推荐）

```tsx
// 保留现有的艺术设计信息（主题、故事、情境图）
const localProduct = products.find(p => p.id === id);

// 从 Shopify 获取实时价格、库存、购物车功能
const { product: shopifyProduct } = useShopifyProduct(id);

// 合并数据
const mergedProduct = {
  ...localProduct,
  price: shopifyProduct?.price,
  inStock: shopifyProduct?.availableForSale,
  variantId: shopifyProduct?.variants[0]?.id,
};
```

#### 方案 B：完全使用 Shopify（需迁移数据）

- 将所有产品信息迁移到 Shopify Metafields
- 通过 GraphQL 查询完整数据
- 更复杂，但数据集中管理

**建议**：先使用方案 A，保持灵活性

---

## 🧪 测试步骤

### 1. 测试 API 连接

在浏览器控制台运行：
```javascript
fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
  },
  body: JSON.stringify({
    query: `{ shop { name } }`
  })
}).then(r => r.json()).then(console.log);
```

### 2. 测试添加购物车

1. 点击产品详情页的 "ADD TO CART" 按钮
2. 检查按钮是否变为 "ADDED TO CART"
3. 打开购物车侧边栏，确认产品已添加
4. 尝试修改数量、删除产品

### 3. 测试结账流程

1. 在购物车中点击 "PROCEED TO CHECKOUT"
2. 应跳转到 Shopify 官方结账页面
3. 完成测试订单（使用 Shopify 测试信用卡）

---

## 🚀 部署到生产环境

### Vercel 部署（推荐）

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Add Shopify integration"
   git push
   ```

2. **在 Vercel 导入项目**
   - 访问 [vercel.com](https://vercel.com)
   - Import Git Repository
   - 选择您的 GitHub 仓库

3. **设置环境变量**
   在 Vercel Dashboard：
   - Settings → Environment Variables
   - 添加：
     ```
     VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
     VITE_SHOPIFY_STOREFRONT_TOKEN=shpat_xxxxx
     ```

4. **部署**
   Vercel 会自动构建和部署

---

## 🔒 安全注意事项

### ✅ 安全的做法：
- Storefront API token 可以在前端使用（已限制权限）
- 仅允许读取产品和创建结账，无法管理商店

### ❌ 绝不要做：
- ❌ 不要在前端暴露 Admin API token
- ❌ 不要将 `.env` 文件提交到 Git
- ❌ 不要在公共代码中硬编码 token

---

## 📞 常见问题

### Q: 为什么 API 调用失败？
**A:** 检查：
1. `.env` 文件中的域名是否正确（不包含 `https://`）
2. Token 是否以 `shpat_` 开头
3. Storefront API 应用是否已安装
4. 产品的 Handle 是否与代码中的 ID 匹配

### Q: 产品无法添加到购物车？
**A:** 确认：
1. Variant ID 格式正确（`gid://shopify/ProductVariant/123456`）
2. 产品库存 > 0
3. 产品状态为 "Active"

### Q: 可以免费测试吗？
**A:** Shopify 提供 **14 天免费试用**，足够完成开发和测试

---

## 📚 相关资源

- [Shopify Hydrogen React 文档](https://shopify.dev/docs/api/hydrogen-react)
- [Storefront API 参考](https://shopify.dev/docs/api/storefront)
- [Shopify 免费试用](https://www.shopify.com/tw/free-trial)

---

## ✅ 下一步

完成设置后，您将拥有：
- ✅ 完全自定义的前端（保留所有艺术交互）
- ✅ Shopify 电商后台（产品管理、订单、支付）
- ✅ 实时库存同步
- ✅ 安全的结账流程
- ✅ 专业的订单管理系统

需要帮助？查看文档或联系 Shopify 支持团队！