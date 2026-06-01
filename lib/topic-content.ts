// Topic encyclopedia — 20 deep-dive articles on muslim-travel-Thailand
// subjects that don't fit a niche or a city. EN canonical. Editorial content
// (no AI generation) so we can claim factual integrity on every article.
//
// Each topic ships:
//   • intro      — 1 paragraph framing
//   • sections   — 3-5 h3-titled body paragraphs
//   • takeaways  — 3-4 bullet "what to remember"
//   • refs       — 2-4 external sources (cite via <Cite n={i}/>)

export interface TopicSection {
  heading: string;
  body: string;
}

export interface TopicRef {
  title: string;
  source?: string;
  url?: string;
  date?: string;
}

export interface TopicContent {
  slug: string;
  title: string;
  emoji: string;
  intro: string;
  sections: TopicSection[];
  takeaways: string[];
  refs: TopicRef[];
}

export const TOPIC_CONTENT: Record<string, TopicContent> = {
  // =================================================================
  "cicot-certification": {
    slug: "cicot-certification",
    title: "CICOT halal certification",
    emoji: "✅",
    intro:
      "The Central Islamic Council of Thailand (CICOT) is the country's only government-recognized halal certification body. A CICOT seal — a green diamond with Arabic script around 'halal' — is what distinguishes a venue that has passed a real audit from one that simply self-declares 'muslim-friendly'. Understanding the difference matters: CICOT-certified products are recognized by Malaysia's JAKIM and Indonesia's MUI under bilateral agreements, while self-declared 'muslim-friendly' labels carry no equivalent guarantee.",
    sections: [
      {
        heading: "What CICOT audits",
        body: "Certification covers the full supply chain — ingredient sourcing, supplier halal status, transportation, storage conditions, kitchen layout (separation from non-halal), staff handling protocols, and even cleaning agents. Restaurants are audited annually; manufacturers more frequently. Each certificate has a unique ID and an expiry date and is verifiable on halal.or.th.",
      },
      {
        heading: "CICOT vs. self-declared 'muslim-friendly'",
        body: "A 'muslim-friendly' label is marketing language. It can mean anything from 'we have a vegetarian menu' to 'we use halal chicken from a halal supplier'. CICOT means 'we passed an audit by a state-recognized authority within the last 12-24 months'. In Thailand both labels exist side by side; only one is legally substantiated.",
      },
      {
        heading: "International recognition",
        body: "Through bilateral MoUs, CICOT certification is accepted by Malaysia's JAKIM, Indonesia's MUI, Singapore's MUIS, and several GCC authorities. This means a CICOT-certified restaurant in Bangkok is considered halal-compliant by official bodies in those countries — important for tourists and for Thai food exports.",
      },
      {
        heading: "Why some good halal places skip certification",
        body: "Annual audit fees + the documentation burden mean some small family-run halal restaurants — especially in muslim-majority areas like Pattani or Krabi — don't bother with the certificate. The food can still be entirely halal. Our Trust Score blends the official certificate signal with cross-source community verification (Reddit threads, Naver blogs, Pantip discussions) precisely to surface these places.",
      },
    ],
    takeaways: [
      "Green diamond + Arabic 'halal' = the real certificate; verify cert ID on halal.or.th",
      "CICOT is recognized internationally (JAKIM / MUI / MUIS / GCC)",
      "'Muslim-friendly' alone is a marketing label, not an audit",
      "Uncertified family-run halal places can still be legitimate — check cross-source signals",
    ],
    refs: [
      { title: "Central Islamic Council of Thailand", source: "Official body", url: "https://www.halal.or.th/" },
      { title: "JAKIM Malaysia halal recognition list", source: "Government of Malaysia" },
      { title: "BPJPH Indonesia MUI certification body", source: "Government of Indonesia" },
    ],
  },

  // =================================================================
  "ramadan-in-thailand": {
    slug: "ramadan-in-thailand",
    title: "Ramadan in Thailand",
    emoji: "🌙",
    intro:
      "Ramadan in Thailand is a quieter, more accommodated experience than in muslim-majority countries — but the country has roughly 4-5 million muslim residents and a sizable annual GCC + Southeast-Asian muslim tourist flow, so iftar tables, Ramadan buffets, and special prayer schedules are easy to find in Bangkok, Phuket, Krabi, and the deep south. Restaurant hours adjust in muslim-majority areas; international hotels run Ramadan packages catering specifically to GCC visitors.",
    sections: [
      {
        heading: "Iftar timing & where to break fast",
        body: "Maghrib in Bangkok shifts roughly between 18:35 and 18:55 depending on time of year (Ramadan moves ~11 days earlier annually on the Gregorian calendar). Most major hotels — Marriott, Hilton, Sheraton, Centara, Anantara, Banyan Tree — run Ramadan buffets at their flagship Bangkok locations. Al Meroz, Bangkok's largest halal hotel, runs the most authentic spread.",
      },
      {
        heading: "Mosques during Ramadan",
        body: "Tarawih prayers run nightly after Isha at every Bangkok mosque. Foundation Mosque (Charoen Krung), Darul Aman (Sukhumvit), Haroon (Bang Rak), and the Indonesian Mosque (Phra Khanong) all welcome visitors. Tarawih usually starts ~20:00 and runs 1-2 hours. Friday Jum'ah crowds are noticeably larger during Ramadan.",
      },
      {
        heading: "Suhoor options",
        body: "Suhoor (pre-dawn meal) is less commercialized — most muslim travelers eat at the hotel or order in. A handful of 24h halal restaurants on Sukhumvit Soi 3 and Indra Square cover the suhoor crowd. Some hotels run quiet suhoor buffets 03:30-05:00 — confirm in advance.",
      },
      {
        heading: "Travel etiquette during Ramadan",
        body: "Eating publicly during fasting hours is fine — Thailand is a buddhist-majority country, no public-fasting expectation exists. Drinking water in muslim-majority areas (deep south, Krabi, Pattani) during Ramadan is technically OK but considered polite to be discreet. Alcohol availability is unchanged.",
      },
    ],
    takeaways: [
      "Maghrib in Bangkok: ~18:35-18:55 depending on year",
      "Major hotels run Ramadan buffets; book ahead — they fill up",
      "Tarawih at any Bangkok mosque ~20:00 nightly",
      "No public-fasting expectation — eating publicly is fine in non-muslim areas",
    ],
    refs: [
      { title: "AlAdhan Prayer Times API · Bangkok", source: "Prayer-times reference", url: "https://aladhan.com/" },
      { title: "Halal Food Council of Thailand · Ramadan schedule", source: "Local authority" },
    ],
  },

  // =================================================================
  "iftar-buffets-bangkok": {
    slug: "iftar-buffets-bangkok",
    title: "Iftar buffets in Bangkok",
    emoji: "🍽",
    intro:
      "Bangkok's hotel scene has embraced iftar in a way that other Southeast Asian capitals have not. During Ramadan, 15-20 major hotels run elaborate iftar buffets — many of them open to non-hotel guests with advance reservation. Prices range from ฿800 (3-star hotel) to ฿3,500 (5-star international chain) per head. Buffets typically open at maghrib + 5 minutes with a dates-and-water ritual, then a 3-hour full spread.",
    sections: [
      {
        heading: "Top tier (฿2,000+)",
        body: "Al Meroz (the largest dedicated halal hotel in Thailand), Anantara Riverside, Marriott Sukhumvit, Hilton Sukhumvit, and Banyan Tree all run premium iftar tables with global halal cuisine — Levantine mezze, biryani station, Thai halal favorites, fresh kabsa, and live carving. Reservation 1 week ahead required during peak nights.",
      },
      {
        heading: "Mid tier (฿1,000-2,000)",
        body: "Centara Grand at CentralWorld, Mövenpick BDMS, and several boutique Sukhumvit hotels run solid mid-range iftars. Smaller spread, similar quality, easier to book last-minute.",
      },
      {
        heading: "Budget / authentic (฿400-800)",
        body: "Indra Square restaurants, Sukhumvit Soi 3 family halal restaurants, and the muslim community kitchens in Bang Rak and Phra Khanong offer authentic iftar at near-cost. Less polished, more genuine — and excellent food.",
      },
      {
        heading: "Iftar at home",
        body: "All major delivery platforms — Grab Food, foodpanda, LineMan — list halal-tagged restaurants in their Ramadan menus. The catering pool grows significantly during the month.",
      },
    ],
    takeaways: [
      "Book 5-star hotel iftars 1 week ahead during peak weekends",
      "Indra Square + Sukhumvit Soi 3 = authentic + cheap iftar",
      "Most platforms (Grab/Foodpanda) tag halal restaurants during Ramadan",
      "Al Meroz remains the benchmark for dedicated muslim hotel iftar",
    ],
    refs: [
      { title: "Al Meroz Hotel Bangkok Ramadan menu" },
      { title: "Bangkok Post · Ramadan dining guide", source: "Tourism press" },
    ],
  },

  // =================================================================
  "prayer-rooms-thai-airports": {
    slug: "prayer-rooms-thai-airports",
    title: "Prayer rooms at Thai airports",
    emoji: "🛫",
    intro:
      "Every major Thai international airport now provides dedicated multi-faith or muslim-specific prayer rooms. Locations are signposted in airport navigation maps but not always obvious — knowing in advance saves a frustrated search after a long flight. All five major airports we cover (Suvarnabhumi, Don Mueang, Phuket, Krabi, Chiang Mai) have basic wudu (ablution) facilities adjacent to the prayer room.",
    sections: [
      {
        heading: "Suvarnabhumi (BKK)",
        body: "Multiple dedicated prayer rooms. Departure level: Concourse D, near gate D5 (recently renovated, separate male/female sections, wudu facilities). Arrivals level: near baggage claim, signposted in English/Thai/Arabic. Most thoroughly accommodating Thai airport for muslim travelers.",
      },
      {
        heading: "Don Mueang (DMK)",
        body: "Smaller airport but provides musholla near Terminal 1 (international departures) gate 4 area. Signage is in Thai and small English print — ask information desk if needed. Wudu sink is shared with restroom.",
      },
      {
        heading: "Phuket International (HKT)",
        body: "Prayer room in departures, signposted from check-in area. Adequate but small. The mosque just outside the airport (Mukarrom Mosque, 5min by tuk-tuk) is much larger and accessible for travelers with longer layovers.",
      },
      {
        heading: "Krabi (KBV) and Chiang Mai (CNX)",
        body: "Both smaller airports provide prayer facilities in the departures area. Krabi's is more spacious (reflecting the muslim-majority province). Chiang Mai's is smaller but well-maintained.",
      },
    ],
    takeaways: [
      "Suvarnabhumi BKK: best-equipped, multiple rooms, separate gender",
      "Don Mueang DMK: smaller musholla at Terminal 1 gate 4",
      "Phuket airport: in-terminal room + nearby Mukarrom Mosque for layovers",
      "Krabi + Chiang Mai: adequate facilities, ask information desk",
    ],
    refs: [
      { title: "Airports of Thailand · facility maps", source: "Government tourism" },
      { title: "Suvarnabhumi airport official site", url: "https://suvarnabhumi.airportthai.co.th/" },
    ],
  },

  // =================================================================
  "muslim-travel-etiquette": {
    slug: "muslim-travel-etiquette",
    title: "Muslim travel etiquette in Thailand",
    emoji: "🤝",
    intro:
      "Thailand is a buddhist-majority country with a deeply established muslim community, especially in the south. Thai cultural etiquette is generally accommodating to muslim travelers — modest dress is welcomed in temples and royal sites, alcohol is easy to avoid, and finding halal food is straightforward in major cities. A few unique practices are worth knowing.",
    sections: [
      {
        heading: "Temple visits",
        body: "Most major buddhist temples (Wat Pho, Wat Arun, Grand Palace) require modest dress — shoulders and knees covered. This aligns naturally with muslim dress codes. Shoes off before entering the prayer hall (not just buddhist — same as mosques). The royal sites in particular enforce dress strictly; carry a sarong as backup.",
      },
      {
        heading: "Greeting customs",
        body: "Thais traditionally greet with a wai (palms together, slight bow). Muslims may prefer a handshake (men-to-men, women-to-women) or a verbal salaam. Both are accepted. Avoid touching anyone's head — considered very impolite in Thai buddhist culture.",
      },
      {
        heading: "Public displays of religion",
        body: "Hijab is fully accepted in public; Thailand has long-standing muslim communities so this is not unusual. Wearing thobe / kandura is also fine in tourist areas — locals often recognize GCC clothing immediately and address visitors in Arabic-style English greetings.",
      },
      {
        heading: "Eating with locals",
        body: "When in doubt, explicitly say 'halal' or 'no pork, no alcohol' — both English phrases are widely understood in tourist areas. In muslim-majority south, you don't need to ask; in central Thailand always confirm. Tipping is appreciated but not required.",
      },
      {
        heading: "Friday prayer",
        body: "Most large mosques (Bangkok, Phuket, Hat Yai) welcome traveling muslims at Friday Jum'ah. Arrive 30 minutes early — typical Jum'ah is 12:15-13:15 in Bangkok. Friday afternoon traffic near mosques can be heavy; allow extra time.",
      },
    ],
    takeaways: [
      "Modest dress works for both temples and mosques — same standard",
      "Greeting: wai or salaam both accepted",
      "Public hijab/thobe is normal; widely recognized",
      "Friday Jum'ah ~12:15-13:15 in Bangkok; arrive early",
    ],
    refs: [
      { title: "Tourism Authority of Thailand · cultural etiquette", url: "https://www.tourismthailand.org/" },
      { title: "CrescentRating · Thailand muslim travel report" },
    ],
  },

  // =================================================================
  "halal-vs-muslim-friendly": {
    slug: "halal-vs-muslim-friendly",
    title: "Halal vs. muslim-friendly — the label difference",
    emoji: "🔍",
    intro:
      "The two terms are often used interchangeably in Thai tourism marketing, but they carry very different guarantees. 'Halal' is a regulated label requiring third-party certification (CICOT in Thailand, JAKIM in Malaysia, MUI in Indonesia). 'Muslim-friendly' is unregulated — anyone can use it. Understanding which label you're seeing changes how you should evaluate a venue.",
    sections: [
      {
        heading: "Halal — certified",
        body: "A venue displaying the official green CICOT diamond seal has passed a third-party audit covering ingredients, supply chain, kitchen layout, staff handling, and storage. The certificate is verifiable on halal.or.th, has an expiry date, and is recognized internationally by JAKIM (Malaysia), MUI (Indonesia), MUIS (Singapore), and several GCC bodies.",
      },
      {
        heading: "Muslim-friendly — uncertified, self-declared",
        body: "A venue declaring itself 'muslim-friendly' is essentially saying 'we make an effort'. It might mean any of: vegetarian options exist; pork is not served; halal chicken is sourced; the kitchen has separation; prayer space is provided; alcohol is not served in the dining area. There's no required minimum standard — the label is marketing, not certification.",
      },
      {
        heading: "Why both exist in Thailand",
        body: "Many small family-run halal restaurants — especially in muslim-majority provinces — don't bother with the annual CICOT audit fee. They're functionally halal but the seal is missing. Meanwhile, large international hotels often use 'muslim-friendly' deliberately because they serve alcohol in some venues (the spa restaurant, the rooftop bar) and can't claim full CICOT compliance.",
      },
      {
        heading: "How we handle this",
        body: "Our Trust Score blends the official CICOT signal with cross-source community verification — Reddit threads, Pantip discussions, Naver blog posts. A small uncertified restaurant with 50 muslim community mentions from Naver and Pantip can score higher than a CICOT-certified chain with no community traction.",
      },
    ],
    takeaways: [
      "'Halal' = audited, certificate, verifiable, internationally recognized",
      "'Muslim-friendly' = marketing label, no standard, requires individual verification",
      "Uncertified family-run halal can still be legitimate — use cross-source signals",
      "Always confirm specifics with the venue if it matters to you (kitchen separation, ingredients)",
    ],
    refs: [
      { title: "CICOT halal certification standard", url: "https://www.halal.or.th/" },
      { title: "Mastercard-CrescentRating GMTI report" },
    ],
  },

  // =================================================================
  "halal-tourism-statistics": {
    slug: "halal-tourism-statistics",
    title: "Halal tourism statistics in Thailand",
    emoji: "📊",
    intro:
      "Thailand consistently ranks in the top 10 muslim-friendly non-Organisation of Islamic Cooperation (non-OIC) destinations in the annual Mastercard-CrescentRating Global Muslim Travel Index. The country received roughly 6-8 million muslim international visitors in 2024 (depending on which methodology), with GCC, Malaysia, and Indonesia as the largest source markets. This represents a 40-50% growth from pre-pandemic 2019 levels.",
    sections: [
      {
        heading: "Source markets",
        body: "Malaysia and Indonesia are the largest single sources (combined ~3-4M annual visitors due to proximity), but GCC visitors (Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain) are the highest per-capita spenders. The Saudi market alone grew ~250% from 2019 to 2024 following visa-on-arrival expansion. South Korea and India contribute smaller but growing muslim-traveler segments.",
      },
      {
        heading: "Spending patterns",
        body: "Average GCC family trip spend in Thailand: ฿35,000-45,000 (~$1,000-1,300 USD) per traveler. Stays average 7-12 nights, longer than the all-tourist average of 4-6 nights. Phuket and Bangkok absorb roughly 75% of muslim visitor spend; Krabi, Pattaya, and Hua Hin make up most of the remainder.",
      },
      {
        heading: "Local muslim population",
        body: "Thailand has approximately 4-5 million muslim residents (~7% of the total population), concentrated in the deep south (Pattani, Yala, Narathiwat — 80%+ muslim-majority), plus established communities in Bangkok (~5%), Krabi (~40%), and Phuket (~30%). This domestic base means halal infrastructure exists organically rather than only as tourism infrastructure.",
      },
      {
        heading: "Government investment",
        body: "Tourism Authority of Thailand (TAT) launched dedicated Muslim Friendly Destination promotion in 2014 and has actively expanded since. The Halal Standard Institute provides accreditation; CICOT runs the certification. Bangkok now has 60+ dedicated halal restaurants registered with CICOT, plus several hundred more muslim-friendly venues.",
      },
    ],
    takeaways: [
      "6-8M muslim international visitors annually (2024)",
      "GCC market grew 250% post-pandemic; highest per-capita spend",
      "~4-5M muslim Thais — infrastructure is organic, not just touristic",
      "Top 10 muslim-friendly non-OIC destination (Mastercard-CR GMTI)",
    ],
    refs: [
      { title: "Mastercard-CrescentRating Global Muslim Travel Index 2024" },
      { title: "Tourism Authority of Thailand · muslim visitor stats", url: "https://www.tourismthailand.org/" },
    ],
  },

  // =================================================================
  "qibla-direction-thailand": {
    slug: "qibla-direction-thailand",
    title: "Qibla direction in Thailand",
    emoji: "🧭",
    intro:
      "Qibla — the direction muslims face during prayer, toward the Kaaba in Mecca — is roughly west-northwest from anywhere in Thailand. The exact angle shifts slightly between northern and southern Thailand, but for practical purposes, any compass pointing 'WNW' (around 280-295°) is correct enough for prayer. Most muslim-friendly hotels mark the qibla on the ceiling or with a sticker on the desk.",
    sections: [
      {
        heading: "Angles by city",
        body: "Bangkok: ~292° (slightly north of due west). Phuket: ~290°. Chiang Mai: ~289° (further north). Hat Yai: ~292°. Pattani: ~292°. Anywhere in Thailand: 286°-294° range. Any compass app or Google Maps' qibla finder confirms exact angle.",
      },
      {
        heading: "How to find qibla in a hotel",
        body: "Real muslim-friendly hotels mark the qibla on the ceiling (a small arrow + Arabic 'qibla'), on the desk, or behind the door. Properties that only offer 'muslim-friendly amenities on request' often have a qibla compass available at reception — ask.",
      },
      {
        heading: "Apps",
        body: "Muslim Pro, Athan Pro, and Qibla Finder all work in Thailand. Most major mosques face qibla directly, so if you're nearby, just follow the mosque's longitudinal direction. Google Maps' 'Qibla' overlay also works.",
      },
    ],
    takeaways: [
      "Qibla in Thailand: 286°-294° (west-northwest)",
      "Bangkok specifically: ~292°",
      "Quality muslim-friendly hotels mark qibla on ceiling or desk",
      "Apps: Muslim Pro, Athan Pro, Qibla Finder all support Thailand",
    ],
    refs: [
      { title: "Qibla Finder · Google", url: "https://qiblafinder.withgoogle.com/" },
    ],
  },

  // =================================================================
  "jumah-prayer-bangkok-mosques": {
    slug: "jumah-prayer-bangkok-mosques",
    title: "Jum'ah prayer at Bangkok mosques",
    emoji: "🕌",
    intro:
      "Friday Jum'ah prayer is the central muslim worship event of the week. Bangkok has roughly 175 mosques across the metropolitan area, but a handful dominate as the main Jum'ah destinations for travelers. Visitor expectations are simple: arrive 20-30 minutes early, dress modestly, bring socks if floors are wet from wudu, and follow the local imam's khutbah (sermon — usually delivered in Thai with some Arabic).",
    sections: [
      {
        heading: "Foundation Mosque (Bang Rak)",
        body: "Charoen Krung Road 90. The most historic mosque in Bangkok, accessible by Saphan Taksin BTS. Old wooden building with strong community feel. Khutbah in Thai. Easy walk from major Chao Phraya river hotels.",
      },
      {
        heading: "Darul Aman Mosque (Sukhumvit)",
        body: "Off Sukhumvit Road, walking distance from BTS Asok. Modern facility, large capacity, popular with the expat-muslim community. Khutbah sometimes available in English or Arabic — confirm with the imam in advance for visitor accommodation.",
      },
      {
        heading: "Haroon Mosque (Bang Rak)",
        body: "Older mosque near Foundation. Smaller but with strong community engagement. Worth visiting after Jum'ah — the surrounding muslim neighborhood has excellent halal food.",
      },
      {
        heading: "Indonesian Mosque (Phra Khanong)",
        body: "Indonesian community mosque. Khutbah in Indonesian + Arabic. Welcoming to international muslims. BTS Phra Khanong.",
      },
      {
        heading: "Timing",
        body: "Jum'ah in Bangkok runs 12:15-13:15 typically. Adhan (call to prayer) ~12:15, khutbah ~12:30-12:55, formal prayer ~13:00. Bangkok traffic spikes 11:45-12:15 near mosques — allow extra travel time.",
      },
    ],
    takeaways: [
      "Jum'ah ~12:15-13:15 in Bangkok",
      "Foundation Mosque + Darul Aman = most accommodating for travelers",
      "Arrive 20-30 minutes early, dress modestly, bring socks",
      "Indonesian Mosque does Indonesian-language khutbah",
    ],
    refs: [
      { title: "Foundation Mosque (Mas­yid Jam'iyatul Islam) directory" },
      { title: "Bangkok Metropolitan mosques registry · CICOT" },
    ],
  },

  // =================================================================
  "halal-meat-suppliers-thailand": {
    slug: "halal-meat-suppliers-thailand",
    title: "Halal meat suppliers in Thailand",
    emoji: "🥩",
    intro:
      "Thailand has a robust halal meat supply chain anchored by CICOT-certified processors. Major chains like CP Foods, Betagro, and Saha Farms run halal-certified production lines alongside their conventional operations. For retail, Foodland (Sukhumvit branch and a few others) stocks halal-section meat; Big C and Lotus have halal-tagged frozen sections. Restaurant supply runs through wholesalers like Makro (cash-and-carry) and direct distribution from the processors.",
    sections: [
      {
        heading: "Major certified processors",
        body: "CP Foods (Charoen Pokphand) — chicken, processed meats, sausages. Betagro — chicken, beef, pork (separate halal line). Saha Farms — chicken, duck. All maintain CICOT certification on the halal production line, with separate facilities and audited supply chains.",
      },
      {
        heading: "Retail halal meat",
        body: "Foodland (Sukhumvit Soi 5) has a dedicated halal section. Big C and Lotus tag halal frozen poultry. Tops Supermarket runs halal-section in select branches (Asok, EmQuartier). For full halal grocery (not just meat), Indra Square's surrounding shops carry imported halal goods, spices, and frozen items.",
      },
      {
        heading: "Restaurant supply",
        body: "Makro (cash-and-carry wholesale) carries CICOT-certified bulk meat. Direct supply from CP/Betagro requires a wholesale account. Smaller halal restaurants often source from family-run butchers in Bangkok's muslim neighborhoods — Indra Square, Phra Khanong, Bang Rak all have halal butchers.",
      },
      {
        heading: "Export grade",
        body: "Thai halal-certified chicken is a major export to GCC, Malaysia, and Indonesia. CP Foods alone exports several hundred thousand tonnes of halal chicken annually. This means the underlying supply chain is built for international halal compliance — the rigor is high.",
      },
    ],
    takeaways: [
      "CP Foods, Betagro, Saha Farms = main certified processors",
      "Foodland (Sukhumvit Soi 5) has dedicated halal section",
      "Indra Square area has halal butchers and grocery",
      "Thai halal chicken is a major export commodity — supply chain is solid",
    ],
    refs: [
      { title: "CICOT certified halal processors list", url: "https://www.halal.or.th/" },
      { title: "CP Foods halal certification page" },
    ],
  },

  // =================================================================
  "muslim-population-thailand": {
    slug: "muslim-population-thailand",
    title: "Muslim population in Thailand",
    emoji: "📌",
    intro:
      "Thailand has roughly 4-5 million muslim residents, comprising 6-8% of the total population. The community is geographically concentrated in three main regions: the deep south (Pattani / Yala / Narathiwat — 80%+ muslim-majority), the central coast (Krabi, Phuket, parts of Phang Nga), and Bangkok metro (significant pockets in Bang Rak, Klong Toey, Phra Khanong, Min Buri). Ethnically, the community spans Malay-Thai (south), Yunnanese-Chinese muslim ('Chin Haw' — north), and Indian/Pakistani-descended muslims (Bangkok).",
    sections: [
      {
        heading: "Deep south",
        body: "Pattani, Yala, Narathiwat — collectively known historically as Patani — are the cultural heart of Thai Muslim life. The provinces are ethnically Malay, the local language is Bahasa Melayu (Yawi dialect) alongside Thai, and the muslim population is 80%+ of the local total. The food, architecture, and customs reflect Malay-Indonesian rather than central-Thai influences.",
      },
      {
        heading: "Central coast (Andaman)",
        body: "Krabi (~40% muslim), Phuket (~30%), and parts of Phang Nga have long-established muslim fishing communities. Most of the boat captains running long-tail and ferry services to Phi Phi, Railay, Koh Lanta are muslim. This shapes the local halal food scene — seafood, Andaman-style cooking, family-run village restaurants.",
      },
      {
        heading: "Bangkok",
        body: "Roughly 5% of Bangkok's metropolitan population is muslim, in the high tens of thousands. Concentrations: Bang Rak (older waterfront muslim community), Klong Toey and Phra Khanong (working-class muslim neighborhoods), Min Buri and Lat Krabang (outer-eastern muslim suburbs), Sukhumvit Soi 3 (Middle Eastern expat enclave).",
      },
      {
        heading: "Yunnanese muslim ('Chin Haw') north",
        body: "Chiang Mai has a small but historically important Yunnanese-Chinese muslim community descended from caravan traders. The original Khao Soi recipe is theirs — the muslim version is the source, not a variant. Chang Khlan road in Chiang Mai is the small muslim quarter.",
      },
    ],
    takeaways: [
      "4-5M muslim Thais (~6-8% of population)",
      "Deep south (Pattani/Yala/Narathiwat) is 80%+ muslim, culturally Malay",
      "Andaman coast: Krabi 40%, Phuket 30% — strong local infrastructure",
      "Yunnanese muslim Chiang Mai community = origin of khao soi",
    ],
    refs: [
      { title: "Thai National Statistical Office · religion census" },
      { title: "Tourism Authority of Thailand · Muslim Friendly Destination" },
    ],
  },

  // =================================================================
  "alcohol-free-thai-drinks": {
    slug: "alcohol-free-thai-drinks",
    title: "Alcohol-free Thai drinks guide",
    emoji: "🥥",
    intro:
      "Thailand's beverage culture is much broader than its bar scene suggests. Alongside the famous Thai beer brands, the country has a rich tradition of non-alcoholic drinks — herbal teas, fruit smoothies, fresh coconut water, butterfly-pea blue tea, and cold-pressed sugarcane juice. For muslim travelers and anyone avoiding alcohol, almost every restaurant menu has at least 5-10 alcohol-free options that are genuinely interesting (not just sodas).",
    sections: [
      {
        heading: "Cha Manao — Thai lemon iced tea",
        body: "Thai black tea + lime + sugar over crushed ice. Sweeter and more lemony than Western iced tea. Available at almost any cafe or street stall in Thailand. ฿30-60.",
      },
      {
        heading: "Cha Yen — Thai iced tea (orange)",
        body: "The famous orange iced tea. Made from Thai-style black tea blended with spices, then condensed milk for the signature color and creaminess. Available everywhere. ฿40-80.",
      },
      {
        heading: "Nam Manao — fresh lime juice",
        body: "Fresh-squeezed lime, sugar syrup, salt, water, ice. Bright and refreshing. ฿30-50. Variant: Nam Som (orange juice — pure, not from concentrate).",
      },
      {
        heading: "Butterfly Pea (Anchan)",
        body: "Bright blue tea from butterfly pea flowers. Mild flavor; add lime and it turns purple. Photogenic and pure. ฿40-80 at cafes.",
      },
      {
        heading: "Coconut & sugarcane",
        body: "Fresh coconut (sold whole with a straw) — ฿50-80. Cold-pressed sugarcane juice — green-colored, slightly herbal, ฿20-40 from street vendors. Both completely halal and ubiquitous.",
      },
      {
        heading: "Coffee culture (Yala / Pattani style)",
        body: "Southern muslim Thai coffee tradition is strong — strong espresso-style coffee served with condensed milk. Yala is famous for it. Most coffee shops in Bangkok's muslim areas serve this style. ฿40-80.",
      },
    ],
    takeaways: [
      "Almost every restaurant has 5+ alcohol-free options beyond sodas",
      "Cha yen, cha manao, butterfly pea, fresh coconut = staples",
      "Yala / southern muslim coffee tradition is excellent",
      "All listed drinks are halal — confirm preparation if hyper-strict (some Thai sodas use unfamiliar ingredients)",
    ],
    refs: [
      { title: "Thailand beverage culture · TAT cultural guide" },
    ],
  },

  // =================================================================
  "wudu-facilities-bangkok": {
    slug: "wudu-facilities-bangkok",
    title: "Wudu facilities in Bangkok",
    emoji: "💧",
    intro:
      "Wudu — the ritual ablution before prayer — requires running water and adequate space to wash hands, face, mouth, and feet. Bangkok's major mosques have purpose-built wudu areas, but for travelers caught away from a mosque, options exist at major malls (some have low foot-wash sinks adjacent to prayer rooms), airports (all major Thai airports), and at most muslim-friendly hotels in the bathroom.",
    sections: [
      {
        heading: "At mosques",
        body: "Every Bangkok mosque has dedicated wudu facilities. Foundation, Darul Aman, Haroon, and Indonesian Mosque all have separate male/female ablution areas with running water, low sinks, and waste drainage. Open during all prayer windows.",
      },
      {
        heading: "At malls",
        body: "Siam Paragon, EmQuartier, CentralWorld, ICONSIAM all have prayer rooms with adjacent wudu sinks. Terminal 21 has a smaller prayer space. Ask at customer service if not signposted — Thai retail is increasingly accommodating but signage is inconsistent.",
      },
      {
        heading: "At airports",
        body: "Suvarnabhumi BKK has dedicated wudu sinks at both prayer rooms (Concourse D and arrivals). Don Mueang T1 has shared restroom sinks adjacent to the musholla. Phuket airport has dedicated facilities in the prayer room.",
      },
      {
        heading: "At hotels",
        body: "Most muslim-friendly hotels have bidet-equipped bathrooms with low water access — usable for wudu. Higher-end muslim-friendly hotels (Al Meroz, some Anantara properties) have purpose-designed wudu sinks separate from the bathroom.",
      },
      {
        heading: "Public restrooms",
        body: "Standard public toilets in Thailand have a 'bum gun' (handheld bidet) — usable for wudu if needed, though less ideal than a proper foot-wash sink. Modesty considerations: most muslim travelers prefer to do wudu before leaving the hotel for the day.",
      },
    ],
    takeaways: [
      "All Bangkok mosques have dedicated wudu facilities",
      "Major malls have adjacent wudu sinks in prayer rooms",
      "Suvarnabhumi BKK has best airport wudu infrastructure",
      "Hotel bathrooms (with bidet) work for emergency wudu",
    ],
    refs: [
      { title: "Bangkok mosque facility directory · CICOT" },
    ],
  },

  // =================================================================
  "family-friendly-halal-hotels-phuket": {
    slug: "family-friendly-halal-hotels-phuket",
    title: "Family-friendly halal hotels in Phuket",
    emoji: "👨‍👩‍👧",
    intro:
      "Phuket has the strongest concentration of muslim-friendly family hotels in Thailand because the local muslim population (~30% of permanent residents) means halal kitchen staff and protocols already exist at most beachfront properties. The challenge is filtering for hotels that go beyond generic 'muslim-friendly' marketing to actually provide what muslim families need: halal kitchen separation, prayer kit on request, qibla marking, women-only pool hours, family suites.",
    sections: [
      {
        heading: "Top tier — dedicated muslim hotels",
        body: "These properties operate halal-only kitchens, no alcohol service, prayer kits in every room, and qibla marked on the ceiling: Mövenpick Resort Karon (specific halal wings), several boutique resorts in Bang Tao and Surin. Premium pricing, premium experience.",
      },
      {
        heading: "Mid tier — muslim-friendly mainstream",
        body: "International chains with strong muslim-friendly programs: Centara, Anantara, Banyan Tree. They provide muslim-friendly amenities on request (prayer kit, halal-confirmed meals, qibla compass) but also serve alcohol in some venues. Suitable for families comfortable with mixed environments.",
      },
      {
        heading: "Budget — verified halal-default",
        body: "Smaller family-run guesthouses in Karon, Kata Noi, and Surin, often muslim-owned. Halal is the default — no need to request. Pool may not be private but the surrounding food and culture is genuinely muslim.",
      },
      {
        heading: "Locations to avoid",
        body: "Patong is the alcohol/nightlife hub. Most hotels there serve alcohol prominently and the surrounding streets are bar-heavy. Suitable for adult travelers comfortable with that, but not for family travel.",
      },
    ],
    takeaways: [
      "Karon, Kata Noi, Surin, Bang Tao = most family-friendly muslim areas",
      "Mövenpick Karon has dedicated halal wings",
      "Avoid Patong for family travel — alcohol/nightlife district",
      "Mid-range chains (Centara/Anantara) accommodate on request",
    ],
    refs: [
      { title: "Phuket Tourism Association · muslim friendly properties" },
    ],
  },

  // =================================================================
  "southern-thailand-muslim-history": {
    slug: "southern-thailand-muslim-history",
    title: "Southern Thailand Muslim history",
    emoji: "📜",
    intro:
      "The deep south of Thailand — the modern provinces of Pattani, Yala, and Narathiwat — was historically the Sultanate of Patani, a Malay-muslim kingdom that predates the modern Thai state by several centuries. Patani converted to Islam in the 13-14th centuries through trade with the Malay archipelago. The region was a major center of Islamic learning, exporting scholars across Southeast Asia. Today the descendants of that civilization remain — culturally Malay-muslim, distinct from central Thai Buddhist culture, with their own language, food, and architecture.",
    sections: [
      {
        heading: "The Sultanate era",
        body: "Patani was a powerful trading state from the 15th-18th centuries — a key Malay-muslim center connecting the Indian Ocean, the South China Sea, and the rest of the archipelago. The Krue Se Mosque (built around 1578, unfinished) is the surviving architectural symbol of this era. Scholars from Patani were renowned across Southeast Asia for their Islamic jurisprudence and Arabic-language education.",
      },
      {
        heading: "Annexation by Siam",
        body: "Modern Thailand formally absorbed Patani in 1909 following the Anglo-Siamese Treaty, which redrew the colonial-era southern borders. The Sultanate's autonomy was dissolved over the early 20th century. This historical trauma continues to shape regional political and cultural dynamics today.",
      },
      {
        heading: "Cultural distinctiveness",
        body: "The local language remains Bahasa Melayu (Yawi dialect) alongside Thai. Food traditions are distinctly Malay-Indonesian — nasi kerabu (blue herb rice), khao yam (southern rice salad), kopi (sweet condensed-milk coffee), and a strong fish-based cuisine. Architecture shows Malay wooden-house traditions alongside Sino-Portuguese facades in the coastal towns.",
      },
      {
        heading: "Travel today",
        body: "Travel to the deep south is genuinely worthwhile for the cultural depth, the food traditions, and the historical sites. Check current government travel advisories before going — there have been intermittent security concerns. Most areas are safe and welcoming; informed planning is sensible. Locals are extremely hospitable to visitors who show interest in the region's heritage.",
      },
    ],
    takeaways: [
      "Patani Sultanate predates modern Thailand by several centuries",
      "Krue Se Mosque (~1578) is the cultural symbol",
      "Language: Bahasa Melayu (Yawi) alongside Thai",
      "Check current travel advisories — most areas safe, planning helps",
    ],
    refs: [
      { title: "Krue Se Mosque · UNESCO documentation" },
      { title: "History of Patani · academic source" },
    ],
  },

  // =================================================================
  "zamzam-water-availability-bangkok": {
    slug: "zamzam-water-availability-bangkok",
    title: "Zamzam water availability in Bangkok",
    emoji: "🚰",
    intro:
      "Zamzam — the holy water from the well in Mecca's Masjid al-Haram — is a prized item for muslim travelers, often brought back from Hajj or Umrah pilgrimages. In Bangkok, Zamzam is occasionally available through specific channels: the Saudi embassy (limited distribution), large halal Middle Eastern grocers around Sukhumvit Soi 3 and Indra Square, and during pilgrimage season, returning pilgrims often share their allotment with community members.",
    sections: [
      {
        heading: "Embassy distribution",
        body: "The Royal Embassy of Saudi Arabia in Bangkok (Sukhumvit Soi 11 area) occasionally distributes Zamzam during religious events or to returning Thai pilgrims. Not a reliable retail source for tourists.",
      },
      {
        heading: "Halal grocers",
        body: "Some Middle Eastern grocers on Sukhumvit Soi 3 — particularly those run by Saudi or GCC owners — stock 5L or 10L Zamzam bottles brought back through proper channels. Availability is irregular; ask the shopkeeper. Expect ฿800-2,000 per bottle depending on size and bottling origin.",
      },
      {
        heading: "Community sharing",
        body: "Returning pilgrims from Hajj season (typically July-August) often share their allotted 5L Zamzam with their mosque community. If staying in Bangkok during that period, attending Friday prayer at Foundation Mosque or Darul Aman may yield community access.",
      },
      {
        heading: "Authenticity warning",
        body: "Saudi Arabia restricts commercial Zamzam exports, so any large-volume retail Zamzam in Bangkok is either pilgrim-imported (legitimate but limited) or, occasionally, of questionable origin. Verify with the seller about the import channel if unsure.",
      },
    ],
    takeaways: [
      "Limited retail availability — Bangkok grocers carry occasionally",
      "Hajj season (July-August) is best community-sharing window",
      "Sukhumvit Soi 3 + Indra Square = main retail attempts",
      "Authenticity matters — ask about import channel",
    ],
    refs: [
      { title: "Saudi Embassy Thailand · cultural events" },
    ],
  },

  // =================================================================
  "arabic-language-thailand": {
    slug: "arabic-language-thailand",
    title: "Arabic language in Thailand",
    emoji: "🇸🇦",
    intro:
      "Arabic in Thailand is present in three distinct contexts: religious (Qur'anic Arabic taught at madrasahs and Islamic schools nationwide), tourism (Soi Arab in Sukhumvit and Phuket Bang Tao have functional Arabic-speaking staff), and academic (universities like Chulalongkorn and Thammasat offer Arabic language programs). For travelers, the practical reality is that Arabic is increasingly understood in muslim-friendly tourism areas — particularly Sukhumvit Soi 3, Phuket Patong/Karon, and select Krabi hotels.",
    sections: [
      {
        heading: "Religious Arabic (Qur'anic)",
        body: "Every mosque in Thailand teaches Qur'anic Arabic to children of muslim families. The southern provinces (Pattani / Yala) have the strongest Arabic-language educational infrastructure, with several pondok schools where Arabic is the primary medium of religious instruction. Bangkok has 4-5 prominent madrasahs and Islamic schools offering Arabic education.",
      },
      {
        heading: "Conversational Arabic in tourism",
        body: "Soi Arab (Sukhumvit Soi 3) staff and Phuket Bang Tao resort staff often speak functional Arabic at a hospitality level — enough to handle reservations, room requests, and basic dining orders. Higher-end muslim-friendly hotels (Al Meroz, Mövenpick) employ Arabic-speaking concierge teams specifically for GCC guests.",
      },
      {
        heading: "Arabic language schools",
        body: "Chulalongkorn University, Thammasat University, and Ramkhamhaeng University all offer Arabic studies programs. For private classes, several institutes around Pratunam and Sukhumvit offer Arabic-as-a-foreign-language tracks. Costs range from ฿8,000-25,000 per semester.",
      },
      {
        heading: "Signage",
        body: "Arabic signage is mostly limited to Sukhumvit Soi 3 (restaurants, halal grocers, money changers), Phuket Bang Tao tourist areas, and a few high-end hotel concierge areas. General Thai signage is in Thai + English; expect to use English as the bridge language outside the muslim areas.",
      },
    ],
    takeaways: [
      "Religious Arabic taught at every mosque + every Islamic school",
      "Sukhumvit Soi 3 + Phuket Bang Tao = functional Arabic in tourism",
      "Chulalongkorn / Thammasat offer formal Arabic programs",
      "Outside muslim areas: English is the practical bridge language",
    ],
    refs: [
      { title: "Chulalongkorn Arabic Studies Department" },
      { title: "Pattani pondok schools registry" },
    ],
  },

  // =================================================================
  "halal-medical-tourism": {
    slug: "halal-medical-tourism",
    title: "Halal medical tourism in Thailand",
    emoji: "🏥",
    intro:
      "Thailand is one of the world's leading medical tourism destinations, hosting 2-3 million international medical visitors annually. For muslim travelers, the country offers a robust set of muslim-friendly medical options: female doctors available on request, halal hospital diets, prayer rooms in major hospitals, and gelatin-free pharmaceutical alternatives. Major facilities like Bumrungrad, BNH, BDMS, and the Bangkok Hospital network all have established muslim-friendly protocols.",
    sections: [
      {
        heading: "Female doctors",
        body: "Most major Thai hospitals have substantial female medical staff — typically 30-50% of practicing doctors. Bumrungrad and BNH publish female-doctor availability online; specifically request a female doctor when booking and the hospital will accommodate without question.",
      },
      {
        heading: "Halal hospital diets",
        body: "Bumrungrad, BNH, Samitivej, and the Bangkok Hospital chain all provide halal-meal options upon request. The hospital kitchen sources from CICOT-certified suppliers and the meals are clearly labeled. Confirm at admission to ensure protocol is set up from day one.",
      },
      {
        heading: "Gelatin-free pharmaceuticals",
        body: "Many capsule medications use porcine gelatin. Most Thai hospitals have plant-based alternatives or different formulations available — ask the pharmacist explicitly. The major international-facing hospitals have established processes for this; smaller regional hospitals may need more advocacy.",
      },
      {
        heading: "Prayer rooms",
        body: "Bumrungrad, BNH, Samitivej, Mahidol Hospital, and most large Bangkok facilities have dedicated prayer rooms. Signage is in English + Thai + sometimes Arabic. Quran copies are typically available on shelves.",
      },
      {
        heading: "Cost",
        body: "Thai medical tourism is typically 30-70% cheaper than equivalent care in GCC countries, US, or UK. Even with the cost of accommodating muslim-specific needs, the savings are substantial. Common procedures: cosmetic surgery, dental work, orthopedic surgery, IVF, cardiology.",
      },
    ],
    takeaways: [
      "Bumrungrad / BNH / Samitivej = best muslim-friendly hospital protocols",
      "Female doctor requests accommodated routinely",
      "Halal hospital diets standard at major facilities",
      "Cost: 30-70% cheaper than equivalent GCC/US/UK care",
    ],
    refs: [
      { title: "Bumrungrad International Hospital · muslim patient services" },
      { title: "BNH Hospital · halal services page" },
    ],
  },

  // =================================================================
  "muslim-wedding-customs-thailand": {
    slug: "muslim-wedding-customs-thailand",
    title: "Muslim wedding customs in Thailand",
    emoji: "💍",
    intro:
      "Muslim weddings in Thailand follow the traditional Islamic structure (nikah ceremony, walima reception) blended with regional cultural elements — Malay-Indonesian influences in the south, central Thai Muslim community traditions in Bangkok, and increasingly GCC-style premium ceremonies for destination weddings. The country has a small but growing muslim-wedding-venue industry catering to both local Thai muslims and destination weddings from Malaysia, Indonesia, GCC, and Singapore.",
    sections: [
      {
        heading: "Nikah ceremony",
        body: "The nikah is the religious marriage contract — short, simple, witnessed by two muslim adult males. Most Bangkok mosques will host nikah ceremonies for visiting couples; Foundation Mosque, Darul Aman, and Haroon are all welcoming. Required documentation varies by mosque — typically passport copies, witness statements, mahr (dowry) agreement. Allow 2-3 weeks of planning for foreign couples.",
      },
      {
        heading: "Walima reception",
        body: "The post-nikah celebration. Thai muslim walima can be modest (community kitchen, family hall) or premium (hotel ballroom with halal catering, traditional dance, henna). Al Meroz Hotel, Centara, and Anantara are the main premium venues. Catering is halal-certified and customizable for cultural preferences.",
      },
      {
        heading: "Destination wedding scene",
        body: "Phuket (Bang Tao, Karon), Krabi, and Koh Samui have emerged as muslim destination wedding spots — beachfront, private resort settings, halal-only catering, and segregated celebration spaces. Costs range from $5K-30K for the full event depending on guest count and venue.",
      },
      {
        heading: "Mahr (dowry) considerations",
        body: "Thai muslim communities follow local customs around mahr — typically a token amount agreed upon at the nikah. International destination weddings have more variation. Documentation matters; bring proof of the agreed amount for legal purposes.",
      },
      {
        heading: "Civil registration",
        body: "Thai law requires civil registration for legal marriage status. Foreigners marrying in Thailand need additional documentation (embassy affidavits, single-status certificates). The Thai civil registration is separate from the religious nikah and is what's recognized internationally.",
      },
    ],
    takeaways: [
      "Nikah at any major Bangkok mosque, 2-3 weeks planning for foreigners",
      "Walima venues: Al Meroz, Centara, Anantara for premium",
      "Destination: Phuket Bang Tao, Krabi, Koh Samui beachfront",
      "Civil registration separate from nikah — needed for legal status",
    ],
    refs: [
      { title: "Bangkok mosques nikah procedures" },
      { title: "Al Meroz wedding hall services" },
    ],
  },

  // =================================================================
  "turkish-restaurant-history-bangkok": {
    slug: "turkish-restaurant-history-bangkok",
    title: "Turkish restaurant scene in Bangkok",
    emoji: "🥙",
    intro:
      "Bangkok has quietly become one of Asia's strongest Turkish restaurant scenes outside Istanbul. The transformation started in the early 2000s when Turkish entrepreneurs migrated to take advantage of Bangkok's growing GCC and muslim tourist market. Today the city has 40-60 Turkish restaurants — kebab houses, mezze restaurants, doner shops, and high-end Anatolian cuisine — concentrated in Sukhumvit Soi 3 and along the Pratunam-Indra Square corridor.",
    sections: [
      {
        heading: "The Sukhumvit Soi 3 cluster",
        body: "Soi 3 (Soi Arab) hosts roughly half of Bangkok's Turkish food infrastructure — Istanbul-style kebabs, baklava bakeries, Turkish coffee houses, and several premium Anatolian restaurants. Most are halal by default and Turkish-staff-owned. The street is a 5-minute walk from BTS Nana.",
      },
      {
        heading: "Premium tier",
        body: "A handful of restaurants in the Sukhumvit corridor serve premium Turkish — full mezze, ocakbası grill, premium Anatolian wines (alcohol-served versions exist; ask the venue specifically). For strict halal, ask if the kitchen has a non-alcohol cooking program.",
      },
      {
        heading: "Doner & street level",
        body: "Doner kebab in Bangkok has exploded over the last decade — small Turkish-owned shops near Sukhumvit, Indra Square, and around major hospitals. Quality varies; the best ones (typically third-generation family operations) have a clear preference for fresh-cut meat over pre-frozen.",
      },
      {
        heading: "Cultural footprint",
        body: "The Bangkok Turkish community is small (a few hundred people) but well-organized. They run a Turkish school, host cultural events around Ramadan, and maintain strong ties to GCC visitors via their Turkish-speaking and Arabic-speaking staff. This has shaped Bangkok's Middle Eastern food scene more than its size would suggest.",
      },
    ],
    takeaways: [
      "Sukhumvit Soi 3 is the Turkish food center — ~30 restaurants on one street",
      "Most Turkish restaurants are halal by default",
      "Doner kebab quality varies — third-generation family shops are best",
      "Bangkok Turkish community is small but disproportionately influential",
    ],
    refs: [
      { title: "Bangkok Turkish community directory" },
      { title: "TripAdvisor · Turkish restaurants Bangkok (blocked)" },
    ],
  },
};

export function getTopicContent(slug: string): TopicContent | null {
  return TOPIC_CONTENT[slug] ?? null;
}
