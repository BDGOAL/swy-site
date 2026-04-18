# 🖤 SWY LOGO 设置指南

## ✅ 当前状态

代码已更新为使用本地 LOGO 文件：`/swy-logo.png`

## 📋 部署前必做步骤

### 1️⃣ 下载 LOGO 文件

从你的 GitHub 仓库下载 LOGO：

```
https://raw.githubusercontent.com/BDGOAL/Swyshopify/refs/heads/main/SWY-logo_new.png
```

**或者使用命令行：**

```bash
# 进入项目根目录
cd your-project-folder

# 下载文件到 public 文件夹
curl -o public/swy-logo.png "https://raw.githubusercontent.com/BDGOAL/Swyshopify/refs/heads/main/SWY-logo_new.png?token=GHSAT0AAAAAADWTVDC7VOSSFGWXDE55MICM2ND5P3A"
```

### 2️⃣ 文件结构确认

确保文件放置正确：

```
your-project/
├── public/
│   ├── swy-logo.png  ← LOGO 文件必须在这里
│   └── README.md
├── src/
│   └── app/
│       └── components/
│           └── LandingPage.tsx  ← 已更新为使用 /swy-logo.png
└── ...
```

### 3️⃣ 提交到 Git

```bash
# 添加文件
git add public/swy-logo.png

# 提交
git commit -m "Add SWY logo to public folder"

# 推送到 GitHub
git push origin main
```

### 4️⃣ Vercel 自动部署

推送后，Vercel 会自动检测更改并重新部署 ✅

---

## 🔍 验证 LOGO 是否正确加载

部署完成后，打开浏览器开发者工具（F12）：

### Network 面板检查：
- 应该看到 `swy-logo.png` 请求
- 状态应该是 `200 OK`
- 类型应该是 `image/png`

### Console 检查：
- 不应该有 404 错误
- 不应该有 "Failed to load resource" 错误

---

## 🚨 常见问题

### Q: LOGO 不显示？
**A:** 检查文件名是否完全匹配：
- ✅ 正确：`/public/swy-logo.png`
- ❌ 错误：`/public/SWY-logo.png` (大小写)
- ❌ 错误：`/public/swy_logo.png` (下划线)

### Q: 部署后仍然 404？
**A:** 确保：
1. 文件已提交到 Git
2. 文件在 `public` 文件夹根目录
3. Vercel 重新构建完成（不是使用缓存）

### Q: 想更换 LOGO？
**A:** 只需替换 `/public/swy-logo.png` 文件即可，无需修改代码

---

## 💡 性能优化说明

使用本地文件的优势：

| 指标 | GitHub URL | 本地文件 |
|------|-----------|---------|
| **加载速度** | ~500ms | ~50ms |
| **稳定性** | ⚠️ Token 过期风险 | ✅ 永久可用 |
| **CDN 缓存** | ❌ 无 | ✅ Vercel Edge |
| **域名** | github.com | swyshopify.vercel.app |

---

## ✅ 完成检查清单

- [ ] 下载 LOGO 文件
- [ ] 放置到 `/public/swy-logo.png`
- [ ] 提交到 Git
- [ ] 推送到 GitHub
- [ ] Vercel 自动部署完成
- [ ] 打开网站验证 LOGO 显示

**全部完成后，你的网站就可以完美运行了！** 🚀🖤
