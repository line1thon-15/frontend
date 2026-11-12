// Y7-5 성장 기록 (내 성장 기록)
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/common/StatusBar.jsx'
import Header from '../components/common/Header.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'

// TODO: 백엔드 연동 후 성장 기록 API에서 받아오기
const MOCK = {
  summary: [
    { label: '연습', value: 12 },
    { label: '찾은 단서', value: 8 },
    { label: '심화 연습', value: 4 },
  ],
  areas: [
    { id: 'fraud', label: '게임 아이템·용돈 사기', progress: 70, badge: true },
    { id: 'friend-request', label: '친구의 무리한 부탁', progress: 40, badge: false },
    { id: 'money', label: '가게 이용·계산', progress: 20, badge: false },
  ],
  weakClues: ['너무 싼 가격', '친구인 척하는 말'],
  latestAnswer: {
    text: '비밀번호는 알려 줄 수 없어. 부모님께 먼저 물어보고 답할게',
    method: '글로 답함',
    result: '잘 지켰어요',
  },
}

function Card({ className = '', children }) {
  return <section className={`rounded-[1.125rem] p-4 ${className}`}>{children}</section>
}

export default function ChildGrowth() {
  const navigate = useNavigate()
  const { summary, areas, weakClues, latestAnswer } = MOCK

  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <StatusBar />
      <Header title="내 성장 기록" />

      <main className="flex flex-1 flex-col gap-3 px-5 pt-3">
        <ul className="grid grid-cols-3 gap-2">
          {summary.map((item) => (
            <li key={item.label} className="flex flex-col items-center gap-0.5 rounded-[1.125rem] bg-surface-soft p-4">
              <p className="text-[1.375rem] font-bold">{item.value}</p>
              <p className="text-xs text-subtle">{item.label}</p>
            </li>
          ))}
        </ul>

        <Card className="border border-line bg-white">
          <h2 className="text-sm font-bold text-muted">영역별 연습</h2>
          <ul className="mt-2.5 flex flex-col gap-2.5">
            {areas.map((area) => (
              <li key={area.id}>
                <div className="flex items-center justify-between text-sm">
                  <span>{area.label}</span>
                  {area.badge && (
                    <span className="rounded-full bg-chip px-3 py-1.5 text-[0.8125rem] font-medium text-primary-ink">
                      배지
                    </span>
                  )}
                </div>
                <div
                  className="mt-1.5 h-2 w-full rounded-full bg-chip"
                  role="progressbar"
                  aria-label={`${area.label} 진행률`}
                  aria-valuenow={area.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="h-full rounded-full bg-primary" style={{ width: `${area.progress}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="border border-success-soft bg-surface-soft">
          <h2 className="text-sm font-bold text-muted">더 연습이 필요한 단서</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {weakClues.map((clue) => (
              <li
                key={clue}
                className="rounded-full border border-clue-ink bg-clue-soft px-3 py-1.5 text-[0.8125rem] font-medium text-clue-ink"
              >
                {clue}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="border border-line bg-white">
          <h2 className="text-sm font-bold text-muted">최근 내가 직접 한 답</h2>
          <p className="mt-2 text-[0.9375rem] leading-[1.45]">“{latestAnswer.text}”</p>
          <div className="mt-3 flex gap-2">
            <span className="rounded-full bg-chip px-3 py-1.5 text-[0.8125rem] font-medium text-primary-ink">
              ✏️ {latestAnswer.method}
            </span>
            <span className="rounded-full border border-success bg-success-soft px-3 py-1.5 text-[0.8125rem] font-medium text-success">
              {latestAnswer.result}
            </span>
          </div>
        </Card>

        <p className="text-xs text-faint">
          심화 연습이 더 쌓이면 내 답이 어떻게 달라졌는지 비교해 볼 수 있어요
        </p>
      </main>

      <div className="px-5 pt-4 pb-4">
        <Button onClick={() => navigate('/home')}>홈으로</Button>
      </div>

      <HomeIndicator />
    </div>
  )
}
