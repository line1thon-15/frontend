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

export default function ChildGrowth() {
  const navigate = useNavigate()
  const { summary } = MOCK

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <StatusBar />
      <Header title="내 성장 기록" />

      <main className="flex flex-1 flex-col gap-3 px-5 pt-3">
        <ul className="grid grid-cols-3 gap-2">
          {summary.map((item) => (
            <li key={item.label} className="rounded-2xl bg-surface-soft py-3 text-center">
              <p className="text-xl font-bold">{item.value}</p>
              <p className="mt-0.5 text-xs text-muted">{item.label}</p>
            </li>
          ))}
        </ul>

      </main>

      <div className="px-5 pt-4 pb-4">
        <Button onClick={() => navigate('/home')}>홈으로</Button>
      </div>

      <HomeIndicator />
    </div>
  )
}
