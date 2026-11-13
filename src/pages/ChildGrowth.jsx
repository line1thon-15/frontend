// Y7-5 성장 기록 (내 성장 기록)
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/common/StatusBar.jsx'
import Header from '../components/common/Header.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'
import { getGrowth } from '../api/me.js'
import { AREA_LABEL } from '../api/areas.js'
import { toMessage } from '../api/errors.js'
import { useLoad } from '../api/useLoad.js'

function Card({ className = '', children }) {
  return <section className={`rounded-[1.125rem] p-4 ${className}`}>{children}</section>
}

export default function ChildGrowth() {
  const navigate = useNavigate()
  const { status, data, error, reload } = useLoad(getGrowth)

  const areas = data?.areas ?? []
  const weakClues = data?.needs_practice_cues.map((cue) => cue.label) ?? []
  // 피그마의 '찾은 단서'·'심화 연습' 숫자는 /me/growth 응답에 없어, 서버가 주는 값으로 바꿨어요.
  const summary = [
    { label: '연습', value: areas.reduce((sum, a) => sum + a.practice_count, 0) },
    { label: '배지', value: areas.reduce((sum, a) => sum + a.badges.length, 0) },
    { label: '연속 기록(일)', value: data?.streak_days ?? 0 },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <StatusBar />
      <Header title="내 성장 기록" />

      <main className="flex flex-1 flex-col gap-3 px-5 pt-3">
        {status === 'error' && (
          <p role="alert" className="text-sm text-[#b4234a]">
            {toMessage(error)}{' '}
            <button type="button" onClick={reload} className="underline">
              다시 시도
            </button>
          </p>
        )}

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
            {areas.map((item) => (
              <li key={item.area}>
                <div className="flex items-center justify-between text-sm">
                  <span>{AREA_LABEL[item.area] ?? item.area}</span>
                  {item.badges.length > 0 && (
                    <span className="rounded-full bg-chip px-3 py-1.5 text-[0.8125rem] font-medium text-primary-ink">
                      배지
                    </span>
                  )}
                </div>
                {/* 진행률 막대는 서버가 값을 주지 않아, 연습 횟수로 보여 줘요 */}
                <p className="mt-1 text-[0.8125rem] text-subtle">{item.practice_count}번 연습했어요</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="border border-success-soft bg-surface-soft">
          <h2 className="text-sm font-bold text-muted">더 연습이 필요한 단서</h2>
          {status === 'done' && weakClues.length === 0 && (
            <p className="mt-2 text-[0.8125rem] text-subtle">아직 없어요</p>
          )}
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

        {/* TODO: '최근 내가 직접 한 답' 카드는 서버가 주는 값이 없어 빼 뒀어요 — 백엔드와 확인 필요 */}

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
