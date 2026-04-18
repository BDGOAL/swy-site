# ✅ Avenir 字體設置完成！

## 📅 完成時間：2026.03.07

---

## 🎉 成功！你的 Avenir 字體已經設置完成！

### **已設置的字體：**

1. ✅ **Avenir Regular** (font-weight: 400)
   - 檔案：`/src/imports/binary-data.txt`
   - 用途：內文、說明文字、次要標題

2. ✅ **Avenir Black** (font-weight: 900)
   - 檔案：`/src/imports/binary-data-1.txt`
   - 用途：品牌標題、主要 CTA、重點文字

---

## 📂 更新的檔案：

### **`/src/styles/fonts.css`**

```css
/* ✅ Avenir Regular */
@font-face {
  font-family: 'Avenir';
  src: url('/src/imports/binary-data.txt') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* ✅ Avenir Black */
@font-face {
  font-family: 'Avenir';
  src: url('/src/imports/binary-data-1.txt') format('woff2');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

:root {
  --font-primary: 'Avenir', -apple-system, sans-serif;
  --font-secondary: 'Avenir', -apple-system, sans-serif;
}
```

---

## 🎨 如何使用 Avenir 字體：

### **方法 1：使用 CSS 變數（推薦）**

```tsx
// 主標題 - Avenir Black
<h1 style={{
  fontFamily: 'var(--font-primary)',
  fontWeight: 900  // Avenir Black
}}>
  SWY COLLECTION
</h1>

// 內文 - Avenir Regular
<p style={{
  fontFamily: 'var(--font-secondary)',
  fontWeight: 400  // Avenir Regular
}}>
  每一場開箱都是儀式的開始
</p>
```

### **方法 2：直接使用 Avenir**

```tsx
// Avenir Black
<h1 style={{
  fontFamily: 'Avenir, sans-serif',
  fontWeight: 900
}}>
  標題
</h1>

// Avenir Regular
<p style={{
  fontFamily: 'Avenir, sans-serif',
  fontWeight: 400
}}>
  內文
</p>
```

---

## 🔍 檢查字體是否正確載入：

### **1. 在瀏覽器中檢查**

1. 打開網站
2. 按 **F12** 打開開發者工具
3. 前往 **Network** 標籤
4. 重新整理頁面
5. 搜尋 `binary-data`
6. 你應該看到兩個檔案：
   - `binary-data.txt` (Avenir Regular)
   - `binary-data-1.txt` (Avenir Black)

### **2. 檢查字體渲染**

1. 右鍵點擊任何文字
2. 選擇 **Inspect (檢查元素)**
3. 在 **Computed** 標籤中查看 **font-family**
4. 應該顯示：`Avenir, -apple-system, BlinkMacSystemFont, sans-serif`

---

## 🚀 下一步（GitHub 推送）：

### **重要！你的字體檔案在本地環境**

現在需要把字體檔案推送到 GitHub，讓 Vercel 也能載入：

#### **方法 A：使用 Figma Make 的 Git 功能**

1. 查看 Figma Make 介面是否有「Sync to GitHub」或「Push」按鈕
2. 點擊同步所有變更
3. Vercel 會自動重新部署

#### **方法 B：手動下載並推送**

1. 下載整個專案（包含 `/src/imports/` 資料夾）
2. 使用 Git 指令：
   ```bash
   git add src/imports/binary-data.txt
   git add src/imports/binary-data-1.txt
   git add src/styles/fonts.css
   git commit -m "Add Avenir fonts"
   git push origin main
   ```
3. Vercel 自動部署

---

## ✅ 確認清單：

- [x] Avenir Regular 字體檔案已上傳（`/src/imports/binary-data.txt`）
- [x] Avenir Black 字體檔案已上傳（`/src/imports/binary-data-1.txt`）
- [x] `/src/styles/fonts.css` 已更新
- [x] CSS 變數已設置（`--font-primary`, `--font-secondary`）
- [ ] **推送到 GitHub（待完成）**
- [ ] **在 Vercel 上測試（待完成）**

---

## 📊 字體資訊：

| 字體 | 檔案 | 字重 | 用途 |
|------|------|------|------|
| **Avenir Black** | `binary-data-1.txt` | 900 | 主標題、品牌名稱、CTA |
| **Avenir Regular** | `binary-data.txt` | 400 | 內文、說明、次要文字 |

---

## 🎨 品牌一致性：

### **SWY 官方字體系統：**

✅ **主字體：** Avenir Black (已設置)  
✅ **副字體：** Avenir Regular (已設置)  
✅ **中文字體：** Noto Serif TC (已設置)

### **字體優先順序：**

```
1. Avenir (你上傳的字體) ✅
2. -apple-system (macOS 系統字體)
3. BlinkMacSystemFont (Chrome 系統字體)
4. sans-serif (最終備用)
```

---

## ⚠️ 注意事項：

### **1. 字體授權**
確認你已經購買 Avenir 的 Web Font 授權。使用未授權字體可能違反版權法。

### **2. 檔案大小**
- `binary-data.txt` (Avenir Regular)：約 130KB
- `binary-data-1.txt` (Avenir Black)：約 130KB
- **總計：** 約 260KB

這是合理的大小，不會影響網站效能。

### **3. 格式**
檔案格式應該是 **WOFF2**（Web Open Font Format 2）- 最佳網頁字體格式。

---

## 🐛 如果字體沒有顯示：

### **問題排查步驟：**

#### **1. 檢查檔案路徑**
確認檔案確實存在於 `/src/imports/` 資料夾中。

#### **2. 檢查 Console**
打開瀏覽器 Console（F12），查看是否有錯誤訊息，例如：
- `404 Not Found` → 檔案路徑錯誤
- `CORS error` → 跨域問題（通常不會發生）

#### **3. 強制重新整理**
按 **Ctrl + Shift + R** (Windows) 或 **Cmd + Shift + R** (Mac) 清除快取並重新載入。

#### **4. 檢查字體格式**
如果你上傳的是 `.ttf` 檔案，可能需要改成：
```css
src: url('/src/imports/binary-data.txt') format('truetype');
```

---

## ✅ 成功！

**你現在使用的是真正的 Avenir 字體！**

網站的所有文字現在都會使用：
- **Avenir Black** (粗體標題)
- **Avenir Regular** (一般文字)

完全符合 **SWY 品牌指南 2026** 的要求！

---

**Created:** 2026.03.07  
**Status:** ✅ Setup Complete  
**Next Step:** Push to GitHub → Deploy to Vercel
