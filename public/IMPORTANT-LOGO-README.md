# ⚠️ 重要：Logo 文件保护说明

## 📌 关键文件

```
/public/swy-logo.png
```

## 🛡️ 保护规则

**此文件由用户手动上传至 GitHub，绝对不可删除或覆盖！**

### ✅ 允许的操作：
- 在代码中引用：`<img src="/swy-logo.png" />`
- 更新图片内容（由用户在 GitHub 手动替换）

### ❌ 禁止的操作：
- ❌ 使用 `delete_tool` 删除此文件
- ❌ 使用 `write_tool` 覆盖此文件
- ❌ 在 Git 中删除或移动此文件
- ❌ 推送任何会移除此文件的更改

---

## 🔄 同步工作流程

### Figma Make → GitHub 推送时：
1. ✅ 推送代码更改（`.tsx`, `.ts`, `.css` 等）
2. ✅ 推送 `/public/products/` 中的产品图片
3. ❌ **不推送/不删除** `/public/swy-logo.png`

### 文件状态：
- **在 Figma Make 中：** 可能不存在或为占位符
- **在 GitHub 中：** 必须保持用户上传的真实 PNG
- **在 Vercel 中：** 从 GitHub 读取真实 PNG

---

## 📝 如需修改 Logo：

1. 用户在 GitHub 仓库手动替换 `swy-logo.png`
2. Vercel 自动重新部署
3. 无需修改代码

---

## 🎨 当前使用位置：

- `/src/app/components/LandingPage.tsx` - 主 Logo 显示
- 任何使用 `<img src="/swy-logo.png" />` 的组件

---

**最后更新：2026-03-04**  
**创建原因：防止推送时意外删除用户手动上传的 Logo 文件**
