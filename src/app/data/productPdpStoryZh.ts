/**
 * Chinese PDP copy for `story_intro` and `story_body` when set here.
 * Takes precedence over Shopify metafields so repo copy can ship without Admin edits.
 */

export const PDP_STORY_INTRO_ZH: Record<string, string> = {
  "night-was-mine": `華燈初上。窗外中環的交界依舊人來人往。霓虹拉扯出失焦的光線，每個人都在急於將自己推銷給這座城市。

房間裡沒有開燈。他只靜靜坐在那一方深色皮椅裡，陷進黑暗。

乾燥的煙草味與帶點焦糖感的蘭姆酒香輕盈交錯。那不是夜店裡喧鬧的酒氣，而是一場只屬於自己的午夜對話。溫暖、迷人，卻始終保有某種冰冷的克制。`,
};

export const PDP_STORY_BODY_ZH: Record<string, string> = {
  "night-was-mine": `手指輕觸水晶杯沿。過往的點滴隔著這層酒香望過去，都像隔著毛玻璃，失了真，也退了火。

「樹大總招風，知者自守沈默。」這是他用代價學回來的字句。

他點燃了這陣氣味。黑胡椒與欖美脂率先切開一道銳利的辛香輪廓；隨後，琥珀與向日葵將蘭姆酒推向溫暖的核心，那是看透遊戲規則後才長出來的溫度。最後，香根草與煙草把夜色收得極深、極穩。

當你不再試圖向世界證明什麼，你才真正擁有了自己。
舉手投足間那種不敢直視的從容，是歲月無聲錘鍊下來的底氣。

窗外的繁華依舊，但已經與他無關。
這夜，不屬於外面的喧囂。

這夜，屬於我。`,
};

export function productPdpStoryIntroZh(productId: string): string {
  return PDP_STORY_INTRO_ZH[productId]?.trim() ?? "";
}

export function productPdpStoryBodyZh(productId: string): string {
  return PDP_STORY_BODY_ZH[productId]?.trim() ?? "";
}
