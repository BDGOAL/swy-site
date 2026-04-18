# 🔍 Checkout Debug Guide - 解決 "Creating checkout..." 卡住問題

## 🚨 **當前問題**
點擊 "PROCEED TO CHECKOUT" 時顯示 "Creating checkout..." 但一直卡住，沒有跳轉到 Shopify 結帳頁面。

---

## ✅ **我已經添加的改進**

### 1. **詳細錯誤日誌**
現在 Console 會顯示：
- 🛒 Creating checkout with items
- 📦 Checkout API response
- ✅ Checkout created successfully
- ❌ 任何錯誤訊息

### 2. **用戶友好的錯誤提示**
如果 checkout 創建失敗，會顯示 alert 提示具體錯誤

### 3. **API 狀態檢查**
驗證 HTTP response 狀態碼和 Shopify 用戶錯誤

---

## 🧪 **診斷步驟**

### **Step 1: 打開瀏覽器開發者工具**

1. 按 `F12` 或 `Right Click > Inspect`
2. 切換到 **Console** 標籤

### **Step 2: 清除舊數據**

在 Console 中執行：
```javascript
localStorage.clear();
location.reload();
```

### **Step 3: 重新添加商品到購物車**

1. 重新訪問網站
2. 點擊任意產品
3. 滾動完成開箱動畫
4. 點擊 "Add to Cart"

### **Step 4: 查看 Console 日誌**

應該會看到：
```
🛒 Creating checkout with items: [
  { variantId: "gid://shopify/ProductVariant/8291160424648", quantity: 1 }
]
```

### **Step 5: 點擊 "PROCEED TO CHECKOUT"**

查看 Console 中會出現以下哪種情況：

---

## 📊 **可能出現的情況**

### **情況 A: ✅ 成功創建 Checkout**

Console 顯示：
```
✅ Checkout created successfully: https://your-store.myshopify.com/checkouts/xxxxx
```

**解決方案：**
- 應該會自動跳轉到 Shopify 結帳頁面
- 如果沒跳轉，檢查瀏覽器是否阻擋彈出視窗

---

### **情況 B: ❌ Variant ID 錯誤**

Console 顯示：
```
❌ Checkout user errors: [
  { message: "Variant does not exist", field: ["lineItems", 0, "variantId"] }
]
```

**原因：** Variant ID 格式錯誤或產品不存在

**解決方案：**
1. 訪問 Shopify Admin
2. 進入 Products > 選擇產品
3. 複製正確的 Variant ID（格式：`gid://shopify/ProductVariant/XXXXX`）
4. 更新 `/src/app/data/products.ts` 中的 `shopifyVariantId`

---

### **情況 C: ❌ API 權限錯誤**

Console 顯示：
```
❌ Checkout API response not OK: 401 Unauthorized
```

**原因：** Storefront Access Token 錯誤或已過期

**解決方案：**
1. 訪問 Shopify Admin
2. **Apps** > **Develop apps** > 選擇你的 App
3. **API credentials** > **Storefront API access token**
4. 複製 Token
5. 更新 `/src/app/config/shopify.ts`：
```typescript
storefrontAccessToken: 'YOUR_NEW_TOKEN_HERE',
```

---

### **情況 D: ❌ CORS 錯誤**

Console 顯示：
```
Access to fetch at 'https://...' from origin 'https://swyshopify.vercel.app' has been blocked by CORS policy
```

**原因：** Shopify 沒有允許你的網域

**解決方案：**
1. Shopify Admin > **Apps** > **Develop apps**
2. 選擇你的 App
3. **Configuration** > **Storefront API**
4. 在 "Storefront API access scopes" 中確認已勾選：
   - `unauthenticated_read_product_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`

---

### **情況 E: ❌ Network 錯誤**

Console 顯示：
```
❌ Failed to create checkout: Network request failed
```

**原因：** 網絡連接問題或 Shopify API 暫時不可用

**解決方案：**
1. 檢查網絡連接
2. 稍後再試
3. 檢查 Shopify Status: https://www.shopifystatus.com/

---

## 🛠️ **手動測試 API**

如果仍然無法解決，可以在 Console 中手動測試 Shopify API：

```javascript
const testCheckout = async () => {
  const query = `
    mutation {
      checkoutCreate(input: {
        lineItems: [
          {
            variantId: "gid://shopify/ProductVariant/8291160424648",
            quantity: 1
          }
        ]
      }) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          message
          field
        }
      }
    }
  `;

  const response = await fetch(
    'https://your-store.myshopify.com/api/2024-10/graphql.json',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': 'YOUR_TOKEN_HERE', // 替換為你的 token
      },
      body: JSON.stringify({ query }),
    }
  );

  const data = await response.json();
  console.log('API Test Result:', data);
};

testCheckout();
```

**預期結果：**
```json
{
  "data": {
    "checkoutCreate": {
      "checkout": {
        "id": "gid://shopify/Checkout/xxxxx",
        "webUrl": "https://your-store.myshopify.com/checkouts/xxxxx"
      },
      "checkoutUserErrors": []
    }
  }
}
```

---

## 📋 **檢查清單**

請確認以下所有項目：

- [ ] Shopify Store 是否已啟用（非 Trial 過期狀態）
- [ ] Storefront Access Token 是否正確
- [ ] Variant ID 格式是否正確（`gid://shopify/ProductVariant/XXXXX`）
- [ ] Shopify App 是否有足夠的 API 權限
- [ ] 產品是否在 Shopify Admin 中顯示為 "Active"
- [ ] 瀏覽器 Console 是否有錯誤訊息
- [ ] LocalStorage 是否已清除（避免舊數據干擾）

---

## 🎯 **快速修復（臨時解決方案）**

如果你需要立即測試結帳流程，可以使用模擬模式：

在 `/src/app/components/ShoppingCart.tsx` 中暫時修改：

```typescript
const handleCheckout = () => {
  // 臨時：直接跳轉到 Shopify store
  window.location.href = 'https://your-store.myshopify.com/cart';
};
```

這會跳轉到 Shopify 的購物車頁面（雖然是空的，但可以測試結帳流程）。

---

## 📞 **需要進一步協助**

如果以上步驟都無法解決問題，請提供：

1. **Console 中的完整錯誤訊息**（截圖或複製文字）
2. **Network 標籤中的 GraphQL request/response**（截圖）
3. **你的 Shopify Plan**（Starter / Basic / Plus）
4. **Storefront API 權限列表**（截圖）

我會根據具體錯誤訊息提供更精確的解決方案！

---

## 🎬 **測試後應該看到的結果**

成功的流程應該是：

```
1. 點擊 "Add to Cart"
   → Console: "🛒 Creating checkout with items..."
   → Console: "✅ Checkout created successfully: https://..."
   
2. 購物車側邊欄打開
   → 顯示商品
   → 顯示 "PROCEED TO CHECKOUT" 按鈕
   
3. 點擊 "PROCEED TO CHECKOUT"
   → 立即跳轉到 Shopify 結帳頁面
   → URL: https://your-store.myshopify.com/checkouts/xxxxx
   
4. 在 Shopify 結帳頁面
   → 顯示商品清單
   → 可以填寫配送資訊
   → 可以選擇付款方式
```

**一切順利的話，整個流程應該不超過 2-3 秒！** ⚡
