import type { Lang } from "./types";

export const SUPPORTED_LANGS: Lang[] = ["en", "ko", "th", "zh", "ja", "ar"];
export const DEFAULT_LANG: Lang = "en";

export const SITE = {
  origin: "https://salaamthailand.com",
  name: "Salaam Thailand",
  tagline: {
    en: "Thailand's verified halal & muslim-friendly directory. No paid promotion.",
    ko: "검증된 태국 할랄 & 무슬림 친화 디렉토리. 광고 거품 X.",
    th: "ไดเรกทอรีฮาลาลและมุสลิมในไทย ตรวจสอบจาก 6 แหล่ง ไม่มีโปรโมชันที่จ่ายเงิน",
    zh: "泰国清真与穆斯林友好独立指南，来自6个来源的验证，不含付费推广。",
    ja: "タイのハラール・ムスリムフレンドリー独立ガイド。6つの情報源で検証、有料宣伝なし。",
    ar: "السلام تايلاند — الدليل المستقل للحلال والمسلمين، تم التحقق من 6 مصادر، بدون ترويج مدفوع.",
  },
} as const;

export const T = {
  // Islamic greeting (universal Arabic + transliteration + translation per lang)
  greeting_arabic: {
    en: "ٱلسَّلَامُ عَلَيْكُمْ", ko: "ٱلسَّلَامُ عَلَيْكُمْ", th: "ٱلسَّلَامُ عَلَيْكُمْ",
    zh: "ٱلسَّلَامُ عَلَيْكُمْ", ja: "ٱلسَّلَامُ عَلَيْكُمْ", ar: "ٱلسَّلَامُ عَلَيْكُمْ",
  },
  greeting_translit: {
    en: "Assalāmu ʿAlaykum", ko: "앗살라무 알라이쿰", th: "อัสซาลามู อะลัยกุม",
    zh: "色兰 (Sàilán)", ja: "アッサラーム アライクム", ar: "",
  },
  greeting_meaning: {
    en: "Peace be upon you",
    ko: "당신에게 평화가 있기를",
    th: "ขอความสันติจงประสบแด่ท่าน",
    zh: "愿你平安",
    ja: "あなたに平安あれ",
    ar: "السلام عليكم",
  },

  // navigation
  nav_explore: { en: "Explore", ko: "탐색", th: "สำรวจ", zh: "探索", ja: "探索", ar: "استكشف" },
  nav_about: { en: "About", ko: "소개", th: "เกี่ยวกับ", zh: "关于", ja: "概要", ar: "حول" },

  // landing hero
  hero_title: {
    en: "Salaam Thailand. Halal you can trust.",
    ko: "Salaam Thailand. 믿을 수 있는 할랄.",
    th: "Salaam Thailand. ฮาลาลที่ไว้วางใจได้",
    zh: "Salaam Thailand. 值得信赖的清真。",
    ja: "Salaam Thailand. 信頼できるハラール。",
    ar: "السلام تايلاند. حلال يمكنك الوثوق به.",
  },
  hero_subtitle: {
    en: "Halal restaurants. Muslim-friendly hotels. Tours. Mosques. Clinics. Beauty. Verified across 6 independent sources.",
    ko: "할랄 식당, 무슬림 친화 호텔, 투어, 모스크, 병원, 뷰티 — 6개 독립 소스로 검증.",
    th: "ร้านอาหารฮาลาล โรงแรมมุสลิม ทัวร์ มัสยิด คลินิก บิวตี้ — ตรวจสอบจาก 6 แหล่งอิสระ",
    zh: "清真餐厅、穆斯林友好酒店、旅游、清真寺、诊所、美容 — 来自6个独立来源的验证。",
    ja: "ハラール レストラン、ムスリムフレンドリー ホテル、ツアー、モスク、クリニック、ビューティー — 6つの情報源で検証。",
    ar: "مطاعم حلال. فنادق صديقة للمسلمين. جولات. مساجد. عيادات. تجميل. تم التحقق من 6 مصادر مستقلة.",
  },

  // audience clarifier — appears below hero subtitle
  for_audience: {
    en: "🧳 Tourists  ·  🏠 Expats  ·  🇹🇭 Residents",
    ko: "🧳 여행자  ·  🏠 거주 외국인  ·  🇹🇭 현지인",
    th: "🧳 นักท่องเที่ยว  ·  🏠 ชาวต่างชาติพำนัก  ·  🇹🇭 คนไทย",
    zh: "🧳 游客  ·  🏠 外籍居民  ·  🇹🇭 本地居民",
    ja: "🧳 観光客  ·  🏠 在住外国人  ·  🇹🇭 タイ在住者",
    ar: "🧳 سياح  ·  🏠 مقيمون أجانب  ·  🇹🇭 المقيمون المحليون",
  },

  popular_picks: {
    en: "Popular picks",
    ko: "인기 검색",
    th: "ค้นหายอดนิยม",
    zh: "热门精选",
    ja: "人気の選択",
    ar: "الأكثر شعبية",
  },

  // multi-source pitch
  sources_pitch: {
    en: "Each place is cross-checked against Google · Reddit · Naver · Pantip · YouTube · Bookimed",
    ko: "각 장소는 구글 · Reddit · 네이버 · Pantip · 유튜브 · Bookimed에서 교차 검증",
    th: "แต่ละสถานที่ตรวจสอบจาก Google · Reddit · Naver · Pantip · YouTube · Bookimed",
    zh: "每个地点都经过 Google · Reddit · Naver · Pantip · YouTube · Bookimed 交叉验证",
    ja: "各スポットは Google · Reddit · Naver · Pantip · YouTube · Bookimed で相互検証",
    ar: "كل مكان تم التحقق منه عبر Google و Reddit و Naver و Pantip و YouTube و Bookimed",
  },

  // category section
  browse_categories: { en: "Browse categories", ko: "카테고리 둘러보기", th: "เรียกดูหมวดหมู่", zh: "浏览分类", ja: "カテゴリーを見る", ar: "تصفح الفئات" },
  see_all: { en: "See all", ko: "전체 보기", th: "ดูทั้งหมด", zh: "查看全部", ja: "すべて見る", ar: "عرض الكل" },
  places_count: { en: "places", ko: "곳", th: "แห่ง", zh: "处", ja: "件", ar: "أماكن" },

  // directory
  trust_score: { en: "Trust Score", ko: "신뢰 점수", th: "คะแนนความน่าเชื่อถือ", zh: "信任分数", ja: "信頼スコア", ar: "درجة الثقة" },
  filter_out_viral: {
    en: "Hide suspected ad/viral listings",
    ko: "광고/바이럴 의심 제외",
    th: "ซ่อนรายการที่สงสัยว่าเป็นโฆษณา",
    zh: "隐藏疑似广告/水军条目",
    ja: "広告/やらせ疑いを除外",
    ar: "إخفاء الإعلانات المشبوهة",
  },
  sort_by: { en: "Sort by", ko: "정렬", th: "เรียงตาม", zh: "排序", ja: "並び替え", ar: "ترتيب" },
  sort_trust: { en: "Trust Score", ko: "신뢰 점수", th: "คะแนน", zh: "信任分数", ja: "信頼スコア", ar: "درجة الثقة" },
  sort_reviews: { en: "Most reviewed", ko: "리뷰 많은 순", th: "รีวิวมากที่สุด", zh: "评论最多", ja: "レビュー数", ar: "الأكثر تقييمًا" },
  sort_rating: { en: "Highest rated", ko: "별점 높은 순", th: "คะแนนสูงสุด", zh: "评分最高", ja: "評価順", ar: "الأعلى تقييمًا" },
  search_ph: {
    en: "Search places, cities, categories…",
    ko: "장소·도시·카테고리 검색…",
    th: "ค้นหาสถานที่ เมือง หมวดหมู่…",
    zh: "搜索场所、城市、分类…",
    ja: "場所・都市・カテゴリーを検索…",
    ar: "ابحث عن أماكن، مدن، فئات…",
  },

  // filters
  filter_beginner: { en: "Beginner-friendly", ko: "초보 친화", th: "เหมาะกับมือใหม่", zh: "适合初学者", ja: "初心者向け", ar: "مناسب للمبتدئين" },
  filter_korean_friendly: { en: "Korean-friendly", ko: "한국어 가능", th: "รองรับเกาหลี", zh: "韩语友好", ja: "韓国語対応", ar: "يدعم الكورية" },
  filter_24h: { en: "Open 24h", ko: "24시간 운영", th: "เปิด 24 ชม.", zh: "24小时营业", ja: "24時間営業", ar: "مفتوح 24 ساعة" },
  price_band: { en: "Price", ko: "가격대", th: "ราคา", zh: "价格", ja: "価格", ar: "السعر" },
  price_budget: { en: "Budget", ko: "저렴", th: "ประหยัด", zh: "经济", ja: "格安", ar: "اقتصادي" },
  price_mid: { en: "Mid", ko: "중간", th: "ปานกลาง", zh: "中等", ja: "普通", ar: "متوسط" },
  price_premium: { en: "Premium", ko: "프리미엄", th: "พรีเมียม", zh: "高端", ja: "プレミアム", ar: "متميز" },
  price_luxury: { en: "Luxury", ko: "럭셔리", th: "หรูหรา", zh: "奢华", ja: "ラグジュアリー", ar: "فاخر" },

  // place detail
  patient_voices: { en: "What people actually said", ko: "진짜 사람들의 후기", th: "ผู้คนพูดว่ายังไง", zh: "真实评价", ja: "実際の声", ar: "ماذا قال الناس فعلاً" },
  faq: { en: "Frequently asked", ko: "자주 묻는 질문", th: "คำถามที่พบบ่อย", zh: "常见问题", ja: "よくある質問", ar: "أسئلة شائعة" },
  hours: { en: "Hours", ko: "운영시간", th: "เวลาทำการ", zh: "营业时间", ja: "営業時間", ar: "ساعات العمل" },
  price_range: { en: "Price range", ko: "가격대", th: "ช่วงราคา", zh: "价格范围", ja: "価格帯", ar: "نطاق السعر" },

  // CTAs
  cta_book_klook: { en: "Book on Klook", ko: "Klook 예약", th: "จองบน Klook", zh: "Klook 预订", ja: "Klookで予約", ar: "احجز عبر Klook" },
  cta_book_viator: { en: "Book on Viator", ko: "Viator 예약", th: "จองบน Viator", zh: "Viator 预订", ja: "Viatorで予約", ar: "احجز عبر Viator" },
  cta_book_gyg: { en: "Book on GetYourGuide", ko: "GetYourGuide 예약", th: "จองบน GetYourGuide", zh: "GetYourGuide 预订", ja: "GetYourGuideで予約", ar: "احجز عبر GetYourGuide" },
  cta_book_agoda: { en: "Find on Agoda", ko: "Agoda 검색", th: "หาบน Agoda", zh: "Agoda 查找", ja: "Agodaで探す", ar: "ابحث على Agoda" },
  cta_view_map: { en: "View on Google Maps", ko: "구글 맵에서 보기", th: "ดูบน Google Maps", zh: "Google 地图查看", ja: "Google マップで見る", ar: "عرض على خرائط جوجل" },

  // sources (badges)
  source_google: { en: "Google", ko: "구글", th: "Google", zh: "Google", ja: "Google", ar: "جوجل" },
  source_reddit: { en: "Reddit", ko: "Reddit", th: "Reddit", zh: "Reddit", ja: "Reddit", ar: "Reddit" },
  source_naver: { en: "Naver", ko: "네이버", th: "Naver", zh: "Naver", ja: "Naver", ar: "نيفر" },
  source_pantip: { en: "Pantip", ko: "Pantip", th: "Pantip", zh: "Pantip", ja: "Pantip", ar: "Pantip" },
  source_youtube: { en: "YouTube", ko: "유튜브", th: "YouTube", zh: "YouTube", ja: "YouTube", ar: "يوتيوب" },
  source_bookimed: { en: "Bookimed", ko: "Bookimed", th: "Bookimed", zh: "Bookimed", ja: "Bookimed", ar: "Bookimed" },
  source_website: { en: "Official site", ko: "공식 사이트", th: "เว็บไซต์ทางการ", zh: "官网", ja: "公式サイト", ar: "الموقع الرسمي" },

  // category page status
  coming_soon: { en: "Coming soon", ko: "준비 중", th: "เร็วๆ นี้", zh: "即将推出", ja: "近日公開", ar: "قريبًا" },
  coming_soon_msg: {
    en: "This category is currently being verified across our 6 sources. Check back soon.",
    ko: "이 카테고리는 6개 소스에서 현재 검증 중입니다. 곧 다시 확인해주세요.",
    th: "หมวดหมู่นี้กำลังตรวจสอบจาก 6 แหล่ง โปรดกลับมาดูใหม่",
    zh: "此分类正在通过6个来源进行验证，敬请期待。",
    ja: "このカテゴリーは現在6つの情報源で検証中です。もう少しお待ちください。",
    ar: "يتم التحقق من هذه الفئة حاليًا عبر 6 مصادر. عد قريبًا.",
  },
  no_matches: { en: "No matches", ko: "결과 없음", th: "ไม่พบรายการ", zh: "没有匹配", ja: "該当なし", ar: "لا توجد نتائج" },
  try_remove_filters: {
    en: "Try removing some filters.",
    ko: "필터를 일부 해제해 보세요.",
    th: "ลองลบตัวกรองบางตัวออก",
    zh: "尝试移除一些筛选条件。",
    ja: "フィルターをいくつか外してみてください。",
    ar: "حاول إزالة بعض المرشحات.",
  },
  reset: { en: "Reset", ko: "초기화", th: "ล้าง", zh: "重置", ja: "リセット", ar: "إعادة تعيين" },
  all_label: { en: "All", ko: "전체", th: "ทั้งหมด", zh: "全部", ja: "すべて", ar: "الكل" },

  // landing
  top_picks: { en: "Top picks", ko: "추천", th: "แนะนำ", zh: "精选", ja: "おすすめ", ar: "الاختيارات" },
  score_pitch_title: {
    en: "How we score every place",
    ko: "모든 장소를 어떻게 점수화하는지",
    th: "เราให้คะแนนแต่ละสถานที่อย่างไร",
    zh: "我们如何为每个地点评分",
    ja: "各スポットのスコア算出方法",
    ar: "كيف نقيم كل مكان",
  },
  score_pitch_blurb: {
    en: "Every Trust Score combines independent signals. No place can buy a higher rank — the formula is public.",
    ko: "신뢰 점수는 독립적인 신호들을 결합합니다. 어떤 장소도 순위를 살 수 없습니다 — 공식은 공개되어 있습니다.",
    th: "คะแนนความน่าเชื่อถือทุกคะแนนรวมจากสัญญาณอิสระ ไม่มีสถานที่ใดซื้ออันดับได้ — สูตรเปิดเผยต่อสาธารณะ",
    zh: "每个信任分数综合独立信号。没有任何地方可以购买更高排名 — 公式是公开的。",
    ja: "信頼スコアは独立した信号を組み合わせます。順位は買えません — 算出式は公開されています。",
    ar: "كل درجة ثقة تجمع إشارات مستقلة. لا يمكن لأي مكان شراء ترتيب أعلى — الصيغة عامة.",
  },

  // place detail
  book_or_inquire: { en: "Book / Inquire", ko: "예약 / 문의", th: "จอง / สอบถาม", zh: "预订 / 咨询", ja: "予約 / お問い合わせ", ar: "احجز / استفسر" },
  affiliate_disclaimer: {
    en: "Affiliate links — we may earn a commission. Trust Score is computed before any commercial relationship.",
    ko: "제휴 링크 — 수수료를 받을 수 있습니다. 신뢰 점수는 상업 관계와 무관하게 산정됩니다.",
    th: "ลิงก์พาร์ทเนอร์ — เราอาจได้รับค่าคอมมิชชั่น คะแนนคำนวณก่อนความสัมพันธ์ทางการค้า",
    zh: "联盟链接 — 我们可能赚取佣金。信任分数在任何商业关系之前计算。",
    ja: "アフィリエイトリンク — 手数料を得る場合があります。信頼スコアは商業関係の前に計算されます。",
    ar: "روابط تابعة — قد نحصل على عمولة. درجة الثقة تحسب قبل أي علاقة تجارية.",
  },
  photos_label: { en: "Photos", ko: "사진", th: "ภาพถ่าย", zh: "照片", ja: "写真", ar: "صور" },
  community_discussions: {
    en: "Community discussions",
    ko: "커뮤니티 토론",
    th: "การสนทนาในชุมชน",
    zh: "社区讨论",
    ja: "コミュニティの議論",
    ar: "نقاشات المجتمع",
  },
  community_blurb: {
    en: "Unfiltered conversations from Reddit, Pantip (TH), and Naver (KR) — independent perspectives that complement Google reviews.",
    ko: "Reddit, Pantip(태국), Naver(한국)의 필터링되지 않은 대화 — 구글 리뷰를 보완하는 독립적인 시각.",
    th: "บทสนทนาที่ไม่กรองจาก Reddit, Pantip และ Naver — มุมมองอิสระที่เสริมรีวิว Google",
    zh: "来自 Reddit、Pantip（泰国）和 Naver（韩国）的未过滤对话 — 补充 Google 评论的独立视角。",
    ja: "Reddit、Pantip（タイ）、Naver（韓国）の未加工の会話 — Googleレビューを補完する独立した視点。",
    ar: "محادثات غير مفلترة من Reddit و Pantip و Naver — وجهات نظر مستقلة تكمل تقييمات Google.",
  },
  mentions_in_community: {
    en: "Mentions in community discussions",
    ko: "커뮤니티에서 언급된 곳",
    th: "การกล่าวถึงในชุมชน",
    zh: "社区讨论中的提及",
    ja: "コミュニティでの言及",
    ar: "ذكر في نقاشات المجتمع",
  },
  mentions_blurb: {
    en: "Threads where this place's name appears. Independent voices, not curated reviews.",
    ko: "이 장소가 언급된 스레드들. 큐레이션된 리뷰가 아닌 독립적인 목소리.",
    th: "เธรดที่กล่าวถึงสถานที่นี้ เสียงอิสระที่ไม่ผ่านการคัดสรร",
    zh: "提及此地的讨论。独立声音，非筛选评论。",
    ja: "この場所が登場するスレッド。キュレーションされていない独立した声。",
    ar: "مواضيع تظهر فيها اسم هذا المكان. أصوات مستقلة، ليست تقييمات منسقة.",
  },
  contact_links: {
    en: "Contact & links",
    ko: "연락처 & 링크",
    th: "ติดต่อและลิงก์",
    zh: "联系方式与链接",
    ja: "連絡先・リンク",
    ar: "اتصل والروابط",
  },
  address_label: { en: "Address", ko: "주소", th: "ที่อยู่", zh: "地址", ja: "住所", ar: "العنوان" },
  phone_label: { en: "Phone", ko: "전화", th: "โทรศัพท์", zh: "电话", ja: "電話", ar: "هاتف" },
  website_label: { en: "Website", ko: "웹사이트", th: "เว็บไซต์", zh: "网站", ja: "ウェブサイト", ar: "موقع" },
  back_to_all: {
    en: "All categories",
    ko: "전체 카테고리",
    th: "หมวดหมู่ทั้งหมด",
    zh: "全部分类",
    ja: "全カテゴリー",
    ar: "كل الفئات",
  },
  low_signal_warn: {
    en: "Low signal: high rating but few reviews — could be paid promotion. Treat with caution.",
    ko: "신호 부족: 평점은 높지만 리뷰가 적음 — 유료 홍보일 수 있습니다. 주의 필요.",
    th: "สัญญาณต่ำ: คะแนนสูงแต่รีวิวน้อย — อาจเป็นโปรโมชันที่จ่ายเงิน ระมัดระวัง",
    zh: "信号低：评分高但评论少 — 可能是付费推广。请谨慎。",
    ja: "シグナル弱：評価は高いがレビューが少ない — 有料宣伝の可能性。注意。",
    ar: "إشارة منخفضة: تقييم عالٍ لكن مراجعات قليلة — قد يكون دعاية مدفوعة. كن حذرًا.",
  },
  bookable_label: { en: "Bookable", ko: "예약 가능", th: "จองได้", zh: "可预订", ja: "予約可", ar: "متاح للحجز" },
  threads_scanned: { en: "threads scanned", ko: "스레드 스캔됨", th: "เธรดที่สแกน", zh: "条讨论已扫描", ja: "スレッドをスキャン", ar: "موضوع تم مسحه" },
  matches_of: { en: "matches of", ko: "/", th: "จาก", zh: "/", ja: "/", ar: "من" },

  // footer
  footer_blurb: {
    en: "Verified Thai is an independent directory. Affiliate commissions from booking partners support the site but never influence Trust Scores.",
    ko: "Verified Thai는 독립 디렉토리입니다. 예약 파트너로부터 수수료를 받지만 신뢰 점수에 영향을 주지 않습니다.",
    th: "Verified Thai เป็นไดเรกทอรีอิสระ ค่าคอมมิชชั่นจากพาร์ทเนอร์ไม่ส่งผลต่อคะแนน",
    zh: "Verified Thai 是独立目录。来自预订合作伙伴的佣金支持网站运营，但不影响信任分数。",
    ja: "Verified Thaiは独立したディレクトリです。提携先からの手数料はサイト運営を支えますが、信頼スコアには影響しません。",
    ar: "Verified Thai دليل مستقل. عمولات الشركاء تدعم الموقع لكنها لا تؤثر على درجات الثقة.",
  },
} as const;

export function t<K extends keyof typeof T>(key: K, lang: Lang): string {
  const node = T[key] as Record<string, string>;
  return node[lang] ?? node[DEFAULT_LANG];
}
