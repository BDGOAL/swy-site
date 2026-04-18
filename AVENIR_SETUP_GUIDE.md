# 🔤 如何在網站中使用真正的 Avenir 字體

## ⚠️ 重要：Avenir 是付費商業字體

**Avenir 無法像 Google Fonts 那樣免費使用**。你需要以下其中一種授權：

---

## ✅ 方案 A：Adobe Fonts（最推薦！）

### **優點：**
- ✅ 完整 Avenir 字體家族
- ✅ 合法授權
- ✅ 高品質 Web Font
- ✅ CDN 加速
- ✅ 包含在 Adobe CC 訂閱中（無需額外付費）

### **步驟：**

#### 1. **登入 Adobe Fonts**
訪問：https://fonts.adobe.com

#### 2. **搜尋 Avenir**
在搜尋框輸入 "Avenir"

#### 3. **選擇字重**
勾選你需要的字重：
- ✅ **Avenir Black** (品牌主字體)
- ✅ **Avenir Regular** (品牌副字體)
- 可選：Avenir Medium, Bold (備用)

#### 4. **創建 Web 專案**
- 點擊右上角「Add to Web Project」
- 創建新專案或選擇現有專案
- 專案名稱：`SWY Digital Unboxing`

#### 5. **獲取嵌入代碼**
你會看到類似這樣的代碼：

```html
<link rel="stylesheet" href="https://use.typekit.net/abc1234.css">
```

或

```css
@import url("https://use.typekit.net/abc1234.css");
```

**複製 `abc1234` 這個專案 ID！**

#### 6. **更新網站代碼**

打開 `/src/styles/fonts.css`，找到這一行：

```css
@import url("https://use.typekit.net/[你的專案ID].css");
```

**替換成你的實際專案 ID：**

```css
@import url("https://use.typekit.net/abc1234.css");
```

#### 7. **啟用 Avenir**

在同一個檔案中，取消註解：

```css
/* 刪除這些註解符號 */
--font-primary: 'Avenir', 'Montserrat', -apple-system, sans-serif;
--font-secondary: 'Avenir', 'Montserrat', -apple-system, sans-serif;
```

改成：

```css
--font-primary: 'Avenir', 'Montserrat', -apple-system, sans-serif;
--font-secondary: 'Avenir', 'Montserrat', -apple-system, sans-serif;
```

#### 8. **完成！** 🎉

重新整理網站，Avenir 字體應該已經生效。

---

## 📋 方案 B：購買 Avenir Web Font 授權

如果你沒有 Adobe CC 訂閱，可以直接購買 Web Font 授權：

### **1. Fonts.com**
- 網址：https://www.fonts.com/font/linotype/avenir
- 價格：約 $40-100 USD/年
- 包含：Web Font 授權 + WOFF2 檔案

### **2. MyFonts**
- 網址：https://www.myfonts.com/fonts/linotype/avenir/
- 價格：約 $50-150 USD（一次性）
- 包含：自托管授權

### **3. Monotype (官方)**
- 網址：https://www.monotype.com/fonts/avenir
- 企業級授權

---

## 🛠️ 方案 C：自托管 Avenir 字體檔案

**⚠️ 僅在你已購買授權的情況下使用！**

### **步驟：**

#### 1. **獲取字體檔案**
- 從授權供應商下載 `.woff2` 和 `.woff` 檔案
- 需要的檔案：
  - `Avenir-Black.woff2`
  - `Avenir-Regular.woff2`

#### 2. **上傳到專案**
將字體檔案放到：
```
/public/fonts/
  - Avenir-Black.woff2
  - Avenir-Regular.woff2
```

#### 3. **更新 fonts.css**

```css
/* 自托管 Avenir */
@font-face {
  font-family: 'Avenir';
  src: url('/fonts/Avenir-Black.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Avenir';
  src: url('/fonts/Avenir-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

:root {
  --font-primary: 'Avenir', 'Montserrat', -apple-system, sans-serif;
  --font-secondary: 'Avenir', 'Montserrat', -apple-system, sans-serif;
}
```

---

## 🎯 推薦方案比較

| 方案 | 價格 | 難度 | 推薦度 |
|------|------|------|--------|
| **Adobe Fonts** | 包含在 Adobe CC ($54.99/月) | ⭐ 簡單 | ⭐⭐⭐⭐⭐ |
| **Fonts.com** | $40-100/年 | ⭐⭐ 中等 | ⭐⭐⭐⭐ |
| **自托管** | 一次性購買 $50-150 | ⭐⭐⭐ 較難 | ⭐⭐⭐ |
| **Montserrat (免費替代)** | 免費 | ⭐ 簡單 | ⭐⭐⭐ |

---

## ❓ 常見問題

### **Q: 我能直接使用 Avenir 嗎？**
❌ 不行。Avenir 是付費字體，**必須購買授權**才能合法使用。

### **Q: Montserrat 和 Avenir 有什麼差別？**
- **相似度：85%**
- Montserrat 是受 Avenir 啟發的免費替代品
- 字形非常接近，但細節略有不同

### **Q: 如果我沒有 Adobe CC，該怎麼辦？**
- 使用 Montserrat（目前的設定）
- 或購買 Fonts.com 授權

### **Q: 我可以從其他網站「借」Avenir 嗎？**
❌ **絕對不行！** 這是侵權行為。

---

## ✅ 快速決策表

### **你有 Adobe Creative Cloud 訂閱嗎？**

#### ✅ 有 → 使用 Adobe Fonts（方案 A）
→ 訪問 https://fonts.adobe.com  
→ 獲取專案 ID  
→ 更新 `/src/styles/fonts.css`

#### ❌ 沒有 → 兩種選擇：

**選項 1：購買授權** ($40-150)
→ 使用方案 B 或 C

**選項 2：使用 Montserrat**（免費）
→ 保持現有設定  
→ 視覺效果 85% 相似

---

## 🚀 我的建議

### **如果你：**

1. **已經有 Adobe CC** → 馬上使用 Adobe Fonts！
2. **品牌對字體要求嚴格** → 購買 Fonts.com 授權
3. **預算有限 / 快速上線** → 暫時使用 Montserrat

**Montserrat 已經非常接近 Avenir**，一般用戶很難分辨差異。

---

**告訴我你的選擇，我立刻幫你設置！** 🎨
