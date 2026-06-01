// City-specific wiki content. EN canonical. Districts/areas list is the most
// editorially valuable piece — it's what muslim travelers actually need
// (which neighborhoods to base in, where to pray, where to find halal food).
//
// All copy is fact-checked editorial; nothing AI-generated. Add more
// languages as we get them translated.

import type { Lang } from "./types";

export interface CityContent {
  slug: string;
  intro: string;                                              // 1-2 paragraphs framing the city
  muslimPopulationHint: string;                               // demographic context
  keyAreas: { name: string; description: string }[];          // top neighborhoods / districts
  travelTips: { title: string; body: string }[];              // practical tips
  notableMosques: string[];                                   // famous mosque names (text only — places.json has the rest)
}

export const CITY_CONTENT: Record<string, CityContent> = {
  bangkok: {
    slug: "bangkok",
    intro:
      "Bangkok is the densest muslim-friendly metropolis in Southeast Asia outside Kuala Lumpur. With roughly 250,000-400,000 muslim residents and several distinct halal districts, the city offers something for every traveler — from GCC visitors looking for shisha lounges along Sukhumvit Soi 3, to Malaysian families settling around Bang Rak's hotel cluster, to Indonesian and Pakistani residents anchored near Klong San and Phra Khanong. CICOT (Central Islamic Council of Thailand) is headquartered here, and a majority of Thailand's certified halal restaurants are within a one-hour radius of Sukhumvit.",
    muslimPopulationHint:
      "Roughly 4-5% of Bangkok's metropolitan population identifies as muslim. Concentrated in Bang Rak, Klong Toey, Phra Khanong, Min Buri, Lat Krabang.",
    keyAreas: [
      { name: "Sukhumvit Soi 3 (Soi Arab / Nana)", description: "Bangkok's main Middle Eastern street. Lebanese, Egyptian, Syrian restaurants, shawarma stalls, shisha lounges, halal supermarkets. Walk from BTS Nana." },
      { name: "Indra Square (Ratchaprarop)",       description: "Indo-Pakistani-Bangladeshi enclave. Halal grocery, biryani houses, sari shops, hijab boutiques. Walking distance from Pratunam." },
      { name: "Bang Rak",                          description: "Historic muslim area near Saphan Taksin. Foundation Mosque, halal kitchens, easy access to the Chao Phraya pier." },
      { name: "Phra Khanong",                      description: "Local muslim community with halal Thai eateries, mosques, and family-run halal bakeries. BTS Phra Khanong." },
      { name: "Sukhumvit Soi 11",                  description: "Modern halal Indian dining cluster — newer, upscale, expat-favored." },
      { name: "Khlong San (Thonburi side)",        description: "Across the river. Less touristy, mosque-anchored neighborhoods, deeply local halal food." },
    ],
    travelTips: [
      { title: "Prayer rooms in malls",     body: "Most major malls now have a quiet musholla — Siam Paragon, Terminal 21, EmQuartier, CentralWorld, ICONSIAM. Ask at the customer service desk if not signposted." },
      { title: "Friday Jum'ah",              body: "The biggest Jum'ah crowd is at Foundation Mosque (Charoen Krung 90), Darul Aman (Sukhumvit), and Haroon Mosque (Bang Rak). Plan around 12:15-13:15 traffic." },
      { title: "Airport prayer rooms",       body: "Suvarnabhumi (BKK) has dedicated multi-faith prayer rooms on both Concourse D (departures) and the arrivals level. Don Mueang (DMK) has a small musholla near gate 3." },
      { title: "Shisha legality",            body: "Personal shisha is legal but heavily restricted in indoor venues. Soi 3 / Soi 11 lounges generally operate openly." },
      { title: "Alcohol-free hotels",        body: "Filter by 'muslim-friendly' in our directory — most halal-marked hotels have an alcohol-free mini bar, prayer kit on request, and qibla marking on the ceiling." },
    ],
    notableMosques: ["Foundation Mosque (Mas­yid Jam'iyatul Islam)", "Darul Aman Mosque", "Haroon Mosque", "Indonesian Mosque (Phra Khanong)", "Kuwait Mosque"],
  },

  phuket: {
    slug: "phuket",
    intro:
      "Phuket has one of the strongest muslim communities in southern Thailand — roughly 30% of the island's permanent population is muslim, concentrated in inland and coastal villages outside the main tourist beaches. This means halal food is genuinely abundant, not a tourist add-on, and most resorts can arrange muslim-friendly amenities on request because their kitchen staff already work within halal protocols. Patong is the partying hub (avoid for family travel); Karon, Kata Noi, Surin, and the Old Town are far more muslim-friendly.",
    muslimPopulationHint:
      "~30-35% of Phuket province is muslim. Centered in Thalang, Pa Khlok, and inland villages. Karon and Kata neighborhoods have visible mosques.",
    keyAreas: [
      { name: "Phuket Old Town",        description: "Sino-Portuguese architecture + several halal eateries. Walking-distance from Saturday night market. Easier than Patong for families." },
      { name: "Karon Beach",             description: "Karon has a sizable muslim resident population and several halal restaurants within walking distance of the beach. Multiple muslim-friendly hotels." },
      { name: "Kata / Kata Noi",         description: "Quieter than Patong. Family-friendly. Several halal restaurants accessible by tuk-tuk. Fewer alcohol bars." },
      { name: "Surin Beach",             description: "More upscale, residential. Some halal-friendly resorts and a Saturday halal beach market in season." },
      { name: "Bang Tao",                description: "Beachfront resort area. Several large hotels have muslim-friendly amenities. Multiple halal restaurants in the residential streets." },
      { name: "Phuket Town Saturday market", description: "Walking street with halal food vendors clearly marked. Best place to eat halal Thai street food on the island." },
    ],
    travelTips: [
      { title: "Avoid Patong for family travel", body: "Patong is the alcohol/nightlife district. Karon, Kata, and Surin are more family-appropriate." },
      { title: "Airport prayer room",            body: "Phuket International Airport (HKT) has a dedicated prayer room in the departures terminal — ask at any information desk." },
      { title: "Halal seafood",                  body: "Andaman seafood is generally halal-friendly (seafood is naturally halal), but the cooking process matters — confirm wok cleaning if separation from non-halal is critical." },
      { title: "Friday Jum'ah",                  body: "Mosques in Karon and Thalang area are accessible to tourists. Larger mosques in Phuket Town serve the Friday congregation." },
    ],
    notableMosques: ["Mukarrom Mosque (Karon)", "Bang Tao Mosque", "Sun Suk Mosque (Surin)", "Phuket Town Central Mosque"],
  },

  krabi: {
    slug: "krabi",
    intro:
      "Krabi province has a long-standing muslim community — roughly 40% of its population is muslim, the highest concentration outside the deep south. Halal food is the default in most local restaurants, not a special request. Andaman seafood is abundant; many fishing boat operators are muslim. Ao Nang is the main tourist anchor but Krabi Town itself is more authentic and offers far more halal options.",
    muslimPopulationHint:
      "~40% of Krabi province is muslim. Concentrated in Krabi Town, Klong Muang, and inland villages.",
    keyAreas: [
      { name: "Krabi Town",        description: "The capital — heavily muslim, halal restaurants on almost every street. Walking-friendly night market with halal seafood." },
      { name: "Ao Nang",           description: "Main beach resort area. Several halal restaurants and muslim-friendly hotels. Pier for Phi Phi / Railay day trips." },
      { name: "Klong Muang",       description: "Quieter beach north of Ao Nang. Several halal beachfront restaurants and family-friendly resorts." },
      { name: "Railay Beach",      description: "Accessible only by long-tail boat. Limited halal options on Railay itself; better to eat in Krabi Town before crossing." },
    ],
    travelTips: [
      { title: "Long-tail boat operators",  body: "Many boat captains are muslim — book directly at the pier for cheaper rates and often more flexibility on prayer breaks." },
      { title: "Phi Phi day trips",          body: "Bring halal-packed lunches from Krabi Town. Phi Phi restaurants are largely non-halal." },
      { title: "Friday Jum'ah",              body: "Krabi Town Central Mosque is walking distance from most hotels and accommodates visitors." },
    ],
    notableMosques: ["Krabi Town Central Mosque", "Klong Muang Mosque", "Ao Nang Community Mosque"],
  },

  "chiang-mai": {
    slug: "chiang-mai",
    intro:
      "Chiang Mai's muslim community is small but deeply rooted — historically Yunnanese muslim ('Chin Haw') traders who settled along the trade route from southern China. The community lives mostly around Chang Khlan and the Night Bazaar. Halal options are concentrated in this area; outside the Old City moat, halal food becomes scarcer. The cool climate, slower pace, and excellent halal khao soi (the muslim Yunnanese version is the original) make Chiang Mai a strong muslim travel choice in the north.",
    muslimPopulationHint:
      "~1-2% of Chiang Mai province. Concentrated near Chang Khlan road and the Night Bazaar area.",
    keyAreas: [
      { name: "Chang Khlan Road (Night Bazaar area)", description: "Muslim quarter. Several halal khao soi shops, Yunnanese muslim restaurants, halal grocers. Walking distance from Tha Phae Gate." },
      { name: "Old City (within the moat)",            description: "Tourist hub. Limited halal options inside, but many tour operators here arrange muslim-friendly itineraries." },
      { name: "Nimmanhaemin",                          description: "Trendy expat district. A few halal cafes and modern muslim-friendly bistros (verify per visit)." },
    ],
    travelTips: [
      { title: "Halal khao soi",          body: "Try the muslim Yunnanese khao soi at Khao Soi Islam (Chang Khlan) — the dish's historical origin. Different from the popular non-halal khao soi found in tourist menus." },
      { title: "Friday Jum'ah",            body: "Chang Khlan Mosque is the main Friday prayer location. Smaller mosques in Sankamphaeng and San Sai also accommodate." },
      { title: "Elephant sanctuaries",     body: "Most reputable sanctuaries accommodate halal meal requests with 24h notice. Confirm before booking." },
    ],
    notableMosques: ["Chang Khlan Mosque (An-Nur)", "Ban Ho Mosque", "Sankamphaeng Mosque"],
  },

  "hat-yai": {
    slug: "hat-yai",
    intro:
      "Hat Yai is the largest city in southern Thailand and a major muslim transit hub between Bangkok and Malaysia. The city's population includes significant Thai-Chinese, Thai-muslim, and ethnic Malay communities, making halal food genuinely widespread rather than a niche category. Most Malaysian visitors enter Thailand via Hat Yai by train or by road from Penang/Kedah, so the city's hospitality industry caters heavily to muslim travelers.",
    muslimPopulationHint:
      "~25-35% of greater Hat Yai / Songkhla area is muslim. Concentrated in Yala/Pattani direction.",
    keyAreas: [
      { name: "Hat Yai Central Market",   description: "Halal dim sum, halal Thai street food, halal Malaysian-style nasi lemak. Walkable from the train station." },
      { name: "Lee Garden Plaza area",     description: "Hotel concentration. Several muslim-friendly mid-range hotels." },
      { name: "Songkhla Old Town (30 min north)", description: "Historic Sino-Portuguese district with muslim heritage. Halal restaurants and mosques." },
    ],
    travelTips: [
      { title: "Cross-border travel",     body: "Hat Yai is the natural stopover for travelers going to/from Penang and Kuala Lumpur. KTM trains and shared vans run frequently." },
      { title: "Halal dim sum",            body: "Hat Yai's signature — try Khao Tom Pla Kim Yong (halal Thai-Chinese morning porridge) or muslim-run dim sum stalls in the central market." },
      { title: "Friday Jum'ah",            body: "Central Mosque (Mas­yid An-Nur, Phra Phuthi Bart road) is the main Friday gathering." },
    ],
    notableMosques: ["Hat Yai Central Mosque (An-Nur)", "Klong Wah Mosque", "Songkhla Central Mosque (Klong Hae)"],
  },

  pattaya: {
    slug: "pattaya",
    intro:
      "Pattaya is increasingly popular with GCC and Russian-muslim travelers, especially families. While Pattaya is famous for nightlife, several beach-front and Jomtien-side hotels run muslim-friendly programs — alcohol-free wings, prayer kits on request, halal kitchen confirmation. Halal restaurants concentrate near Walking Street's quieter ends and along Soi 13/1. Jomtien is far more muslim-family-appropriate than central Pattaya.",
    muslimPopulationHint:
      "Low local muslim population (<2%), but heavy muslim tourist concentration from GCC and Russia.",
    keyAreas: [
      { name: "Jomtien Beach",            description: "Quieter than central Pattaya. Several muslim-friendly hotels and a small concentration of halal restaurants. Better for families." },
      { name: "Pattaya Soi 13/1 area",     description: "Cluster of halal Middle Eastern restaurants and small mosques. Walking distance from Beach Road." },
      { name: "Naklua (north of Pattaya)", description: "Calmer, residential. Several halal seafood restaurants." },
    ],
    travelTips: [
      { title: "Avoid central Pattaya",   body: "Walking Street and Soi 6 are the nightlife districts. Best avoided for family travel — choose Jomtien or Naklua instead." },
      { title: "Friday Jum'ah",            body: "Pattaya Mosque (Soi 13/1) is the main gathering, accommodates tourists." },
      { title: "Beach activities",         body: "Coral Island (Koh Larn) day trips can be arranged with halal-packed meals from Naklua restaurants." },
    ],
    notableMosques: ["Darul Iman Mosque (Pattaya)", "Naklua Mosque"],
  },

  "hua-hin": {
    slug: "hua-hin",
    intro:
      "Hua Hin is Thailand's royal beach town and one of the more refined coastal destinations for muslim families. The atmosphere is calmer than Pattaya, more upscale than Phuket Karon, and increasingly favored by GCC travelers and Singaporean Malay families. Halal options have grown significantly — most beachfront resorts now offer some form of muslim-friendly accommodation if requested in advance.",
    muslimPopulationHint:
      "Low local muslim population, growing muslim tourism. Strong GCC, Malaysian, Singaporean visitor base.",
    keyAreas: [
      { name: "Hua Hin Beach (central)",  description: "Main beach. Several beachfront hotels offer halal kitchen or prayer-kit-on-request packages." },
      { name: "Cicada Market area",        description: "Weekend night market with several halal food stalls. Good for evening browsing." },
      { name: "Khao Takiab",               description: "Quieter southern beach. Some halal restaurants and family-friendly resorts." },
    ],
    travelTips: [
      { title: "Royal sites",             body: "Klai Kangwon Palace area is respectful — dress conservatively, which aligns naturally with muslim travelers' preferences." },
      { title: "Friday Jum'ah",            body: "Hua Hin Mosque (Soi 88 area) serves Friday prayer for the small local community." },
      { title: "Train option",             body: "Hua Hin is reachable by train from Bangkok (~4h) — more pleasant than the bus/van options." },
    ],
    notableMosques: ["Hua Hin Mosque (An-Nur)", "Cha-am Mosque (30min north)"],
  },

  "koh-samui": {
    slug: "koh-samui",
    intro:
      "Koh Samui has a small but established muslim presence, mostly in the village of Bang Rak (north shore) and Hua Thanon (east coast). Several beachfront resorts offer muslim-friendly amenities. The island is more upscale than Phuket — quieter beaches, fewer party districts, easier to find calm halal-friendly accommodation.",
    muslimPopulationHint:
      "Small local muslim community (~3-5% of permanent islanders). Hua Thanon is the main muslim village.",
    keyAreas: [
      { name: "Chaweng Beach",         description: "Main tourist beach. Several halal restaurants but also significant nightlife. Halal-friendly resort cluster on quieter ends." },
      { name: "Bophut Fisherman's Village", description: "Walkable old-town district. A few halal cafes and several muslim-friendly mid-range hotels." },
      { name: "Hua Thanon",            description: "Muslim village on the east coast. Authentic halal Thai food, local mosques. Easy day-trip to nearby Lamai." },
      { name: "Maenam Beach",          description: "Quieter family-friendly beach. Some muslim-friendly resorts." },
    ],
    travelTips: [
      { title: "Halal seafood at Hua Thanon", body: "The fishing village offers fresh, naturally halal seafood prepared in muslim-owned restaurants." },
      { title: "Friday Jum'ah",                body: "Hua Thanon Mosque is the main Friday prayer location. Smaller mosques exist in Bang Rak village." },
      { title: "Avoid full moon party",        body: "The famous party is on neighboring Koh Phangan — Koh Samui itself is calmer." },
    ],
    notableMosques: ["Hua Thanon Mosque", "Bang Rak Mosque"],
  },

  "ko-lanta": {
    slug: "ko-lanta",
    intro:
      "Ko Lanta is a muslim-majority island — roughly 80% of permanent residents are muslim, mostly ethnic Urak Lawoi (sea gypsies) and Thai-Malay. This makes it one of Thailand's most genuinely muslim-friendly beach destinations: halal food is the default, mosques anchor most villages, and tourism is calmer than Phuket or Krabi. The island stretches long and narrow, with quieter beaches on the southern end.",
    muslimPopulationHint:
      "~80% of Ko Lanta's permanent population is muslim. Mosques in every village.",
    keyAreas: [
      { name: "Saladan (north port)",    description: "Main pier and town. Halal restaurants throughout. Most accommodation booking happens here." },
      { name: "Klong Dao Beach",          description: "Northernmost beach. Family-friendly, several muslim-friendly resorts. Walkable to Saladan." },
      { name: "Long Beach (Phra Ae)",     description: "Long stretch of calm beach. Mix of resorts, several halal restaurants." },
      { name: "Old Town (east side)",     description: "Historic Chinese-muslim trading port. Heritage walking street, halal restaurants, fishing village atmosphere." },
    ],
    travelTips: [
      { title: "Genuinely halal default",    body: "On Ko Lanta you usually don't need to ask — most restaurants are halal by default. Confirm only for non-village resort restaurants." },
      { title: "Friday Jum'ah",               body: "Every village has a mosque. Largest are Saladan Central, Long Beach Mosque, and Old Town Mosque." },
      { title: "Slow pace",                   body: "Ko Lanta is intentionally low-key — no big nightclubs, fewer English-speaking tourists, calmer atmosphere. Best for travelers seeking quiet." },
    ],
    notableMosques: ["Saladan Central Mosque", "Long Beach Mosque", "Old Town Mosque"],
  },

  pattani: {
    slug: "pattani",
    intro:
      "Pattani is the historical capital of Patani — the centuries-old Malay-muslim sultanate that predates the modern Thai-Malay border. The province is overwhelmingly muslim (~85%) and culturally Malay, with its own dialect, food traditions, and architecture. Travel here is genuinely different from anywhere else in Thailand: halal is universal, Malay is widely spoken, and the food traditions show clear Malaysian-Indonesian influences. The province has experienced security concerns historically — check current travel advisories — but the cultural depth is unmatched.",
    muslimPopulationHint:
      "~85% of Pattani province is muslim, ethnically Malay. Sister provinces Yala and Narathiwat are similar.",
    keyAreas: [
      { name: "Pattani Town",          description: "Provincial capital. Historic Krue Se Mosque area. Halal food everywhere — no need to filter." },
      { name: "Yala Town (1h south)",   description: "Cultural center of southern muslim Thailand. Cleaner, calmer than Pattani Town. Famous for kopi (coffee culture)." },
      { name: "Narathiwat",            description: "Coastal southernmost province. Beautiful beaches, Malay fishing villages, halal seafood." },
      { name: "Tak Bai",                description: "Historic riverside town near the Malaysian border. Several mosques and traditional Malay houses." },
    ],
    travelTips: [
      { title: "Travel advisory check",  body: "Check your government's current travel advisory before visiting. Most areas are entirely safe but periodically reviewed." },
      { title: "Krue Se Mosque",          body: "The unfinished 16th-century mosque is a national historic landmark and the cultural symbol of Patani Malay heritage." },
      { title: "Local food traditions",   body: "Try nasi kerabu (blue rice), khao yam (southern rice salad), and the kopi tradition — distinct from central Thai cuisine." },
      { title: "Language",                body: "Bahasa Melayu (Yawi dialect) is widely spoken alongside Thai. English is less common — basic Bahasa or Thai helps." },
    ],
    notableMosques: ["Krue Se Mosque (Pattani)", "Central Pattani Mosque", "Yala Central Mosque", "Narathiwat Central Mosque"],
  },
};

export function getCityContent(slug: string): CityContent | null {
  return CITY_CONTENT[slug] ?? null;
}

// Stub for future localization — currently EN canonical only.
export function localizeCity(content: CityContent, _lang: Lang): CityContent {
  return content;
}
