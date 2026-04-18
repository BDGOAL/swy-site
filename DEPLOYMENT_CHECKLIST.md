# ✅ 部署检查清单

按照顺序完成每个步骤，打勾确认完成。

---

## 📋 第一阶段：准备工作

- [ ] 已安装 Git（`git --version` 检查）
- [ ] 已拥有 GitHub 账号
- [ ] 已拥有 Vercel 账号（或用 GitHub 登录）
- [ ] 已获取 Shopify Storefront API Token
- [ ] 已确认 Token 格式正确（不是 `shpat_` 开头）

---

## 🔧 第二阶段：代码准备

- [ ] 已复制 `.env.example` 为 `.env`
- [ ] 已在 `.env` 中填入正确的 Shopify 配置
- [ ] 本地运行 `npm run dev` 测试成功
- [ ] 左下角显示 "✅ CONNECTED"
- [ ] 确认 `.gitignore` 包含 `.env`

---

## 🌐 第三阶段：推送到 GitHub

### 使用 GitHub Desktop（推荐）

- [ ] 已安装 GitHub Desktop
- [ ] 点击 "Publish repository"
- [ ] ✅ 设置为 **Private**
- [ ] 已成功推送到 GitHub
- [ ] 在 GitHub 网站上能看到代码

### 使用命令行

- [ ] 执行 `git init`
- [ ] 执行 `git add .`
- [ ] 执行 `git commit -m "Initial commit"`
- [ ] 在 GitHub 创建新仓库
- [ ] 执行 `git remote add origin <URL>`
- [ ] 执行 `git push -u origin main`

---

## 🚀 第四阶段：Vercel 部署

### 4.1 导入项目

- [ ] 访问 https://vercel.com
- [ ] 点击 "Add New..." → "Project"
- [ ] 选择 GitHub 仓库
- [ ] 点击 "Import"

### 4.2 配置环境变量（重要！）

逐个添加以下 5 个变量：

- [ ] `VITE_SHOPIFY_STORE_DOMAIN` = `your-store.myshopify.com`
- [ ] `VITE_SHOPIFY_STOREFRONT_TOKEN` = `<SHOPIFY_STOREFRONT_ACCESS_TOKEN>`
- [ ] `VITE_SHOPIFY_API_VERSION` = `2026-01`
- [ ] `VITE_SHOPIFY_COUNTRY_CODE` = `TW`
- [ ] `VITE_SHOPIFY_LANGUAGE_CODE` = `zh-TW`

**检查项：**
- [ ] 变量名完全一致（包括大小写）
- [ ] 没有包含引号
- [ ] Production、Preview、Development 都已勾选

### 4.3 部署设置

- [ ] Framework Preset: **Vite**
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`

### 4.4 开始部署

- [ ] 点击 "Deploy" 按钮
- [ ] 等待 2-3 分钟
- [ ] 看到绿色勾选 ✅

---

## ✅ 第五阶段：验证成功

- [ ] Vercel 显示 "Deployment Successful"
- [ ] 获得网站 URL（`https://xxx.vercel.app`）
- [ ] 点击 URL 访问网站
- [ ] 网站正常加载
- [ ] 左下角显示 "✅ CONNECTED"
- [ ] 按 F12 查看 Console，无错误信息
- [ ] 开箱动画正常运行

---

## 🎨 第六阶段：优化（可选）

- [ ] 删除 `<ShopifyConnectionTest />` 组件
- [ ] 提交并推送更新
- [ ] Vercel 自动重新部署
- [ ] 确认测试面板已消失

---

## 🌍 第七阶段：自定义域名（可选）

- [ ] 在 Vercel 添加域名
- [ ] 在域名注册商添加 DNS 记录
- [ ] 等待 DNS 生效（5-60 分钟）
- [ ] 确认 HTTPS 证书已配置
- [ ] 访问自定义域名测试

---

## 📊 最终检查

- [ ] ✅ 网站在线运行
- [ ] ✅ Shopify 连接正常
- [ ] ✅ 所有动画正常
- [ ] ✅ 移动端显示正常
- [ ] ✅ HTTPS 证书有效
- [ ] ✅ 环境变量已保存在 Vercel
- [ ] ✅ `.env` 未提交到 GitHub

---

## 🔄 日常维护流程

### 每次更新代码

- [ ] 修改代码
- [ ] 本地测试 `npm run dev`
- [ ] 提交：`git add .`
- [ ] 提交：`git commit -m "描述"`
- [ ] 推送：`git push`
- [ ] Vercel 自动部署（1-2 分钟）
- [ ] 访问网站确认更新

---

## ❌ 常见错误排查

### 错误 1: Build Failed

- [ ] 检查 Vercel Build Logs
- [ ] 查找具体错误信息
- [ ] 确认本地 `npm run build` 成功
- [ ] 检查是否有语法错误

### 错误 2: Shopify Connection Failed

- [ ] 检查 Vercel 环境变量
- [ ] 确认 Token 正确
- [ ] 确认没有引号或空格
- [ ] 重新部署测试

### 错误 3: 404 Not Found

- [ ] 确认 `vercel.json` 存在
- [ ] 确认 `rewrites` 配置正确
- [ ] 重新部署

### 错误 4: 动画不流畅

- [ ] 检查是否在移动设备上
- [ ] 确认 Motion 包已安装
- [ ] 检查 Console 错误
- [ ] 降低动画复杂度

---

## 📞 获取帮助

如果遇到问题：

1. **查看文档**
   - [DEPLOY_NOW.md](./DEPLOY_NOW.md) - 快速部署
   - [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) - 完整指南

2. **检查日志**
   - Vercel Dashboard → Deployments → 点击部署 → Build Logs
   - 浏览器 Console (F12)

3. **官方文档**
   - Vercel: https://vercel.com/docs
   - Shopify: https://shopify.dev/docs

---

## 🎉 完成！

**全部打勾？恭喜！你的网站现在已经：**

- ✅ 部署在全球 CDN
- ✅ 拥有免费 HTTPS
- ✅ 连接到 Shopify
- ✅ 自动更新机制

**你的网站：** `https://你的项目名.vercel.app`

---

**最后更新：** 2026-02-28
