# 🚀 Vercel 部署指南

## 📦 准备工作

在部署之前，确保你已经：
- ✅ 拥有 GitHub 账号
- ✅ 拥有 Vercel 账号（可以用 GitHub 登录）
- ✅ 已获取 Shopify Storefront API Token

---

## 🔧 步骤 1：将代码推送到 GitHub

### 1.1 初始化 Git 仓库（如果还没有）

```bash
git init
git add .
git commit -m "Initial commit: SWY Digital Unboxing Experience"
```

### 1.2 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称：`swy-digital-unboxing`
3. 设置为 **Private**（因为包含 Shopify 配置）
4. **不要**勾选 "Initialize with README"
5. 点击 "Create repository"

### 1.3 推送代码到 GitHub

```bash
git remote add origin https://github.com/你的用户名/swy-digital-unboxing.git
git branch -M main
git push -u origin main
```

---

## 🌐 步骤 2：在 Vercel 部署

### 2.1 导入项目

1. 访问 https://vercel.com
2. 点击 **"Add New..."** → **"Project"**
3. 选择你的 GitHub 仓库 `swy-digital-unboxing`
4. 点击 **"Import"**

### 2.2 配置环境变量

在 "Environment Variables" 区域添加以下变量：

| 变量名 | 值 |
|--------|-----|
| `VITE_SHOPIFY_STORE_DOMAIN` | `your-store.myshopify.com` |
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | `<SHOPIFY_STOREFRONT_ACCESS_TOKEN>` |
| `VITE_SHOPIFY_API_VERSION` | `2026-01` |
| `VITE_SHOPIFY_COUNTRY_CODE` | `TW` |
| `VITE_SHOPIFY_LANGUAGE_CODE` | `zh-TW` |

**重要提示：**
- 环境变量名称必须 **完全一致**（包括大小写）
- Token 不要包含引号
- 应用到所有环境（Production、Preview、Development）

### 2.3 部署设置

- **Framework Preset**: Vite
- **Build Command**: `npm run build`（自动检测）
- **Output Directory**: `dist`（自动检测）
- **Install Command**: `npm install`（自动检测）

### 2.4 开始部署

点击 **"Deploy"** 按钮，等待 2-3 分钟。

---

## ✅ 步骤 3：验证部署

### 3.1 检查部署状态

部署完成后，Vercel 会显示：
- ✅ **部署成功** 的绿色勾选
- 🔗 你的网站 URL（例如：`https://swy-digital-unboxing.vercel.app`）

### 3.2 测试网站

1. 点击网站 URL
2. 检查左下角的 **"SHOPIFY CONNECTION TEST"** 面板
3. 应该显示：✅ **CONNECTED**

### 3.3 查看控制台

按 `F12` 打开开发者工具，在 Console 中应该看到：
```
✅ Shopify 连接成功！
```

---

## 🌍 步骤 4：绑定自定义域名（可选）

### 4.1 在 Vercel 添加域名

1. 进入项目 → **Settings** → **Domains**
2. 输入你的域名（例如：`www.swy.com.tw`）
3. 点击 **"Add"**

### 4.2 配置 DNS

在你的域名注册商（如 GoDaddy、Cloudflare）添加 DNS 记录：

**A 记录：**
```
Name: @
Type: A
Value: 76.76.21.21
```

**CNAME 记录：**
```
Name: www
Type: CNAME
Value: cname.vercel-dns.com
```

### 4.3 等待 DNS 生效

通常需要 5-60 分钟，Vercel 会自动配置 HTTPS 证书。

---

## 🔄 步骤 5：后续更新

### 每次修改代码后：

```bash
git add .
git commit -m "描述你的修改"
git push
```

Vercel 会 **自动重新部署**！🎉

---

## 🛠️ 常见问题

### Q1: Shopify 连接失败？
**A:** 检查 Vercel 环境变量是否正确设置。进入 **Settings** → **Environment Variables** 确认。

### Q2: 修改后没有更新？
**A:** 确保你已经 `git push`，然后在 Vercel 查看部署日志。

### Q3: 想要移除测试面板？
**A:** 在 `/src/app/App.tsx` 中删除 `<ShopifyConnectionTest />` 组件。

### Q4: 想要更换 Token？
**A:** 在 Vercel → **Settings** → **Environment Variables** 修改，然后重新部署。

---

## 📊 性能优化（可选）

### 启用 Vercel Analytics

1. 进入项目 → **Analytics** 标签
2. 点击 **"Enable"**
3. 免费获取用户访问数据

### 启用 Speed Insights

1. 进入项目 → **Speed Insights** 标签
2. 点击 **"Enable"**
3. 查看网站性能指标

---

## 🎯 完成！

你的网站现在已经：
- ✅ 部署在全球 CDN 上（超快速）
- ✅ 拥有免费 HTTPS 证书
- ✅ 连接到 Shopify 后端
- ✅ 自动更新（每次 Git push）

**你的网站 URL：** `https://你的项目名.vercel.app`

---

## 📞 需要帮助？

- Vercel 文档：https://vercel.com/docs
- Shopify 文档：https://shopify.dev/docs/storefronts/headless
- 我的支持：（填入你的联系方式）
