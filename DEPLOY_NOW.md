# ⚡ 5 分钟快速部署指南

## 🎯 目标
将你的「SWY 数位开箱体验」网站部署到 Vercel（免费 + 全球 CDN）

---

## 📋 第一步：准备 GitHub（2 分钟）

### 方法 A：使用 GitHub Desktop（推荐新手）

1. 下载 GitHub Desktop：https://desktop.github.com
2. 打开 GitHub Desktop
3. 点击 **File** → **Add Local Repository**
4. 选择你的项目文件夹
5. 点击 **Publish repository**
6. ✅ **设置为 Private**
7. 点击 **Publish**

### 方法 B：使用命令行

```bash
# 在项目文件夹中执行
git init
git add .
git commit -m "SWY Digital Unboxing - Initial Commit"

# 在 GitHub 创建新仓库后执行（替换为你的仓库 URL）
git remote add origin https://github.com/你的用户名/swy-digital-unboxing.git
git push -u origin main
```

---

## 🚀 第二步：部署到 Vercel（3 分钟）

### 2.1 连接 GitHub

1. 访问 https://vercel.com（使用 GitHub 登录）
2. 点击 **"Add New..."** → **"Project"**
3. 选择你的仓库 `swy-digital-unboxing`
4. 点击 **"Import"**

### 2.2 配置环境变量（重要！）

在 **"Environment Variables"** 区域，逐个添加以下 5 个变量：

```
变量名: VITE_SHOPIFY_STORE_DOMAIN
值: your-store.myshopify.com
```

```
变量名: VITE_SHOPIFY_STOREFRONT_TOKEN
值: <SHOPIFY_STOREFRONT_ACCESS_TOKEN>
```

```
变量名: VITE_SHOPIFY_API_VERSION
值: 2026-01
```

```
变量名: VITE_SHOPIFY_COUNTRY_CODE
值: TW
```

```
变量名: VITE_SHOPIFY_LANGUAGE_CODE
值: zh-TW
```

**⚠️ 注意事项：**
- 变量名必须**完全一致**（包括大小写）
- 不要包含引号
- 添加后确保 **"Production"**、**"Preview"**、**"Development"** 都勾选

### 2.3 部署！

点击 **"Deploy"** 按钮，等待 2-3 分钟 ☕

---

## ✅ 第三步：验证成功

### 看到这些就成功了：

1. ✅ **Vercel 显示绿色勾选**
2. 🔗 **你的网站 URL**（例如：`https://swy-digital-unboxing.vercel.app`）
3. 左下角显示 **"✅ CONNECTED"**

### 如果连接失败：

1. 检查 Vercel 环境变量是否正确
2. 进入 **Settings** → **Environment Variables**
3. 确认 5 个变量都存在
4. 点击 **Deployments** → 最新部署 → **"Redeploy"**

---

## 🎨 移除测试面板（可选）

部署成功后，你可以移除左下角的测试面板：

1. 打开 `/src/app/App.tsx`
2. 删除这一行：
```tsx
<ShopifyConnectionTest />
```
3. 保存并推送到 GitHub：
```bash
git add .
git commit -m "Remove test panel"
git push
```

Vercel 会自动重新部署！

---

## 🌍 下一步：绑定自己的域名（可选）

### 如果你有域名（例如 www.swy.com.tw）：

1. Vercel → **Settings** → **Domains**
2. 输入你的域名，点击 **"Add"**
3. 按照提示在域名注册商添加 DNS 记录
4. 等待 5-60 分钟，Vercel 会自动配置 HTTPS

---

## 📊 完成！

**你的网站现在：**
- ✅ 在全球 CDN 上运行（超快）
- ✅ 拥有免费 HTTPS 证书
- ✅ 连接到 Shopify 后端
- ✅ 每次 Git push 自动更新

**你的网站地址：**
```
https://你的项目名.vercel.app
```

---

## 🔄 日常更新流程

每次修改代码后：

```bash
git add .
git commit -m "描述你的修改"
git push
```

Vercel 会在 1-2 分钟内自动更新你的网站！🎉

---

## 🆘 遇到问题？

### 常见错误及解决方案：

**错误 1: "Build failed"**
- 解决：检查代码是否有语法错误
- 查看 Vercel 的 **Build Logs** 查找具体错误

**错误 2: "Shopify Connection Failed"**
- 解决：检查环境变量是否正确设置
- 确认 Token 没有包含引号或空格

**错误 3: "404 Not Found"**
- 解决：确保 `vercel.json` 文件存在
- 重新部署（Deployments → Redeploy）

---

## 📞 技术支持

- Vercel 官方文档：https://vercel.com/docs
- Shopify Headless 文档：https://shopify.dev/docs/storefronts/headless
- GitHub 新手指南：https://docs.github.com/get-started

---

**🎊 恭喜！你的网站现在已经上线了！**
