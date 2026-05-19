# 캐나다 서부 로드트립 PWA

Vancouver → Calgary 10박 11일 (2026-08-04 → 2026-08-14) 개인용 여행 동반 앱.

## 라이브
> 자동 배포 실패 — 아래 "배포" 섹션을 참고해 직접 푸시 필요.
> Vercel 팀: **james-projects21** (BEOMSOO HWANG's projects)
> Vercel 대시보드: https://vercel.com/james-projects21

## 스택
- Next.js 14 App Router (TypeScript strict)
- Tailwind CSS · lucide-react
- react-leaflet + OpenStreetMap (API 키 불필요)
- js-yaml (서버사이드 데이터 로딩)
- 핸드롤드 PWA — `public/manifest.json` + `public/sw.js`

## 화면
1. `/` — D-day 카운트다운 (출발 전) / 오늘 일정 (여행 중) / 회상 (이후)
2. `/itinerary` & `/itinerary/[day]` — 11일 일정
3. `/map` — Leaflet OSM 지도, 마커+폴리라인 (전 도시 자동 fit-bounds)
4. `/drives` — 6개 드라이브 구간, Saskatchewan Crossing 주유 강조
5. `/food` — 도시별 럭셔리·파인다이닝, 예약필수/드레스코드 태그
6. `/reservations` — 전 항공권 + 호텔 예약번호 (탭하여 복사)
7. `/photos` — 골든아워 시간표 (2026-08 록키 일출/일몰)
8. `/packing` — localStorage 체크박스
9. `/info` — 세금/팁/비상/한식·한국 마트
10. `/more` — 나머지 메뉴 진입

## 로컬 실행
```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # 프로덕션 빌드
```

## 배포 (Vercel)
이 프로젝트는 Vercel용으로 설정됨. 두 가지 방법:

### A. Vercel CLI (가장 빠름)
```bash
npm i -g vercel
cd canada_trip
vercel                  # 신규 프로젝트 생성 (팀: james-projects21 선택)
vercel deploy --prod    # 프로덕션 배포
```

### B. Vercel 대시보드 import
1. https://vercel.com/james-projects21 접속
2. **Add New → Project → Import** → 이 디렉토리를 GitHub에 푸시 후 import
3. Framework Preset = **Next.js** (자동 감지) → Deploy

> 자동 배포 시도가 빌드 환경(sandbox)에서 막힌 이유:
> npm 레지스트리(registry.npmjs.org) 및 api.vercel.com이 sandbox 프록시 allowlist에서 차단되어 있음.
> 호스트 PC에서 위 두 방법 중 하나로 직접 진행 필요.

## 데이터 수정
모든 여행 정보(일정, 식당, 사진 스팟, 짐 리스트, 예약번호 등)는
`data/trip.yaml` 한 파일에서 관리. 수정 → 재배포면 끝.

## 파일 구조
```
canada_trip/
├── app/              # App Router 페이지
├── components/       # 클라이언트/서버 컴포넌트
├── data/trip.yaml    # 모든 여행 데이터
├── lib/trip.ts       # YAML 로더 + 타입
├── public/           # PWA manifest, SW, 아이콘
└── package.json
```
