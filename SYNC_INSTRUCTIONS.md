# 📤 同步指引：Figma Make → GitHub → Vercel

## 🎯 需要同步的文件

### 文件 1: `/src/app/components/LandingPage.tsx`
**關鍵修改：** Logo 圖片路徑（第 86 行）

**修改前（舊代碼）：**
可能是 GitHub raw URL 或其他路徑

**修改後（新代碼）：**
```tsx
<img
  src="/swy-logo.png"
  alt="SWY"
  className="w-[200px] sm:w-[280px] md:w-[350px] h-auto"
/>
```

---

### 文件 2: `/src/app/components/CollectionGrid.tsx`
**關鍵修改：** 產品圖片路徑（第 19 行）

**修改前（舊代碼）：**
```tsx
'morning-after-quit': '/products/morning-after-quit.png',  // 缺少 "i"
```

**修改後（新代碼）：**
```tsx
'morning-after-quit': '/products/morning-after-i-quit.png',  // 正確！
```

---

## 🔧 快速同步方法

### **選項 A：在 GitHub Web 介面手動編輯**

1. **編輯 LandingPage.tsx：**
   - 前往：https://github.com/BDGOAL/Swyshopify/blob/main/src/app/components/LandingPage.tsx
   - 點擊鉛筆圖標 → 找到第 86 行 → 修改 `src` 屬性為 `"/swy-logo.png"`
   - Commit changes

2. **編輯 CollectionGrid.tsx：**
   - 前往：https://github.com/BDGOAL/Swyshopify/blob/main/src/app/components/CollectionGrid.tsx
   - 點擊鉛筆圖標 → 找到第 19 行 → 確認路徑包含 "i"
   - Commit changes

3. **等待 Vercel 自動部署：**
   - GitHub commit 會觸發 Vercel 自動部署
   - 大約 1-2 分鐘

4. **測試：**
   - 訪問：https://swyshopify.vercel.app
   - 強制刷新（Ctrl + Shift + R）

---

### **選項 B：下載完整文件並替換**

**從 Figma Make 下載文件：**

1. 在 Figma Make 介面中
2. 找到文件列表
3. 下載 `/src/app/components/LandingPage.tsx`
4. 下載 `/src/app/components/CollectionGrid.tsx`

**上傳到 GitHub：**

1. 前往 GitHub 對應路徑
2. 點擊文件 → 刪除舊文件 → Upload new file
3. 或直接編輯並貼上完整內容

---

### **選項 C：使用 Git 命令（如果有本地環境）**

```bash
# 1. Clone 倉庫（如果還沒有）
git clone https://github.com/BDGOAL/Swyshopify.git
cd Swyshopify

# 2. 從 Figma Make 複製更新的文件到本地
# 替換以下兩個文件：
# - src/app/components/LandingPage.tsx
# - src/app/components/CollectionGrid.tsx

# 3. 提交並推送
git add src/app/components/LandingPage.tsx
git add src/app/components/CollectionGrid.tsx
git commit -m "Fix logo and product image paths"
git push origin main

# 4. 等待 Vercel 自動部署
```

---

## ⏰ 部署時間線

1. **GitHub Commit：** 即時
2. **Vercel 檢測到更新：** ~10 秒
3. **Vercel 開始構建：** ~30 秒
4. **部署完成：** ~1-2 分鐘

**監控部署進度：**
- Vercel Dashboard: https://vercel.com/dashboard
- 選擇 `swyshopify` 項目
- 查看 **Deployments** 標籤

---

## ✅ 驗證清單

部署完成後，請檢查：

### 1. Logo 顯示測試
- [ ] 訪問：https://swyshopify.vercel.app
- [ ] 強制刷新（Ctrl + Shift + R）
- [ ] **預期結果：** 頁面中央顯示大尺寸 SWY logo
- [ ] **動畫測試：** 向下滾動，logo 縮小並移動到左上角

### 2. 產品圖片測試
- [ ] 滾動到 "The Archive" 區域
- [ ] 找到第 7 個產品：**"THE MORNING AFTER I QUIT"**
- [ ] **預期結果：** 顯示你上傳的本地圖片（不是 Unsplash）
- [ ] **Hover 測試：** 鼠標懸停，圖片放大並增強對比度

### 3. Console 檢查
- [ ] 按 F12 打開開發者工具
- [ ] 切換到 Console 標籤
- [ ] 刷新頁面
- [ ] **預期結果：** 沒有 404 錯誤訊息

### 4. Network 檢查
- [ ] 按 F12 → Network 標籤
- [ ] 刷新頁面
- [ ] 搜索 `swy-logo`
- [ ] **預期結果：** Status Code = 200 OK

---

## 🆘 如果仍然有問題

### 問題 A: Logo 還是不顯示

**可能原因：**
- 瀏覽器緩存

**解決方案：**
1. 清除瀏覽器緩存（Ctrl + Shift + Delete）
2. 選擇 "圖片和文件"
3. 時間範圍：最近 1 小時
4. 清除後重新訪問

**或者使用無痕模式：**
- 按 Ctrl + Shift + N
- 訪問網站測試

---

### 問題 B: Vercel 未自動部署

**解決方案：**
1. 前往 Vercel Dashboard
2. 選擇 `swyshopify` 項目
3. **Deployments** → 點擊最新部署
4. 點擊 **"Redeploy"** → **"Rebuild"**
5. 等待重新部署完成

---

### 問題 C: 圖片顯示為灰色方塊

**原因：**
Logo 圖片有淺灰色背景（不是透明背景）

**解決方案（後續優化）：**
1. 使用圖片編輯工具（Photoshop、Figma 等）
2. 將背景改為透明
3. 重新上傳到 GitHub `/public/swy-logo.png`
4. Vercel 會自動更新

---

## 📊 目前狀態總結

| 項目 | 狀態 | 說明 |
|------|------|------|
| Logo 文件存在 | ✅ | `https://swyshopify.vercel.app/swy-logo.png` 可訪問 |
| 產品圖片存在 | ✅ | `morning-after-i-quit.png` 正常顯示 |
| Figma Make 代碼 | ✅ | 已更新為正確路徑 |
| GitHub 代碼 | ⏳ | **需要同步** |
| Vercel 部署 | ⏳ | 等待 GitHub 同步後自動部署 |

---

## 🎯 下一步

1. **立即執行：** 使用上述任一方法同步代碼到 GitHub
2. **等待：** Vercel 自動部署（1-2 分鐘）
3. **測試：** 訪問網站並強制刷新
4. **回報：** 告訴我 Logo 是否正常顯示

如果有任何問題，請提供：
- 瀏覽器 Console 錯誤訊息
- Network 標籤的 Status Code
- 截圖

我會立即協助解決！🖤
