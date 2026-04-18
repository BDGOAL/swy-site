# 📸 圖片上傳指南

目前網站無法顯示以下圖片，因為它們尚未上傳到 `/public` 資料夾。

---

## ❌ 缺少的文件

### 1. SWY Logo
- **文件名稱：** `swy-logo.png`
- **存放位置：** `/public/swy-logo.png`
- **下載連結：** https://raw.githubusercontent.com/BDGOAL/Swyshopify/refs/heads/main/SWY-logo_new.png

### 2. 產品圖片 - The Morning After I Quit
- **文件名稱：** `morning-after-quit.png`
- **存放位置：** `/public/products/morning-after-quit.png`
- **下載連結：** https://raw.githubusercontent.com/BDGOAL/Swyshopify/refs/heads/main/public/products/the%20morning%20after%20i%20quit_graphic_V2-03.png

---

## 📋 上傳步驟（方法 1：通過 GitHub）

因為 Figma Make 可能不支持直接上傳圖片文件，建議通過 GitHub 上傳：

### Step 1: 下載圖片到本地電腦

1. **SWY Logo：**
   - 右鍵點擊：https://raw.githubusercontent.com/BDGOAL/Swyshopify/refs/heads/main/SWY-logo_new.png
   - 選擇「另存圖片為...」
   - 重命名為：`swy-logo.png`

2. **產品圖片：**
   - 右鍵點擊：https://raw.githubusercontent.com/BDGOAL/Swyshopify/refs/heads/main/public/products/the%20morning%20after%20i%20quit_graphic_V2-03.png
   - 選擇「另存圖片為...」
   - 重命名為：`morning-after-quit.png`

### Step 2: 上傳到 GitHub 倉庫

#### 上傳 Logo：
1. 前往 GitHub 倉庫：https://github.com/BDGOAL/Swyshopify
2. 點擊進入 `public/` 資料夾
3. 點擊右上角的 **"Add file" → "Upload files"**
4. 拖曳 `swy-logo.png` 到上傳區域
5. 在底部填寫 Commit message：`Add SWY logo`
6. 點擊 **"Commit changes"**

#### 上傳產品圖片：
1. 在 `public/` 資料夾中，點擊進入 `products/` 子資料夾
2. 點擊 **"Add file" → "Upload files"**
3. 拖曳 `morning-after-quit.png` 到上傳區域
4. Commit message：`Add morning-after-quit product image`
5. 點擊 **"Commit changes"**

### Step 3: 等待 Vercel 自動部署

- GitHub 更新後，Vercel 會在 1-2 分鐘內自動重新部署
- 前往 https://swyshopify.vercel.app 查看結果
- 圖片應該會正常顯示

---

## 📋 上傳步驟（方法 2：通過本地 Git）

如果你有本地 Git 倉庫：

```bash
# 1. Clone 倉庫（如果還沒有）
git clone https://github.com/BDGOAL/Swyshopify.git
cd Swyshopify

# 2. 將下載的圖片移動到正確位置
# 將 swy-logo.png 放到 public/
# 將 morning-after-quit.png 放到 public/products/

# 3. 提交並推送
git add public/swy-logo.png
git add public/products/morning-after-quit.png
git commit -m "Add logo and product images"
git push origin main
```

---

## ✅ 驗證圖片已正確上傳

上傳完成後，在瀏覽器中訪問以下 URL：

1. **Logo 檢查：**
   ```
   https://swyshopify.vercel.app/swy-logo.png
   ```
   應該看到 SWY logo 圖片

2. **產品圖片檢查：**
   ```
   https://swyshopify.vercel.app/products/morning-after-quit.png
   ```
   應該看到產品圖片

---

## 🎯 預期結果

上傳完成後：
- ✅ 首頁中央的 SWY logo 正常顯示（大圖）
- ✅ 滾動後 logo 移動到左上角（小圖）
- ✅ CollectionGrid 中「THE MORNING AFTER I QUIT」產品卡片顯示正確的背景圖

---

## ❓ 需要幫助？

如果上傳過程中遇到問題，請提供：
- 錯誤訊息截圖
- 你使用的上傳方法（GitHub web / Git CLI）
- 瀏覽器 Console 中的錯誤訊息（按 F12 打開）
