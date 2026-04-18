# 🚀 Shopify 快速参考

## ✅ 当前配置（2026-02-28）

```
商店域名: your-store.myshopify.com
Storefront API Token: <SHOPIFY_STOREFRONT_ACCESS_TOKEN>
API 版本: 2024-01
Token 过期: 约 24 小时后（2026-03-01）
```

---

## 🔄 Token 过期后如何重新生成？

### 快速步骤：

1. **访问 Shopify Admin**
   ```
   https://admin.shopify.com/store/your-store/settings/apps/development
   ```

2. **点击 "SWY Headless" 应用**

3. **点击 "API credentials" 标签**

4. **在 "Storefront API access token" 部分，点击 "Reveal token" 或 "Generate token"**

5. **复制新 token**

6. **更新代码**
   - 打开 `/src/app/shopify/ShopifyProvider.tsx`
   - 替换 `storefrontAccessToken` 的值
   - 保存文件

---

## 📋 必需权限（Scopes）

```
✓ unauthenticated_read_product_listings
✓ unauthenticated_read_product_inventory
✓ unauthenticated_write_checkouts
```

---

## 🧪 测试 Shopify 连接

### 方法 1：使用内置测试组件（推荐）

开发环境下，左下角会自动显示连接状态测试组件：
- ✅ 绿点 = 连接成功
- ❌ 红点 = 连接失败
- 🟡 黄点 = 测试中

### 方法 2：浏览器控制台测试

按 `F12` 打开控制台，粘贴以下代码：

```javascript
fetch('https://your-store.myshopify.com/api/2024-01/graphql.json', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': '<SHOPIFY_STOREFRONT_ACCESS_TOKEN>',
  },
  body: JSON.stringify({
    query: '{ shop { name } }'
  })
})
.then(r => r.json())
.then(data => {
  if (data.data) {
    console.log('✅ 连接成功！', data.data.shop.name);
  } else {
    console.error('❌ 连接失败', data.errors);
  }
});
```

---

## 🛍️ 添加产品到 Shopify

### 步骤：

1. **登录 Shopify Admin**
   ```
   https://admin.shopify.com/store/your-store
   ```

2. **Products → Add product**

3. **填写产品信息：**
   - **Title**: 例如 "午夜浪潮"
   - **Description**: 产品描述
   - **Price**: 例如 "2280"（不含货币符号）
   - **Images**: 上传产品图片

4. **重要：设置 Handle（产品别名）**
   
   在 "Search engine listing" 部分，点击 "Edit website SEO"，设置 URL handle：
   
   | 产品名称 | Handle |
   |---------|--------|
   | 午夜浪潮 | `midnight-tide` |
   | 最后一场雪 | `the-last-snow` |
   | 琥珀仪式 | `amber-ritual` |

5. **保存产品**

---

## 🔑 获取产品 Variant ID

### 方法 1：通过 GraphQL（推荐）

1. **访问 GraphQL 测试工具**
   ```
   https://shopify.dev/docs/api/storefront/graphql
   ```

2. **粘贴查询：**
   ```graphql
   {
     products(first: 10) {
       edges {
         node {
           id
           title
           handle
           variants(first: 5) {
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

3. **复制返回的 Variant ID**
   ```
   格式: gid://shopify/ProductVariant/123456789
   ```

### 方法 2：通过浏览器测试

在浏览器控制台运行：

```javascript
fetch('https://your-store.myshopify.com/api/2024-01/graphql.json', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': '<SHOPIFY_STOREFRONT_ACCESS_TOKEN>',
  },
  body: JSON.stringify({
    query: `{
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            variants(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }`
  })
})
.then(r => r.json())
.then(data => {
  console.table(
    data.data.products.edges.map(p => ({
      title: p.node.title,
      handle: p.node.handle,
      variantId: p.node.variants.edges[0]?.node.id
    }))
  );
});
```

---

## 📝 更新产品数据文件

打开 `/src/app/data/products.ts`，添加 `shopifyVariantId`：

```typescript
export const products = [
  {
    id: '001',
    title: '情緒號',
    subtitle: 'EMOTION NO.',
    // ... 其他字段
    
    // ✅ 添加这一行（从上面获取的 Variant ID）
    shopifyVariantId: 'gid://shopify/ProductVariant/YOUR_VARIANT_ID_HERE',
  },
  // ... 其他产品
];
```

---

## 🛒 测试购物车功能

### 完整测试流程：

1. **测试添加到购物车**
   - 打开产品详情页（Unboxing Experience）
   - 点击 "ADD TO CART" 按钮
   - 按钮应变为 "ADDED TO CART"（绿色勾选）

2. **测试购物车显示**
   - 点击右上角购物袋图标
   - 购物车侧边栏应滑出
   - 确认产品已添加并显示正确信息

3. **测试数量修改**
   - 在购物车中点击 `+` / `-` 按钮
   - 数量应实时更新
   - 总价应自动计算

4. **测试删除产品**
   - 点击产品旁的删除图标
   - 产品应从购物车移除

5. **测试结账流程**
   - 点击 "PROCEED TO CHECKOUT"
   - 应跳转到 Shopify 官方结账页面
   - URL 应类似：`https://your-store.myshopify.com/checkouts/...`

---

## 🚨 常见错误排查

### 错误 1：`Access denied for storefront access token`

**原因：** Token 过期或权限不足

**解决：**
1. 检查 token 是否过期（24 小时后自动过期）
2. 重新生成 token（见上方步骤）
3. 确认权限包含所需的 scopes

---

### 错误 2：`Product not found`

**原因：** 产品未发布或 handle 不匹配

**解决：**
1. 确认产品在 Shopify Admin 中已发布
2. 检查产品 handle 是否与代码中的 ID 匹配
3. 确认产品的 "Sales channels" 包含 "Online Store"

---

### 错误 3：`Cannot add to cart`

**原因：** Variant ID 错误或库存不足

**解决：**
1. 确认 Variant ID 格式正确（`gid://shopify/ProductVariant/...`）
2. 检查产品库存 > 0
3. 确认产品状态为 "Active"

---

### 错误 4：`CORS error`

**原因：** Shopify 域名配置问题

**解决：**
1. 确认使用正确的 Shopify 域名（不含 `https://`）
2. 检查 Storefront API 应用是否已正确安装
3. 清除浏览器缓存并重试

---

## 📞 需要帮助？

### Shopify 官方资源：

- **Storefront API 文档**: https://shopify.dev/docs/api/storefront
- **Hydrogen React 文档**: https://shopify.dev/docs/api/hydrogen-react
- **GraphQL 参考**: https://shopify.dev/docs/api/storefront/reference
- **Shopify 帮助中心**: https://help.shopify.com/

### 开发者社区：

- Shopify Community: https://community.shopify.com/
- Shopify Discord: https://discord.gg/shopifydevs

---

## ✅ 下一步建议

1. ✅ 在 Shopify Admin 中创建真实产品
2. ✅ 获取产品 Variant IDs
3. ✅ 更新 `/src/app/data/products.ts`
4. ✅ 测试完整购买流程
5. ✅ 配置支付方式（Shopify Payments）
6. ✅ 设置运费规则
7. ✅ 配置税费设置
8. ✅ 准备部署到生产环境

---

**最后更新：** 2026-02-28  
**Token 过期提醒：** 请在 2026-03-01 之前重新生成 token
