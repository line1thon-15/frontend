// Y4-1 감정 온도계
// 연습 시작 전에 지금 기분을 골라요. 고른 기분은 서버로 보내지 않고 저장하지도 않아요.
import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import StatusBar from '../components/common/StatusBar.jsx'
import Header from '../components/common/Header.jsx'
import Choice from '../components/common/Choice.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'
import { startPractice, startRetry } from '../api/practice.js'
import { toMessage } from '../api/errors.js'

// level: 막대가 채워지는 개수 (5 = 아주 좋아)
const MOODS = [
  { level: 5, choice: '아주 좋아', label: '아주 좋아요' },
  { level: 4, choice: '좋아', label: '좋아요' },
  { level: 3, choice: '보통이야', label: '보통이에요' },
  { level: 2, choice: '조금 불안해', label: '조금 불안해요' },
  { level: 1, choice: '힘들어', label: '힘들어요' },
]

// 막대 높이 (왼쪽부터 점점 높아짐)
const BAR_HEIGHTS = ['h-6', 'h-8', 'h-10', 'h-14', 'h-[4.375rem]']

export default function EmotionCheck() {
  const navigate = useNavigate()
  const { areaId } = useParams()
  // 결과 화면의 '다시 연습하기'로 오면 ?retry=이전세션id 가 붙어요
  const [searchParams] = useSearchParams()
  const retryOf = searchParams.get('retry')
  const [level, setLevel] = useState(3)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState('')

  // 연습 시작 (고른 기분은 보내지 않아요)
  const handleStart = async () => {
    if (starting) return
    setStarting(true)
    setError('')
    try {
      const session = retryOf ? await startRetry(retryOf) : await startPractice(areaId)
      // 받은 세션을 넘겨서 대화 화면이 다시 부르지 않게 해요
      navigate(`/practice/${session.area}/chat/${session.session_id}`, { state: { session } })
    } catch (err) {
      setError(
        toMessage(err, {
          NO_SCENARIO_AVAILABLE: '지금은 이 연습을 할 수 없어요. 다른 연습을 골라 볼까요?',
        }),
      )
      setStarting(false)
    }
  }

  const mood = MOODS.find((m) => m.level === level)
  const showRestTip = level <= 3

  return (
    // 글자를 크게 하면 길어질 수 있어서 스크롤 가능 (스크롤바는 숨김)
    <div className="h-screen overflow-y-auto bg-page text-ink [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-h-full flex-col">
        <StatusBar />
        <Header title="현재 기분 체크" />

        <main className="flex flex-1 flex-col px-5 pt-4">
          <h2 className="text-[1.375rem] font-bold">지금 기분이 어때요?</h2>

          {/* 감정 온도계 */}
          <div className="mt-4 rounded-2xl bg-placeholder p-4">
            <p className="flex items-baseline gap-1">
              <span className="text-xl font-bold">{level}</span>
              <span className="text-sm text-muted">/ 5</span>
              <span className="ml-2 text-sm">{mood.label}</span>
            </p>
            <div className="mt-3 flex items-end gap-2" aria-hidden="true">
              {BAR_HEIGHTS.map((height, i) => {
                const filled = i < level
                const current = i === level - 1
                return (
                  <span
                    key={height}
                    className={`flex-1 rounded-lg transition-colors ${height} ${
                      filled ? 'bg-mood' : 'bg-white'
                    } ${current ? 'border border-primary-strong' : ''}`}
                  />
                )
              })}
            </div>
          </div>

          {showRestTip && (
            <p className="mt-2 text-xs leading-relaxed text-muted">
              기분이 안 좋으면 오늘은 쉬어도 괜찮아요.
              <br />
              좋아하는 사람과 이야기해 보는 것도 좋아요.
            </p>
          )}

          <div role="radiogroup" aria-label="지금 기분" className="mt-4 flex flex-col gap-2.5">
            {MOODS.map((m) => (
              <Choice key={m.level} selected={level === m.level} onClick={() => setLevel(m.level)}>
                {m.choice}
              </Choice>
            ))}
          </div>
        </main>

        <div className="flex flex-col gap-2.5 px-5 pt-5 pb-4">
          {error && (
            <p role="alert" className="text-center text-sm text-alert">
              {error}
            </p>
          )}
          <Button disabled={starting} onClick={handleStart}>
            {starting ? '연습을 준비하고 있어요…' : '연습 시작하기'}
          </Button>
          <Button variant="soft" onClick={() => navigate('/home')}>
            오늘은 쉬기
          </Button>
        </div>

        <HomeIndicator />
      </div>
    </div>
  )
}
