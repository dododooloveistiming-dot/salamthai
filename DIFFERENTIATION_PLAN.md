# Salaam Thailand — 데이터 차별화 4-Track 플랜

> **전제:** 데이터 양은 이미 OK (34 niches × 2,310 places). 이제 **"왜 다른 사이트 말고 우리?"** 답하는 4트랙 데이터 작업.

---

## Track 1: Vision AI 사진 증거

**왜 차별화:** 기존 할랄 사이트는 모두 셀프 신고 기반. 우리는 **"이 사진에 할랄 인증서가 보이고 / 기도매트가 있고 / 주류가 없음을 GPT-4 vision으로 검증"** 으로 시각적 증거 제공.

### Tech
- **API:** OpenAI GPT-4o-mini Vision (`gpt-4o-mini` 모델)
- **비용:** 사진당 ~$0.001, 100K 사진 ≈ **$100**
- **속도:** 5 RPS (rate limit), 100K 사진 ≈ 6시간

### 입력
- 기존 master CSV의 `photo_urls_json` 컬럼 (각 place당 1-8장)
- 총 ~100,000장 (모든 니치 합산)

### 출력 (새 컬럼: `photo_signals_json`)
```json
[
  {
    "url": "https://lh3.googleusercontent.com/...",
    "signals_positive": ["halal_cert_displayed", "prayer_mat", "qibla_arrow", "hijabi_staff"],
    "signals_negative": ["alcohol_bottle", "pork_dish"],
    "signal_locations": {"halal_cert_displayed": "top-right wall", "alcohol_bottle": "back shelf"},
    "confidence": 0.92
  }
]
```

### 시그널 사전
**Positive (각 시그널마다 별도 카운터):**
- `halal_cert_displayed` — 할랄 인증서 사진/벽에 게시
- `cicot_logo` — CICOT 로고 식별
- `prayer_mat` — 기도 매트
- `qibla_arrow` — 키블라 표시
- `wudu_facility` — 우두 시설
- `hijabi_staff` — 히잡 매니저/직원
- `arabic_signage` — 아랍어 간판
- `mosque_visible` — 가까이 모스크 보임
- `family_section` — 가족 섹션 분리
- `no_alcohol_sign` — 노 알코올 명시 사인

**Negative:**
- `alcohol_bottle` — 주류 보임 (배경 포함)
- `pork_dish` — 돼지고기 요리/메뉴
- `bar_nearby` — 술집 인접
- `dog_present` — 개 보임 (할랄 환경 부적합)
- `non_halal_menu_item` — 메뉴에 비할랄 항목

### 구현 파일
- `C:\dbd-scraper\diff\analyze_photos_vision.py` — 메인 스크립트
- `C:\dbd-scraper\diff\merge_photo_signals.py` — master CSV에 머지

### Required
- [ ] OpenAI API key (환경변수 `OPENAI_API_KEY`)

---

## Track 2: CICOT 인증서 라이프사이클

**왜 차별화:** 다른 사이트는 "할랄 인증" 라벨만 보여줌. 우리는 **인증번호 + 만료일 + 인증 카테고리**까지 추적. 만료된 곳 자동 빨간 배지.

### Tech
- **소스:** Thailand Central Islamic Council (CICOT) 공식 DB — `halal.or.th`
- **기존 코드:** `C:\dbd-scraper\scrape_cicot.py` 있음, 확장 필요
- **API 키:** 없음 (공개 웹 스크랩)

### 출력 (새 컬럼)
| 컬럼 | 설명 |
|---|---|
| `cicot_cert_no` | 인증번호 (e.g., "12-3456/2024") |
| `cicot_issued_date` | 발급일 |
| `cicot_expiry_date` | 만료일 |
| `cicot_categories` | 인증 카테고리 (식품/식당/제품) |
| `cicot_status` | `active` / `expired` / `pending` / `unknown` |
| `cicot_business_name_th` | 인증된 정식 상호 (태국어) |

### 구현 파일
- `C:\dbd-scraper\scrape_cicot.py` — 확장 (라이프사이클 필드 추가)
- `C:\dbd-scraper\diff\merge_cicot_lifecycle.py` — 퍼지 매치 + 머지

### 매칭 전략
- 사업자 등록번호 매치 (best)
- 상호명 fuzzy match (rapidfuzz, 임계값 85%)
- 주소 토큰 매치

---

## Track 3: 다국어 무슬림 리뷰 통합

**왜 차별화:** 다른 사이트들은 영어/태국어만. 우리는 **GCC + 한국 + 중국 + 인니** 무슬림 여행객 리뷰까지.

### 3a. 아랍어 포럼
**소스:**
- Saudi Travel Forum (`saudi-travel.com`)
- Mawdoo3 Travel (`mawdoo3.com/travel`)
- Reddit `r/saudiarabia` + `r/MuslimTravel` 태국 키워드
- TripAdvisor Arabic locale

**구현:** `scrape_arabic_forums.py`
**난이도:** 중간 (대부분 robots.txt 허용, Arabic NLP 토큰화 필요)

### 3b. Xiaohongshu (小红书)
**소스:** 중국 무슬림 (위구르/회족) 여행 후기 — 태국 의료/할랄/모스크 키워드
**난이도:** **높음** — 공식 API 없음, 모바일 앱 API 리버스 엔지니어링 필요
**대안:**
- 제3자 API (TikAPI / RapidAPI) — 유료
- 또는 검색 결과만 헤드리스 브라우저로 스크랩

**구현:** `scrape_xiaohongshu.py` (스켈레톤만 — API key 결정 후 구체화)

### 3c. YouTube 자막 (Whisper 전사)
**소스:** 이미 수집한 `*_youtube_videos.csv` 의 video ID 사용
**처리:**
1. `yt-dlp`로 오디오 다운로드 (또는 자막 직접 추출 시도)
2. OpenAI Whisper API or 로컬 `whisper-large-v3` 로 전사
3. 무슬림 관련 키워드 추출 ("halal", "prayer", "kosher" — 위양성)

**비용:** OpenAI Whisper API $0.006/분, 평균 5분 비디오 × 5,000개 = ~$150
**대안:** 로컬 Whisper (CPU 느림, GPU 빠름) — 무료

**구현:** `transcribe_youtube_videos.py`

### 출력 (새 테이블 `community_threads_extended`)
기존 `community_threads` 구조 그대로 + `language` 컬럼 추가:
- `language`: `en` / `ko` / `th` / `zh` / `ja` / `ar` / `id`

---

## Track 4: 부정 시그널 (Negative Signals)

**왜 차별화:** 경쟁사가 절대 안 보여주는 것. **유저 신뢰 폭증**.

### 시그널 (텍스트 + 사진)

**A. 리뷰 텍스트 NLP** (rule-based, 즉시 가능)
- "alcohol nearby" / "주변에 술집" / "บาร์ใกล้ๆ"
- "pork served" / "돼지고기" / "หมู"
- "kitchen is shared" / "주방 공용"
- "expired certification" / "인증 만료"
- "no longer halal" / "더 이상 할랄 아님"

**B. CICOT 만료** (Track 2 의존)
- 인증 만료된 곳 자동 flag

**C. Vision AI** (Track 1 의존)
- 주류 병/돼지고기 사진에서 검출

**D. Cross-check** 
- Place 이름에 "Pork"/"Bacon"/"Pizza Hut" 등 비할랄 키워드 (false positive 주의)
- 위치 좌표 반경 100m 내 술집 (Google Places API)

### 출력 (새 컬럼: `negative_signals_json`)
```json
{
  "signals": [
    {
      "type": "alcohol_visible_in_photo",
      "evidence_url": "https://lh3.googleusercontent.com/...",
      "evidence_text": null,
      "source": "vision_ai",
      "detected_at": "2026-06-01",
      "severity": "high"
    },
    {
      "type": "cicot_cert_expired",
      "evidence_text": "Cert 12-3456 expired 2024-12-31",
      "source": "cicot_db",
      "detected_at": "2026-06-02",
      "severity": "critical"
    }
  ],
  "trust_penalty": 25  // trust_score 차감량 (0-50)
}
```

### 구현 파일
- `C:\dbd-scraper\diff\detect_negative_signals.py` — 통합 디텍터
- 트랙 1/2 출력 의존

### 법적/PR 주의사항
- "evidence-based"로만 표기 — `"Photo on 2026-05-12 shows alcohol bottle in background"` 식
- 절대 단정적 표현 X — "no longer halal" 같은 말 직접 X
- 비즈니스 owner 클레임 받을 채널 마련 (admin/ 에 이미 인프라 있음)

---

## 실행 순서 + ROI

| # | Track | 비용 | 시간 | 차별화 임팩트 |
|---|---|---|---|---|
| 1 | **Negative signals (rule-based 부분)** | $0 | 1일 | ⭐⭐⭐ |
| 2 | **CICOT 라이프사이클** | $0 | 2일 | ⭐⭐⭐⭐ |
| 3 | **Vision AI 사진 증거** | $100 | 1-2일 | ⭐⭐⭐⭐⭐ |
| 4 | **YouTube Whisper 전사** | $0-$150 | 2일 | ⭐⭐ |
| 5 | **아랍어 포럼** | $0 | 2-3일 | ⭐⭐⭐ |
| 6 | **Xiaohongshu** | $50-200 (3rd party API) | 3-5일 | ⭐⭐ |

**총 비용:** ~$300 (사진 vision 메인)  
**총 시간:** 2-3주 (혼자) 또는 1주 (병렬 가능 task 동시 진행)

---

## 디렉토리 구조

```
C:\dbd-scraper\diff\               ← 차별화 데이터 작업 전용
├── analyze_photos_vision.py
├── scrape_arabic_forums.py
├── scrape_xiaohongshu.py
├── transcribe_youtube_videos.py
├── detect_negative_signals.py
├── merge_photo_signals.py
├── merge_cicot_lifecycle.py
├── merge_diff_into_master.py     ← 4 트랙 결과 → master CSV 합치는 최종 머지
└── README.md
```

## 사이트 통합

머지 후 `scripts/build-data.mjs` 가 자동으로 새 컬럼 픽업.
사이트 코드 변경 필요:
- `lib/types.ts` → `Place` 인터페이스에 `photo_signals`, `cicot_lifecycle`, `negative_signals` 추가
- `app/[lang]/place/[slug]/page.tsx` → "Evidence" 섹션 신설 (사진 증거 + 인증 만료 배지 + 부정 시그널)
- `components/TrustGauge.tsx` → 부정 시그널 패널티 반영

---

## API Key / 자격증명 체크리스트

작업 시작 전 필요:
- [ ] **OpenAI API key** (Vision Track 1 + Whisper Track 3c)
  - 발급: https://platform.openai.com/api-keys
  - 환경변수: `OPENAI_API_KEY`
  - 예상 사용량: ~$300 (vision 100K + whisper 5K videos)
- [ ] **(선택) Xiaohongshu 3rd party API** (Track 3b)
  - TikAPI / RapidAPI 옵션
  - 결정 후 구체화

CICOT (Track 2), 아랍어 포럼 (Track 3a), 부정 시그널 (Track 4)은 API key 불필요.

---

## 메모리

이 플랜은 Claude Code 메모리에도 저장됨:
- `salaamthailand_differentiation.md`
- `MEMORY.md` 인덱스 업데이트

새 세션에서도 "차별화 4트랙" 키워드로 이어가기 가능.
