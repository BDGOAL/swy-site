# 📦 SWY 產品圖片放置指南

## 🎯 **快速開始**

**當前狀態：** 網站正在使用 Unsplash 佔位圖片，等待你上傳真實產品圖片。

**上傳步驟：**
1. 將產品圖片放到這個資料夾：`/public/products/`
2. 修改 `/src/app/data/productImageFallbacks.ts` 中的路徑
3. 將 Unsplash URL 改為 `/products/檔案名.png`

---

## 📋 **檔案命名對應表**

以下是每個產品的檔案命名（使用產品英文名稱的 Initial）：

| 產品 ID | 產品名稱 | 英文名稱 | 主要檔案 | 備用檔案 |
|---------|----------|----------|----------|----------|
| `the-last-snow` | 最後一場雪 | The Last Snow | **TLS.png** | TLS2.png |
| `the-first-rose` | 初戀玫瑰 | The First Rose | **TFR.png** | TFR2.png, TFR3.png, TFR4.png |
| `no-worries` | 無憂時光 | It means no worries | **IMNW.png** | IMNW2.png, IMNW3.png |
| `old-library` | 舊圖書館 | The Old Library | **TOL.png** | TOL2.png, TOL3.png, TOL4.png |
| `mens-garage` | 男人車庫 | The Men's Garage | **TMG.png** | TMG2.png, TMG3.png |
| `im-rich` | 我很富有 | I'm Rich | **IR.png** | — |
| `morning-after-quit` | 辭職後的早晨 | The Morning After I Quit | **TMAIQ.png** | TMAIQ2.png, TMAIQ3.png |
| `night-was-mine` | 那夜屬於我 | The Night Was Mine | **TNWM.png** | TNWM2.png |

> ⚠️ **重要：** 粗體標示的檔案是**主要顯示圖片**，必須放置。其他是備用圖片（可選）。

---

## 📂 **目前附件中的檔案清單**

根據你提供的截圖，以下是所有產品圖片：

### ✅ **主要圖片（必須）**
1. `TLS.png` - 最後一場雪
2. `TFR.png` - 初戀玫瑰
3. `IMNW.png` - 無憂時光
4. `TOL.png` - 舊圖書館
5. `TMG.png` - 男人車庫
6. `IR.png` - 我很富有
7. `TMAIQ.png` - 辭職後的早晨
8. `TNWM.png` - 那夜屬於我

### 📸 **備用圖片（可選）**
- `TLS2.png`
- `TFR2.png`, `TFR3.png`, `TFR4.png`
- `IMNW2.png`, `IMNW3.png`
- `TOL2.png`, `TOL3.png`, `TOL4.png`
- `TMG2.png`, `TMG3.png`
- `TMAIQ2.png`, `TMAIQ3.png`
- `TNWM2.png`

---

## 🚀 **放置步驟**

### **方法 1：直接複製（推薦）**
1. 從附件中選擇所有 `.png` 檔案
2. 直接拖放到 `/public/products/` 資料夾
3. 確認所有檔案名稱與上表一致
4. 完成！網站會自動載入

### **方法 2：逐一上傳**
如果你想先測試，可以只上傳主要圖片：
1. 上傳 8 個主要檔案（TLS.png, TFR.png, IMNW.png, TOL.png, TMG.png, IR.png, TMAIQ.png, TNWM.png）
2. 檢查網站顯示效果
3. 再上傳備用圖片

---

## 🔍 **圖片規格建議**

根據你的附件，圖片規格如下：

| 尺寸 | 用途 | 檔案範例 |
|------|------|----------|
| **864 × 1,184** | 標準產品圖（直式） | TFR.png, TOL2.png, IMNW.png |
| **896 × 1,200** | 標準產品圖（直式） | TLS.png, TNWM.png, TOL4.png |
| **1,728 × 2,304** | 高解析度產品圖 | IR.png, TOL.png, TMG.png, TMAIQ.png |

> ✅ **建議：** 優先使用高解析度圖片（1,728 × 2,304）作為主圖，確保在 Retina 螢幕上顯示清晰。

---

## 🎨 **圖片顯示位置**

這些產品圖片會顯示在以下位置：

1. **產品卡片網格** (`CollectionGrid.tsx`) - 「從淺水海面拾起漂流瓶」互動效果
2. **膠片揭幕區** (`AcetateReveal.tsx`) - 滾動揭幕展示
3. **開箱體驗頁** (`UnboxingExperience.tsx`) - 三步開箱流程
4. **檔案存檔頁** (`Archive.tsx`) - 檔案系統展示
5. **購物車** (`ShopifyContext.tsx`) - 購物車預覽圖

---

## ⚙️ **技術細節**

### **圖片路徑配置**
圖片路徑已在 `/src/app/data/productImageFallbacks.ts` 中配置：

```typescript
export const productImageFallbacks: Record<string, string> = {
  'the-last-snow': '/products/TLS.png',
  'the-first-rose': '/products/TFR.png',
  'no-worries': '/products/IMNW.png',
  'old-library': '/products/TOL.png',
  'mens-garage': '/products/TMG.png',
  'im-rich': '/products/IR.png',
  'morning-after-quit': '/products/TMAIQ.png',
  'night-was-mine': '/products/TNWM.png',
};
```

### **如何更換主圖**
如果你想使用備用圖片作為主圖（例如 `TFR2.png` 而非 `TFR.png`）：
1. 重新命名檔案：`TFR2.png` → `TFR.png`
2. 或修改 `productImageFallbacks.ts` 中的路徑

---

## 🔧 **故障排除**

### **Q1: 圖片無法顯示？**
✅ 確認檔案名稱完全一致（包含大小寫）
✅ 確認檔案放在 `/public/products/` 資料夾
✅ 清除瀏覽器緩存（Cmd/Ctrl + Shift + R）

### **Q2: 圖片顯示模糊？**
✅ 優先使用 1,728 × 2,304 高解析度版本
✅ 確認圖片格式為 PNG（支援透明背景）

### **Q3: 想新增更多產品圖片？**
1. 將圖片放到 `/public/products/` 資料夾
2. 在 `productImageFallbacks.ts` 中新增對應的產品 ID 和路徑
3. 在 `products.ts` 中新增產品數據

---

## 📞 **需要協助？**

如果遇到任何問題，請告訴我：
- 圖片無法顯示
- 需要調整圖片尺寸或裁切
- 想新增或移除產品
- 想使用備用圖片作為主圖

---

**最後更新：** 2026-03-23  
**系統版本：** SWY Digital Unboxing v2.0 - Noir Archive Edition