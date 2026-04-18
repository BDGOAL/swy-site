import type { Bilingual } from "../lib/i18n";

/** Site-wide bilingual strings. Add pages here as the site grows. */
export const siteCopy = {
  brand: {
    /** Logo wordmark — same in both locales */
    logoAlt: { en: "SWY", zh: "SWY" } satisfies Bilingual,
    shortName: { en: "SWY", zh: "SWY" } satisfies Bilingual,
  },
  nav: {
    primaryAria: { en: "Primary navigation", zh: "主要導覽" } satisfies Bilingual,
    utilitiesAria: { en: "Site utilities", zh: "網站工具" } satisfies Bilingual,
    menuToggle: { en: "Open menu", zh: "打開選單" } satisfies Bilingual,
    menuClose: { en: "Close menu", zh: "關閉選單" } satisfies Bilingual,
    /** Mobile drawer title (uppercase styling at call site). */
    menuDrawerTitle: { en: "Menu", zh: "選單" } satisfies Bilingual,
    cart: { en: "Cart", zh: "購物車" } satisfies Bilingual,
    shop: { en: "Shop", zh: "選香" } satisfies Bilingual,
    collection: { en: "Collection", zh: "選集" } satisfies Bilingual,
    story: { en: "Story", zh: "故事" } satisfies Bilingual,
    about: { en: "About", zh: "關於" } satisfies Bilingual,
    contact: { en: "Contact", zh: "聯絡" } satisfies Bilingual,
  },
  search: {
    placeholder: {
      en: "Search a scent, mood, or story",
      zh: "搜尋香氣、情緒或故事片段",
    } satisfies Bilingual,
    ariaOpen: { en: "Search scents", zh: "搜尋香氣" } satisfies Bilingual,
    ariaClose: { en: "Close search", zh: "關閉搜尋" } satisfies Bilingual,
    hintEmpty: {
      en: "Type a name, mood, or story fragment — results update as you type.",
      zh: "輸入名稱、情緒或故事關鍵字 — 結果會隨打字更新。",
    } satisfies Bilingual,
    noMatch: {
      en: "No scents match that search. Try another name, mood, or note — or explore these three stories.",
      zh: "沒有符合的香氣。換個名稱、情緒或香調試試 — 或從以下三支故事開始。",
    } satisfies Bilingual,
    suggested: { en: "Suggested", zh: "推薦" } satisfies Bilingual,
    viewStory: { en: "View Story", zh: "閱讀故事" } satisfies Bilingual,
  },
  landing: {
    hero: {
      statementLine1: {
        en: "Form, before it is spoken.",
        zh: "形，在語言之前。",
      } satisfies Bilingual,
      statementLine2: {
        en: "Memory, before it is named.",
        zh: "記憶，在命名之前。",
      } satisfies Bilingual,
      supporting: {
        en: "It is felt before it is explained.",
        zh: "與其用言語說明，不如先感受。",
      } satisfies Bilingual,
      scrollCue: { en: "Scroll", zh: "向下閱讀" } satisfies Bilingual,
      cta: {
        primary: { en: "Explore all scents", zh: "探索所有香氣" } satisfies Bilingual,
        secondary: { en: "Continue the story", zh: "延續每段故事" } satisfies Bilingual,
      },
    },
    collectionPreview: {
      eyebrow: { en: "Selected scents", zh: "精選香氣" } satisfies Bilingual,
      title: {
        en: "A quiet beginning to the archive.",
        zh: "一切，從安靜開始。",
      } satisfies Bilingual,
      body: {
        en: "A first encounter with the scents that shape the collection.",
        zh: "從幾支香氣開始，認識它的輪廓。",
      } satisfies Bilingual,
      syncing: { en: "Syncing collection…", zh: "同步選香中…" } satisfies Bilingual,
      viewStory: { en: "View Story", zh: "閱讀故事" } satisfies Bilingual,
    },
    brandDna: {
      eyebrow: { en: "Brand DNA", zh: "品牌之所以成立" } satisfies Bilingual,
      title: { en: "Scent, as memory held near.", zh: "香氣，是記憶最安靜的形狀。" } satisfies Bilingual,
      body: {
        en: "SWY is not built around notes alone, but around the moments that stay with us. Each fragrance is composed as a trace — of atmosphere, feeling, and the quiet ways we remember who we are.",
        zh: "SWY 不僅關於香氣，也關於那些留下來的時刻。每一支香氣，都是一道痕跡——氣氛、感受，與我們記得自己的方式。",
      } satisfies Bilingual,
      principles: [
        { en: "Memory", zh: "記憶" },
        { en: "Atmosphere", zh: "氣氛" },
        { en: "Intimacy", zh: "親密" },
      ] as const,
      linkCollection: { en: "Enter the collection", zh: "進入選香" } satisfies Bilingual,
      figcaption: {
        en: "Still: paper, dust, late light.",
        zh: "靜物：紙頁、微塵、將晚的光。",
      } satisfies Bilingual,
    },
    brandVision: {
      eyebrowLine1: { en: "A world", zh: "一個世界" } satisfies Bilingual,
      eyebrowLine2: { en: "in fragments", zh: "由碎片拼成" } satisfies Bilingual,
      titleLine1: { en: "Some stories", zh: "有些故事，有些記憶" } satisfies Bilingual,
      titleLine2: { en: "unfold in parts.", zh: "總是一點一點地浮現。" } satisfies Bilingual,
      body1: {
        en: "Not every feeling announces itself.",
        zh: "不是每一種感受，都會先聲奪人。",
      } satisfies Bilingual,
      body2: {
        en: "Some return slowly — in a room at dusk, in the texture of paper, in the stillness after someone has gone.",
        zh: "有些感受總是慢慢回來——在黃昏的房間裡、在紙張的觸感裡、在某人離去後留下的靜裡。",
      } satisfies Bilingual,
      body3: {
        en: "SWY gathers these fragments and lets them remain, close to skin.",
        zh: "SWY 把這些細碎感受留下，靠近你，也靠近記憶。",
      } satisfies Bilingual,
      italic: {
        en: "A scent can arrive like a memory — partial, vivid, and suddenly yours.",
        zh: "香氣有時像記憶一樣到來——不完整，卻鮮明，忽然就成了你的。",
      } satisfies Bilingual,
    },
    acetate: {
      label: { en: "Material", zh: "材質" } satisfies Bilingual,
      captionLine1: { en: "Form, before language.", zh: "形，在語言之前。" } satisfies Bilingual,
      captionLine2: { en: "Memory, before name.", zh: "記憶，在命名之前。" } satisfies Bilingual,
    },
    conversion: {
      eyebrow: { en: "Invitation", zh: "邀請" } satisfies Bilingual,
      titleLine1: { en: "When the story feels familiar,", zh: "當這段故事變得熟悉時，" } satisfies Bilingual,
      titleLine2: { en: "follow it.", zh: "就跟著它走。" } satisfies Bilingual,
      supporting: {
        en: "Return to the collection, or follow the thread a little further.",
        zh: "回到選集，或沿著這條線索，再往前一點。",
      } satisfies Bilingual,
      ctaPrimary: { en: "Explore all scents", zh: "探索所有香氣" } satisfies Bilingual,
      /** Temporary: scrolls to on-page narrative; replace when a dedicated story route exists. */
      ctaSecondary: { en: "Continue the story", zh: "延續這段故事" } satisfies Bilingual,
    },
    footer: {
      microcopy: { en: "Fragrance, told in fragments.", zh: "香氣，在片段之中成形。" } satisfies Bilingual,
      copyrightPrefix: { en: "©", zh: "©" } satisfies Bilingual,
    },
  },
  collectionPage: {
    introEyebrow: { en: "Collection", zh: "選集" } satisfies Bilingual,
    introTitle: { en: "A quiet archive of scents.", zh: "香氣，在這裡安靜展開。" } satisfies Bilingual,
    introBody: {
      en: "Browse by atmosphere, mood, and the forms each scent leaves behind.",
      zh: "從氣氛、情緒與每支香氣的輪廓開始。",
    } satisfies Bilingual,
    filterAll: { en: "All", zh: "全部" } satisfies Bilingual,
    filterLabel: { en: "Mood", zh: "氛圍" } satisfies Bilingual,
    filterLight: { en: "Bright", zh: "清朗" } satisfies Bilingual,
    filterDark: { en: "Nocturne", zh: "夜調" } satisfies Bilingual,
    browseCue: {
      en: "Find the scent that stays.",
      zh: "找出那支會留下來的香氣。",
    } satisfies Bilingual,
    viewPiece: { en: "View", zh: "閱覽" } satisfies Bilingual,
    currencyNote: {
      en: "Product selection and pricing may vary.",
      zh: "產品選擇與價格或會有所不同。",
    } satisfies Bilingual,
    card: {
      familyLabel: { en: "Family", zh: "香調家族" } satisfies Bilingual,
      priceLabel: { en: "Price", zh: "售價" } satisfies Bilingual,
    },
  },
  product: {
    notFound: { en: "Product not found", zh: "找不到此香氣" } satisfies Bilingual,
    scentNarrativeEyebrow: { en: "Scent story", zh: "香氣故事" } satisfies Bilingual,
    productType: { en: "Eau de Parfum", zh: "淡香精" } satisfies Bilingual,
    variantSoldOut: { en: "(Sold out)", zh: "（售罄）" } satisfies Bilingual,
    defaultVariant: { en: "Default", zh: "標準" } satisfies Bilingual,
    fragranceProfile: { en: "Fragrance Profile", zh: "香氣輪廓" } satisfies Bilingual,
    scentCharacter: { en: "In the air", zh: "氣息之間" } satisfies Bilingual,
    accords: { en: "Accords", zh: "氣味結構" } satisfies Bilingual,
    narrative: { en: "The Narrative", zh: "敘事" } satisfies Bilingual,
    impression: { en: "Impression", zh: "氣息印象" } satisfies Bilingual,
    wearContext: { en: "Wear moment", zh: "適合時刻" } satisfies Bilingual,
    presence: { en: "Presence", zh: "存在感" } satisfies Bilingual,
    endurance: { en: "Endurance", zh: "留香感" } satisfies Bilingual,
    visualStorytelling: { en: "Visual Storytelling", zh: "視覺敘事" } satisfies Bilingual,
    continueScentStory: { en: "Related scents", zh: "相關香氣" } satisfies Bilingual,
    discoverStory: { en: "Discover Story", zh: "發現故事" } satisfies Bilingual,
    textureAlt: { en: "Texture visual", zh: "質感影像" } satisfies Bilingual,
    demoMode: {
      en: "Shopify not configured — demo checkout mode.",
      zh: "尚未連結 Shopify — 目前為展示模式。",
    } satisfies Bilingual,
    syncingShopify: { en: "Syncing Shopify product…", zh: "同步商品資料中…" } satisfies Bilingual,
    loading: { en: "Loading…", zh: "載入中…" } satisfies Bilingual,
    storyEyebrow: { en: "Story", zh: "故事" } satisfies Bilingual,
    detailsEyebrow: { en: "Details", zh: "細節" } satisfies Bilingual,
    selectVariant: { en: "Edition", zh: "版本" } satisfies Bilingual,
    volumeLabel: { en: "Capacity", zh: "容量" } satisfies Bilingual,
    capacityValue: { en: "30ml", zh: "30毫升" } satisfies Bilingual,
    quantityLabel: { en: "Quantity", zh: "數量" } satisfies Bilingual,
    addToCart: { en: "Add to cart", zh: "加入購物車" } satisfies Bilingual,
    adding: { en: "Adding…", zh: "加入中…" } satisfies Bilingual,
    soldOut: { en: "Sold Out", zh: "已售罄" } satisfies Bilingual,
    configureNote: {
      en: "Connect Shopify to enable checkout for this scent.",
      zh: "連結 Shopify 後即可為此香氣結帳。",
    } satisfies Bilingual,
    notAvailable: { en: "This product is not yet available for purchase.", zh: "此香氣尚未開放購買。" } satisfies Bilingual,
    cartError: { en: "Failed to add to cart. Please try again.", zh: "無法加入購物車，請再試一次。" } satisfies Bilingual,
    wearWhen: { en: "Wear moment", zh: "適合時刻" } satisfies Bilingual,
    longevity: { en: "Longevity", zh: "持久度" } satisfies Bilingual,
    sillage: { en: "Sillage", zh: "擴散" } satisfies Bilingual,
    pairing: { en: "Pairing Suggestion", zh: "搭配建議" } satisfies Bilingual,
    notesTop: { en: "Top notes", zh: "前調" } satisfies Bilingual,
    notesHeart: { en: "Heart notes", zh: "中調" } satisfies Bilingual,
    notesBase: { en: "Base notes", zh: "後調" } satisfies Bilingual,
    scentFamily: { en: "Scent family", zh: "香調家族" } satisfies Bilingual,
    moodKeywords: { en: "Mood", zh: "氣味情緒" } satisfies Bilingual,
    textureEyebrow: { en: "Texture", zh: "質感" } satisfies Bilingual,
    relatedEyebrow: { en: "Related Scents", zh: "相關香氣" } satisfies Bilingual,
    relatedCard: { en: "Related Scent", zh: "相關香氣" } satisfies Bilingual,
    explore: { en: "Explore", zh: "探索" } satisfies Bilingual,
    floatingCart: { en: "Cart", zh: "購物車" } satisfies Bilingual,
    cartDrawerClose: { en: "Close", zh: "關閉" } satisfies Bilingual,
    fallback: {
      description: { en: "Description coming soon.", zh: "更多內容即將補上。" } satisfies Bilingual,
      imageAlt: { en: "Product image", zh: "產品圖片" } satisfies Bilingual,
    },
  },
  language: {
    groupLabel: { en: "Language", zh: "語言" } satisfies Bilingual,
    english: { en: "English", zh: "English" } satisfies Bilingual,
    chinese: { en: "中文", zh: "中文" } satisfies Bilingual,
  },
} as const;

export type SiteCopy = typeof siteCopy;
