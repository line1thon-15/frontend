// Y4-2·Y4-3 연습 대화
// AI가 상대 역할을 하고, 아이는 선택지로 답해요.
// 종료 규칙(백엔드가 판정): 의심하는 답을 고르면 바로 종료, 아니면 4번째 답에서 종료 → Y5 연습 결과
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StatusBar from '../components/common/StatusBar.jsx'
import Header from '../components/common/Header.jsx'
import Bubble from '../components/common/Bubble.jsx'
import Choice from '../components/common/Choice.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'

const MAX_TURNS = 4

// TODO: 연습 세션 API(T-15) 연동 — 지금은 피그마 시안의 첫 턴만 넣어 둠
// 다음 턴 대사·선택지·힌트와 종료 여부는 백엔드 응답으로 받을 예정
const MOCK_SESSION = {
  title: '게임 아이템 거래',
  round: 2,
  totalRounds: 5,
  hints: 2,
  turns: [
    {
      ai: ['안녕! 나 한정판 아이템 있는데 반값에 줄게 ㅎㅎ', '대신 지금 바로 문화상품권 번호를 보내줘야 해!'],
      hint: '"지금 바로"와 "상품권 번호"를 다시 읽어 보세요',
      choices: ['좋아! 번호 보내 줄게', '부모님께 먼저 물어볼게', '직접 만나서 거래하자'],
    },
  ],
}

function Chip({ className, children }) {
  return <span className={`rounded-full px-3 py-1.5 text-sm font-medium ${className}`}>{children}</span>
}

export default function PracticeChat() {
  const navigate = useNavigate()
  const { areaId } = useParams()
  const session = MOCK_SESSION
  const bottomRef = useRef(null)

  const [turnIndex, setTurnIndex] = useState(0)
  const [messages, setMessages] = useState(() => session.turns[0].ai.map((text) => ({ from: 'other', text })))
  const [selected, setSelected] = useState(null)
  const [hintsLeft, setHintsLeft] = useState(session.hints)
  const [hintShown, setHintShown] = useState(false)
  const [finished, setFinished] = useState(false)

  const turn = session.turns[turnIndex]

  // 새 메시지가 생기면 아래로 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, hintShown])

  const showHint = () => {
    if (hintsLeft === 0 || hintShown) return
    setHintsLeft((n) => n - 1)
    setHintShown(true)
  }

  const answer = () => {
    if (selected === null || finished) return
    const text = turn.choices[selected]
    setMessages((prev) => [...prev, { from: 'me', text }])
    setSelected(null)
    setHintShown(false)

    // TODO: 백엔드가 종료 여부와 다음 턴을 응답으로 알려주면 그 값 사용
    //       (규칙: 의심하는 답이면 바로 종료, 아니면 4번째 답에서 종료)
    const next = session.turns[turnIndex + 1]
    if (!next || turnIndex + 1 >= MAX_TURNS) {
      setFinished(true)
      setTimeout(() => navigate(`/practice/${areaId}/result`), 800)
      return
    }

    setTurnIndex((i) => i + 1)
    setTimeout(() => {
      setMessages((prev) => [...prev, ...next.ai.map((t) => ({ from: 'other', text: t }))])
    }, 500)
  }

  return (
    <div className="flex h-screen flex-col bg-page text-ink">
      <StatusBar />
      <Header title={session.title} />

      {/* 대화 영역만 스크롤 (스크롤바 숨김) */}
      <main className="flex-1 overflow-y-auto px-5 pt-3 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-1.5">
          <Chip className="border border-primary bg-chip text-primary-ink">
            연습 {session.round} / {session.totalRounds}
          </Chip>
          <Chip className="border-[0.8px] border-success bg-success-soft text-success">힌트 {hintsLeft}개 남음</Chip>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {messages.map((m, i) => (
            <Bubble key={i} from={m.from}>
              {m.text}
            </Bubble>
          ))}
        </div>

        {hintShown && (
          <div className="relative mt-5 rounded-3xl bg-success-soft px-5 py-3.5">
            {/* 피그마처럼 긴 점선 테두리 (CSS dashed는 점 간격을 못 바꿔서 SVG로 그림)
                pathLength=960, 7+5 간격 → 정확히 80번 반복돼서 이음새 없이 고르게 끊겨요 */}
            <svg className="pointer-events-none absolute inset-0 size-full overflow-visible" aria-hidden="true">
              <rect
                x="0.5"
                y="0.5"
                rx="24"
                style={{ width: 'calc(100% - 1px)', height: 'calc(100% - 1px)' }}
                fill="none"
                stroke="var(--color-success)"
                strokeWidth="1"
                pathLength="960"
                strokeDasharray="7 5"
              />
            </svg>
            <p className="text-[0.9375rem] font-bold text-success">힌트</p>
            <p className="mt-1 text-[0.9375rem]">{turn.hint}</p>
          </div>
        )}

        {!finished && (
          <>
            <p className="mt-6 mb-2.5 text-[0.9375rem] text-subtle">나는 이렇게 답할래요</p>
            <div role="radiogroup" aria-label="답 고르기" className="flex flex-col gap-2.5">
              {turn.choices.map((c, i) => (
                <Choice key={c} selected={selected === i} onClick={() => setSelected(i)}>
                  {c}
                </Choice>
              ))}
            </div>
          </>
        )}
        <div ref={bottomRef} />
      </main>

      <div className="grid h-[4.5rem] grid-cols-2 items-center gap-2.5 px-5">
        <button
          type="button"
          onClick={showHint}
          disabled={hintsLeft === 0 || hintShown || finished}
          className="h-14 rounded-2xl border border-success bg-success-soft text-lg font-bold text-success transition disabled:opacity-40"
        >
          힌트 사용하기💡
        </button>
        <Button disabled={selected === null || finished} onClick={answer}>
          답하기
        </Button>
      </div>

      <HomeIndicator />
    </div>
  )
}
