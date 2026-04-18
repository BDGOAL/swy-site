# 🔧 Avenir 字體修復指南

## ❌ 當前問題：

瀏覽器**無法載入 `.txt` 檔案作為字體**，即使內容是正確的 Base64 編碼字體。

你的字體目前儲存在：
- `/src/imports/binary-data.txt` (Avenir Regular)
- `/src/imports/binary-data-1.txt` (Avenir Black)

但瀏覽器會拒絕它們，因為副檔名是 `.txt`。

---

## ✅ 解決方案（選擇一個）：

### **方案 A：重新命名檔案（推薦，最簡單）**

#### **在 GitHub 上操作：**

1. **前往你的 GitHub repository**
   - 網址：`https://github.com/你的用戶名/swyshopify`

2. **導航到 `/src/imports/` 資料夾**

3. **重新命名 `binary-data.txt`：**
   - 點擊檔案
   - 點擊右上角的「鉛筆」圖示（Edit）
   - 將檔案名從 `binary-data.txt` 改為：
     ```
     Avenir-Regular.woff2
     ```
   - 點擊 **Commit changes**

4. **重新命名 `binary-data-1.txt`：**
   - 同樣步驟
   - 改名為：
     ```
     Avenir-Black.woff2
     ```

5. **更新 `/src/styles/fonts.css`：**

```css
/* Traditional Chinese support - @import must be first */
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;500;600;700&display=swap');

/* ✅ Avenir Regular */
@font-face {
  font-family: 'Avenir';
  src: url('/src/imports/Avenir-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* ✅ Avenir Black */
@font-face {
  font-family: 'Avenir';
  src: url('/src/imports/Avenir-Black.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

:root {
  --font-primary: 'Avenir', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-secondary: 'Avenir', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-serif: 'Noto Serif TC', serif;
  --font-sans: 'Avenir', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

6. **Commit 並等待 Vercel 重新部署**

---

### **方案 B：移到 `/public/fonts/` 資料夾**

#### **更專業的方式：**

1. **在 GitHub 創建 `/public/fonts/` 資料夾**

2. **移動並重新命名檔案：**
   - `binary-data.txt` → `/public/fonts/Avenir-Regular.woff2`
   - `binary-data-1.txt` → `/public/fonts/Avenir-Black.woff2`

3. **更新 `/src/styles/fonts.css`：**

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;500;600;700&display=swap');

@font-face {
  font-family: 'Avenir';
  src: url('/fonts/Avenir-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Avenir';
  src: url('/fonts/Avenir-Black.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

:root {
  --font-primary: 'Avenir', -apple-system, sans-serif;
  --font-secondary: 'Avenir', -apple-system, sans-serif;
  --font-serif: 'Noto Serif TC', serif;
}
```

---

## 🎯 推薦步驟（最快）：

### **立即執行（5 分鐘）：**

1. **前往 GitHub**
   - 打開 `https://github.com/你的用戶名/你的repo名稱`

2. **重新命名兩個檔案：**
   - `src/imports/binary-data.txt` → `Avenir-Regular.woff2`
   - `src/imports/binary-data-1.txt` → `Avenir-Black.woff2`

3. **等我更新 CSS**（我現在就做）

4. **Vercel 自動部署**

5. **完成！字體會正常顯示！**

---

## ❓ 為什麼 `.txt` 不行？

瀏覽器會檢查：
1. **檔案副檔名**（必須是 `.woff2`, `.woff`, `.ttf`, `.otf`）
2. **MIME type**（伺服器回應的 Content-Type）
3. **檔案內容**（必須是有效的字體格式）

即使你的 `.txt` 檔案包含正確的 Base64 字體資料，瀏覽器仍然會拒絕，因為副檔名錯誤。

---

## ✅ 完成後檢查：

### **在瀏覽器開發者工具（F12）：**

1. **Network 標籤**
   - 搜尋 `Avenir`
   - 應該看到兩個 `.woff2` 檔案
   - Status: `200 OK`（綠色）
   - Type: `font/woff2`

2. **Console 標籤**
   - 不應該有字體相關錯誤
   - 如果之前有 `Failed to decode font` 錯誤，現在應該消失了

3. **Elements 標籤**
   - 檢查任何文字
   - **Computed** → **font-family**
   - 應該顯示：`Avenir, -apple-system, ...`

---

## 🚀 完成後：

你的網站會使用真正的 Avenir 字體！

**告訴我你選擇哪個方案，我會配合更新 CSS！** 🎨
