# 🍾 瓶子圖片資訊

## 📍 當前狀態

目前使用 **Unsplash 高品質替代圖片**，因為瓶子圖片尚未上傳。

## 🔧 如何替換為真實瓶子圖片

### 步驟 1：上傳瓶子圖片
將您的瓶子圖片（建議透明背景 PNG）上傳到：
```
/public/products/bottle.png
```

### 步驟 2：更新配置
修改 `/src/app/data/bottleImage.ts` 檔案：

```typescript
// 改為這行：
export const BOTTLE_IMAGE = '/products/bottle.png';

// 刪除或註解掉 Unsplash URL
```

### 步驟 3：推送到 GitHub
```bash
git add public/products/bottle.png src/app/data/bottleImage.ts
git commit -m "Add real bottle image"
git push origin main
```

Vercel 會自動重新部署！✅

---

## 📁 建議圖片規格

- **尺寸**：600x900px（2:3 比例）
- **格式**：PNG（支援透明背景）
- **背景**：透明或淺色背景
- **風格**：符合 Noir Archive 美學

---

**注意**：在您上傳真實圖片前，Unsplash fallback 會繼續提供專業的替代圖片，不會影響網站運作。
