目前的代碼雖然有了基本的層次，但缺乏 物理實體感（Physicality）和 光學瑕疵（Optical Imperfections），這正是你參考圖中那種「高級感」的來源。

根據你提供的最終定稿文案  與參考圖的視覺風格（高對比、網格系統、大膽排版），以下是針對 Figma / Shopify Landing Page 的全盤設定指南。

1. 視覺語調與材質設定 (Surface & Material)
要做到「漂流瓶」與「復古膠片」感，不能只靠顏色，要靠 "Digital Grain" (數位顆粒)：


底色層 (The Paper)：使用 #F2F0ED ，但必須疊加一層透明度 3% 的 動態噪點 (Animated Noise)。這會讓頁面看起來像是在顯影液中的底紙，而不是死板的網頁背景。

膠片層 (The Acetate)：

質感： 使用 backdrop-filter: blur(15px) brightness(1.1) 模擬半透明磨砂膠片。

光學特效： 加入輕微的 色散 (Chromatic Aberration)，讓文字邊緣在滾動時產生紅綠色的極微小溢出，模擬舊相機鏡頭感。


標籤實體感：產品標籤嚴格遵循 40mm x 60mm 比例 。


細節： 標籤邊緣不要純平，給予 1px 的細微圓角  與極輕的 inner-shadow，模擬紙張纖維被壓印在玻璃瓶上的厚度。

2. 剩餘頁面結構設定 (The Modular Layout)
Figma 目前只做了 Hero，你需要引導它完成剩餘的「檔案式」排版：

Section 1: The Archive Grid (典藏目錄)
參考你提供的 noir. 圖片，使用 0.5px 網格系統：

佈局： 非對稱的三欄或四欄設計，每一格代表一支香水。


視覺： 預覽圖使用高對比黑白插畫（如烏鴉 、玫瑰 、齒輪 ）。

交互： 滑鼠懸停（Hover）時，該格產生「顯影」效果——從黑白插畫淡入為帶有藍調或暖色調的情境攝影圖（Photo Card）。

Section 2: The Drift Bottle Scroll (漂流瓶故事橫移)
這部分是強化「漂流瓶」感的關鍵：

特效： 使用 水平滾動 (Horizontal Scroll)。


物理動態： 瓶身在畫面中央緩慢旋轉，背景的故事文案（如 The Last Snow ）隨著滾動像在水面上漂浮一樣產生微小的位移差（Parallax）。

漂浮感指令： Apply a slow Sine-wave animation (y-axis +/- 15px) to all floating elements.

Section 3: Product Story Detail (章節詳情)
參考 History of Art 圖片：


排版： 左側是大面積留白與極大的襯線體標題（如 "THE LAST SNOW" ），右側是高對比的情境圖。


細節： 將 Note Pyramid (Top/Heart/Base)  處理成像是檔案室的「標本標籤」，字體極小（9px - 11px），帶有手寫編號。

3. 給 Figma 的完整 Vibe Coding 指令 (針對 8 支香水)
你可以將此段文字直接餵給設計工具或開發：

Project Concept: "Digital Archive of Scented Memories."
Layout Reference: "Noir typography meets Art Exhibition minimalism."
Global Styles:

Lines: 0.5px Stroke, Opacity 10% - 20%. Mimic "Die-cut lines" from packaging docs.

Motion: Spring-based damping (Stiffness: 80, Damping: 25). Objects should feel like they are floating in high-viscosity liquid (Oil/Water).
- Step-by-Step Transition: >   1. Unseal: Slide up the #F2F0ED sleeve.
2. Expose: Acetate film fades in with white-ink text.
3. Develop: The background photo card sharpens from blur (8px to 0px).
Key Sections to Generate:

Hero: The Drift Bottle metaphor.
- The Collection: 8-grid archive using B&W illustrations.
- Individual Story: Cinematic split-screen with "Acetate" text overlays for taglines like "When innocence blushes...".

4. 針對「漂流瓶」特效的技術微調建議
目前的兩層重疊不夠「厚」，請要求設計工具在兩層之間加入 「折射層 (Refraction Layer)」：

當用戶捲動時，背景的文字在經過瓶身位置時產生扭曲（Distortion）。

這能瞬間解決「數位感太強」的問題，讓網站看起來像是在透過真實玻璃觀看。