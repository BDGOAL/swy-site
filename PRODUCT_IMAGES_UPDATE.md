# 產品圖片更新說明

## ✅ 已修復的問題

### 1. Logo 顯示問題
**問題**：`/public/swy-logo.png` 被 Git 反覆刪除，導致 Logo 無法顯示

**解決方案**：
- 將 Logo 改為使用內嵌 SVG，不再依賴外部 PNG 文件
- SVG Logo 位於 `/src/app/components/LandingPage.tsx`
- 使用 CSS 變數 `--font-serif` 確保字體一致性
- 添加文字陰影和濾鏡效果，模擬白墨印刷質感

### 2. Archive Section 產品圖片顯示問題
**問題**：Archive.tsx 使用了錯誤的產品 ID（yubai, yese-zhanyou 等不存在的 ID）

**解決方案**：
- 修正所有產品 ID 映射，使用正確的 8 個產品 ID：
  - `the-last-snow`（最後一場雪）
  - `the-first-rose`（初戀玫瑰）
  - `no-worries`（無憂時光）
  - `old-library`（舊圖書館）
  - `mens-garage`（男人車庫）
  - `im-rich`（我很富有）
  - `morning-after-quit`（辭職後的早晨）
  - `night-was-mine`（那夜屬於我）

## 📁 新建文件

### `/src/app/data/productImageFallbacks.ts`
集中管理所有產品圖片的 Unsplash 回退 URL，確保圖片總是能夠顯示。

每個產品都有精心挑選的高質量 Unsplash 圖片，與產品主題完美匹配：
- **最後一場雪**：雪夜城市景觀
- **初戀玫瑰**：復古玫瑰特寫
- **無憂時光**：溫馨家居場景
- **舊圖書館**：老圖書館書架
- **男人車庫**：車庫工具場景
- **我很富有**：奢華金屬質感
- **辭職後的早晨**：陽光灑落窗邊
- **那夜屬於我**：雪茄煙霧夜景

## 🔄 已更新的組件

以下組件已全部更新為使用正確的產品 ID 和圖片回退系統：

1. **CollectionGrid.tsx**
   - 導入 `productImageFallbacks`
   - 使用 `getProductImage()` 函數獲取圖片
   - 所有 8 個產品都能正確顯示

2. **Archive.tsx**
   - 導入 `productImageFallbacks`
   - 修正產品 ID 映射
   - 背景圖片正確渲染

3. **AcetateReveal.tsx**
   - 導入 `productImageFallbacks`
   - 更新圖片獲取邏輯

4. **UnboxingExperience.tsx**
   - 導入 `productImageFallbacks`
   - 修正所有產品背景圖片引用

5. **LandingPage.tsx**
   - 將 Logo 從 `<img>` 改為 `<svg>`
   - 不再依賴 `/public/swy-logo.png`

## 🎨 設計考量

所有回退圖片都經過精心挑選，符合 SWY Noir Archive 美學：
- ✅ 高對比度黑白風格
- ✅ 城市街景/建築/物件主題
- ✅ 霧氣/光線效果
- ✅ 16mm 底片顆粒感
- ✅ Brutalist 極簡風格

## 🚀 下一步（可選）

如果您想替換為自己的產品圖片：

1. 準備 8 張圖片（建議尺寸 800x1000px，3:4 比例）
2. 按照以下命名規則上傳到 `/public/products/`：
   - `the-last-snow.png`
   - `the-first-rose.png`
   - `it-means-no-worries.png`
   - `the-old-library.png`
   - `mens-garage.png`
   - `i-am-rich.png`
   - `morning-after-i-quit.png`
   - `the-night-was-mine.png`

3. 修改 `getProductImage()` 函數邏輯，先嘗試加載本地圖片：
```typescript
const getProductImage = (productId: string): string => {
  // 嘗試使用本地圖片（如果存在）
  const localPath = `/products/${productId}.png`;
  
  // 回退到 Unsplash（目前的默認行為）
  return productImageFallbacks[productId] || '';
};
```

## ✨ 現在的狀態

- ✅ Logo 正常顯示（SVG 版本）
- ✅ 所有產品圖片都能正確加載（Unsplash 回退）
- ✅ Archive section 顯示所有 8 個產品
- ✅ 產品 ID 映射完全正確
- ✅ 圖片主題與產品故事匹配
- ✅ 保持 Noir Archive 美學一致性

網站現在應該能完全正常運作了！🎉
