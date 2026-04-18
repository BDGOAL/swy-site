import type { Locale } from "../lib/i18n";

/**
 * Approved one-line elevator pitches for collection cards (keyed by local product id).
 * Also includes optional extra lowercase tokens to improve onsite search discoverability.
 */

export const ELEVATOR_PITCHES_BY_PRODUCT_ID: Record<string, string> = {
  "the-last-snow": "一場落在告別之前的雪，寫給放下之後仍會綻放的人。",
  "morning-after-quit": "像第一個不用鬧鐘的清晨，把自由曬進微涼床單裡。",
  "the-first-rose": "一朵藏在掌心的玫瑰，把年少最安靜的悸動留到最後。",
  "no-worries": "像舊唐樓黃昏裡的果皮與飯香，把人帶回最踏實的歸屬。",
  "old-library": "紙頁、木書架與昏黃午後，把青春與秘密一頁頁封存。",
  "mens-garage": "屬於男人的一隅天地，在皮革、塵埃與沉默裡安放理想。",
  "im-rich": "真正的富有，不是擁有更多，而是每天都敢向自己點頭。",
  "night-was-mine": "在煙草與蘭姆酒交錯的夜裡，讓沉默本身成為最強烈的魅力。",
};

/** Extra normalized tokens per product for lightweight synonym / mood search */
export const COLLECTION_SEARCH_BOOST_BY_PRODUCT_ID: Record<string, string> = {
  "the-last-snow": "snow winter goodbye ending snowflake 雪 告別",
  "morning-after-quit": "freedom morning quit relief linen alarm clock 自由 清晨",
  "the-first-rose": "love rose floral flowers peony first crush youth 玫瑰 初戀 愛 花香",
  "no-worries": "home comfort nostalgia childhood family kitchen lemon hakuna worries 家 童年 溫暖",
  "old-library": "library paper books ink study friendship 圖書館 書",
  "mens-garage": "garage leather wood dust craft solitude workshop 皮革 車庫 woody",
  "im-rich": "rich wealth ambition confidence success 富有 野心",
  "night-was-mine": "night rum tobacco allure confidence evening 夜 煙草 魅力",
};

/** English card lines — editorial, not literal glosses of the Chinese lines */
export const ELEVATOR_PITCH_EN_BY_PRODUCT_ID: Record<string, string> = {
  "the-last-snow":
    "Snow before farewell — written for those who bloom after they let go.",
  "morning-after-quit":
    "Like the first morning without an alarm — freedom pressed into cool linen.",
  "the-first-rose":
    "A rose held in the palm — youth’s quiet crush, kept to the very end.",
  "no-worries":
    "Citrus peel and supper warmth in an old walk-up — belonging without owning.",
  "old-library":
    "Paper, oak shelves, amber afternoon — youth filed away between the pages.",
  "mens-garage":
    "Leather, dust, and patience — a corner where duty ends and making begins.",
  "im-rich":
    "Wealth that starts before the numbers — quiet conviction, well before the win.",
  "night-was-mine":
    "Rum, tobacco, and a room that listens — confidence that outlasts the night.",
};

export function getElevatorPitchForProductId(id: string): string {
  return ELEVATOR_PITCHES_BY_PRODUCT_ID[id] ?? "";
}

export function getLocalizedElevatorPitch(id: string, locale: Locale): string {
  if (locale === "zh") return getElevatorPitchForProductId(id);
  return ELEVATOR_PITCH_EN_BY_PRODUCT_ID[id] ?? "";
}

export function getSearchBoostForProductId(id: string): string {
  return COLLECTION_SEARCH_BOOST_BY_PRODUCT_ID[id] ?? "";
}
