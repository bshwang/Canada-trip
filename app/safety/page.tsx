import Header from "@/components/Header";
import {
  Shield,
  AlertTriangle,
  Footprints,
  SprayCan,
  Car,
  Mountain,
  Phone,
} from "lucide-react";

export default function SafetyPage() {
  return (
    <>
      <Header title="야생동물 안전" subtitle="곰·엘크·사슴 · Bear Spray" />
      <div className="px-5 space-y-5 pb-4">
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex gap-3">
          <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            Banff·Yoho·Jasper는 흑곰(Black Bear)과 회색곰(Grizzly) 서식지입니다.
            대부분의 곰은 사람을 피하지만, 깜짝 마주침이 가장 위험합니다.
          </div>
        </div>

        <Card title="기본 수칙" icon={<Shield size={16} className="text-brand" />}>
          <ul className="text-sm text-stone-700 space-y-1.5 list-disc pl-5">
            <li>혼자 다니지 말고, 2~3인 이상이 함께 이동</li>
            <li>하이크 중 소리내며 걷기 (대화, 박수, 노래)</li>
            <li>음식·쓰레기·치약·향수는 절대 텐트/숙소 밖에 두지 않기</li>
            <li>새벽·해질녘은 곰 활동 시간 — 출발/복귀 시간 조절</li>
            <li>강아지 데려가지 않기 (곰을 자극)</li>
          </ul>
        </Card>

        <Card
          title="Bear Spray 사용법"
          icon={<SprayCan size={16} className="text-rose-600" />}
        >
          <ol className="text-sm text-stone-700 space-y-1.5 list-decimal pl-5">
            <li>허리벨트나 가슴 스트랩에 즉시 손이 닿게 휴대 (가방 속 X)</li>
            <li>안전핀 제거 → 곰이 <span className="font-semibold">4~5m 거리</span>까지 접근 시 분사</li>
            <li>곰 얼굴 방향으로 1~2초씩 짧게 분사, 바람 방향 주의</li>
            <li>곰이 도망가면 즉시 천천히 후퇴 (등 보이지 말기)</li>
            <li>비행기 수하물 위탁 X — 캐나다 현지에서 구매 (Canadian Tire, MEC, $40~50)</li>
          </ol>
        </Card>

        <Card
          title="곰을 만났을 때"
          icon={<Footprints size={16} className="text-stone-700" />}
        >
          <div className="space-y-3 text-sm text-stone-700">
            <div>
              <div className="font-semibold text-stone-900">멀리서 본 경우 (50m+)</div>
              <p className="text-stone-600">조용히 후퇴. 사진 욕심에 다가가지 말 것.</p>
            </div>
            <div>
              <div className="font-semibold text-stone-900">가까이 마주친 경우</div>
              <ul className="list-disc pl-5 text-stone-600 space-y-1">
                <li>침착하게, 등 보이지 말고 천천히 후퇴</li>
                <li>크고 차분한 목소리로 "Hey bear" 반복</li>
                <li>달리지 않기 (곰의 추격 본능 자극)</li>
                <li>키 커 보이게 팔 올리기, 무리는 모이기</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-stone-900">공격 받는 경우</div>
              <ul className="list-disc pl-5 text-stone-600 space-y-1">
                <li><span className="font-semibold">회색곰 (Grizzly)</span> — 죽은 척, 엎드려 목 보호</li>
                <li><span className="font-semibold">흑곰 (Black Bear)</span> — 끝까지 저항, 얼굴·코 가격</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card
          title="도로 위 야생동물"
          icon={<Car size={16} className="text-sky2" />}
        >
          <ul className="text-sm text-stone-700 space-y-1.5 list-disc pl-5">
            <li>Icefields Parkway·Bow Valley Parkway는 엘크·사슴·곰 빈번</li>
            <li>새벽·해질녘 시속 70km 이하로 감속</li>
            <li>도로에 동물 보이면 차 안에서 관찰, 절대 하차 금지</li>
            <li>충돌 시: 911 신고 + 차 가장자리로 이동 + 비상등</li>
          </ul>
        </Card>

        <Card
          title="하이크 시 추가 팁"
          icon={<Mountain size={16} className="text-emerald-700" />}
        >
          <ul className="text-sm text-stone-700 space-y-1.5 list-disc pl-5">
            <li>Larch Valley·Lake Agnes 등은 9~10월 곰 활동 피크</li>
            <li>Parks Canada 공지에서 "Bear in area" 트레일은 우회</li>
            <li>새끼곰 발견 시 즉시 후퇴 (어미는 100% 근처)</li>
            <li>음식 포장지·껍질도 모두 들고 나오기 (Leave No Trace)</li>
          </ul>
        </Card>

        <Card
          title="비상 연락"
          icon={<Phone size={16} className="text-rose-600" />}
        >
          <ul className="text-sm text-stone-700 space-y-1.5">
            <li><span className="font-mono font-semibold">911</span> — 응급 (생명 위협 시)</li>
            <li><span className="font-mono font-semibold">1-888-WARDENS</span> (1-888-927-3367) — Parks Canada 공원 경찰</li>
            <li><span className="font-mono">403-762-1470</span> — Banff Park 사무소</li>
          </ul>
        </Card>
      </div>
    </>
  );
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-stone-200 p-4">
      <h2 className="text-sm font-bold text-stone-800 mb-2 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}
