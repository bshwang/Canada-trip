# 캐나다 서부 로드트립 PWA

Vancouver → Calgary 10박 11일 (2026-08-04 → 2026-08-14) 개인용 여행 동반 앱.

## 라이브
> Vercel 팀: **james-projects21** · 대시보드: https://vercel.com/james-projects21
> Firebase: **canada-trip-caff5** · 콘솔: https://console.firebase.google.com/project/canada-trip-caff5

## 스택
- Next.js 14 App Router (TypeScript strict)
- Tailwind CSS · lucide-react
- react-leaflet + OpenStreetMap (API 키 불필요)
- **Firebase Auth (Google 로그인) + Firestore** — 모든 편집 데이터를 클라우드 동기화
- Firestore 오프라인 IndexedDB persistence — Icefields 같은 데이터 안 터지는 곳에서도 동작
- js-yaml — 시드 데이터 (`data/trip.yaml`) 로딩
- 핸드롤드 PWA — `public/manifest.json` + `public/sw.js`

## 화면
1. `/` — D-day 카운트다운 + 출발 전 체크리스트 / 오늘 일정 (여행 중) / 회상 (이후)
2. `/itinerary` & `/itinerary/[day]` — 일정 + 활동/숙소/드라이브 **추가/수정/삭제**, 일자별 노트
3. `/map` — Leaflet OSM 지도
4. `/drives` — 6개 드라이브 구간
5. `/food` — 도시별 식당 **추가/수정/삭제** (도시도 추가 가능)
6. `/reservations` — 항공·호텔·렌터카·투어 **추가/수정/삭제**
7. `/photos` — 포토 스팟 **추가/수정/삭제**
8. `/budget` — 일자별 지출 (CAD↔KRW 환율, 카테고리별 합계)
9. `/packing` — 항목 **추가/수정/삭제** + 체크박스
10. `/safety` — 곰·야생동물 안전 가이드
11. `/info` — 세금/팁/비상/한식 + 환율 변환 위젯
12. `/account` — Google 로그인 (클라우드 동기화)
13. `/backup` — JSON 백업/복원
14. `/more` — 나머지 메뉴 진입

## 데이터 모델

`data/trip.yaml`은 **초기 시드만**. 사용자가 처음 페이지에 진입할 때 시드가 캐시에 복사되고,
이후 모든 편집은 Firestore (로그인 시) + localStorage (캐시)에 저장.

- 로그인 안 한 경우: 이 기기 브라우저에만 저장 (PWA 캐시 지우면 사라짐)
- 로그인한 경우: `users/{uid}/state/{key}` 문서에 저장 → 모든 기기 동기화
- 오프라인: Firestore IndexedDB persistence가 자동으로 캐시 → 온라인 복귀 시 동기화

## Firebase 설정 (배포 전 필수)

### 1. Firebase 콘솔에서 웹 앱 등록
1. https://console.firebase.google.com/project/canada-trip-caff5/overview
2. **앱 추가 → Web (`</>`)** → 닉네임 "canada-trip-pwa" → 등록
3. 표시되는 `firebaseConfig` 객체의 6개 값을 복사

### 2. Authentication > Google 로그인 활성화
1. 좌측 **Authentication → Sign-in method**
2. **Google** 행 클릭 → 사용 설정 → 프로젝트 지원 이메일 선택 → 저장
3. **Settings → Authorized domains**에 Vercel 도메인 추가 (예: `canada-trip.vercel.app`)

### 3. Firestore 데이터베이스 생성
1. 좌측 **Firestore Database → 데이터베이스 만들기**
2. **프로덕션 모드 시작** → 리전 선택 (예: `asia-northeast3` 서울)
3. **규칙** 탭 → `firestore.rules` 파일 내용 붙여넣기 → 게시

### 4. Vercel 환경변수 설정
Vercel 프로젝트 **Settings → Environment Variables**에 다음 6개 추가
(Production/Preview/Development 모두 체크):

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=canada-trip-caff5.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=canada-trip-caff5
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=canada-trip-caff5.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

추가 후 **Deployments → 최신 → Redeploy** 클릭.

### 5. 로컬 개발용
`.env.example`을 `.env.local`로 복사하고 값 채우기:
```bash
cp .env.example .env.local
```

## 로컬 실행
```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # 프로덕션 빌드
```

## 배포 (Vercel)

### A. GitHub 자동 배포 (추천)
- GitHub `bshwang/Canada-trip` 저장소에 푸시 → Vercel이 자동 빌드/배포

### B. Vercel CLI
```bash
npm i -g vercel
vercel              # 신규 프로젝트 (팀: james-projects21)
vercel deploy --prod
```

## 파일 구조
```
canada_trip/
├── app/              # App Router 페이지
├── components/       # 클라이언트/서버 컴포넌트
├── data/trip.yaml    # 초기 시드 데이터
├── lib/
│   ├── trip.ts       # YAML 로더 + 타입
│   ├── firebase.ts   # Firebase 초기화
│   ├── auth.tsx      # AuthProvider + useAuth
│   └── store.ts      # useTripData / useTripList / useTripMap
├── firestore.rules   # Firestore 보안 규칙
├── public/           # PWA manifest, SW, 아이콘
└── package.json
```
