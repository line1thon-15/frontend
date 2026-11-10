// G3 성장 요약 (보호자)
import StatusBar from '../components/common/StatusBar.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'

// TODO: 백엔드 연동 후 보호자 성장 요약 API에서 받아오기
const MOCK = {
  nickname: '하늘',
  alert: {
    time: '11/3 (화) 오후 4:12',
    title: '확인이 필요한 메시지 결과가 있었어요',
    description: '메시지 내용과 사진은 공유되지 않아요. 아이와 편하게 이야기해 보세요.',
  },
  stats: [
    { label: '이번 주 연습', value: '12회' },
    { label: '먼저 판단', value: '62%' },
    { label: '약한 단서', value: '2개' },
  ],
  weeks: ['3주 전', '2주 전', '지난주', '이번 주'],
  trends: {
    missed: { label: '위험 놓침', values: [40, 32, 28, 18] },
    doubt: { label: '정상 의심', values: [30, 26, 22, 20] },
    first: { label: '먼저 판단', values: [34, 58, 46, 62] },
  },
  areas: [
    { label: '게임 아이템·용돈 사기', progress: 80 },
    { label: '친구의 무리한 부탁', progress: 40 },
  ],
}

// 받침이 있는 이름 뒤에는 '이'를 붙여요 (하늘 → 하늘이, 강아지 → 강아지)
function callName(name) {
  const code = name.charCodeAt(name.length - 1) - 0xac00
  const hasBatchim = code >= 0 && code <= 11171 && code % 28 !== 0
  return hasBatchim ? `${name}이` : name
}

export default function GuardianSummary() {
  const { nickname, stats } = MOCK

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <StatusBar />

      <main className="flex flex-1 flex-col gap-3 px-5 pt-3">
        <h1 className="py-2 text-lg font-bold">{callName(nickname)}의 성장 요약</h1>

        <ul className="grid grid-cols-3 gap-2">
          {stats.map((item) => (
            <li key={item.label} className="rounded-2xl bg-surface-soft py-3 text-center">
              <p className="text-xl font-bold">{item.value}</p>
              <p className="mt-0.5 text-xs text-muted">{item.label}</p>
            </li>
          ))}
        </ul>

      </main>

      <HomeIndicator />
    </div>
  )
}
