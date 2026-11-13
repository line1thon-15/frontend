// Y4-2·Y4-3 연습 대화
// AI가 상대 역할을 하고, 아이는 선택지로 답해요.
// 언제 끝날지는 백엔드가 판단해서 응답의 status로 알려 줘요.
//   in_progress → 다음 대사·선택지 / ended → Y5 연습 결과 / stopped → 안전 멈춤(안내 문구 + 홈으로)
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import StatusBar from '../components/common/StatusBar.jsx'
import Header from '../components/common/Header.jsx'
import Bubble from '../components/common/Bubble.jsx'
import Choice from '../components/common/Choice.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'
import { answerTurn, getSession } from '../api/practice.js'
import { toMessage } from '../api/errors.js'
import { ApiError } from '../api/client.js'
import { AREA_LABEL } from '../api/areas.js'

// 아이 답은 최대 4번 (백엔드 규칙) — 위 칩에 "연습 n / 4"로 보여 줘요
const MAX_TURNS = 4

function Chip({ className, children }) {
  return <span className={`rounded-full px-3 py-1.5 text-sm font-medium ${className}`}>{children}</span>
}

// 받은 턴의 AI 대사를 말풍선 목록에 붙여요 (같은 턴은 한 번만)
function withAiLine(messages, turn) {
  if (!turn) return messages
  const key = `ai-${turn.turn_index}`
  if (messages.some((m) => m.key === key)) return messages
  return [...messages, { key, from: 'other', text: turn.ai_line }]
}

// 내가 고른 답 말풍선 (같은 턴은 한 번만)
function withMyAnswer(messages, turnIndex, text) {
  const key = `me-${turnIndex}`
  if (messages.some((m) => m.key === key)) return messages
  return [...messages, { key, from: 'me', text }]
}

export default function PracticeChat() {
  const navigate = useNavigate()
  const location = useLocation()
  const { areaId, sessionId } = useParams()
  const bottomRef = useRef(null)

  // 시작 화면에서 넘겨준 세션이 있으면 그대로 쓰고, 없으면(새로고침 등) A16으로 불러와요
  const initial = location.state?.session?.session_id === sessionId ? location.state.session : null
  const [session, setSession] = useState(initial)
  const [messages, setMessages] = useState(() => withAiLine([], initial?.turn))
  const [loadError, setLoadError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [hintShown, setHintShown] = useState(false)

  const turn = session?.turn ?? null
  const goResult = useCallback(
    () => navigate(`/practice/${areaId}/result/${sessionId}`, { replace: true }),
    [navigate, areaId, sessionId],
  )

  // 응답 하나를 화면에 반영해요 (A16·A17 공통)
  const apply = useCallback(
    (next) => {
      if (next.status === 'ended') {
        // 마무리 대사 없이 바로 결과 화면으로
        goResult()
        return
      }
      setSession(next)
      setMessages((prev) => withAiLine(prev, next.turn))
      setSelected(null)
      setHintShown(false)
    },
    [goResult],
  )

  // 현재 턴 다시 불러오기 (처음 열 때, 이미 처리된 답일 때)
  const reload = useCallback(async () => {
    setLoadError(null)
    try {
      apply(await getSession(sessionId))
    } catch (err) {
      setLoadError(err)
    }
  }, [apply, sessionId])

  useEffect(() => {
    if (!initial) reload()
    // 처음 한 번만
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 새 메시지가 생기면 아래로 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, hintShown, session?.status])

  const answer = async () => {
    if (selected === null || submitting || !turn) return
    const choice = turn.choices[selected]
    // 응답이 올 때까지 다시 누를 수 없어요 (두 번 누르면 409)
    setSubmitting(true)
    setError('')
    try {
      const next = await answerTurn(sessionId, { choiceId: choice.id, turnIndex: turn.turn_index })
      setMessages((prev) => withMyAnswer(prev, turn.turn_index, choice.text))
      apply(next)
    } catch (err) {
      if (err instanceof ApiError && err.code === 'TURN_ALREADY_ANSWERED') {
        // 이미 처리된 답 → 에러 대신 지금 턴을 다시 불러와요
        setMessages((prev) => withMyAnswer(prev, turn.turn_index, choice.text))
        await reload()
      } else if (err instanceof ApiError && err.code === 'SESSION_ENDED') {
        goResult()
      } else if (err instanceof ApiError && err.code === 'SESSION_STOPPED') {
        navigate('/home', { replace: true })
      } else if (err instanceof ApiError && err.code === 'INVALID_CHOICE') {
        // 선택지가 바뀌었을 수 있어서 지금 턴을 다시 불러와요
        await reload()
      } else {
        // 503 AI_UNAVAILABLE 등 → 고른 답은 그대로 두고 다시 보낼 수 있게
        setError(
          toMessage(err, {
            AI_UNAVAILABLE: '잠시 문제가 생겼어요. 같은 답으로 다시 보내 볼까요?',
          }),
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  const stopped = session?.status === 'stopped'
  const title = AREA_LABEL[session?.area ?? areaId] ?? '연습 대화'

  return (
    <div className="flex h-screen flex-col bg-page text-ink">
      <StatusBar />
      <Header title={title} />

      {/* 대화 영역만 스크롤 (스크롤바 숨김) */}
      <main className="flex-1 overflow-y-auto px-5 pt-3 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {!session && !loadError && <p className="mt-10 text-center text-sm text-subtle">대화를 불러오고 있어요…</p>}

        {!session && loadError && (
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-muted">{toMessage(loadError, { SESSION_NOT_FOUND: '연습을 찾을 수 없어요.' })}</p>
            <button type="button" onClick={reload} className="cursor-pointer text-sm underline">
              다시 불러오기
            </button>
          </div>
        )}

        {session && (
          <>
            {!stopped && turn && (
              <div className="flex gap-1.5">
                {/* TODO: "연습 n/4" 표시 여부는 백엔드와 확정 필요 (의심 답이면 4번 전에 끝나요) */}
                <Chip className="border border-primary bg-chip text-primary-ink">
                  연습 {turn.turn_index + 1} / {MAX_TURNS}
                </Chip>
              </div>
            )}

            {turn && !stopped && (
              <p className="mt-3 text-xs text-subtle">
                {turn.platform} · {turn.speaker_name}
              </p>
            )}

            <div className="mt-3 flex flex-col gap-3">
              {messages
                // 안전 멈춤 안내 문구는 말풍선 대신 아래 안내 상자로 보여 줘요
                .filter((m) => !(stopped && m.key === `ai-${turn?.turn_index}`))
                .map((m) => (
                  <Bubble key={m.key} from={m.from}>
                    {m.text}
                  </Bubble>
                ))}
            </div>

            {/* 안전 멈춤: 서버가 준 안내 문구 + 홈으로 (선택지 없음, 결과 화면으로 안 감) */}
            {stopped && turn && (
              <div className="mt-6 rounded-3xl border border-line bg-white px-5 py-4">
                <p className="text-[0.9375rem] leading-relaxed break-keep">{turn.ai_line}</p>
              </div>
            )}

            {/* 힌트 (1차에는 서버가 항상 비워서 보내요 → 있을 때만 보여 줘요) */}
            {!stopped && hintShown && turn?.hint && (
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

            {!stopped && turn && (
              <>
                <p className="mt-6 mb-2.5 text-[0.9375rem] text-subtle">나는 이렇게 답할래요</p>
                <div role="radiogroup" aria-label="답 고르기" className="flex flex-col gap-2.5">
                  {turn.choices.map((c, i) => (
                    <Choice key={c.id} selected={selected === i} onClick={() => !submitting && setSelected(i)}>
                      {c.text}
                    </Choice>
                  ))}
                </div>
              </>
            )}

            {error && (
              <p role="alert" className="mt-4 text-center text-sm text-alert">
                {error}
              </p>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </main>

      {stopped ? (
        <div className="flex h-[4.5rem] items-center px-5">
          <Button onClick={() => navigate('/home', { replace: true })}>홈으로</Button>
        </div>
      ) : (
        <div className={`grid h-[4.5rem] items-center gap-2.5 px-5 ${turn?.hint ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {turn?.hint && (
            <button
              type="button"
              onClick={() => setHintShown(true)}
              disabled={hintShown || submitting}
              className="h-14 cursor-pointer rounded-2xl border border-success bg-success-soft text-lg font-bold text-success transition disabled:cursor-default disabled:opacity-40"
            >
              힌트 사용하기💡
            </button>
          )}
          <Button disabled={selected === null || submitting || !turn} onClick={answer}>
            {submitting ? '보내는 중…' : '답하기'}
          </Button>
        </div>
      )}

      <HomeIndicator />
    </div>
  )
}
