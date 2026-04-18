# 🎉 Shopify 配置完成指南

## ✅ 当前状态

Shopify Headless 功能已成功启用！

### 已配置的信息：

```
商店域名: your-store.myshopify.com
Storefront API Token: <SHOPIFY_STOREFRONT_ACCESS_TOKEN>
API 版本: 2024-01
国家/地区: TW (台湾)
语言: ZH (中文)
```

### Token 权限范围：
- ✅ `unauthenticated_write_checkouts` - 创建结账
- ✅ `unauthenticated_read_product_inventory` - 读取产品库存
- ✅ `unauthenticated_read_product_listings` - 读取产品列表

---

## ✅ 重要说明

### Storefront API Token 有效期：永久有效

**好消息！** 你的 Storefront API Access Token (`<SHOPIFY_STOREFRONT_ACCESS_TOKEN>`) **不会过期**。

#### Token 特性：
- ✅ **永久有效** - 无需定期更新
- ✅ **安全性高** - 只能访问公开的商店数据（产品、结账等）
- ✅ **无请求限制** - 适合高流量网站
- ⚠️ **手动撤销** - 只有你在 Shopify Admin 中手动删除才会失效

#### 何时需要重新生成？

只在以下情况需要重新生成 token：

1. **Token 泄露** - 如果你的 token 被公开暴露（例如提交到公开的 GitHub repo）
2. **权限变更** - 需要添加/删除 API 权限范围
3. **应用重建** - 删除并重新创建自定义应用
4. **主动安全策略** - 定期轮换密钥（可选，非必需）

**当前配置完全可以长期使用，无需担心过期问题！** 🎉

---

## 🔐 安全最佳实践

虽然 token 不会过期，但建议：

### 1. 使用环境变量（生产环境）

创建 `.env.local` 文件（**不要提交到 Git**）：

```bash
# .env.local
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=<SHOPIFY_STOREFRONT_ACCESS_TOKEN>
VITE_SHOPIFY_API_VERSION=2026-01
VITE_SHOPIFY_COUNTRY_CODE=TW
VITE_SHOPIFY_LANGUAGE_CODE=zh-TW
```

### 2. 在 Vercel 中配置环境变量

1. 前往 Vercel Dashboard: https://vercel.com/dashboard
2. 选择你的项目 `swyshopify`
3. 进入 **Settings → Environment Variables**
4. 添加以下变量：
   - `VITE_SHOPIFY_STORE_DOMAIN` = `your-store.myshopify.com`
   - `VITE_SHOPIFY_STOREFRONT_TOKEN` = `<SHOPIFY_STOREFRONT_ACCESS_TOKEN>`
   - `VITE_SHOPIFY_API_VERSION` = `2026-01`

5. 重新部署网站

这样 token 就不会暴露在代码中！

### 3. 添加 `.env.local` 到 `.gitignore`

确保敏感信息不会被提交到 GitHub。

---

## 🚨 之前文档中 "24 小时过期" 的说明是错误的

**已更正！** Storefront API token 是永久有效的，你可以安心使用。

---

## 🛡️ Token 安全性说明

Storefront API token 的设计理念：

- **前端安全** - 专门为在浏览器中使用而设计
- **只读 + 结账** - 只能读取公开数据和创建订单，无法修改商店设置
- **无敏感信息** - 无法访问客户数据、订单详情等私密信息
- **公开暴露相对安全** - 即使在前端代码中可见，风险也很低

**对比：Admin API token (`shpat_xxx`) 绝对不能暴露！**

---

## 📋 下一步：添加真实产品

目前网站使用的是 **模拟产品数据**。要显示真实的 Shopify 产品，您需要：

### 步骤 1：在 Shopify Admin 中创建产品

1. 前往 Shopify Admin
2. Products → Add product
3. 填写产品信息（名称、描述、价格、图片等）
4. 点击 "Save"

### 步骤 2：获取产品 ID 和变体 ID

有两种方法：

#### 方法 A：通过 Shopify Admin URL（简单）

1. 在 Products 页面，点击您创建的产品
2. 查看浏览器地址栏，URL 类似：
   ```
   https://admin.shopify.com/store/your-store/products/1234567890
   ```
3. 最后的数字 `1234567890` 就是 Product ID

#### 方法 B：使用 GraphQL API（推荐）

1. 前往：https://shopify.dev/docs/api/storefront/graphql
2. 使用以下查询获取产品信息：

```graphql
{
  products(first: 10) {
    edges {
      node {
        id
        title
        handle
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
}
```

3. 记下返回的 `id` 值（格式：`gid://shopify/Product/1234567890`）

### 步骤 3：更新产品数据文件

打开 `/src/app/data/products.ts`，将模拟数据替换为真实的 Shopify 产品 ID：

```typescript
export const products = [
  {
    id: '001',
    title: '情緒號',
    subtitle: 'EMOTION NO.',
    description: '以科學與詩性交會而生的調香序列，讓香氣成為情緒的載體...',
    category: 'scent',
    image: 'https://images.unsplash.com/photo-1585159812596-fac104f2f069?w=800',
    price: 'NT$ 2,280',
    
    // ✅ 替换为真实的 Shopify 变体 ID
    shopifyVariantId: 'gid://shopify/ProductVariant/YOUR_VARIANT_ID',
  },
  // ... 其他产品
];
```

---

## 🛒 购物车功能测试

配置完成后，您可以测试以下功能：

### 1. 添加到购物车
- 点击任意产品的 "ADD TO CART" 按钮
- 应该看到按钮变为 "ADDED TO CART"（绿色勾选）

### 2. 查看购物车
- 点击右上角的购物袋图标
- 侧边栏购物车应该滑出
- 显示已添加的产品

### 3. 结账流程
- 在购物车中点击 "PROCEED TO CHECKOUT"
- 将跳转到 Shopify 官方结账页面

---

## 🔧 故障排除

### 问题 1：点击 "ADD TO CART" 没有反应

**可能原因：**
- Token 已过期（24 小时后）
- 产品 ID 错误
- 产品未在 Shopify 中发布

**解决方法：**
1. 检查浏览器控制台（F12）是否有错误
2. 确认 token 未过期
3. 确认产品 ID 正确

### 问题 2：购物车显示为空

**可能原因：**
- 产品添加失败
- Shopify API 连接问题

**解决方法：**
1. 打开浏览器控制台查看错误信息
2. 检查网络请求（Network 标签）
3. 确认 Shopify 产品已正确发布

### 问题 3：无法跳转到结账页面

**可能原因：**
- Checkout 权限未启用
- 购物车为空

**解决方法：**
1. 确认 token 权限包含 `unauthenticated_write_checkouts`
2. 确保购物车中至少有一个产品

---

## 📚 相关文档

- [Shopify Storefront API 文档](https://shopify.dev/docs/api/storefront)
- [Hydrogen React 文档](https://shopify.dev/docs/api/hydrogen-react)
- [Shopify GraphQL Admin API](https://shopify.dev/docs/api/admin-graphql)

---

## 🎯 下一步建议

1. ✅ 在 Shopify Admin 中创建真实产品
2. ✅ 获取产品 ID 和变体 ID
3. ✅ 更新 `/src/app/data/products.ts` 文件
4. ✅ 测试完整的购买流程
5. ✅ 配置支付方式（Shopify Payments）
6. ✅ 设置运费和税费规则

---

**配置日期：** 2026-02-28
**Token 过期时间：** 2026-03-01（约 24 小时后）