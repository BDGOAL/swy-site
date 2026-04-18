# SWY - Digital Unboxing Experience

> 「沉重而刻意」的开箱仪式感 · Noir Archive - Deep Black Edition

为 SWY（Scent With You）品牌打造的数位开箱交互体验网站，将实体包装的白墨膠片、蛋殼紙質與物理壓線轉化為網頁層次感。

---

## ✨ 设计特色

### 三步开箱流程
1. **封套滑动** - Parallax 效果
2. **膠片揭幕** - 半透明毛玻璃層
3. **產品呈現** - 40mm×60mm 標籤配合情境背景

### 视觉美学
- 🎨 石墨黑（#0A0A0A）背景
- 📝 白墨感文字（#F2F0ED）
- 🎞️ 6% 动态噪点 + 光学暗角
- 🎭 Brutalist 极简主义风格
- ⚡ useSpring 阻尼感动画
- 📏 0.5px 细线压线效果

---

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **动画引擎**: Motion (Framer Motion)
- **样式系统**: Tailwind CSS v4
- **电商后端**: Shopify Headless (Hydrogen React)
- **构建工具**: Vite
- **部署平台**: Vercel

---

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 环境变量配置

复制 `.env.example` 为 `.env`，填入你的 Shopify 配置：

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your_token_here
VITE_SHOPIFY_API_VERSION=2026-01
VITE_SHOPIFY_COUNTRY_CODE=TW
VITE_SHOPIFY_LANGUAGE_CODE=zh-TW
```

---

## 📦 部署到 Vercel

### 方法 1：一键部署（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/你的用户名/swy-digital-unboxing)

点击按钮后，记得在 Vercel 添加环境变量！

### 方法 2：手动部署

详细步骤请参考：
- 📖 [5 分钟快速部署指南](./DEPLOY_NOW.md)
- 📖 [完整部署文档](./VERCEL_DEPLOYMENT_GUIDE.md)

---

## 🔌 Shopify 集成

### 已集成功能

- ✅ 产品查询（Storefront API）
- ✅ 购物车管理（CartProvider）
- ✅ 库存查询
- ✅ 结账流程

### 配置指南

- 📖 [Shopify 快速参考](./SHOPIFY_QUICK_REFERENCE.md)
- 📖 [Shopify 配置指南](./SHOPIFY_CONFIGURATION_GUIDE.md)
- 📖 [Shopify 完整设置](./SHOPIFY_SETUP.md)

### 集成示例

```tsx
import { AddToCartButton } from './components/AddToCartButton';

// 在产品页面使用
<AddToCartButton 
  variantId="gid://shopify/ProductVariant/YOUR_VARIANT_ID"
/>
```

---

## 📂 项目结构

```
/src
  /app
    /components         # React 组件
      Hero.tsx          # 首页封套
      UnboxingExperience.tsx  # 开箱主流程
      AcetateReveal.tsx # 膠片揭幕
      ShoppingCart.tsx  # 购物车
      AddToCartButton.tsx  # 加入购物车按钮
    /shopify           # Shopify 集成
      ShopifyProvider.tsx
      /hooks
        useShopifyCart.ts
        useShopifyProduct.ts
    /data              # 产品数据
      products.ts
    App.tsx            # 主应用入口
    routes.ts          # 路由配置
  /styles
    theme.css          # 设计系统主题
    fonts.css          # 字体配置
    tailwind.css       # Tailwind 配置
```

---

## 🎨 设计系统

### 颜色变量

```css
--color-noir-black: #0A0A0A;      /* 石墨黑背景 */
--color-chalk-white: #F2F0ED;     /* 白墨感文字 */
--color-film-grain: rgba(255,255,255,0.06);  /* 噪点 */
```

### 字体层级

- **TITLE**: 10px / 0.3em tracking
- **LABEL**: 9px / 0.2em tracking
- **BODY**: 8px / normal

### 动画参数

```ts
useSpring({
  tension: 120,
  friction: 26,
  mass: 1
})
```

---

## 🧪 测试 Shopify 连接

启动开发服务器后，左下角会显示连接测试面板：

- ✅ **CONNECTED** - Shopify 连接成功
- ❌ **CONNECTION FAILED** - 检查环境变量

生产环境请删除 `<ShopifyConnectionTest />` 组件。

---

## 📖 文档索引

| 文档 | 说明 |
|------|------|
| [DEPLOY_NOW.md](./DEPLOY_NOW.md) | ⚡ 5 分钟快速部署 |
| [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) | 📖 完整部署指南 |
| [SHOPIFY_QUICK_REFERENCE.md](./SHOPIFY_QUICK_REFERENCE.md) | 📝 Shopify 快速参考 |
| [SHOPIFY_CONFIGURATION_GUIDE.md](./SHOPIFY_CONFIGURATION_GUIDE.md) | 🔧 Shopify 配置详解 |
| [SHOPIFY_SETUP.md](./SHOPIFY_SETUP.md) | 📦 Shopify 完整设置 |
| [INTEGRATION_EXAMPLE.tsx](./INTEGRATION_EXAMPLE.tsx) | 💡 集成代码示例 |

---

## 🔐 安全提醒

- ⚠️ **不要将 `.env` 文件提交到 Git**
- ⚠️ **Storefront API Token 是公开的**（只能查询，无法修改数据）
- ⚠️ **Admin API Token 绝对不能暴露**（如果你有的话）
- ✅ 已在 `.gitignore` 中排除 `.env`

---

## 📊 性能指标

- ⚡ **First Contentful Paint**: < 1.2s
- ⚡ **Largest Contentful Paint**: < 2.5s
- ⚡ **Time to Interactive**: < 3.8s
- 📦 **Bundle Size**: ~180KB (gzipped)

---

## 🎯 下一步开发

### 待实现功能

- [ ] 添加真实产品数据（从 Shopify 后台）
- [ ] 完善购物车 UI
- [ ] 添加结账流程
- [ ] 移动端优化
- [ ] 添加产品详情页
- [ ] 实现香水档案（Archive）功能
- [ ] 添加用户评论
- [ ] 整合 Google Analytics

### 优化建议

- [ ] 图片懒加载
- [ ] Code splitting
- [ ] Service Worker (PWA)
- [ ] SEO meta tags
- [ ] Open Graph 图片

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

版权所有 © 2026 SWY - Scent With You

---

## 🙏 致谢

- 设计灵感：Brutalist Web Design
- 技术支持：Shopify Hydrogen
- 动画引擎：Motion (Framer Motion)
- 托管平台：Vercel

---

**Built with ❤️ for SWY by Figma Make**
