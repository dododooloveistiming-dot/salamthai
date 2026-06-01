// Wiki registry — central list of every City guide and Topic encyclopedia
// entry the site ships. Both the wiki index page and the dynamic
// /wiki/city/[city]/ + /wiki/topic/[slug]/ routes read from here so adding a
// new entry means one edit in one file.

export interface CityEntry {
  slug: string;          // URL slug
  name: string;          // display name
  emoji: string;
  hint: string;          // short subtitle for index card
  // matches Place.city field (case-insensitive)
  matchCities: string[];
}

export interface TopicEntry {
  slug: string;
  title: string;
  emoji: string;
  hint: string;
}

export const CITIES: CityEntry[] = [
  { slug: "bangkok",       name: "Bangkok",       emoji: "🏙",  hint: "Soi Arab · Indra Square · Phra Khanong",   matchCities: ["Bangkok"] },
  { slug: "phuket",        name: "Phuket",        emoji: "🏖",  hint: "Halal beaches & Old Town",                  matchCities: ["Phuket"] },
  { slug: "krabi",         name: "Krabi",         emoji: "🚤",  hint: "Muslim community + Andaman halal seafood",  matchCities: ["Krabi"] },
  { slug: "chiang-mai",    name: "Chiang Mai",    emoji: "🏔",  hint: "Halal khao soi + Old City mosques",         matchCities: ["Chiang Mai", "Chiangmai"] },
  { slug: "hat-yai",       name: "Hat Yai",       emoji: "🚉",  hint: "Southern hub — Malaysia border",            matchCities: ["Hat Yai", "Hatyai", "Songkhla"] },
  { slug: "pattaya",       name: "Pattaya",       emoji: "🏄",  hint: "GCC traveler favorite",                     matchCities: ["Pattaya"] },
  { slug: "hua-hin",       name: "Hua Hin",       emoji: "⛱",  hint: "Royal beach town",                          matchCities: ["Hua Hin", "Huahin"] },
  { slug: "koh-samui",     name: "Koh Samui",     emoji: "🌴",  hint: "Island resorts",                            matchCities: ["Koh Samui", "Ko Samui"] },
  { slug: "ko-lanta",      name: "Ko Lanta",      emoji: "🏝",  hint: "Muslim-majority island",                    matchCities: ["Ko Lanta", "Koh Lanta"] },
  { slug: "pattani",       name: "Pattani",       emoji: "🕌",  hint: "Cultural heart of Thai Muslims",            matchCities: ["Pattani", "Yala", "Narathiwat"] },
];

export const TOPICS: TopicEntry[] = [
  { slug: "cicot-certification",            title: "CICOT halal certification",          emoji: "✅", hint: "How Thailand's official halal label works" },
  { slug: "ramadan-in-thailand",            title: "Ramadan in Thailand",                emoji: "🌙", hint: "What changes during the holy month" },
  { slug: "iftar-buffets-bangkok",          title: "Iftar buffets in Bangkok",           emoji: "🍽", hint: "Top hotel & restaurant iftar tables" },
  { slug: "prayer-rooms-thai-airports",     title: "Prayer rooms at Thai airports",      emoji: "🛫", hint: "Suvarnabhumi · Don Mueang · Phuket · Krabi" },
  { slug: "muslim-travel-etiquette",        title: "Muslim travel etiquette in Thailand", emoji: "🤝", hint: "What to expect, what to ask, what to bring" },
  { slug: "halal-vs-muslim-friendly",       title: "Halal vs. muslim-friendly",          emoji: "🔍", hint: "The label difference explained" },
  { slug: "halal-tourism-statistics",       title: "Halal tourism statistics",           emoji: "📊", hint: "8M+ muslim arrivals annually" },
  { slug: "qibla-direction-thailand",       title: "Qibla direction in Thailand",        emoji: "🧭", hint: "Roughly west-northwest from anywhere in TH" },
  { slug: "jumah-prayer-bangkok-mosques",   title: "Jum'ah prayer at Bangkok mosques",   emoji: "🕌", hint: "Schedule, which mosques, parking" },
  { slug: "halal-meat-suppliers-thailand",  title: "Halal meat suppliers in Thailand",   emoji: "🥩", hint: "Wholesale, retail, certifications" },
  { slug: "muslim-population-thailand",     title: "Muslim population in Thailand",      emoji: "📌", hint: "Geography & community" },
  { slug: "alcohol-free-thai-drinks",       title: "Alcohol-free Thai drinks guide",     emoji: "🥥", hint: "What to order at a Thai bar/cafe" },
  { slug: "wudu-facilities-bangkok",        title: "Wudu facilities in Bangkok",         emoji: "💧", hint: "Where to perform ablution in public" },
  { slug: "family-friendly-halal-hotels-phuket", title: "Family-friendly halal hotels in Phuket", emoji: "👨‍👩‍👧", hint: "Beach access + halal kitchen + prayer kit" },
  { slug: "southern-thailand-muslim-history",    title: "Southern Thailand muslim history",       emoji: "📜", hint: "Pattani · Yala · Narathiwat" },
  { slug: "zamzam-water-availability-bangkok",   title: "Zamzam water in Bangkok",                emoji: "🚰", hint: "Where to find it" },
  { slug: "arabic-language-thailand",       title: "Arabic language in Thailand",        emoji: "🇸🇦", hint: "Speakers, classes, signage" },
  { slug: "halal-medical-tourism",          title: "Halal medical tourism",              emoji: "🏥", hint: "Female doctors, halal hospital diets" },
  { slug: "muslim-wedding-customs-thailand", title: "Muslim wedding customs in Thailand", emoji: "💍", hint: "Nikah, walima, halal catering" },
  { slug: "turkish-restaurant-history-bangkok", title: "Turkish restaurant scene in Bangkok", emoji: "🥙", hint: "How Bangkok became a kebab capital" },
];
