# ⚫⚪ SWY 黑白雙色系統設計方案

## 🎨 設計理念

結合 **Noir Archive 沉重儀式感** + **品牌指南清爽留白**，創造戲劇化對比層次。

---

## 🎯 配色策略

### **黑色區域（Deep Black Sections）**⚫

**用途：** 情感強烈、沉浸式體驗、品牌儀式感

**顏色組合：**
```css
背景：#0A0A0A (Graphite Black) 或 #302E2F (Jet Black)
文字：#F8F8F9 (Bleached Silk)
強調：#E6E7E8 (Watermark)
邊框：rgba(248,248,249,0.1) (半透明淺色)
```

**適用組件：**
1. ✅ **Hero Section** - 首屏衝擊力
2. ✅ **Unboxing Experience** - 沉浸式開箱
3. ✅ **Conversion Section** - CTA 戲劇張力
4. ✅ **Archive Section** - 檔案神秘感
5. ✅ **Footer** - 收尾沉穩感

---

### **白色區域（Light Sections）**⚪

**用途：** 產品展示、資訊閱讀、呼吸感留白

**顏色組合：**
```css
背景：#F8F8F9 (Bleached Silk)
文字：#302E2F (Jet Black)
次要文字：#494851 (Anthracite)
邊框：rgba(48,46,47,0.1) (半透明深色)
```

**適用組件：**
1. ✅ **Collection Grid** - 產品清晰展示
2. ✅ **Brand DNA** - 品牌故事易讀性
3. ✅ **Brand Vision** - 理念呈現
4. ✅ **Product Details** - 產品資訊
5. ✅ **Shopping Cart** - 購物流程清晰

---

## 📐 頁面節奏設計

### **LandingPage 垂直節奏：**

```
⚫ Hero (黑) - 視覺衝擊
   ↓
⚪ Collection Grid (白) - 產品展示
   ↓
⚫ Conversion Section (黑) - CTA 強調
   ↓
⚪ Brand DNA (白) - 故事閱讀
   ↓
⚫ Drift Bottle Scroll (黑) - 沉浸體驗
   ↓
⚪ Brand Vision (白) - 理念留白
   ↓
⚫ Archive (黑) - 檔案探索
   ↓
⚫ Footer (黑) - 收尾
```

**視覺效果：** 黑 → 白 → 黑 → 白 → ...（像手風琴般展開）

---

## 🎨 過渡效果設計

### **黑白切換過渡：**

```css
/* 平滑漸變過渡（避免生硬切換）*/
section {
  transition: background-color 0.8s ease;
}

/* 分隔線設計 */
.section-divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(73,72,81,0.2) 50%,
    transparent 100%
  );
}

/* 陰影疊加（增強層次）*/
.dark-section {
  box-shadow: inset 0 10px 30px rgba(0,0,0,0.3);
}

.light-section {
  box-shadow: inset 0 10px 30px rgba(248,248,249,0.3);
}
```

---

## 🛠️ CSS Variables 配置

### **新增黑白系統變數：**

```css
:root {
  /* Dark Theme Variables */
  --dark-bg: #0A0A0A;           /* 或 #302E2F */
  --dark-text: #F8F8F9;
  --dark-text-secondary: #E6E7E8;
  --dark-border: rgba(248,248,249,0.1);
  --dark-accent: #494851;
  
  /* Light Theme Variables */
  --light-bg: #F8F8F9;
  --light-text: #302E2F;
  --light-text-secondary: #494851;
  --light-border: rgba(48,46,47,0.1);
  --light-accent: #E6E7E8;
  
  /* Transition */
  --section-transition: background-color 0.8s ease, color 0.8s ease;
}
```

---

## 📋 組件實現範例

### **黑色區域組件：**

```tsx
// Hero.tsx
<section 
  className="relative min-h-screen"
  style={{
    backgroundColor: 'var(--dark-bg)',
    color: 'var(--dark-text)',
    transition: 'var(--section-transition)',
  }}
>
  <h1 
    className="swy-heading-black"
    style={{ 
      color: 'var(--dark-text)',
      fontSize: '4rem',
    }}
  >
    SWY DIGITAL UNBOXING
  </h1>
  
  <p style={{ color: 'var(--dark-text-secondary)' }}>
    每一場開箱都是儀式的開始
  </p>
  
  <div style={{ 
    border: '0.5px solid var(--dark-border)',
  }}>
    ...
  </div>
</section>
```

### **白色區域組件：**

```tsx
// CollectionGrid.tsx
<section 
  className="relative py-32"
  style={{
    backgroundColor: 'var(--light-bg)',
    color: 'var(--light-text)',
    transition: 'var(--section-transition)',
  }}
>
  <h2 
    className="swy-heading-black"
    style={{ 
      color: 'var(--light-text)',
      fontSize: '3rem',
    }}
  >
    COLLECTION
  </h2>
  
  <p style={{ color: 'var(--light-text-secondary)' }}>
    探索我們的精選系列
  </p>
  
  <div style={{ 
    border: '0.5px solid var(--light-border)',
    backgroundColor: '#FFFFFF',
  }}>
    ...
  </div>
</section>
```

---

## 🎯 關鍵設計原則

### **1. 對比度優化**
- 黑色背景：文字至少 #E6E7E8（Watermark）
- 白色背景：文字至少 #494851（Anthracite）
- 確保 WCAG AAA 可訪問性

### **2. 留白節奏**
- 黑色區域：padding 較大（py-40, py-48）
- 白色區域：padding 適中（py-24, py-32）
- 營造「呼吸感」

### **3. 邊框細節**
- 黑色區域：使用 0.5px 淺色線（營造精緻感）
- 白色區域：使用 0.5px 深色線（保持輕盈）

### **4. 陰影使用**
- 黑色區域：內陰影（增強深度）
- 白色區域：外陰影（卡片浮起）

---

## 🚀 實現計畫

### **Phase 1: 核心組件更新**
1. ✅ Hero - 黑色背景
2. ✅ CollectionGrid - 白色背景
3. ✅ ConversionSection - 黑色背景
4. ✅ Archive - 黑色背景

### **Phase 2: 過渡效果**
1. ⬜ 添加 section divider
2. ⬜ 實現平滑過渡動畫
3. ⬜ 陰影層次優化

### **Phase 3: 細節打磨**
1. ⬜ 檢查所有文字對比度
2. ⬜ 統一邊框樣式
3. ⬜ 優化 mobile 體驗

---

## 🎨 視覺參考

### **黑色區域氛圍：**
- 沉重、神秘、專注
- 像是「夜間畫廊」
- 強調情感和儀式感

### **白色區域氛圍：**
- 清爽、理性、專業
- 像是「白日展間」
- 強調資訊和可讀性

### **整體感受：**
- 像是「日夜交替的數位體驗」
- 黑白對比製造「戲劇化張力」
- 保持品牌一致性同時增加層次

---

## ✅ 下一步

**我現在會更新以下組件：**

1. ⬜ **LandingPage** - 添加黑白節奏
2. ⬜ **CollectionGrid** - 改為白色背景
3. ⬜ **BrandDNA** - 改為白色背景
4. ⬜ **BrandVision** - 改為白色背景
5. ⬜ **theme.css** - 添加黑白系統變數

**準備好了嗎？我馬上開始實現！** 🚀
