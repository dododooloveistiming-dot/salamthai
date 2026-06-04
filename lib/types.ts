export type Lang = "en" | "ko" | "th" | "zh" | "ja" | "ar";

export type Niche =
  | "halal-food"
  | "muslim-hotel"
  | "halal-tour"
  | "mosque"
  | "halal-clinic"
  | "halal-beauty"
  // 17 halal food sub-niches
  | "halal-arab"
  | "halal-bakery"
  | "halal-bbq"
  | "halal-buffet"
  | "halal-burger"
  | "halal-cafe"
  | "halal-cooking-class"
  | "halal-grocery"
  | "halal-indian"
  | "halal-japanese"
  | "halal-korean"
  | "halal-mediterranean"
  | "halal-pizza"
  | "halal-seafood"
  | "halal-shisha-cafe"
  | "halal-street-food"
  | "halal-thai"
  // 11 muslim services
  | "halal-laundry"
  | "halal-pharmacy"
  | "iftar-buffet"
  | "modest-fashion"
  | "muslim-attractions"
  | "muslim-driver"
  | "muslim-friendly-spa"
  | "muslim-wedding"
  | "prayer-room"
  | "southern-muslim"
  | "arabic-school";

export interface PlaceReview {
  source: string;
  reviewer: string;
  rating: number | null;
  date: string;
  text: string;
}

export interface PlaceVideo {
  video_id: string;
  title: string;
  channel: string;
}

export interface AffiliateLinks {
  klook?: string;
  viator?: string;
  getyourguide?: string;
  agoda?: string;
  tripcom?: string;
  bookimed?: string;
}

export interface SourceBadges {
  google_reviews: number;
  photos: number;
  videos: number;
  reddit: number;
  naver: number;
  pantip: number;
  website: number;
  booking: number;
  bookimed: number;
}

// Lightweight projection used by list/grid client components (Category, Search,
// Hero featured rails). Strips heavy fields (reviews_sample, community_mentions,
// photos/videos_sample, top_review_text, source_badges, etc.) that aren't read in
// the card UI, so HTML payload shrinks ~80% on category pages with 500+ items.
//
// Build a PlaceLite from a Place via toPlaceLite() in lib/data.ts.
export interface PlaceLite {
  id: string;
  slug: string;
  niche: Niche;
  name: string;
  city: string;
  category: string;          // used for search text matching
  rating: number | null;
  review_count: number | null;
  trust_score: number;
  top_photo_url: string;
  price_band: "budget" | "mid" | "premium" | "luxury" | "unknown";
  is_beginner_friendly: boolean;
  is_open_24h: boolean;
  is_suspected_viral: boolean;
  is_partner: boolean;
  is_halal_signaled?: boolean;
  halal_signal_count?: number;       // number of distinct halal signals
  halal_signals_detected?: string;   // comma list — rendered as pills in PlacePhoto
  source_count: number;              // 0-8 distinct sources that verified
  has_affiliate: boolean;            // collapsed from full affiliate{} object
  languages: { en: boolean; ko: boolean; th: boolean; zh: boolean; ja: boolean; ar: boolean };
  // GCC Arabic-review badge for cards (true if ≥1 Arabic review on Booking)
  has_arabic_reviews?: boolean;
  arabic_review_count?: number;
  // YouTube viewer-comment badge
  has_youtube_comments?: boolean;
  youtube_comment_count?: number;
  // OSM verified badge
  has_osm?: boolean;
  // Wikipedia article exists
  has_wikipedia?: boolean;
}

export interface Place {
  id: string;
  slug: string;
  niche: Niche;
  name: string;
  address: string;
  city: string;
  rating: number | null;
  review_count: number | null;
  phone: string;
  website: string;
  category: string;
  google_maps_url: string;
  reviews_scraped_count: number;
  avg_scraped_rating: number | null;
  top_review_text: string;
  reviews_sample: PlaceReview[];
  photos_count: number;
  top_photo_url: string;
  photos_sample: string[];
  videos_count: number;
  top_video_id: string;
  videos_sample: PlaceVideo[];
  price_min_thb: number;
  price_max_thb: number;
  price_unit: string;
  price_band: "budget" | "mid" | "premium" | "luxury" | "unknown";
  opening_hours_json: string;
  is_open_24h: boolean;
  is_beginner_friendly: boolean;
  is_advanced_oriented: boolean;
  beginner_score: number;
  languages: { en: boolean; ko: boolean; th: boolean; zh: boolean; ja: boolean; ar: boolean };
  source_badges: SourceBadges;
  trust_score: number;
  is_suspected_viral: boolean;
  affiliate: AffiliateLinks;
  is_partner: boolean;
  community_mentions?: CommunityThread[];
  // halal-specific signals (text-mined from name/category/reviews/website)
  halal_signals_detected?: string;
  halal_signal_count?: number;
  is_halal_signaled?: boolean;
  // Negative signals (Track 4) — evidence-based, surface on place page
  negative_signals?: NegativeSignal[];
  negative_trust_penalty?: number;
  // CICOT lifecycle (Track 2a)
  cicot_mentioned?: boolean;
  cicot_cert_no?: string;
  cicot_mention_source?: string;
  cicot_mention_evidence?: string;
  // GCC traveler Arabic reviews (Booking.com scrape)
  arabic_reviews?: ArabicReview[];      // top 5
  arabic_review_count?: number;          // total found
  has_arabic_reviews?: boolean;
  // YouTube viewer comments mentioning muslim/halal keywords
  youtube_comments?: YouTubeComment[];   // top 5
  youtube_comment_count?: number;
  has_youtube_comments?: boolean;
  // OpenStreetMap enrichment — community-edited public data
  osm?: OsmData;
  has_osm?: boolean;
  // Wikipedia / Wikidata background (35 mosque entities, 20 with summaries)
  wiki_qid?: string;
  wiki_name?: string;
  wiki_summaries?: WikiSummaries;     // {lang: {extract, description, thumbnail, url}}
  has_wikipedia?: boolean;
}

export type WikiSummaries = Partial<Record<Lang, {
  extract: string;
  description?: string;
  thumbnail?: string;
  url?: string;
}>>;

export interface OsmData {
  id: string;
  type: string;                 // 'node' | 'way' | 'relation'
  opening_hours?: string;
  cuisine?: string;
  phone?: string;
  email?: string;
  website?: string;
  wheelchair?: string;          // 'yes' | 'no' | 'limited' | etc.
  internet_access?: string;     // 'yes' | 'wifi' | 'no'
  diet_halal?: string;          // 'yes' | 'only' | 'no'
  amenity?: string;
  religion?: string;            // mosques → 'muslim'
  /** raw tags JSON — keeps everything OSM has, surfaced on demand */
  tags_json?: string;
}

export interface NegativeSignal {
  type: string;            // e.g., "alcohol_in_name_or_category"
  severity: "critical" | "high" | "medium" | "low";
  source: string;          // e.g., "text_rule:review_snippets"
  evidence_text: string;   // human-readable evidence
  snippet?: string;        // surrounding context
  detected_at: string;     // ISO date
}

export interface ArabicReview {
  reviewer: string;
  country: string;         // reviewer country (often Saudi, UAE, etc.)
  score: string;           // e.g., "8.5" (Booking 0-10)
  positive: string;        // "what I liked"
  negative: string;        // "what I disliked"
  title_positive?: string;
  title_negative?: string;
  posted_date: string;
  booking_url: string;
}

export interface YouTubeComment {
  video_id: string;
  video_title: string;
  channel: string;
  author: string;
  text: string;
  likes: number;
  lang: string;            // 'en' | 'ko' | 'th' | 'ar' | 'zh' | 'ja_kana'
  muslim_keywords: string[];
  posted_at: string;
}

export interface CommunityThread {
  kind: "reddit" | "pantip" | "naver";
  title: string;
  url: string;
  snippet: string;
  score: number;
  comments: number;
  author: string;
  subreddit: string;
  date: string;
}

export interface CommunityBundle {
  generated_at: string;
  niche: Niche;
  counts: { reddit: number; pantip: number; naver: number };
  top_reddit: CommunityThread[];
  top_pantip: CommunityThread[];
  top_naver: CommunityThread[];
}

export interface PlacesBundle {
  generated_at: string;
  total: number;
  by_niche: Record<Niche, number>;
  avg_trust: number;
  places: Place[];
}

export interface NicheMeta {
  emoji: string;
  name: Record<Lang, string>;
  tagline: Record<Lang, string>;
}

export const NICHE_META: Record<Niche, NicheMeta> = {
  "halal-food": {
    emoji: "🥘",
    name: {
      en: "Halal Restaurants",
      ko: "할랄 식당",
      th: "ร้านอาหารฮาลาล",
      zh: "清真餐厅",
      ja: "ハラール レストラン",
      ar: "مطاعم حلال",
    },
    tagline: {
      en: "Verified halal-certified dining across Thailand",
      ko: "태국 전역의 검증된 할랄 인증 식당",
      th: "ร้านอาหารที่ได้รับการรับรองฮาลาลทั่วประเทศไทย",
      zh: "泰国各地经过验证的清真餐厅",
      ja: "タイ全土で検証済みのハラール認証ダイニング",
      ar: "مطاعم معتمدة حلال موثوقة في جميع أنحاء تايلاند",
    },
  },
  "muslim-hotel": {
    emoji: "🏨",
    name: {
      en: "Muslim-Friendly Hotels",
      ko: "무슬림 친화 호텔",
      th: "โรงแรมสำหรับมุสลิม",
      zh: "穆斯林友好酒店",
      ja: "ムスリム フレンドリー ホテル",
      ar: "فنادق صديقة للمسلمين",
    },
    tagline: {
      en: "Prayer room, qibla, halal kitchen — verified",
      ko: "기도방, 키블라, 할랄 키친 — 검증됨",
      th: "ห้องละหมาด กิบลัต ครัวฮาลาล — ตรวจสอบแล้ว",
      zh: "礼拜室、朝向指南、清真厨房 — 已验证",
      ja: "礼拝室、キブラ、ハラールキッチン — 検証済み",
      ar: "غرفة صلاة، قبلة، مطبخ حلال — موثق",
    },
  },
  "halal-tour": {
    emoji: "✈️",
    name: {
      en: "Halal Tours & Activities",
      ko: "할랄 투어 & 액티비티",
      th: "ทัวร์มุสลิมและกิจกรรม",
      zh: "清真旅游与活动",
      ja: "ハラール ツアー＆アクティビティ",
      ar: "جولات وأنشطة حلال",
    },
    tagline: {
      en: "Family muslim-friendly tours & day trips",
      ko: "가족 무슬림 친화 투어 & 데이트립",
      th: "ทัวร์ครอบครัวมุสลิมและทริปวันเดียว",
      zh: "家庭穆斯林友好旅游和一日游",
      ja: "家族向けムスリム フレンドリー ツアー",
      ar: "جولات عائلية صديقة للمسلمين ورحلات يومية",
    },
  },
  "mosque": {
    emoji: "🕌",
    name: {
      en: "Mosques",
      ko: "모스크",
      th: "มัสยิด",
      zh: "清真寺",
      ja: "モスク",
      ar: "المساجد",
    },
    tagline: {
      en: "Find Friday prayer + daily masjid locations",
      ko: "금요예배 + 일일 마스지드 위치 찾기",
      th: "ค้นหาสถานที่ละหมาดวันศุกร์และมัสยิดประจำวัน",
      zh: "查找周五礼拜和日常清真寺位置",
      ja: "金曜礼拝と日々のマスジド情報",
      ar: "ابحث عن صلاة الجمعة ومواقع المساجد",
    },
  },
  "halal-clinic": {
    emoji: "🏥",
    name: {
      en: "Muslim-Friendly Hospitals",
      ko: "무슬림 친화 병원",
      th: "โรงพยาบาลสำหรับมุสลิม",
      zh: "穆斯林友好医院",
      ja: "ムスリム フレンドリー 病院",
      ar: "مستشفيات صديقة للمسلمين",
    },
    tagline: {
      en: "Female doctors, halal food, prayer rooms",
      ko: "여의사, 할랄 식사, 기도방",
      th: "หมอผู้หญิง อาหารฮาลาล ห้องละหมาด",
      zh: "女医生、清真餐食、礼拜室",
      ja: "女医、ハラール食、礼拝室",
      ar: "طبيبات، طعام حلال، غرف صلاة",
    },
  },
  "halal-beauty": {
    emoji: "💄",
    name: {
      en: "Halal Beauty & Salons",
      ko: "할랄 뷰티 & 살롱",
      th: "บิวตี้และซาลอนฮาลาล",
      zh: "清真美容与沙龙",
      ja: "ハラール ビューティー＆サロン",
      ar: "تجميل وصالونات حلال",
    },
    tagline: {
      en: "Halal cosmetics + women-only salons",
      ko: "할랄 화장품 + 여성전용 살롱",
      th: "เครื่องสำอางฮาลาลและซาลอนผู้หญิงล้วน",
      zh: "清真化妆品 + 仅限女性沙龙",
      ja: "ハラール化粧品＋女性専用サロン",
      ar: "مستحضرات تجميل حلال + صالونات نسائية فقط",
    },
  },

  // === 17 halal food sub-niches ===
  "halal-arab": {
    emoji: "🥙",
    name: {
      en: "Halal Arab Restaurants",
      ko: "할랄 아랍 식당",
      th: "ร้านอาหารอาหรับฮาลาล",
      zh: "清真阿拉伯餐厅",
      ja: "ハラール アラブ料理",
      ar: "مطاعم عربية حلال",
    },
    tagline: {
      en: "Authentic Middle Eastern halal cuisine in Thailand",
      ko: "태국 내 정통 중동 할랄 요리",
      th: "อาหารตะวันออกกลางฮาลาลแท้ๆ ในประเทศไทย",
      zh: "泰国正宗中东清真美食",
      ja: "タイで楽しむ本場の中東ハラール料理",
      ar: "مأكولات شرق أوسطية حلال أصيلة في تايلاند",
    },
  },
  "halal-bakery": {
    emoji: "🥐",
    name: {
      en: "Halal Bakeries",
      ko: "할랄 베이커리",
      th: "เบเกอรี่ฮาลาล",
      zh: "清真烘焙店",
      ja: "ハラール ベーカリー",
      ar: "مخابز حلال",
    },
    tagline: {
      en: "Halal-certified bread, pastries, and cakes",
      ko: "할랄 인증 빵, 페이스트리, 케이크",
      th: "ขนมปัง เพสตรี้ และเค้กที่ได้รับการรับรองฮาลาล",
      zh: "清真认证面包、糕点和蛋糕",
      ja: "ハラール認証のパン、ペストリー、ケーキ",
      ar: "خبز ومعجنات وكعك حلال معتمد",
    },
  },
  "halal-bbq": {
    emoji: "🍖",
    name: {
      en: "Halal BBQ & Grill",
      ko: "할랄 BBQ & 그릴",
      th: "บาร์บีคิวและย่างฮาลาล",
      zh: "清真烧烤",
      ja: "ハラール BBQ・グリル",
      ar: "شواء حلال",
    },
    tagline: {
      en: "Charcoal grilled halal meats — beef, lamb, chicken",
      ko: "숯불 할랄 그릴 — 소고기, 양고기, 닭고기",
      th: "เนื้อย่างฮาลาลถ่านไม้ — เนื้อ แกะ ไก่",
      zh: "炭烤清真肉类 — 牛肉、羊肉、鸡肉",
      ja: "炭火焼ハラール肉 — ビーフ、ラム、チキン",
      ar: "لحوم حلال مشوية على الفحم — لحم، ضأن، دجاج",
    },
  },
  "halal-buffet": {
    emoji: "🍽️",
    name: {
      en: "Halal Buffet",
      ko: "할랄 뷔페",
      th: "บุฟเฟ่ต์ฮาลาล",
      zh: "清真自助餐",
      ja: "ハラール ビュッフェ",
      ar: "بوفيه حلال",
    },
    tagline: {
      en: "All-you-can-eat halal — lunch, dinner, hotel",
      ko: "무제한 할랄 — 점심, 저녁, 호텔 뷔페",
      th: "บุฟเฟ่ต์ฮาลาลไม่อั้น — มื้อกลางวัน เย็น โรงแรม",
      zh: "随便吃清真自助餐 — 午餐、晚餐、酒店",
      ja: "食べ放題ハラール — ランチ、ディナー、ホテル",
      ar: "بوفيه حلال مفتوح — غداء، عشاء، فندقي",
    },
  },
  "halal-burger": {
    emoji: "🍔",
    name: {
      en: "Halal Burgers",
      ko: "할랄 버거",
      th: "เบอร์เกอร์ฮาลาล",
      zh: "清真汉堡",
      ja: "ハラール バーガー",
      ar: "برجر حلال",
    },
    tagline: {
      en: "Halal beef burgers — fast food & gourmet",
      ko: "할랄 비프 버거 — 패스트푸드 & 고메",
      th: "เบอร์เกอร์เนื้อฮาลาล — ฟาสต์ฟู้ดและกูร์เมต์",
      zh: "清真牛肉汉堡 — 快餐与高级美食",
      ja: "ハラール ビーフバーガー — ファストフード＆グルメ",
      ar: "برجر لحم حلال — وجبات سريعة وفاخرة",
    },
  },
  "halal-cafe": {
    emoji: "☕",
    name: {
      en: "Halal Cafés",
      ko: "할랄 카페",
      th: "คาเฟ่ฮาลาล",
      zh: "清真咖啡馆",
      ja: "ハラール カフェ",
      ar: "مقاهي حلال",
    },
    tagline: {
      en: "Halal-friendly coffee shops with no alcohol",
      ko: "주류 없는 할랄 친화 커피숍",
      th: "คาเฟ่ฮาลาลปลอดแอลกอฮอล์",
      zh: "无酒精清真友好咖啡店",
      ja: "アルコールなしのハラール カフェ",
      ar: "مقاهي حلال خالية من الكحول",
    },
  },
  "halal-cooking-class": {
    emoji: "👩‍🍳",
    name: {
      en: "Halal Cooking Classes",
      ko: "할랄 쿠킹 클래스",
      th: "คลาสทำอาหารฮาลาล",
      zh: "清真烹饪课",
      ja: "ハラール 料理教室",
      ar: "دروس طبخ حلال",
    },
    tagline: {
      en: "Learn Thai cuisine with halal ingredients only",
      ko: "할랄 재료만으로 배우는 태국 요리",
      th: "เรียนทำอาหารไทยด้วยวัตถุดิบฮาลาลเท่านั้น",
      zh: "用纯清真食材学做泰国菜",
      ja: "ハラール食材だけで学ぶタイ料理",
      ar: "تعلم الطبخ التايلاندي بمكونات حلال فقط",
    },
  },
  "halal-grocery": {
    emoji: "🛒",
    name: {
      en: "Halal Grocery Stores",
      ko: "할랄 식료품점",
      th: "ร้านขายของชำฮาลาล",
      zh: "清真食品店",
      ja: "ハラール 食料品店",
      ar: "بقالات حلال",
    },
    tagline: {
      en: "Halal-certified meat, ingredients, and pantry staples",
      ko: "할랄 인증 육류, 식재료, 식료품",
      th: "เนื้อสัตว์ฮาลาลและเครื่องปรุงที่ได้รับการรับรอง",
      zh: "清真认证肉类、食材和日用食品",
      ja: "ハラール認証の肉、食材、食品全般",
      ar: "لحوم ومكونات وأطعمة حلال معتمدة",
    },
  },
  "halal-indian": {
    emoji: "🍛",
    name: {
      en: "Halal Indian Restaurants",
      ko: "할랄 인도 식당",
      th: "ร้านอาหารอินเดียฮาลาล",
      zh: "清真印度餐厅",
      ja: "ハラール インド料理",
      ar: "مطاعم هندية حلال",
    },
    tagline: {
      en: "Authentic halal Indian curry, biryani, naan",
      ko: "정통 할랄 인도 카레, 비리야니, 난",
      th: "อาหารอินเดียฮาลาลแท้ — แกง บิรยานี นาน",
      zh: "正宗清真印度咖喱、比尔亚尼、馕饼",
      ja: "本格ハラール インドカレー、ビリヤニ、ナン",
      ar: "كاري وبرياني ونان هندي حلال أصيل",
    },
  },
  "halal-japanese": {
    emoji: "🍣",
    name: {
      en: "Halal Japanese Restaurants",
      ko: "할랄 일식당",
      th: "ร้านอาหารญี่ปุ่นฮาลาล",
      zh: "清真日本料理",
      ja: "ハラール 日本料理",
      ar: "مطاعم يابانية حلال",
    },
    tagline: {
      en: "Halal sushi, ramen, and Japanese cuisine",
      ko: "할랄 스시, 라멘, 일본 요리",
      th: "ซูชิ ราเมง อาหารญี่ปุ่นฮาลาล",
      zh: "清真寿司、拉面、日本料理",
      ja: "ハラール 寿司、ラーメン、和食",
      ar: "سوشي ورامن ومأكولات يابانية حلال",
    },
  },
  "halal-korean": {
    emoji: "🍱",
    name: {
      en: "Halal Korean Restaurants",
      ko: "할랄 한식당",
      th: "ร้านอาหารเกาหลีฮาลาล",
      zh: "清真韩国料理",
      ja: "ハラール 韓国料理",
      ar: "مطاعم كورية حلال",
    },
    tagline: {
      en: "Halal Korean BBQ, bibimbap, and Korean cuisine",
      ko: "할랄 한국식 BBQ, 비빔밥, 한식",
      th: "เนื้อย่างเกาหลี บิบิมบับ และอาหารเกาหลีฮาลาล",
      zh: "清真韩国烤肉、拌饭和韩式料理",
      ja: "ハラール 韓国焼肉、ビビンバ、韓国料理",
      ar: "شواء كوري وبيبيمباب ومأكولات كورية حلال",
    },
  },
  "halal-mediterranean": {
    emoji: "🫒",
    name: {
      en: "Halal Mediterranean",
      ko: "할랄 지중해 식당",
      th: "อาหารเมดิเตอร์เรเนียนฮาลาล",
      zh: "清真地中海餐厅",
      ja: "ハラール 地中海料理",
      ar: "مطاعم متوسطية حلال",
    },
    tagline: {
      en: "Halal Mediterranean, Turkish, Lebanese cuisine",
      ko: "할랄 지중해, 터키, 레바논 요리",
      th: "อาหารเมดิเตอร์เรเนียน ตุรกี เลบานอนฮาลาล",
      zh: "清真地中海、土耳其、黎巴嫩美食",
      ja: "ハラール 地中海、トルコ、レバノン料理",
      ar: "مأكولات متوسطية وتركية ولبنانية حلال",
    },
  },
  "halal-pizza": {
    emoji: "🍕",
    name: {
      en: "Halal Pizza",
      ko: "할랄 피자",
      th: "พิซซ่าฮาลาล",
      zh: "清真比萨",
      ja: "ハラール ピザ",
      ar: "بيتزا حلال",
    },
    tagline: {
      en: "Halal-certified pizza — Italian & Western style",
      ko: "할랄 인증 피자 — 이탈리안 & 웨스턴",
      th: "พิซซ่าฮาลาลที่ได้รับการรับรอง — สไตล์อิตาเลียนและตะวันตก",
      zh: "清真认证比萨 — 意式与西式",
      ja: "ハラール認証ピザ — イタリアン＆ウェスタン",
      ar: "بيتزا حلال معتمدة — إيطالية وغربية",
    },
  },
  "halal-seafood": {
    emoji: "🦐",
    name: {
      en: "Halal Seafood",
      ko: "할랄 시푸드",
      th: "อาหารทะเลฮาลาล",
      zh: "清真海鲜",
      ja: "ハラール シーフード",
      ar: "مأكولات بحرية حلال",
    },
    tagline: {
      en: "Halal-certified fresh seafood restaurants",
      ko: "할랄 인증 신선한 해산물 식당",
      th: "ร้านอาหารทะเลสดฮาลาลที่ได้รับการรับรอง",
      zh: "清真认证新鲜海鲜餐厅",
      ja: "ハラール認証 新鮮シーフード レストラン",
      ar: "مطاعم مأكولات بحرية طازجة حلال معتمدة",
    },
  },
  "halal-shisha-cafe": {
    emoji: "💨",
    name: {
      en: "Halal Shisha Cafés",
      ko: "할랄 시샤 카페",
      th: "คาเฟ่ชิชาฮาลาล",
      zh: "清真水烟咖啡馆",
      ja: "ハラール シーシャ カフェ",
      ar: "مقاهي شيشة حلال",
    },
    tagline: {
      en: "Halal-friendly shisha lounges and Arab cafés",
      ko: "할랄 친화 시샤 라운지 & 아랍 카페",
      th: "ลานจิบชิชาและคาเฟ่อาหรับฮาลาล",
      zh: "清真友好水烟休息室和阿拉伯咖啡馆",
      ja: "ハラール対応のシーシャ ラウンジ＆アラブ カフェ",
      ar: "صالات شيشة حلال ومقاهي عربية",
    },
  },
  "halal-street-food": {
    emoji: "🥡",
    name: {
      en: "Halal Street Food",
      ko: "할랄 길거리 음식",
      th: "อาหารริมทางฮาลาล",
      zh: "清真街头小吃",
      ja: "ハラール 屋台料理",
      ar: "أكل الشارع حلال",
    },
    tagline: {
      en: "Halal hawker stalls and Thai street food",
      ko: "할랄 노점 & 태국 길거리 음식",
      th: "แผงลอยและสตรีทฟู้ดไทยฮาลาล",
      zh: "清真小贩摊位和泰式街头小吃",
      ja: "ハラール 屋台＆タイ ストリートフード",
      ar: "أكشاك حلال وأكل شارع تايلاندي",
    },
  },
  "halal-thai": {
    emoji: "🍜",
    name: {
      en: "Halal Thai Restaurants",
      ko: "할랄 태국 식당",
      th: "ร้านอาหารไทยฮาลาล",
      zh: "清真泰国餐厅",
      ja: "ハラール タイ料理",
      ar: "مطاعم تايلاندية حلال",
    },
    tagline: {
      en: "Authentic Thai cuisine — 100% halal certified",
      ko: "정통 태국 요리 — 100% 할랄 인증",
      th: "อาหารไทยแท้ — ฮาลาลรับรอง 100%",
      zh: "正宗泰国菜 — 100% 清真认证",
      ja: "本格タイ料理 — 100% ハラール認証",
      ar: "مأكولات تايلاندية أصيلة — حلال معتمد 100%",
    },
  },

  // === 11 muslim services ===
  "halal-laundry": {
    emoji: "🧺",
    name: {
      en: "Halal Laundry",
      ko: "할랄 세탁소",
      th: "ร้านซักรีดฮาลาล",
      zh: "清真洗衣店",
      ja: "ハラール ランドリー",
      ar: "مغاسل حلال",
    },
    tagline: {
      en: "Halal-friendly laundry — separate from non-halal",
      ko: "할랄 친화 세탁 — 비할랄과 분리",
      th: "ร้านซักรีดฮาลาล — แยกจากไม่ฮาลาล",
      zh: "清真友好洗衣 — 与非清真分离",
      ja: "ハラール対応ランドリー — 非ハラールと分離",
      ar: "مغاسل حلال — منفصلة عن غير الحلال",
    },
  },
  "halal-pharmacy": {
    emoji: "💊",
    name: {
      en: "Halal Pharmacies",
      ko: "할랄 약국",
      th: "ร้านขายยาฮาลาล",
      zh: "清真药店",
      ja: "ハラール 薬局",
      ar: "صيدليات حلال",
    },
    tagline: {
      en: "Halal-certified medicines and supplements",
      ko: "할랄 인증 의약품 및 보조제",
      th: "ยาและอาหารเสริมที่ได้รับการรับรองฮาลาล",
      zh: "清真认证药品和保健品",
      ja: "ハラール認証の薬・サプリメント",
      ar: "أدوية ومكملات معتمدة حلال",
    },
  },
  "iftar-buffet": {
    emoji: "🌙",
    name: {
      en: "Iftar Buffet",
      ko: "이프타르 뷔페",
      th: "บุฟเฟ่ต์อิฟตาร์",
      zh: "开斋餐自助",
      ja: "イフタール ビュッフェ",
      ar: "بوفيه إفطار",
    },
    tagline: {
      en: "Ramadan iftar buffets — hotels & restaurants",
      ko: "라마단 이프타르 뷔페 — 호텔 & 식당",
      th: "บุฟเฟ่ต์อิฟตาร์รอมฎอน — โรงแรมและร้านอาหาร",
      zh: "斋月开斋自助 — 酒店和餐厅",
      ja: "ラマダーン イフタール — ホテル＆レストラン",
      ar: "بوفيهات إفطار رمضان — فنادق ومطاعم",
    },
  },
  "modest-fashion": {
    emoji: "👗",
    name: {
      en: "Modest Fashion",
      ko: "모디스트 패션",
      th: "แฟชั่นมุสลิม",
      zh: "保守时尚",
      ja: "モデスト ファッション",
      ar: "أزياء محتشمة",
    },
    tagline: {
      en: "Hijab, abaya, and modest clothing stores",
      ko: "히잡, 아바야, 모디스트 의류 매장",
      th: "ร้านขายฮิญาบ อาบายา และเสื้อผ้ามุสลิม",
      zh: "头巾、长袍和保守服装店",
      ja: "ヒジャブ、アバヤ、モデスト ウェア",
      ar: "متاجر حجاب وعباءات وملابس محتشمة",
    },
  },
  "muslim-attractions": {
    emoji: "🎢",
    name: {
      en: "Muslim-Friendly Attractions",
      ko: "무슬림 친화 관광지",
      th: "สถานที่ท่องเที่ยวสำหรับมุสลิม",
      zh: "穆斯林友好景点",
      ja: "ムスリム フレンドリー 観光地",
      ar: "معالم سياحية صديقة للمسلمين",
    },
    tagline: {
      en: "Family-friendly attractions with prayer facilities",
      ko: "기도 시설 있는 가족 친화 관광지",
      th: "สถานที่ท่องเที่ยวครอบครัวพร้อมห้องละหมาด",
      zh: "带礼拜设施的家庭友好景点",
      ja: "礼拝施設のある家族向け観光地",
      ar: "معالم عائلية مع مرافق للصلاة",
    },
  },
  "muslim-driver": {
    emoji: "🚗",
    name: {
      en: "Muslim Driver Services",
      ko: "무슬림 운전기사",
      th: "บริการคนขับมุสลิม",
      zh: "穆斯林司机服务",
      ja: "ムスリム ドライバー サービス",
      ar: "خدمات سائقين مسلمين",
    },
    tagline: {
      en: "Muslim private drivers and car rentals",
      ko: "무슬림 전용 기사 & 렌트카",
      th: "คนขับส่วนตัวมุสลิมและเช่ารถ",
      zh: "穆斯林专属司机和租车",
      ja: "ムスリム専属ドライバー＆レンタカー",
      ar: "سائقون خاصون مسلمون وتأجير سيارات",
    },
  },
  "muslim-friendly-spa": {
    emoji: "🧖",
    name: {
      en: "Muslim-Friendly Spas",
      ko: "무슬림 친화 스파",
      th: "สปาสำหรับมุสลิม",
      zh: "穆斯林友好水疗",
      ja: "ムスリム フレンドリー スパ",
      ar: "منتجعات صحية صديقة للمسلمين",
    },
    tagline: {
      en: "Women-only spas with female therapists",
      ko: "여성전용 스파 — 여성 테라피스트",
      th: "สปาผู้หญิงล้วน — เทอราพิสต์หญิง",
      zh: "纯女性水疗 — 女性治疗师",
      ja: "女性専用スパ — 女性セラピスト",
      ar: "منتجعات نسائية فقط — معالجات نساء",
    },
  },
  "muslim-wedding": {
    emoji: "💒",
    name: {
      en: "Muslim Wedding Venues",
      ko: "무슬림 결혼식 장소",
      th: "สถานที่จัดงานแต่งงานมุสลิม",
      zh: "穆斯林婚礼场地",
      ja: "ムスリム ウェディング会場",
      ar: "قاعات أعراس مسلمة",
    },
    tagline: {
      en: "Halal wedding venues with prayer & separation",
      ko: "할랄 결혼식장 — 기도 & 성별 분리",
      th: "สถานที่จัดงานแต่งฮาลาล พร้อมห้องละหมาดและแยกชาย-หญิง",
      zh: "清真婚礼场地 — 提供礼拜与男女分隔",
      ja: "ハラール ウェディング — 礼拝室・男女別席対応",
      ar: "قاعات أعراس حلال — صلاة وفصل بين الجنسين",
    },
  },
  "prayer-room": {
    emoji: "🤲",
    name: {
      en: "Prayer Rooms",
      ko: "기도실",
      th: "ห้องละหมาด",
      zh: "礼拜室",
      ja: "礼拝室",
      ar: "غرف الصلاة",
    },
    tagline: {
      en: "Public prayer rooms — malls, airports, stations",
      ko: "공공 기도실 — 쇼핑몰, 공항, 역",
      th: "ห้องละหมาดสาธารณะ — ห้างฯ สนามบิน สถานี",
      zh: "公共礼拜室 — 商场、机场、车站",
      ja: "公共の礼拝室 — モール、空港、駅",
      ar: "غرف صلاة عامة — مولات، مطارات، محطات",
    },
  },
  "southern-muslim": {
    emoji: "🏝️",
    name: {
      en: "Southern Thailand Muslim Guide",
      ko: "남부 태국 무슬림 가이드",
      th: "ไกด์มุสลิมภาคใต้ของไทย",
      zh: "泰国南部穆斯林指南",
      ja: "南タイ ムスリム ガイド",
      ar: "دليل المسلمين جنوب تايلاند",
    },
    tagline: {
      en: "Pattani, Yala, Narathiwat, Songkhla — muslim south",
      ko: "빠따니, 얄라, 나라티왓, 송클라 — 무슬림 남부",
      th: "ปัตตานี ยะลา นราธิวาส สงขลา — ภาคใต้มุสลิม",
      zh: "北大年、惹拉、那拉提瓦、宋卡 — 穆斯林南部",
      ja: "パッタニー、ヤラー、ナラーティワート、ソンクラー",
      ar: "باتاني، يالا، ناراثيوات، سونغكلا — الجنوب المسلم",
    },
  },
  "arabic-school": {
    emoji: "📚",
    name: {
      en: "Arabic & Islamic Schools",
      ko: "아랍어 & 이슬람 학교",
      th: "โรงเรียนสอนภาษาอาหรับและอิสลาม",
      zh: "阿拉伯语和伊斯兰学校",
      ja: "アラビア語＆イスラム学校",
      ar: "مدارس عربية وإسلامية",
    },
    tagline: {
      en: "Arabic language & Quran schools in Thailand",
      ko: "태국 내 아랍어 & 꾸란 학교",
      th: "โรงเรียนสอนภาษาอาหรับและอัลกุรอานในประเทศไทย",
      zh: "泰国阿拉伯语和古兰经学校",
      ja: "タイのアラビア語＆クルアーン学校",
      ar: "مدارس عربية وقرآنية في تايلاند",
    },
  },
};

export function nicheName(niche: Niche, lang: Lang): string {
  return NICHE_META[niche].name[lang] || NICHE_META[niche].name.en;
}

export function nicheTagline(niche: Niche, lang: Lang): string {
  return NICHE_META[niche].tagline[lang] || NICHE_META[niche].tagline.en;
}
