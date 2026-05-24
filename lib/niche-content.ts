import type { Lang, Niche } from "./types";

// Wiki-style content per niche. EN is the canonical source; other langs
// fall back to EN where translation isn't provided. Content is structured
// so the category page can render it as an editorial-style guide and we
// can emit a FAQPage JSON-LD block for AEO.

export type LocalText = Partial<Record<Lang, string>>;

export interface NicheGuide {
  intro: LocalText;                                     // 1–2 paragraphs framing the niche
  criteria: { title: LocalText; body: LocalText }[];    // how to evaluate / what to look for
  citySpotlights: { city: string; body: LocalText }[];  // city-by-city orientation
  faqs: { q: LocalText; a: LocalText }[];               // FAQPage schema
}

export function ll(text: LocalText, lang: Lang): string {
  return text[lang] || text.en || "";
}

export const NICHE_GUIDES: Record<Niche, NicheGuide> = {
  // ============================================================
  "halal-food": {
    intro: {
      en: "Thailand serves halal food across two distinct streams: certified restaurants displaying the official CICOT (Central Islamic Council of Thailand) seal, and a much larger pool of self-declared muslim-friendly venues serving Indian, Pakistani, Middle Eastern, Malay, and modern fusion cuisines. Bangkok's Sukhumvit Soi 3 (Nana) and Phadungdao around Chinatown are the densest halal hotspots; Phuket Town, Krabi, and Hat Yai also concentrate strong halal scenes thanks to local Muslim populations. Beyond food, Thai halal certification covers ingredients, preparation, and even the kitchen layout — a CICOT mark is a stricter signal than a generic 'halal' sign.",
      ko: "태국의 할랄 음식은 크게 두 흐름입니다. 공식 CICOT(태국이슬람중앙회) 인증 식당, 그리고 인도/파키스탄/중동/말레이/현대 퓨전 요리를 제공하는 자체 무슬림 친화 식당들입니다. 방콕의 수쿰빗 소이3(나나)와 차이나타운 인근 파둥다오가 가장 밀집된 할랄 핫스팟이며, 푸켓 타운, 끄라비, 핫야이도 현지 무슬림 인구 덕분에 할랄 씬이 강합니다. CICOT 마크는 단순한 '할랄' 표시보다 훨씬 엄격한 신호입니다 — 재료, 조리, 주방 구조까지 검증합니다.",
      ar: "تقدم تايلاند الطعام الحلال عبر تيارين متميزين: المطاعم المعتمدة التي تعرض ختم CICOT الرسمي (المجلس الإسلامي المركزي لتايلاند)، وعدد أكبر بكثير من الأماكن الصديقة للمسلمين التي تقدم المأكولات الهندية والباكستانية والشرق أوسطية والمالاوية. سوكومفيت سوي 3 (نانا) في بانكوك وفادونغداو حول الحي الصيني هي أكثف نقاط الحلال؛ بوكيت تاون وكرابي وهات ياي تركز أيضًا مشاهد حلال قوية. علامة CICOT إشارة أكثر صرامة من علامة 'حلال' عامة — فهي تشمل المكونات والتحضير وحتى تخطيط المطبخ.",
      th: "อาหารฮาลาลในไทยแบ่งเป็นสองสาย: ร้านที่ได้รับการรับรอง CICOT (สำนักงานคณะกรรมการกลางอิสลามแห่งประเทศไทย) อย่างเป็นทางการ และร้านมุสลิม-เฟรนด์ลีจำนวนมากที่ขายอาหารอินเดีย ปากีสถาน ตะวันออกกลาง มาเลย์ และฟิวชั่นสมัยใหม่ สุขุมวิทซอย 3 (นานา) และพาดุงดาวรอบไชน่าทาวน์ในกรุงเทพคือจุดศูนย์รวมฮาลาลที่หนาแน่นที่สุด ภูเก็ตทาวน์ กระบี่ และหาดใหญ่ก็มีร้านฮาลาลแน่นแฟ้นเช่นกัน",
    },
    criteria: [
      {
        title: { en: "CICOT certification", ko: "CICOT 인증", ar: "شهادة CICOT" },
        body: {
          en: "The gold standard. Issued by the Central Islamic Council of Thailand after inspecting ingredients, suppliers, kitchen layout, staff handling, and storage. Certificates carry an expiry date and a unique ID; you can verify on halal.or.th. CICOT-certified venues are also accepted by Malaysia (JAKIM) and Indonesia (MUI) under bilateral recognition agreements — important for travelers from GCC, Malaysia, and Indonesia.",
          ko: "황금 표준. 태국이슬람중앙회가 재료/공급망/주방 구조/직원 핸들링/보관까지 검증 후 발급합니다. 인증서에는 만료일과 고유 ID 가 있으며 halal.or.th 에서 확인 가능. 말레이시아 JAKIM, 인도네시아 MUI 와의 상호 인정으로 GCC, 동남아 무슬림에게도 인정됩니다.",
        },
      },
      {
        title: { en: "Muslim-owned vs Muslim-friendly", ko: "무슬림 소유 vs 무슬림 친화" },
        body: {
          en: "Muslim-owned restaurants are generally safest — entire kitchen is halal, no cross-contamination with non-halal stocks. Muslim-friendly venues (especially hotels) may have halal-only sections within a mixed kitchen; ask about separate utensils, oil, and prep surfaces. Indian and Pakistani restaurants in Sukhumvit are nearly always Muslim-owned.",
        },
      },
      {
        title: { en: "Cuisine cluster", ko: "음식 종류별 클러스터" },
        body: {
          en: "Bangkok concentrates by cuisine: Soi 3 / Nana = Arabic, Lebanese, Egyptian, Turkish, kebab, shawarma; Phadungdao (Chinatown) = Pakistani, Indian, biryani; Pratunam = Indonesian, Malay; Phra Khanong = Indian Muslim. Most non-Thai halal cuisines cluster within 500m of a mosque.",
        },
      },
      {
        title: { en: "Price band", ko: "가격대" },
        body: {
          en: "Budget Indian/Pakistani plates run ฿80–฿180 (~$2–5). Lebanese/Arab mid-tier ฿250–฿500 ($7–14). Hotel halal fine dining (Centara, Avani, Anantara) ฿600–฿2,000+ ($17–55). Iftar buffets during Ramadan: ฿800–฿2,500/person.",
        },
      },
    ],
    citySpotlights: [
      {
        city: "Bangkok",
        body: {
          en: "Sukhumvit Soi 3 (Nana) — Arabic / Middle Eastern dense cluster, 30+ restaurants in a single street. Foodland Supermarket halal section opposite. Phadungdao (Chinatown) — Pakistani biryani belt + Halal Restaurant since 1949. Pratunam — Indonesian and Malay home cooking. Phra Khanong — long-running Indian Muslim establishments. Indra Square — daytime halal canteen attached to the mosque.",
          ko: "수쿰빗 소이3(나나) — 아랍/중동 식당 30개 이상 밀집. Foodland 마트 할랄 코너 맞은편. 파둥다오(차이나타운) — 파키스탄 비르야니 거리 + 1949년 개업한 Halal Restaurant. 프라투남 — 인도네시아/말레이 가정식. 프라카농 — 오래된 인도 무슬림 식당들. 인드라 스퀘어 — 모스크 부속 낮시간 할랄 식당.",
        },
      },
      {
        city: "Phuket",
        body: {
          en: "Phuket Town has the largest Muslim population on the island. Halal seafood, Roti shops, and Nasi Kandar joints concentrate around the old quarter. Patong and Karon beach areas have hotel-attached halal options aimed at GCC tourists. Look for the CICOT-certified Bismillah and Al Madinah groups.",
        },
      },
      {
        city: "Krabi",
        body: {
          en: "Strong Malay-Muslim community. Ao Nang town has a small but reliable halal scene led by family-run restaurants. Many beach resorts now offer halal kitchen on request — booking in advance is key during peak GCC season (Jan–Feb).",
        },
      },
      {
        city: "Hat Yai",
        body: {
          en: "Southern Thailand, just 1h from Malaysian border. Muslim-majority city in patches — Roti Mata bird tea, Tom Yum halal, and Malay-style restaurants. Daily flights to Bangkok make this the cheapest 'halal weekend' from KL or Penang.",
        },
      },
    ],
    faqs: [
      {
        q: { en: "Is street food in Thailand halal?", ko: "태국 길거리 음식은 할랄인가요?", ar: "هل طعام الشارع في تايلاند حلال؟" },
        a: {
          en: "Most street food in Thailand is NOT halal — pork is common in noodle soups, fried rice, and som tam dressings (fish sauce often includes shrimp paste). Look for stalls displaying the CICOT seal or operating near mosques (Indra Square, Phadungdao, Indra Bangkok). Vegetarian Thai food is also generally safe if the cook avoids fish sauce.",
          ko: "대부분의 태국 길거리 음식은 할랄이 아닙니다 — 면 국물, 볶음밥, 솜땀 드레싱에 돼지고기와 새우장이 흔합니다. CICOT 인증 마크가 있는 노점이나 모스크 근처(인드라 스퀘어, 파둥다오)를 찾으세요.",
        },
      },
      {
        q: { en: "What does the CICOT seal look like?" },
        a: {
          en: "A green circle with Arabic and Thai script reading 'الحلال' / 'ฮาลาล' along with the council emblem (a green crescent). Real seals always include a certificate number — restaurants without a number visible are likely uncertified.",
        },
      },
      {
        q: { en: "Are Thai restaurants near mosques automatically halal?" },
        a: {
          en: "No — proximity is a hint, not a guarantee. Always check the certificate or ask. That said, in dense Muslim neighborhoods (Bang Rak, Klong Toey, Phra Khanong, Indra Square), 80%+ of food vendors operate halal because the local customer base demands it.",
        },
      },
      {
        q: { en: "Can I find halal Thai cuisine, not just imported foods?" },
        a: {
          en: "Yes. Bismillah Restaurant (Bangkok), Yana Halal (multi-branch), and Khao Niaow Mamuang halal stalls serve halal Tom Yum, Pad Thai, Khao Mok Gai (Thai biryani), and Mango Sticky Rice. CICOT-certified Thai cuisine is a growing segment as GCC tourism has tripled in 5 years.",
        },
      },
      {
        q: { en: "What about during Ramadan?" },
        a: {
          en: "Most halal restaurants stay open during fasting hours but adjust serving times (closed roughly 6am–6pm, then iftar at maghrib, then suhoor at 3–5am). Major hotels (Marriott, Hilton, Sheraton) host iftar buffets for ~฿1,200–฿2,500. Reserve 2 weeks ahead during the last 10 days of Ramadan.",
        },
      },
      {
        q: { en: "Are halal restaurants in Thailand zabihah?" },
        a: {
          en: "Most CICOT-certified meat in Thailand comes from CICOT-certified slaughterhouses using hand-slaughter (dhabihah) facing qibla. Imported meat from Brazil, Australia, and India arrives with halal certification from JAKIM, MUI, or DHA. The CICOT seal on the restaurant transitively covers the meat supply chain.",
        },
      },
      {
        q: { en: "How is alcohol handled in halal Thai venues?" },
        a: {
          en: "CICOT certification requires zero alcohol service on the premises. Restaurants serving alcohol cannot hold CICOT certification, even if their food is technically halal. Muslim-friendly hotels often have a separate halal restaurant that is alcohol-free while the rest of the hotel serves alcohol.",
        },
      },
      {
        q: { en: "Do halal restaurants in Bangkok cater to Korean Muslim travelers?" },
        a: {
          en: "Increasingly yes. Several Sukhumvit Soi 3 restaurants and major hotel halal kitchens now offer Korean menus or have Korean-speaking staff. Look for the 🇰🇷 KO badge on our listings — that means we've verified Korean-language signals from reviews or staff.",
        },
      },
    ],
  },

  // ============================================================
  "muslim-hotel": {
    intro: {
      en: "Muslim-friendly hotels in Thailand range from dedicated halal hotels (Al Meroz, Nasa Vegas) where every room faces qibla and the entire kitchen is CICOT-certified, to mainstream luxury chains (Anantara, Centara, Banyan Tree) offering muslim-friendly rooms with prayer mats, qibla indicators, and halal-on-request room service. The Crescent Rating system (an international muslim-tourism standard) classifies hotels from 1 to 7 — most listed properties on this guide are Crescent 5+ or self-verified equivalents.",
      ko: "태국의 무슬림 친화 호텔은 두 갈래입니다. 첫째, 모든 방이 키블라를 향하고 주방 전체가 CICOT 인증된 전용 할랄 호텔(Al Meroz, Nasa Vegas 등). 둘째, 기도매트/키블라 표시/룸서비스 할랄 옵션을 제공하는 메인스트림 럭셔리 체인(Anantara, Centara, Banyan Tree). Crescent Rating 시스템(국제 무슬림 관광 표준)이 호텔을 1~7등급으로 분류하며, 본 가이드의 대부분은 Crescent 5+ 수준입니다.",
      ar: "تتراوح الفنادق الصديقة للمسلمين في تايلاند من الفنادق الحلال المخصصة (Al Meroz، Nasa Vegas) حيث تواجه كل غرفة القبلة والمطبخ بأكمله معتمد من CICOT، إلى السلاسل الفاخرة الرئيسية (Anantara، Centara، Banyan Tree) التي تقدم غرفًا صديقة للمسلمين مع سجاد الصلاة ومؤشرات القبلة والحلال عند الطلب.",
    },
    criteria: [
      {
        title: { en: "Prayer infrastructure", ko: "기도 시설" },
        body: {
          en: "True muslim-friendly rooms include: qibla arrow on the ceiling/wall, prayer mat in the closet, copy of the Qur'an, and ablution facilities (wudu bidet or attached small spray). Dedicated halal hotels often provide a separate prayer room with prayer schedule clock for guests; mainstream hotels may direct you to the nearest mosque (we list distance and Friday prayer hours).",
        },
      },
      {
        title: { en: "Halal kitchen / room service" },
        body: {
          en: "Two models. Full halal: entire hotel kitchen is CICOT-certified, all minibar contents halal, no alcohol on premises (Al Meroz, Yana Hotel). Partial halal: separate halal kitchen for breakfast and room service, alcohol available elsewhere (most 5-star chains). Always confirm at booking — booking.com filters are not always accurate.",
        },
      },
      {
        title: { en: "Crescent Rating tier" },
        body: {
          en: "1–3 = basic prayer mat / qibla on request. 4–5 = halal breakfast + designated prayer area. 6 = full muslim-friendly with halal restaurant + separate prayer room + no alcohol in mini bar. 7 = comprehensive Sharia-compliant including women-only floors and separate facilities.",
        },
      },
      {
        title: { en: "Family-friendly features" },
        body: {
          en: "GCC and Southeast Asian Muslim families often travel in groups of 6–10. Look for: family suites (2–3 bedrooms), kids' clubs with halal snack options, women-only pool hours, private villas with separate male/female lounges. Phuket's Movenpick, Banyan Tree, and Trisara are popular family choices.",
        },
      },
    ],
    citySpotlights: [
      {
        city: "Bangkok",
        body: {
          en: "Al Meroz Bangkok (Ramkhamhaeng) — the only fully Sharia-compliant 4-star hotel in the city, CICOT-certified throughout. Nasa Vegas Hotel (Pratunam) — budget option, halal breakfast included. Centara Watergate Pavillion — central, muslim-friendly rooms on request. The Davis Bangkok — long-time GCC favorite in Sukhumvit. Anantara Riverside — luxury, separate halal kitchen.",
        },
      },
      {
        city: "Phuket",
        body: {
          en: "Movenpick Resort & Spa Karon — best 5-star for muslim families, no alcohol in restaurants on request. Banyan Tree Phuket — villas with private pools (women-only privacy). Anantara Mai Khao — adults-only halal-on-request. Centara Grand West Sands — family resort with halal breakfast.",
        },
      },
      {
        city: "Krabi",
        body: {
          en: "Ao Nang area has the densest muslim-friendly options. Centara Grand Beach Resort Krabi — halal kitchen, large family rooms. Aonang Princeville — local muslim-owned. Phra Nang Inn — boutique, Friday prayer next door.",
        },
      },
    ],
    faqs: [
      {
        q: { en: "Do hotels in Thailand provide prayer mats automatically?" },
        a: {
          en: "Dedicated halal hotels (Al Meroz, Yana, Nasa Vegas) do. Mainstream 5-star chains usually provide on request — call ahead or note in your booking. Some Centara, Anantara, and Marriott properties have begun stocking prayer mats by default following the 2024 GCC tourism surge.",
        },
      },
      {
        q: { en: "Can I get a hotel with a women-only pool in Thailand?" },
        a: {
          en: "Yes — Banyan Tree Phuket, Sri Panwa, and several Trisara villas offer private pools per villa. For public women-only pool hours, Phuket's Marriott Naiyang and Crowne Plaza Phuket Panwa schedule female-only swim sessions twice weekly.",
        },
      },
      {
        q: { en: "How do I verify a hotel is truly muslim-friendly before booking?" },
        a: {
          en: "Cross-check three signals: (1) Crescent Rating score on crescentrating.com, (2) reviews from MuslimTravels subreddit or TripAdvisor filtered by 'family with kids' from GCC countries, (3) direct email to the hotel asking 'do you provide qibla direction, prayer mat, and halal breakfast?' — response within 24h is a good signal.",
        },
      },
      {
        q: { en: "Are halal hotels in Bangkok cheaper or more expensive?" },
        a: {
          en: "Roughly the same price band. Al Meroz (4-star fully halal) is ~฿2,500/night, comparable to Centara Watergate. Premium muslim-friendly options (Banyan Tree, Anantara) command standard luxury pricing. The 'halal premium' usually shows up in dining (alcohol-free bar) rather than room rate.",
        },
      },
      {
        q: { en: "What about during the haram month / Ramadan?" },
        a: {
          en: "Halal hotels run special suhoor / iftar packages during Ramadan with revised meal hours. Mainstream 5-star chains in Bangkok and Phuket also run iftar buffets ฿1,200–฿2,500/person; non-residents welcome. Book 2 weeks ahead for the last 10 days.",
        },
      },
      {
        q: { en: "Is there a recommended muslim-friendly hotel for honeymoon?" },
        a: {
          en: "Phuket: Trisara, Sri Panwa, or Iniala Beach House for ultra-luxury private villas with halal-on-request. Krabi: Rayavadee. Koh Samui: Six Senses Samui. All offer total privacy (no shared pools/beaches) which is the key concern for muslim honeymoon travelers.",
        },
      },
    ],
  },

  // ============================================================
  "halal-tour": {
    intro: {
      en: "Halal-friendly tours in Thailand have surged 4× since 2022 as GCC, Malaysian, Indonesian, and Korean Muslim tourism grew. Operators now bundle private vehicles, halal meal stops, prayer breaks aligned with the day's salah times, and muslim-friendly accommodations. The core selling point is logistics: a regular Phi Phi day tour can leave you with no halal lunch options on the boat — a halal tour pre-coordinates this. Pricing runs 20–40% above standard tours because of the bespoke arrangement.",
      ko: "할랄 친화 투어는 2022년 이후 4배 증가했습니다 — GCC, 말레이시아, 인도네시아, 한국 무슬림 관광이 급성장했기 때문입니다. 사업자들은 전용 차량, 할랄 식사 정차, 살라트 시간에 맞춘 기도 휴식, 무슬림 친화 숙소를 패키지로 묶습니다. 핵심 가치는 로지스틱스 — 일반 피피섬 데이 투어에서는 할랄 점심 옵션이 없을 수 있는데, 할랄 투어는 이를 미리 조율합니다. 가격은 표준 투어보다 20–40% 높습니다.",
    },
    criteria: [
      {
        title: { en: "Private vs group" },
        body: {
          en: "Private muslim tours (8–12 PAX max) almost always cost more but guarantee halal meal pickup, qibla-direction-marked stops, and women-only swim time at island stops. Group muslim tours (Klook 'Muslim-Friendly Phi Phi' product, GetYourGuide) are 30% cheaper but coordination is less tight.",
        },
      },
      {
        title: { en: "Halal meal logistics" },
        body: {
          en: "Best operators provide a CICOT-certified packed lunch (sandwich/biryani/rice box) or coordinate with a CICOT-certified restaurant at the stop. Avoid operators that just say 'we'll find halal food on the way' — at remote islands or jungle sites you won't.",
        },
      },
      {
        title: { en: "Prayer schedule" },
        body: {
          en: "Day tours should pause for Zuhr (~12:30) and Asr (~3:30) at locations with clean prayer space — a beach pavilion, a temple's exterior alcove, or a mosque on route. Multi-day tours need accommodation near a mosque for Maghrib and Isha.",
        },
      },
      {
        title: { en: "Booking channel" },
        body: {
          en: "Klook, GetYourGuide, and Viator have 50+ 'muslim-friendly' tours. Direct booking with operators like Crescent Tours Thailand or Muslim Travel Asia offers customization (e.g., add Tom Yum Halal stop, women-only photo op) but no instant cancellation.",
        },
      },
    ],
    citySpotlights: [
      {
        city: "Phuket / Phi Phi",
        body: {
          en: "Most popular muslim tour cluster. Day trips to Phi Phi, Maya Bay, Khai Islands include halal lunch. Speedboat tours: ฿2,500–฿4,500/PAX with halal box; private muslim charter: ฿28,000–฿45,000/boat (up to 12 PAX). Best to book 5+ days ahead Jan–April.",
        },
      },
      {
        city: "Bangkok",
        body: {
          en: "Bangkok muslim day tours combine Grand Palace exterior + Floating Market (Damnoen Saduak) + halal lunch. Klook's 'Muslim-Friendly Bangkok' product is ฿1,500/PAX. Private tour with Arabic-speaking guide: ฿4,500/PAX. Ramadan iftar tours combining sunset boat ride + iftar at Asiatique: ~฿2,800.",
        },
      },
      {
        city: "Chiang Mai",
        body: {
          en: "Lower muslim tourism but growing. Elephant sanctuary visits (Elephant Nature Park) are vegetarian / halal-compatible. Doi Suthep temple visit + halal lunch in old city. Multi-day muslim Chiang Mai tours often combine elephant + cooking class (halal version) + night market.",
        },
      },
    ],
    faqs: [
      {
        q: { en: "Can I add a mosque visit to a Bangkok day tour?" },
        a: {
          en: "Yes — many private muslim tours include a stop at Haroon Mosque or Indra Square Mosque for Jum'ah (Friday) prayer. Specify when booking. Group tours usually don't accommodate this unless the timing aligns naturally.",
        },
      },
      {
        q: { en: "Are halal tours suitable for kids?" },
        a: {
          en: "Most popular tours (Phi Phi, Safari World, Floating Market) work well for families with kids 5+. Private muslim tours can arrange kid-friendly halal snacks and slower pacing. Phuket Aquarium and Sirinat National Park are gentle introductory options.",
        },
      },
      {
        q: { en: "Do tour boats provide qibla direction?" },
        a: {
          en: "Better operators provide a compass and pre-set qibla bearing card. On Phi Phi day trips, mid-day prayer can be done on the boat deck — the captain announces a 15-min stop. Confirm at booking.",
        },
      },
      {
        q: { en: "What about photography during tours — modesty concerns?" },
        a: {
          en: "Muslim-only tour groups allow more freedom for women to remove hijab for photos at private beach stops. Some operators provide women-only photo time at popular spots like Maya Bay (using booking timeslots). Mixed-group tours don't have this flexibility.",
        },
      },
      {
        q: { en: "How early should I book muslim tours in Thailand?" },
        a: {
          en: "Standard season (May–Dec): 3–5 days ahead. Peak GCC season (Jan–April): 10–14 days ahead. Ramadan and Eid weeks: 3 weeks ahead. Private boat charters: 2 weeks ahead minimum.",
        },
      },
    ],
  },

  // ============================================================
  "mosque": {
    intro: {
      en: "Thailand has over 4,000 registered mosques. Bangkok alone hosts 180+ — concentrated in Klong Toey, Phra Khanong, Bang Rak (Haroon Mosque), Indra Square, and Bang Luang. The largest concentration nationally is in the four southern provinces — Pattani, Yala, Narathiwat, and Songkhla — where Muslims form the majority. Most mosques welcome non-Muslim visitors outside prayer times for respectful viewing. Friday prayer (Jum'ah) typically starts 12:30–13:00; arrive 30 min early.",
      ko: "태국에는 4,000개 이상의 등록된 모스크가 있습니다. 방콕만 180개 이상 — 끌롱또이, 프라카농, 방락(Haroon Mosque), 인드라 스퀘어, 방루앙에 밀집해 있습니다. 전국 최대 무슬림 인구가 있는 빠따니, 얄라, 나라티왓, 송클라 등 남부 4개 주에 가장 밀집합니다. 대부분 모스크는 예배 시간 외에는 비무슬림 방문자를 환영합니다 (정중한 복장 필수). 금요예배(주마)는 보통 12:30–13:00 시작 — 30분 일찍 도착 권장.",
      ar: "في تايلاند أكثر من 4,000 مسجد مسجل. بانكوك وحدها تضم أكثر من 180 — تتركز في كلونغ توي، فرا خانونغ، بانغ راك (مسجد هارون)، إندرا سكوير، وبانغ لوانغ. أكبر تركيز على المستوى الوطني هو في المقاطعات الجنوبية الأربع — فطاني، يالا، ناراثيوات، وسونغكلا — حيث يشكل المسلمون الأغلبية.",
    },
    criteria: [
      {
        title: { en: "Friday prayer (Jum'ah) timing" },
        body: {
          en: "Most Bangkok mosques start the khutbah at 12:45 with prayer at 13:00. Southern mosques (Pattani, Hat Yai) often start earlier at 12:15. Always confirm by calling — major mosques publish hours, smaller community mosques don't.",
        },
      },
      {
        title: { en: "Wudu (ablution) facilities" },
        body: {
          en: "All registered mosques have wudu stations. Larger Bangkok mosques (Haroon, Indra Square, Tonson) have heated water and separate male/female sections. Smaller community mosques have basic facilities — bring your own towel and prayer mat.",
        },
      },
      {
        title: { en: "Visitor etiquette" },
        body: {
          en: "Remove shoes at entrance. Cover knees, shoulders, and (women) hair. Most mosques provide a loaner abaya at the entrance. Don't enter the main prayer hall during prayer unless joining — observe from the rear or visitors' gallery. Photography may be restricted in the main hall.",
        },
      },
      {
        title: { en: "Halal food nearby" },
        body: {
          en: "Major mosques (Haroon, Indra, Phadungdao) always have halal food stalls within 200m. The mosque cafeteria or weekend market is a reliable, cheap option (฿40–฿120/meal). After Jum'ah is particularly bustling.",
        },
      },
    ],
    citySpotlights: [
      {
        city: "Bangkok",
        body: {
          en: "Haroon Mosque (Bang Rak) — oldest in Bangkok, 1837, accessible from Saphan Taksin BTS, Jum'ah ~13:00. Indra Square Mosque — adjacent to Pratunam market, large halal food court attached. Tonson Mosque (Sukhumvit) — central, modern facility, English/Arabic signage. Foundation of Islamic Centre (Klong Toey) — community center + mosque, near Queen Sirikit MRT.",
        },
      },
      {
        city: "Phuket",
        body: {
          en: "Phuket Town has 30+ small community mosques scattered. The Phuket Provincial Mosque (Phuket Town center) is the main administrative mosque. Mai Khao Mosque serves the airport area — useful for travelers with long layovers.",
        },
      },
      {
        city: "Krabi / Ao Nang",
        body: {
          en: "Ao Nang has a beachside mosque popular with tourists. Krabi Provincial Mosque (Krabi Town) handles administrative functions. Local family mosques dot the road to Phra Nang Beach.",
        },
      },
      {
        city: "Pattani / Yala / Narathiwat (Deep South)",
        body: {
          en: "Krue Se Mosque (Pattani) — 16th century, historic site. Pattani Central Mosque — provincial capital mosque. Yala Central Mosque, Narathiwat Central Mosque — large daily congregations. Travel advisories should be checked for the deep south; tourism here is sensitive but mosques themselves welcome respectful visitors.",
        },
      },
    ],
    faqs: [
      {
        q: { en: "Can non-Muslims enter mosques in Thailand?" },
        a: {
          en: "Yes — most mosques welcome respectful non-Muslim visitors outside prayer times. Cover shoulders/knees, remove shoes, women cover hair. Photography typically allowed in the courtyard but ask before photographing inside the prayer hall.",
        },
      },
      {
        q: { en: "Where is the nearest mosque to Suvarnabhumi Airport?" },
        a: {
          en: "Suvarnabhumi has a small prayer room (Muslim Prayer Room) in Concourse C, before immigration. Outside the airport, the closest mosque is Bangchak Mosque (~15 min by taxi). Don Mueang airport has a prayer room near gate 12.",
        },
      },
      {
        q: { en: "Are there English-speaking imams in Bangkok mosques?" },
        a: {
          en: "Yes — Haroon Mosque, Tonson Mosque, and Foundation of Islamic Centre have English-fluent staff for tourist questions. Larger Friday sermons are sometimes delivered in Thai + Arabic with English summary handouts.",
        },
      },
      {
        q: { en: "What's the dress code for women visiting Thai mosques?" },
        a: {
          en: "Long sleeves, long skirt or trousers, headscarf. Most mosques provide a loaner abaya at the entrance for tourists; no need to bring your own. Foot covering not required (you'll be barefoot inside).",
        },
      },
      {
        q: { en: "Can I make Friday prayer at a hotel instead?" },
        a: {
          en: "Jum'ah (Friday) prayer requires a congregation of at least 40 men and a khutbah — must be at a mosque, not a hotel room. Mainstream hotels close to mosques (within 1 km): Centara Watergate (300m to Indra Square), Pullman G (200m to Haroon), Davis (800m to Tonson).",
        },
      },
    ],
  },

  // ============================================================
  "halal-clinic": {
    intro: {
      en: "Thailand is a top-3 global medical tourism destination, and Bangkok has rapidly built muslim-friendly medical services to capture GCC and Southeast Asian patients. Bumrungrad, Samitivej, BNH, Bangkok Hospital, and Phyathai all offer: female-only doctor on request (for women's health), halal-only meal trays, prayer room access on-site, abaya-friendly examination gowns, and Arabic-speaking medical coordinators. Costs run 30–70% lower than Western or GCC equivalents while meeting JCI international standards.",
      ko: "태국은 세계 3대 의료관광 국가로, 방콕은 GCC 및 동남아 무슬림 환자를 위한 무슬림 친화 의료 서비스를 빠르게 구축했습니다. Bumrungrad, Samitivej, BNH, Bangkok Hospital, Phyathai 모두 다음을 제공합니다: 요청 시 여의사(여성 진료), 할랄 전용 식사 트레이, 원내 기도실, 아바야 친화 검사 가운, 아랍어 통역 의료 코디네이터. 비용은 서구나 GCC 대비 30–70% 저렴하며 JCI 국제 인증 기준을 충족합니다.",
    },
    criteria: [
      {
        title: { en: "Female doctor availability" },
        body: {
          en: "Top hospitals maintain a list of female specialists in OB-GYN, dermatology, IVF, plastic surgery, and general medicine. Pre-request through their International Patient Service (IPS) by email at least 3 days ahead. JCI-accredited hospitals (Bumrungrad, Samitivej) honor this consistently; smaller clinics may not.",
        },
      },
      {
        title: { en: "Halal meal program" },
        body: {
          en: "Inpatient halal trays: Bumrungrad, Samitivej, BNH, Bangkok Hospital all maintain dedicated halal kitchens, CICOT-certified, separate utensils. Outpatient cafeterias usually have a marked halal corner. Always confirm at admission — the nurse station has the food preference form.",
        },
      },
      {
        title: { en: "Prayer / wudu facilities" },
        body: {
          en: "Bumrungrad has a multi-faith chapel (Quiet Room) with qibla and prayer mats on the 5th floor. Samitivej Sukhumvit has a small prayer corner in the lobby. Bangkok Hospital has a dedicated muslim prayer room near radiology. Phyathai has limited facilities — confirm before booking.",
        },
      },
      {
        title: { en: "Insurance + accreditation" },
        body: {
          en: "All top hospitals are JCI-accredited (international gold standard). Cigna, Bupa, Allianz international plans accepted. GCC government referrals (UAE Ministry of Health, Saudi MoH) honored at Bumrungrad and Samitivej. Direct billing usually requires guarantee letter.",
        },
      },
    ],
    citySpotlights: [
      {
        city: "Bangkok",
        body: {
          en: "Bumrungrad International — most established muslim-friendly. Samitivej Sukhumvit — top OB-GYN and pediatric. BNH Hospital (Silom) — closer to muslim hotels like Centara Watergate. Bangkok Hospital HQ (Phetchaburi) — large complex, all specialties. Phyathai 2 — cardiology-strong. MedPark (Rama 4) — newest, ultra-modern.",
        },
      },
      {
        city: "Phuket",
        body: {
          en: "Bangkok Hospital Phuket — main international hospital on the island. Phuket International Hospital — strong on plastic surgery and wellness tourism. Both have halal meal options on request.",
        },
      },
      {
        city: "Chiang Mai",
        body: {
          en: "Chiangmai Ram Hospital — JCI-accredited, halal meal on request. Bangkok Hospital Chiang Mai — newer, full-service.",
        },
      },
    ],
    faqs: [
      {
        q: { en: "Can I request a female doctor in Bangkok hospitals?" },
        a: {
          en: "Yes. Bumrungrad, Samitivej, BNH, and Bangkok Hospital all maintain female doctor lists. Pre-arrange via their International Patient Service. For OB-GYN and dermatology, female specialists are nearly always available. For surgery and emergency, it's not always possible — confirm in advance.",
        },
      },
      {
        q: { en: "Are Thai hospital halal meals truly CICOT-certified?" },
        a: {
          en: "Bumrungrad, Samitivej Sukhumvit, BNH, and Bangkok Hospital HQ maintain CICOT-certified halal kitchens. Smaller hospital branches may use 'halal-style' food from an approved supplier without onsite CICOT certification. Always confirm at admission.",
        },
      },
      {
        q: { en: "What about during Ramadan — medication timing?" },
        a: {
          en: "Most major Bangkok hospitals adjust medication schedules around fasting hours during Ramadan if you inform IPS in advance. IV drips and some medications are allowed for medical necessity per fatwa from CICOT. Always discuss with both the treating doctor and your home imam.",
        },
      },
      {
        q: { en: "Does the hospital provide a separate room for visiting family?" },
        a: {
          en: "Yes — premium room categories (Royal Suite, VIP) include a separate lounge/sleeping area for family. Standard rooms have a single recliner for one companion. GCC patients usually book premium rooms for extended family stays.",
        },
      },
      {
        q: { en: "How much does typical muslim-friendly medical tourism cost?" },
        a: {
          en: "Indicative (Bumrungrad pricing, 2026): Heart bypass ~$25K (vs $100K US), Hip replacement ~$15K, IVF cycle ~$5K, Cosmetic dental (full mouth) ~$8K, Cosmetic surgery (face) ~$6K. Add ~10% for muslim-friendly room + halal meals + Arabic coordinator + airport transfer.",
        },
      },
    ],
  },

  // ============================================================
  "halal-beauty": {
    intro: {
      en: "Halal beauty in Thailand spans certified cosmetics (alcohol-free, no animal-derived ingredients), women-only salons and spas (popular with GCC clientele), and hijab-friendly hair stylists with private rooms. Brands like Wardah (Indonesia), Inika (Australia), and a growing list of Thai indie brands now carry CICOT certification. Salons catering specifically to muslim women have multiplied in Sukhumvit, Pratunam, and near major halal hotels.",
      ko: "태국의 할랄 뷰티는 인증된 화장품(알코올 무첨가, 동물성 무첨가), 여성 전용 살롱/스파(GCC 고객 인기), 그리고 개인실 갖춘 히잡 친화 헤어 스타일리스트로 나뉩니다. 와르다(인도네시아), Inika(호주), 그리고 늘어나는 태국 인디 브랜드들이 CICOT 인증을 보유합니다. 무슬림 여성 전용 살롱이 수쿰빗, 프라투남, 주요 할랄 호텔 근처에 늘고 있습니다.",
    },
    criteria: [
      {
        title: { en: "Halal certification on cosmetics" },
        body: {
          en: "Look for 'halal' or 'CICOT' on the box. Key ingredients to avoid (alcohol = ethanol > 0.1%, gelatin from porcine source, beeswax with questionable sourcing). MUI (Indonesia) and JAKIM (Malaysia) certifications are also widely accepted in Thailand.",
        },
      },
      {
        title: { en: "Women-only spas" },
        body: {
          en: "Fully women-only: no male staff anywhere in the facility, private treatment rooms with locking doors, separate entrance. Mixed spas with women-only sections: ladies' wing with female-only staff but shared lobby. Always confirm the model — many spas advertise 'women-friendly' which is not the same as women-only.",
        },
      },
      {
        title: { en: "Hijab-friendly salons" },
        body: {
          en: "Private rooms for hijab removal, female-only hair stylists, no walk-in male traffic. Some salons cater specifically to muslim brides with full bridal makeup + henna packages. Most are located near major muslim hotels (Al Meroz area, Pratunam, Sukhumvit Soi 3).",
        },
      },
      {
        title: { en: "Halal nail polish (breathable)" },
        body: {
          en: "Standard nail polish blocks water from skin → invalidates wudu. Breathable / wudu-friendly polishes (Inglot O2M, Tuesday in Love, 786 Cosmetics) allow water passage. Some Bangkok nail salons specifically stock these — confirm in advance.",
        },
      },
    ],
    citySpotlights: [
      {
        city: "Bangkok",
        body: {
          en: "Wardah Beauty Boutique — flagship Indonesian halal cosmetics, multiple Bangkok locations. Hijabi Beauty Bar (Sukhumvit) — women-only salon with private rooms. Al Meroz Hotel spa — women-only spa within the hotel, halal products only. Pratunam Wholesale Market — Indonesian/Malaysian halal cosmetics importers.",
        },
      },
      {
        city: "Phuket",
        body: {
          en: "Phuket Town has 2–3 women-only spas attached to muslim-friendly hotels. Movenpick Karon Spa offers female-only timeslots on Wednesdays. Smaller indie halal cosmetics shops in Old Phuket Town near the mosque district.",
        },
      },
    ],
    faqs: [
      {
        q: { en: "Are most Thai cosmetics halal?" },
        a: {
          en: "No — mainstream Thai brands (Mistine, Beauty Buffet, Snail White) generally contain alcohol-based ingredients. The CICOT-certified Thai indie scene is growing but still small. Indonesian (Wardah, Sariayu, Emina) and Malaysian (SimplySiti, Velvet Vanity) imports are widely available and reliably halal.",
        },
      },
      {
        q: { en: "Where can I get henna in Bangkok?" },
        a: {
          en: "Sukhumvit Soi 3 area has 4–5 henna artists catering to GCC and Indian Muslim clientele. Book ahead during Ramadan and Eid. Hijabi Beauty Bar and several Pratunam-area salons offer bridal henna packages.",
        },
      },
      {
        q: { en: "Are there fully women-only spas in Bangkok?" },
        a: {
          en: "Yes — Al Meroz Hotel Spa (within the muslim-friendly hotel), Hijabi Beauty Bar, and several small operators near Pratunam. Mainstream hotel spas (Anantara, Banyan Tree) offer women-only hours but not fully women-only.",
        },
      },
      {
        q: { en: "Can I get wudu-friendly nail polish in Thailand?" },
        a: {
          en: "Inglot O2M is the most widely available brand — sold at Inglot counters in Siam Paragon, EmQuartier, CentralWorld. Specialty halal salons stock Tuesday in Love and 786 Cosmetics on request.",
        },
      },
      {
        q: { en: "Is laser hair removal halal in Islam?" },
        a: {
          en: "Most contemporary scholars permit laser hair removal for permitted areas (legs, arms, underarms) by a female practitioner. The treatment itself doesn't break Islamic guidelines. Several Bangkok clinics (Apex Medical, Romrawin) offer female-only treatment rooms on request.",
        },
      },
    ],
  },
};
