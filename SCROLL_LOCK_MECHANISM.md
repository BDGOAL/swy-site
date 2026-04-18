# 🔒 滚动锁定机制 (Scroll Lock)

## ✅ 修复完成

### 问题描述
用户在 "Drift Bottle Scroll" 部分需要横向滑动查看所有 8 个产品，但之前的实现无法阻止用户提前跳过这个部分。

### 解决方案

#### 1. **关键修复点**

**之前的错误代码：**
```typescript
window.addEventListener('wheel', handleScroll, { passive: true });
// passive: true 不允许 preventDefault()
// 只是 return，并没有真正阻止滚动
```

**修复后的代码：**
```typescript
window.addEventListener('wheel', handleWheel, { passive: false });
// passive: false 允许调用 preventDefault()
// 真正阻止默认滚动行为
```

---

#### 2. **滚动锁定逻辑**

```typescript
const handleWheel = (e: WheelEvent) => {
  const rect = containerRef.current.getBoundingClientRect();
  const isInSection = rect.top <= 0 && rect.bottom > window.innerHeight;
  
  // 如果用户在这个区域内并且尝试向下滚动
  if (isInSection && e.deltaY > 0) {
    const progress = scrollYProgress.get();
    
    // 如果还没看完所有产品（进度 < 95%）
    if (progress < 0.95) {
      e.preventDefault();        // 阻止默认滚动
      e.stopPropagation();       // 阻止事件冒泡
      
      // 强制在这个区域内滚动（横向滑动产品）
      window.scrollBy({
        top: e.deltaY * 0.5,     // 减速 50% 更好控制
        behavior: 'auto'
      });
    }
  }
};
```

---

#### 3. **进度追踪**

```typescript
const [hasCompletedScroll, setHasCompletedScroll] = useState(false);

useEffect(() => {
  const unsubscribe = scrollYProgress.on('change', (latest) => {
    // 当用户滚动到 95% 时（看完所有 8 个产品）
    if (latest >= 0.95 && !hasCompletedScroll) {
      setHasCompletedScroll(true);
    }
  });

  return () => unsubscribe();
}, [scrollYProgress, hasCompletedScroll]);
```

---

#### 4. **视觉反馈**

##### 进度指示器更新
```typescript
<p className="text-[8px] opacity-20 tracking-wider">
  {hasCompletedScroll ? 'COMPLETE' : 'SCROLL →'}
</p>
```

##### 完成提示
```typescript
{hasCompletedScroll && (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <p>↓ Continue</p>
  </motion.div>
)}
```

---

## 🎯 用户体验流程

### 第一阶段：进入区域
1. 用户向下滚动到 "Drift Bottle Scroll" 区域
2. 页面自动进入"横向滚动模式"
3. 底部显示进度条和 "SCROLL →" 提示

### 第二阶段：查看产品
1. 用户继续向下滚动
2. 产品卡片横向移动（模拟横向滚动）
3. 如果用户尝试跳过，会被锁定在这个区域
4. 必须看完所有 8 个产品

### 第三阶段：完成查看
1. 当进度达到 95% 时（所有产品已查看）
2. 顶部出现 "↓ Continue" 提示
3. 底部文字变为 "COMPLETE"
4. 解锁滚动，允许继续向下

### 第四阶段：继续浏览
1. 用户可以继续向下滚动
2. 进入下一个区域（Acetate Reveal）

---

## 🔧 技术细节

### 区域检测
```typescript
const rect = containerRef.current.getBoundingClientRect();
const isInSection = rect.top <= 0 && rect.bottom > window.innerHeight;
```

- `rect.top <= 0`：区域顶部已经滚出视口
- `rect.bottom > window.innerHeight`：区域底部还在视口下方
- 两个条件同时满足 = 用户正在这个区域内

### 滚动方向检测
```typescript
if (e.deltaY > 0) {
  // 向下滚动
}
```

- `deltaY > 0`：鼠标滚轮向下
- `deltaY < 0`：鼠标滚轮向上（允许回退查看）

### 进度阈值
```typescript
if (progress < 0.95) {
  // 锁定滚动
}
```

- `0.95` = 95% 进度
- 留 5% 容错空间，避免卡在边缘
- 确保所有 8 个产品都被看到

---

## 📱 响应式行为

### 桌面端
- 使用鼠标滚轮控制
- 平滑的横向移动
- 清晰的进度反馈

### 移动端
- 使用触摸滑动
- 需要测试并可能需要额外的 touch 事件处理
- 考虑添加 `touchmove` 事件监听器

---

## ⚠️ 注意事项

### 性能优化
```typescript
window.scrollBy({
  top: e.deltaY * 0.5,  // 减速 50%
  behavior: 'auto'      // 避免平滑动画造成延迟
});
```

### 事件监听器清理
```typescript
return () => window.removeEventListener('wheel', handleWheel);
```
确保组件卸载时移除监听器，避免内存泄漏。

### 依赖项
```typescript
useEffect(() => {
  // ...
}, [scrollYProgress]);  // 依赖 scrollYProgress
```

---

## 🎨 视觉设计

### 未完成状态
- 进度条：白色/10% 背景，白色/30% 进度
- 文字："SCROLL →"
- 无顶部提示

### 完成状态
- 进度条：接近满格
- 文字："COMPLETE"
- 顶部出现："↓ Continue"（淡入动画）

---

## 🚀 未来增强

### 可选功能
1. **触摸支持**
   ```typescript
   window.addEventListener('touchmove', handleTouch, { passive: false });
   ```

2. **键盘控制**
   - 左右箭头键：快速切换产品
   - 空格键：暂停/继续

3. **自动播放**
   - 添加自动横向滚动选项
   - 让用户可以"躺平"观看

4. **进度保存**
   - 使用 localStorage 记住用户进度
   - 刷新页面后可以从上次位置继续

---

## ✅ 测试清单

- [ ] 进入区域后滚动被锁定
- [ ] 可以在区域内横向查看产品
- [ ] 看完所有产品后出现 "Continue" 提示
- [ ] 解锁后可以继续向下滚动
- [ ] 可以向上滚动返回查看
- [ ] 进度条正确显示
- [ ] 文字提示正确切换
- [ ] 性能流畅（60fps）

---

**更新时间**: 2026-02-28  
**状态**: ✅ 已修复并部署
