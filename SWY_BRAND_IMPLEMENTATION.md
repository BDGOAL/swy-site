# SWY Brand Guideline Implementation

## 🎨 Official Brand Colors

根據 SWY 品牌指南 2026，以下是官方品牌色彩：

### Primary Colors

| Color Name | HEX Code | RGB | CSS Variable | 用途 |
|------------|----------|-----|--------------|------|
| **Bleached Silk** | `#F8F8F9` | 248/248/249 | `--swy-bleached-silk` | 主要淺色背景、文字 |
| **Watermark** | `#E6E7E8` | 230/231/232 | `--swy-watermark` | 次要淺色、邊框 |
| **Anthracite** | `#494851` | 73/72/81 | `--swy-anthracite` | 中灰色文字、圖標 |
| **Jet Black** | `#302E2F` | 48/46/47 | `--swy-jet-black` | 深黑色背景、強調 |

### Legacy Colors (保留相容性)

| Color Name | HEX Code | CSS Variable |
|------------|----------|--------------|
| Graphite Black | `#0A0A0A` | `--swy-graphite-black` |
| Eggshell | `#F2F0ED` | `--swy-eggshell` |
| Charcoal | `#1A1A1A` | `--swy-charcoal` |

---

## ✍️ Typography System

### Font Families

由於 **Avenir** 是付費字體，我們使用 **Montserrat** 作為 web-safe 替代方案：

| Brand Guideline | Web Implementation | CSS Variable | Font Weight |
|----------------|-------------------|--------------|-------------|
| **AVENIR BLACK** (Main) | Montserrat Black | `--font-primary` | `900` |
| **AVENIR REGULAR** (Secondary) | Montserrat Regular | `--font-secondary` | `400` |

### Font Weight Variables

```css
--font-weight-black: 900;   /* Avenir Black 替代 */
--font-weight-bold: 700;
--font-weight-medium: 500;
--font-weight-normal: 400;
--font-weight-light: 300;
```

---

## 🛠️ 使用方法

### 1. 顏色使用（CSS Variables）

```tsx
// 背景色
style={{ backgroundColor: 'var(--swy-jet-black)' }}

// 文字色
style={{ color: 'var(--swy-bleached-silk)' }}

// 邊框色
style={{ borderColor: 'var(--swy-anthracite)' }}
```

### 2. Utility Classes（工具類）

```tsx
// 背景色
<div className="swy-bg-jet-black">
<div className="swy-bg-bleached-silk">

// 文字色
<p className="swy-text-anthracite">
<h1 className="swy-text-jet-black">

// 邊框色
<div className="swy-border-watermark">
```

### 3. Typography Classes

```tsx
// 大標題（模擬 Avenir Black）
<h1 className="swy-heading-black">
  BRAND TITLE
</h1>

// 一般標題（模擬 Avenir Regular）
<h2 className="swy-heading-regular">
  Section Heading
</h2>

// 內文
<p className="swy-body-text">
  Lorem ipsum dolor sit amet...
</p>

// 標籤文字（大寫 + 寬字距）
<span className="swy-label-text">
  ARCHIVE / 001
</span>
```

### 4. Font Family 使用

```tsx
// 主要字體（粗體標題）
style={{ 
  fontFamily: 'var(--font-primary)',
  fontWeight: 'var(--font-weight-black)'
}}

// 次要字體（一般文字）
style={{ 
  fontFamily: 'var(--font-secondary)',
  fontWeight: 'var(--font-weight-normal)'
}}

// 中文襯線字體
style={{ fontFamily: 'var(--font-serif)' }}
```

---

## 📋 完整範例

### 使用品牌色 + 字體的按鈕

```tsx
<button
  className="swy-bg-jet-black swy-text-bleached-silk"
  style={{
    fontFamily: 'var(--font-primary)',
    fontWeight: 'var(--font-weight-black)',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    padding: '16px 48px',
    border: '0.5px solid var(--swy-watermark)',
  }}
>
  EXPLORE ARCHIVE
</button>
```

### 品牌標題

```tsx
<h1
  className="swy-text-jet-black"
  style={{
    fontFamily: 'var(--font-primary)',
    fontWeight: 'var(--font-weight-black)',
    fontSize: '4rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  }}
>
  SWY COLLECTION
</h1>
```

### 內文段落

```tsx
<p
  className="swy-text-anthracite swy-body-text"
  style={{
    fontSize: '1rem',
    lineHeight: '1.8',
    letterSpacing: '0.02em',
  }}
>
  每一場開箱都是儀式的開始...
</p>
```

---

## 🎯 設計原則

### 顏色使用準則

1. **Jet Black** - 主要深色背景、CTA 按鈕
2. **Anthracite** - 次要文字、圖標、輔助元素
3. **Bleached Silk** - 淺色背景、深色背景上的文字
4. **Watermark** - 細微邊框、分隔線、輔助背景

### 字體使用準則

1. **Montserrat Black (900)** - 大標題、品牌名稱、重要 CTA
2. **Montserrat Bold (700)** - 次要標題、按鈕文字
3. **Montserrat Medium (500)** - 小標題、標籤
4. **Montserrat Regular (400)** - 內文、描述文字
5. **Noto Serif TC** - 中文重要內容（保持優雅）

### 字距建議

- 大標題：`letter-spacing: 0.05em`
- 標籤文字：`letter-spacing: 0.3em` + `text-transform: uppercase`
- 一般文字：`letter-spacing: 0.02em`
- 內文段落：`letter-spacing: 0.01em`

---

## ✅ 已更新的檔案

1. `/src/styles/fonts.css` - Montserrat 字體導入
2. `/src/styles/theme.css` - 品牌色彩變數
3. `/src/styles/brand.css` - 品牌工具類
4. `/src/styles/index.css` - 導入品牌樣式

---

## 🚀 下一步

目前所有組件仍使用 Legacy Noir Archive 顏色（`#0A0A0A`, `#F2F0ED`）。

如果需要將整個網站轉換為新的品牌色系，請告知：

1. 是否要保持 Noir Archive 黑色風格（使用 `#0A0A0A` 和 `#302E2F` 混合）？
2. 是否要完全採用新品牌色（`#F8F8F9` 淺色為主）？
3. 還是混合使用（黑白雙色系統）？

---

**Created:** March 7, 2026  
**Brand Guideline Version:** SWY 2026 Official
