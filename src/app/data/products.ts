import type { Bilingual } from "../lib/i18n";

/** Bilingual note lists for structured accords (top / heart / base). */
export type BilingualNoteLayer = {
  top?: { en: string[]; zh: string[] };
  heart?: { en: string[]; zh: string[] };
  base?: { en: string[]; zh: string[] };
};

export type MoodTags = { en: string[]; zh: string[] };

export interface Product {
  id: string;
  slug: string;
  /** English-only display name (all locales). */
  name: string;
  descriptor: Bilingual;
  shortStory: Bilingual;
  longStory?: Bilingual;
  scentFamily: Bilingual;
  moodTags: MoodTags;
  accords?: { en: string[]; zh: string[] };
  notes?: BilingualNoteLayer;
  impression?: Bilingual;
  wearMoment?: Bilingual;
  intensity?: Bilingual;
  lasting?: Bilingual;
  /** Local EN/ZH pairing line when Shopify `pairing_note` is missing or unusable for the active locale. */
  pairingSuggestion?: Bilingual;
  price?: number;
  currency?: string;
  shopifyHandle?: string;
  shopifyVariantId?: string;
  featuredImage?: string;
  gallery?: string[];
  relatedSlugs?: string[];
  featured?: boolean;
  illustration: "crow" | "rose" | "library" | "cigar";
  mood: "light" | "dark";
  backgroundColor: string;
  sleeveColor: string;
}

/** Split legacy mixed note rows into per-locale lists. */
export function partitionLegacyNoteList(items: string[]): { en: string[]; zh: string[] } {
  const zh: string[] = [];
  const en: string[] = [];
  for (const raw of items) {
    const s = raw.trim();
    if (!s) continue;
    const hasCjk = /[\u4e00-\u9fff]/.test(s);
    const hasLat = /[a-zA-Z]/.test(s);
    if (hasCjk && !hasLat) zh.push(s);
    else if (hasLat && !hasCjk) en.push(s);
    else {
      s.split(/[,，、]/).forEach((chunk) => {
        const c = chunk.trim();
        if (!c) return;
        if (/[\u4e00-\u9fff]/.test(c) && !/[a-zA-Z]{2,}/.test(c)) zh.push(c);
        else if (/[a-zA-Z]/.test(c)) en.push(c);
      });
    }
  }
  return { en, zh };
}

function nl(top: string[], mid: string[], base: string[]): BilingualNoteLayer {
  return {
    top: partitionLegacyNoteList(top),
    heart: partitionLegacyNoteList(mid),
    base: partitionLegacyNoteList(base),
  };
}

function accFromNotes(top: string[], mid: string[], max = 5): { en: string[]; zh: string[] } {
  const t = partitionLegacyNoteList(top);
  const m = partitionLegacyNoteList(mid);
  return {
    en: [...t.en, ...m.en].filter((v, i, a) => a.indexOf(v) === i).slice(0, max),
    zh: [...t.zh, ...m.zh].filter((v, i, a) => a.indexOf(v) === i).slice(0, max),
  };
}

export const products: Product[] = [
  {
    id: "the-last-snow",
    slug: "the-last-snow",
    name: "The Last Snow",
    descriptor: {
      en: "In this sweet surrender, her soul came alive again.",
      zh: "有些離開，正是下一段綻放的序章。",
    },
    shortStory: {
      en: "Snowlight on a quiet city — a soft ending that lets something new begin.",
      zh: "半載冬季的城，雪落得很輕，像替那年畢業收束一句溫柔的句號。",
    },
    longStory: {
      en: "The last snow fell as I graduated, in a city where winter lasted half the year. The air was sharp, the sky pale, the streets washed quiet in white.",
      zh: "在半載冬季的城市，雪花靜靜墜落，為畢業那年畫上最後溫柔的句號。",
    },
    scentFamily: { en: "Endings & Beginnings", zh: "結束與開始" },
    moodTags: {
      en: ["Snowlight", "Farewell", "Quiet bloom"],
      zh: ["雪光", "告別", "靜靜綻放"],
    },
    impression: {
      en: "Cool air, pale sky, the hush after something ends.",
      zh: "清冽的空氣、淡白的天，終章之後的寂靜。",
    },
    wearMoment: {
      en: "When you need a clean line between then and now.",
      zh: "當你需要在「那時」與「此刻」之間，劃一道溫柔界線。",
    },
    intensity: { en: "Soft luminosity", zh: "柔光內斂" },
    lasting: { en: "Close to the skin, into the evening", zh: "貼膚而行，直至夜色" },
    notes: nl(
      ["橙花", "Orange"],
      ["小蒼蘭", "鈴蘭", "Freesia", "Lily of the Valley"],
      ["廣藿香", "喀什米爾木", "白雪松", "Patchouli", "Cashmere Wood", "White Cedarwood"]
    ),
    accords: accFromNotes(
      ["橙花", "Orange"],
      ["小蒼蘭", "鈴蘭", "Freesia", "Lily of the Valley"]
    ),
    price: 128,
    currency: "HKD",
    shopifyHandle: "the-last-snow",
    shopifyVariantId: "gid://shopify/ProductVariant/44985797837000",
    relatedSlugs: ["the-first-rose", "morning-after-quit"],
    illustration: "library",
    mood: "light",
    backgroundColor: "#F2F0ED",
    sleeveColor: "#FFFFFF",
  },
  {
    id: "the-first-rose",
    slug: "the-first-rose",
    name: "The First Rose",
    descriptor: {
      en: "When innocence blushes, love learns its first language.",
      zh: "那年那花,是年少的全部，也是初戀的唯一註腳。",
    },
    shortStory: {
      en: "A single rose, offered when that was all you could give.",
      zh: "黃昏流轉，一朵玫瑰，盛住難得的純真與愛戀。",
    },
    longStory: {
      en: "I was young, with little to my name. All I could offer was a single rose—the only rose I could afford, yet it carried every part of me.",
      zh: "在青春流轉的黃昏，想用一朵玫瑰，訴說難得的純真與愛戀。",
    },
    scentFamily: { en: "Innocence & Pure Love", zh: "純真與初戀" },
    moodTags: {
      en: ["First blush", "Petal warmth", "Youth"],
      zh: ["初綻", "花瓣溫度", "年少"],
    },
    impression: {
      en: "Velvet petals, a held breath, the color of beginning.",
      zh: "絲絨花瓣、屏住的呼吸，屬於「開始」的顏色。",
    },
    wearMoment: {
      en: "When memory leans toward tenderness, not drama.",
      zh: "當回憶靠向溫柔，而非戲劇。",
    },
    intensity: { en: "Romantic clarity", zh: "清亮的浪漫" },
    lasting: { en: "Gentle through the day", zh: "整日輕柔相伴" },
    pairingSuggestion: {
      en: "Layer with The Old Library to lend the rose a hush of paper, ink, and time—depth without dimming its blush.",
      zh: "可與 The Old Library 疊擦，為玫瑰加上一層紙頁、墨水與時間的厚度。",
    },
    notes: nl(
      ["水蜜桃", "佛手柑", "牡丹", "Peach", "Bergamot", "Peony"],
      ["玫瑰", "茉莉", "紫羅蘭", "Rose", "Jasmine", "Violet"],
      ["雪松", "廣藿香", "麝香", "Cedarwood", "Patchouli", "Musk"]
    ),
    accords: accFromNotes(
      ["水蜜桃", "佛手柑", "牡丹", "Peach", "Bergamot", "Peony"],
      ["玫瑰", "茉莉", "紫羅蘭", "Rose", "Jasmine", "Violet"]
    ),
    price: 128,
    currency: "HKD",
    shopifyHandle: "the-first-rose",
    shopifyVariantId: "gid://shopify/ProductVariant/44985798164680",
    relatedSlugs: ["the-last-snow", "night-was-mine"],
    illustration: "rose",
    mood: "light",
    backgroundColor: "#F2E8E8",
    sleeveColor: "#F8F2F2",
  },
  {
    id: "no-worries",
    slug: "no-worries",
    name: "It means no worries",
    descriptor: {
      en: "Where the smallest corner holds the gentlest forever.",
      zh: "在塵埃落定前，借一場不散的笑聲。",
    },
    shortStory: {
      en: "Lemon peel on the stairwell, supper warmth through an open door.",
      zh: "舊唐樓走廊，鄰居曬過的檸檬皮香氣，斜陽下的溫度。",
    },
    longStory: {
      en: "At the neighbor's house, the air was filled with lemon and herbs, the warmth of meals, the comfort of laughter. It wasn't mine, yet it felt like home.",
      zh: "舊唐樓走廊，鄰居曬過的檸檬皮香氣，斜陽下的溫度。",
    },
    scentFamily: { en: "Safety & Childhood Warmth", zh: "溫暖與童年" },
    moodTags: {
      en: ["Kitchen light", "Belonging", "Unhurried"],
      zh: ["廚房餘光", "歸屬", "從容"],
    },
    impression: {
      en: "Citrus peel, herbs, the hush of being held by a room.",
      zh: "果皮與香草，被一間房間輕輕托住的安靜。",
    },
    wearMoment: {
      en: "When you want to feel at home in your own skin.",
      zh: "當你想在肌膚之上，重新感覺「像家」。",
    },
    intensity: { en: "Sunlit ease", zh: "陽光般的鬆弛" },
    lasting: { en: "Steady, familiar", zh: "穩定而熟悉" },
    notes: nl(
      ["檸檬", "佛手柑", "小豆蔻", "Lemon", "Bergamot", "Cardamom"],
      ["鼠尾草", "茉莉", "薰衣草", "丁香", "Sage", "Jasmine", "Lavender", "Clove"],
      ["岩薔薇", "琥珀", "苔蘚", "廣藿香", "乳香", "Labdanum", "Amber", "Moss", "Patchouli", "Frankincense"]
    ),
    accords: accFromNotes(
      ["檸檬", "佛手柑", "小豆蔻", "Lemon", "Bergamot", "Cardamom"],
      ["鼠尾草", "茉莉", "薰衣草", "丁香", "Sage", "Jasmine", "Lavender", "Clove"]
    ),
    price: 128,
    currency: "HKD",
    shopifyHandle: "no-worries",
    shopifyVariantId: "gid://shopify/ProductVariant/44985799999688",
    relatedSlugs: ["old-library", "morning-after-quit"],
    illustration: "library",
    mood: "light",
    backgroundColor: "#F5F2E8",
    sleeveColor: "#FAF8ED",
  },
  {
    id: "old-library",
    slug: "old-library",
    name: "The Old Library",
    descriptor: {
      en: "Where paper and silence keep your growing heart in trust.",
      zh: "墨香與沈默角力，我們在字裡行間揮霍年輕。",
    },
    shortStory: {
      en: "Amber afternoon, oak shelves, the rustle of pages you weren't ready to finish.",
      zh: "昏黃午後，老木與紙頁，油墨氣味裡藏著還沒說完的話。",
    },
    longStory: {
      en: "I spent most of my school days in the library. The air was heavy with books—paper, ink, and the quiet rustle of pages.",
      zh: "昏黃午後的光影輕鋪在老木書架間，紙張油墨交織的氣味。",
    },
    scentFamily: { en: "Knowledge & Friendship", zh: "知識與友誼" },
    moodTags: {
      en: ["Paper", "Oak", "Quiet hours"],
      zh: ["紙頁", "橡木", "安靜時光"],
    },
    impression: {
      en: "Dry paper, soft dust, light falling in a narrow band.",
      zh: "乾燥的紙張、細微塵埃，光以窄帶落在書脊上。",
    },
    wearMoment: {
      en: "For thinking slowly, with someone in mind.",
      zh: "適合慢慢想心事，心裡還惦著某個人。",
    },
    intensity: { en: "Scholarly calm", zh: "書齋般的沉靜" },
    lasting: { en: "Measured, enduring", zh: "節制而持久" },
    notes: nl(
      ["橙花", "佛手柑", "迷迭香", "Orange", "Bergamot", "Rosemary"],
      ["沉香", "天竺葵", "Oud", "Geranium"],
      ["琥珀", "麝香", "岩蘭草", "Amber", "Musk", "Vetiver"]
    ),
    accords: accFromNotes(
      ["橙花", "佛手柑", "迷迭香", "Orange", "Bergamot", "Rosemary"],
      ["沉香", "天竺葵", "Oud", "Geranium"]
    ),
    price: 128,
    currency: "HKD",
    shopifyHandle: "old-library",
    shopifyVariantId: "gid://shopify/ProductVariant/44985803047112",
    relatedSlugs: ["no-worries", "the-last-snow"],
    illustration: "library",
    mood: "light",
    backgroundColor: "#EDE8D8",
    sleeveColor: "#F5F0E0",
  },
  {
    id: "mens-garage",
    slug: "mens-garage",
    name: "The Men's Garage",
    descriptor: {
      en: "When duty clocks out, curiosity clocks in.",
      zh: "浪漫，可以很低調。",
    },
    shortStory: {
      en: "Sawdust, leather, and the patience of hands that build.",
      zh: "微光、皮革與工具——屬於自己的一隅，安放未完成的夢。",
    },
    longStory: {
      en: "The air was thick with sawdust and leather, the scent of wood, tools, and time well spent. My grandfather was always building—his hands shaping what would last.",
      zh: "男人需要的是屬於自己的一隅天地，微光和皮革座椅的舒適氣息。",
    },
    scentFamily: { en: "Craft, Solitude & Quiet Romance", zh: "獨處、沉靜與實現夢想的過程" },
    moodTags: {
      en: ["Workshop", "Leather", "Patience"],
      zh: ["工坊", "皮革", "耐心"],
    },
    impression: {
      en: "Grounded wood, peppered air, a door closed on the world.",
      zh: "沉著的木質、微辛的空氣，一扇門把世界關在外面。",
    },
    wearMoment: {
      en: "After hours, when the room belongs to you alone.",
      zh: "下班之後，當空間終於只屬於自己。",
    },
    intensity: { en: "Grounded", zh: "穩健內斂" },
    lasting: { en: "Deep into the night", zh: "深入夜色" },
    notes: nl(
      ["羅勒", "黑胡椒", "Basil", "Black Pepper"],
      ["薰衣草", "百里香", "Lavender", "Thyme"],
      ["廣藿香", "岩蘭草", "皮革", "Patchouli", "Vetiver", "Leather"]
    ),
    accords: accFromNotes(
      ["羅勒", "黑胡椒", "Basil", "Black Pepper"],
      ["薰衣草", "百里香", "Lavender", "Thyme"]
    ),
    price: 128,
    currency: "HKD",
    shopifyHandle: "mens-garage",
    shopifyVariantId: "gid://shopify/ProductVariant/44985805111496",
    relatedSlugs: ["im-rich", "night-was-mine"],
    illustration: "cigar",
    mood: "dark",
    backgroundColor: "#3A3530",
    sleeveColor: "#4A4540",
  },
  {
    id: "im-rich",
    slug: "im-rich",
    name: "I'm Rich",
    descriptor: {
      en: "When your worth begins long before the numbers do.",
      zh: "真正的富有，往往是內在世界無懼枯竭的自信與能量。",
    },
    shortStory: {
      en: "Metal-bright confidence, quiet as a vow you make to yourself.",
      zh: "第一次握緊薪資的那日——富有，從敢於相信生活開始。",
    },
    longStory: {
      en: "The day I held my first paycheck, I told myself: I want to be rich. I will be rich. I am rich.",
      zh: "第一次拿到薪水的那天，富有並不在於擁有多少，而在於敢於相信生活的可能。",
    },
    scentFamily: { en: "Ambition & Self-Belief", zh: "野心與自信" },
    moodTags: {
      en: ["Resolve", "Metal gleam", "Self-possession"],
      zh: "決心、冷光、自持",
    },
    impression: {
      en: "Sharpened air, cool metal, conviction without a speech.",
      zh: "利落的空氣、冷金屬光，無需宣言的篤定。",
    },
    wearMoment: {
      en: "When you step forward before the room agrees.",
      zh: "在眾人點頭之前，你已先向自己點頭。",
    },
    intensity: { en: "Assertive", zh: "鮮明有力" },
    lasting: { en: "Commanding trail", zh: "餘韻鮮明" },
    notes: nl(
      ["小豆蔻", "胡椒", "Cardamom", "Pepper"],
      ["玫瑰葉", "金色橙花", "金屬醛", "Rose Leaf", "Golden Neroli", "Metallic Aldehyde"],
      ["銀麝香", "雪松", "Silver Musk", "Cedarwood"]
    ),
    accords: accFromNotes(
      ["小豆蔻", "胡椒", "Cardamom", "Pepper"],
      ["玫瑰葉", "金色橙花", "金屬醛", "Rose Leaf", "Golden Neroli", "Metallic Aldehyde"]
    ),
    price: 128,
    currency: "HKD",
    shopifyHandle: "im-rich",
    shopifyVariantId: "gid://shopify/ProductVariant/44985805177032",
    relatedSlugs: ["night-was-mine", "mens-garage"],
    illustration: "cigar",
    mood: "dark",
    backgroundColor: "#2A2520",
    sleeveColor: "#3A3530",
  },
  {
    id: "morning-after-quit",
    slug: "morning-after-quit",
    name: "The Morning After I Quit",
    descriptor: {
      en: "When the loudest freedom is the silence you wake to.",
      zh: "繁華落盡後的安靜，原來才是真正生活的開始。",
    },
    shortStory: {
      en: "Linen light, no alarm — the first honest breath in weeks.",
      zh: "沒有鬧鐘的早晨，陽光穿過紗窗，像與自己久別重逢。",
    },
    longStory: {
      en: "The morning after I quit my first job, I woke to silence, sunlight spilling across the sheets. For the first time in a long while, I could breathe without weight.",
      zh: "陽光靜靜穿過紗窗，沒有鬧鐘、沒有老闆的訊息，是與自己的久別重逢。",
    },
    scentFamily: { en: "Release & Relief", zh: "釋放與解脫" },
    moodTags: {
      en: ["Clean sheets", "Daylight", "Relief"],
      zh: ["乾淨床單", "日光", "釋然"],
    },
    impression: {
      en: "Cool citrus, pale florals, the room still listening.",
      zh: "清涼柑橘與淡色花香，房間仍在傾聽。",
    },
    wearMoment: {
      en: "The first morning that belongs to you again.",
      zh: "再次屬於你的，第一個早晨。",
    },
    intensity: { en: "Airy", zh: "輕盈通透" },
    lasting: { en: "Fresh through noon", zh: "清新至午後" },
    notes: nl(
      ["佛手柑", "柑橘", "紫丁香", "Bergamot", "Mandarin", "Lilac"],
      ["白亞麻", "山楂花", "White Linen", "Hawthorn"],
      ["麝香", "雪松", "檀香", "Musk", "Cedarwood", "Sandalwood"]
    ),
    accords: accFromNotes(
      ["佛手柑", "柑橘", "紫丁香", "Bergamot", "Mandarin", "Lilac"],
      ["白亞麻", "山楂花", "White Linen", "Hawthorn"]
    ),
    price: 128,
    currency: "HKD",
    shopifyHandle: "morning-after-quit",
    shopifyVariantId: "gid://shopify/ProductVariant/44985805701320",
    relatedSlugs: ["no-worries", "the-first-rose"],
    illustration: "library",
    mood: "light",
    backgroundColor: "#F0F5F8",
    sleeveColor: "#F8FAFC",
  },
  {
    id: "night-was-mine",
    slug: "night-was-mine",
    name: "The Night Was Mine",
    descriptor: {
      en: "Where unspoken confidence lingers longer than the night.",
      zh: "真正的力量，往往在最無聲的瞬間釋放。成功亦然，魅力亦然。",
    },
    shortStory: {
      en: "Rum, tobacco, and the hush of a room that watches you win.",
      zh: "煙草與蘭姆在初上燈火的房間裡交錯，魅力在沉默中蔓延。",
    },
    longStory: {
      en: "The night I first tasted success, the room was heavy with smoke and rum. I was in control—confident, certain, aware of every glance that found me.",
      zh: "煙草味與蘭姆酒味在華燈初上的房間裡輕盈交錯，魅力在不語中蔓延。",
    },
    scentFamily: { en: "Confidence & Allure", zh: "自信與魅力" },
    moodTags: {
      en: ["Smoke", "Rum", "Low light"],
      zh: ["煙霧", "蘭姆", "低光"],
    },
    impression: {
      en: "Warm spice, dark sweetness, a smile you don't owe anyone.",
      zh: "溫熱辛香與暗甜，一個不必向任何人交代的笑。",
    },
    wearMoment: {
      en: "When the night is an agreement you make with yourself.",
      zh: "當夜晚是你與自己締結的默契。",
    },
    intensity: { en: "Magnetic", zh: "磁性鮮明" },
    lasting: { en: "Late hours", zh: "徹夜不散" },
    notes: nl(
      ["黑胡椒", "欖香脂", "Black Pepper", "Elemi"],
      ["琥珀", "天芥菜", "蘭姆酒", "Amber", "Heliotrope", "Rum"],
      ["岩蘭草", "麝香", "煙草", "Vetiver", "Musk", "Tobacco"]
    ),
    accords: accFromNotes(
      ["黑胡椒", "欖香脂", "Black Pepper", "Elemi"],
      ["琥珀", "天芥菜", "蘭姆酒", "Amber", "Heliotrope", "Rum"]
    ),
    price: 128,
    currency: "HKD",
    shopifyHandle: "night-was-mine",
    shopifyVariantId: "gid://shopify/ProductVariant/44985806356680",
    relatedSlugs: ["im-rich", "mens-garage"],
    illustration: "cigar",
    mood: "dark",
    backgroundColor: "#1A1520",
    sleeveColor: "#2A2530",
  },
];
