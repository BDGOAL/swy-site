# 🛒 SWY Shopify 集成完整指南

## ✅ 已完成的工作

你的网站已经集成好 Shopify 架构，包括：

1. ✅ **ShopifyContext** - 购物车状态管理
2. ✅ **ShoppingCart 组件** - 侧边栏购物车UI
3. ✅ **产品详情页购买按钮** - 在 UnboxingExperience Step 3 显示
4. ✅ **购物车图标按钮** - 右上角固定位置，带数量徽章
5. ✅ **本地存储** - 购物车数据持久化到 localStorage

---

## 📋 下一步：连接到你的 Shopify Store

### **Step 1: 在 Shopify 后台创建 App**

1. 登录你的 **Shopify Admin** (例如: `your-store.myshopify.com/admin`)

2. 进入 **Settings → Apps and sales channels**

3. 点击 **Develop apps**（如果第一次使用，需要先启用 Custom App Development）

4. 点击 **Create an app**
   - App name: `SWY Website` (或任意名称)
   - App developer: 选择你的账号

5. 点击 **Configure Storefront API scopes**

6. 勾选以下权限：
   ```
   ☑ unauthenticated_read_product_listings
   ☑ unauthenticated_read_product_inventory  
   ☑ unauthenticated_write_checkouts
   ☑ unauthenticated_read_checkouts
   ```

7. 点击 **Save**

8. 点击 **Install app** → 确认安装

9. 在 **API credentials** 标签页，你会看到：
   - **Storefront API access token** （复制这个token）
   - **Admin API access token** （暂时不需要）

---

### **Step 2: 更新网站配置**

打开 `/src/app/config/shopify.ts` 文件，替换以下内容：

```typescript
export const shopifyConfig = {
  // ⚠️ 替换为你的 Shopify Store Domain
  storeDomain: 'swy-store.myshopify.com',  // 例如：your-store.myshopify.com
  
  // ⚠️ 替换为你在 Step 1 复制的 Storefront API Access Token
  storefrontAccessToken: '你的_Storefront_API_Token',
  
  // API Version (保持最新)
  apiVersion: '2024-01',
};
```

**重要提示：**
- `storeDomain` 格式：`your-store.myshopify.com`（不要加 `https://`）
- `storefrontAccessToken` 是一个长字符串，类似：`shpat_abc123...`

---

### **Step 3: 在 Shopify 添加产品**

1. 进入 **Shopify Admin → Products**

2. 为每个 SWY 产品创建对应的 Shopify 产品

3. 记录每个产品的 **Variant ID**（变体 ID）：
   - 打开产品详情页
   - 在浏览器地址栏，你会看到 URL 类似：
     ```
     https://admin.shopify.com/store/swy-store/products/1234567890/variants/9876543210
     ```
   - 最后一串数字 `9876543210` 就是 Variant ID
   - 完整的 GraphQL Variant ID 格式：`gid://shopify/ProductVariant/9876543210`

---

### **Step 4: 更新产品数据**

打开 `/src/app/data/products.ts`，为每个产品添加 Shopify 信息：

```typescript
{
  id: 'the-last-snow',
  name: '最後一場雪',
  nameEn: 'The Last Snow',
  // ... 其他字段 ...
  
  // ✅ 添加这两个字段
  shopifyVariantId: 'gid://shopify/ProductVariant/你的产品Variant_ID',
  price: '128.00',  // 产品价格（美元）
}
```

**范例：**
```typescript
{
  id: 'the-last-snow',
  name: '最後一場雪',
  nameEn: 'The Last Snow',
  theme: '結束與開始',
  themeEn: 'Endings & Beginnings',
  // ... 其他字段 ...
  
  shopifyVariantId: 'gid://shopify/ProductVariant/44123456789',
  price: '128.00',
}
```

对所有 8 个产品重复这个步骤。

---

### **Step 5: 测试购物流程**

1. 刷新你的网站

2. 点击任意产品进入 Unboxing 体验

3. 滚动到 Step 3（产品完全展示）

4. 你会看到底部出现 **"ADD TO CART"** 按钮

5. 点击按钮：
   - 产品会加入购物车
   - 购物车侧边栏自动打开
   - 右上角购物车图标显示数量徽章

6. 在购物车中点击 **"Checkout"**

7. 你会被重定向到 Shopify 官方结账页面

---

## 🎨 当前 UI 功能

### **购物车图标**
- 位置：右上角固定
- 数量徽章：显示购物车商品总数
- Noir Archive 美学：黑色半透明背景，白色图标

### **产品详情页购买按钮**
- 只在 Step 3 显示（产品完全展示）
- 包含产品价格
- Loading 状态：点击后显示 "Adding..."
- 如果产品没有 `shopifyVariantId`，显示 "Coming Soon"

### **购物车侧边栏**
- 从右侧滑入
- 显示所有购物车商品
- 可以修改数量（+/-）
- 可以删除商品
- 显示总价
- **Checkout** 按钮跳转到 Shopify 结账

---

## 🔧 常见问题

### **Q: 点击 "Add to Cart" 没有反应？**
A: 检查以下几点：
1. `/src/app/config/shopify.ts` 是否已正确配置
2. 产品的 `shopifyVariantId` 是否存在且格式正确
3. 浏览器控制台是否有错误信息

### **Q: Checkout 按钮跳转到错误页面？**
A: 确认 `shopifyConfig.storeDomain` 格式正确（不要包含 `https://`）

### **Q: 如何在开发环境测试？**
A: 
- 如果 Shopify 未配置，购物车仍然可以工作（Demo 模式）
- 只是点击 Checkout 时会显示警告
- 产品数据会保存在 localStorage 中

### **Q: 价格显示货币符号？**
A: 在 `products.ts` 中，`price` 字段只需填数字（例如 `'128.00'`），UI 会自动添加 `$` 符号

---

## 📊 产品数据映射表

| 网站产品 ID | 产品名称（中文） | 需要在 Shopify 创建 |
|------------|----------------|-------------------|
| `the-last-snow` | 最後一場雪 | ✅ |
| `the-first-rose` | 初戀玫瑰 | ✅ |
| `no-worries` | 無憂時光 | ✅ |
| `old-library` | 舊圖書館 | ✅ |
| `mens-garage` | 男人車庫 | ✅ |
| `im-rich` | 我很富有 | ✅ |
| `morning-after-quit` | 辭職後的早晨 | ✅ |
| `night-was-mine` | 那夜屬於我 | ✅ |

---

## 🚀 部署到 Vercel

配置完成后，记得将更改推送到 Git 仓库：

```bash
git add .
git commit -m "Configure Shopify integration"
git push
```

Vercel 会自动重新部署，新的配置会立即生效！

---

## 💡 高级功能（可选）

如果你想添加更多功能：

1. **产品库存显示** - 从 Shopify 实时获取库存数量
2. **折扣码支持** - 在结账时应用优惠券
3. **产品变体** - 支持不同尺寸/颜色选项
4. **推荐产品** - 在购物车中显示相关产品
5. **订单追踪** - 客户可以查看订单状态

需要这些功能的话再告诉我！🖤✨
