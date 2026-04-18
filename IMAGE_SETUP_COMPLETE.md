# ✅ 圖片設置完成檢查清單

## 📸 已更新的文件路徑

### 1. SWY Logo
- **代碼路徑：** `/src/app/components/LandingPage.tsx` (Line 86)
- **引用方式：** `<img src="/swy-logo.png" />`
- **GitHub 文件：** `/public/swy-logo.png`
- **網站 URL：** `https://swyshopify.vercel.app/swy-logo.png`

### 2. Morning After I Quit 產品圖片
- **代碼路徑：** `/src/app/components/CollectionGrid.tsx` (Line 19)
- **引用方式：** `'morning-after-quit': '/products/morning-after-i-quit.png'`
- **GitHub 文件：** `/public/products/morning-after-i-quit.png`
- **網站 URL：** `https://swyshopify.vercel.app/products/morning-after-i-quit.png`

---

## 🔧 已修正的問題

### ❌ 之前的錯誤：
```tsx
'morning-after-quit': '/products/morning-after-quit.png'
// 缺少 "i" → 404 錯誤
```

### ✅ 修正後：
```tsx
'morning-after-quit': '/products/morning-after-i-quit.png'
// 與 GitHub 檔案名完全匹配 ✅
```

---

## 🚀 部署檢查

### 關鍵確認點：

#### ✅ GitHub 倉庫狀態
你的 GitHub 倉庫 (BDGOAL/Swyshopify) 已包含：
- `/public/swy-logo.png` ✅
- `/public/products/morning-after-i-quit.png` ✅

#### ⏳ Vercel 部署狀態
需要確認 Vercel 是否已部署最新版本：

1. **檢查部署時間：**
   - 前往：https://vercel.com/dashboard
   - 選擇 `swyshopify` 項目
   - 查看最新部署的時間戳
   - **必須是今天（2026年3月4日）**

2. **檢查 Commit 訊息：**
   - 最新部署應該包含你上傳圖片的 commit
   - 例如："Add logo and product images"

---

## 🧪 測試步驟

### Test 1: 直接訪問圖片 URL

#### Logo 測試：
```
https://swyshopify.vercel.app/swy-logo.png
```
**預期結果：**
- ✅ 看到白色的 SWY logo（PNG 圖片）
- ❌ 如果看到 404 → Vercel 未部署最新版本

#### 產品圖片測試：
```
https://swyshopify.vercel.app/products/morning-after-i-quit.png
```
**預期結果：**
- ✅ 看到 "THE MORNING AFTER I QUIT" 的產品圖片
- ❌ 如果看到 404 → Vercel 未部署最新版本

---

### Test 2: 在網站上查看圖片顯示

#### 測試 Logo：
1. 訪問：https://swyshopify.vercel.app
2. 刷新頁面（Ctrl + Shift + R 強制刷新）
3. **預期效果：**
   - ✅ 頁面中央顯示 **大尺寸 SWY logo**
   - ✅ 向下滾動時，logo **縮小並移動到左上角**
   - ✅ 繼續滾動，logo **淡出消失**

#### 測試產品圖片：
1. 滾動到 **"The Archive"** 區域（CollectionGrid）
2. 找到第 7 個產品卡片：**"THE MORNING AFTER I QUIT"**
3. **預期效果：**
   - ✅ 卡片背景顯示你上傳的本地圖片（黑白高對比）
   - ✅ Hover 時圖片放大並增強對比度
   - ❌ 如果還是顯示 Unsplash 圖片 → 檢查瀏覽器緩存

---

### Test 3: 瀏覽器 Console 檢查

1. 按 **F12** 打開開發者工具
2. 切換到 **Console** 標籤
3. 刷新頁面（Ctrl + Shift + R）
4. **檢查錯誤訊息：**

**❌ 如果看到這個錯誤：**
```
GET https://swyshopify.vercel.app/swy-logo.png 404 (Not Found)
GET https://swyshopify.vercel.app/products/morning-after-i-quit.png 404 (Not Found)
```
→ **Vercel 未部署最新版本**，需要手動觸發重新部署

**✅ 沒有 404 錯誤：**
→ **圖片加載成功！**

---

## 🔄 如果圖片仍然不顯示（Vercel 未部署）

### 解決方案 1: 手動觸發 Vercel 重新部署

1. 前往 Vercel Dashboard: https://vercel.com/dashboard
2. 選擇項目 `swyshopify`
3. 進入 **Deployments** 標籤
4. 點擊最新的部署記錄
5. 點擊右上角的 **"Redeploy"** 按鈕
6. 選擇 **"Rebuild"**（重新構建）
7. 等待 1-2 分鐘，直到部署完成
8. 刷新網站測試圖片

---

### 解決方案 2: 在 GitHub 提交一個小變更（觸發自動部署）

1. 前往 GitHub 倉庫：https://github.com/BDGOAL/Swyshopify
2. 打開 `README.md` 文件
3. 點擊編輯按鈕（鉛筆圖標）
4. 添加一行內容，例如：
   ```markdown
   Updated: 2026-03-04 - Added logo and product images
   ```
5. 點擊 **"Commit changes"**
6. Vercel 會自動檢測到新的 commit 並重新部署
7. 等待 1-2 分鐘，刷新網站測試

---

### 解決方案 3: 清除瀏覽器緩存

有時即使 Vercel 已部署，瀏覽器仍會使用舊的緩存：

1. **方法 A：強制刷新**
   - 按 **Ctrl + Shift + R**（Windows/Linux）
   - 按 **Cmd + Shift + R**（Mac）

2. **方法 B：清除緩存**
   - 按 **Ctrl + Shift + Delete**
   - 選擇 "清除圖片和文件"
   - 時間範圍：**最近 1 小時**
   - 點擊清除

3. **方法 C：無痕模式測試**
   - 按 **Ctrl + Shift + N** 開啟無痕視窗
   - 訪問網站，查看圖片是否正常顯示

---

## 📊 最終確認清單

請逐一檢查以下項目：

- [ ] GitHub 倉庫中有 `/public/swy-logo.png` 文件
- [ ] GitHub 倉庫中有 `/public/products/morning-after-i-quit.png` 文件
- [ ] Vercel 最新部署的時間是今天（2026-03-04）
- [ ] 訪問 `https://swyshopify.vercel.app/swy-logo.png` 可以看到 logo
- [ ] 訪問 `https://swyshopify.vercel.app/products/morning-after-i-quit.png` 可以看到產品圖片
- [ ] 網站首頁中央顯示 SWY logo
- [ ] CollectionGrid 中 "THE MORNING AFTER I QUIT" 產品卡片顯示本地圖片
- [ ] 瀏覽器 Console 沒有 404 錯誤

---

## 🎯 下一步：替換其他產品圖片

如果以上測試全部通過，我們可以繼續替換剩餘 7 個產品的 Unsplash 圖片。

### 需要準備的圖片文件名：

```
/public/products/
  ├── the-last-snow.png          (最後一場雪)
  ├── the-first-rose.png         (初戀玫瑰)
  ├── no-worries.png             (無憂時光)
  ├── old-library.png            (舊圖書館)
  ├── mens-garage.png            (男人車庫)
  ├── im-rich.png                (我很富有)
  ├── morning-after-i-quit.png   ✅ 已完成
  └── night-was-mine.png         (那夜屬於我)
```

### 圖片風格建議（符合 Noir Archive 美學）：
- 高對比度黑白
- 城市街景 / 建築細節
- 光影效果 / 霧氣氛圍
- 16mm 底片顆粒感
- Brutalist 風格
- 尺寸建議：800x1000px（3:4 比例）

---

## 💬 回覆格式

請告訴我測試結果：

```
✅ Test 1 - Logo URL: 可以看到 / 404 錯誤
✅ Test 2 - 產品圖片 URL: 可以看到 / 404 錯誤
✅ Test 3 - 網站首頁 Logo: 正常顯示 / 不顯示
✅ Test 4 - 產品卡片: 顯示本地圖片 / 還是 Unsplash
✅ Test 5 - Console 錯誤: 無錯誤 / 有 404 錯誤

Vercel 最新部署時間：__________
```

根據你的回覆，我會立即提供下一步的解決方案！🖤
