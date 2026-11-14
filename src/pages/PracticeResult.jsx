// Y5 연습 결과
import { useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StatusBar from '../components/common/StatusBar.jsx'
import Header from '../components/common/Header.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'
import { getResult } from '../api/practice.js'
import { useLoad } from '../api/useLoad.js'
import { toMessage } from '../api/errors.js'
import { ApiError } from '../api/client.js'

// 카드 level → 색 (green 초록 / yellow 노랑 / red 빨강)
const LEVEL_STYLE = {
  green: 'border-success bg-success-soft',
  yellow: 'border-primary bg-chip',
  red: 'border-alert bg-alert-soft',
}

function Card({ title, className, children }) {
  return (
    <section className={`rounded-3xl p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-muted">{title}</h3>
      <div className="mt-2.5">{children}</div>
    </section>
  )
}

export default function PracticeResult() {
  const navigate = useNavigate()
  const { areaId, sessionId } = useParams()
  const load = useCallback(() => getResult(sessionId), [sessionId])
  const { status, data, error, reload } = useLoad(load)

  // 아직 안 끝난 연습이면 대화로 돌려보내요
  const notEnded = status === 'error' && error instanceof ApiError && error.code === 'SESSION_NOT_ENDED'
  useEffect(() => {
    if (notEnded) navigate(`/practice/${areaId}/chat/${sessionId}`, { replace: true })
  }, [notEnded, navigate, areaId, sessionId])

  return (
    // 글자를 크게 하면 길어질 수 있어서 스크롤 가능 (스크롤바는 숨김)
    <div className="h-screen overflow-y-auto bg-page text-ink [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-h-full flex-col">
        <StatusBar />
        <Header title="연습 결과" />

        <main className="flex flex-1 flex-col px-5 pt-4">
          {status === 'loading' && <p className="mt-10 text-center text-sm text-subtle">결과를 불러오고 있어요…</p>}

          {/* 503 AI_UNAVAILABLE 등 → 다시 시도 */}
          {status === 'error' && (
            <div className="mt-10 flex flex-col items-center gap-3 text-center">
              <p className="text-sm text-muted">
                {toMessage(error, { SESSION_NOT_FOUND: '연습 결과를 찾을 수 없어요.' })}
              </p>
              <button type="button" onClick={reload} className="cursor-pointer text-sm underline">
                다시 시도
              </button>
            </div>
          )}

          {status === 'done' && (
            <>
              <h2 className="text-xl leading-snug font-bold break-keep">
                잘했어요!
                {data.missed.length === 0 && (
                  <>
                    <br />
                    나온 신호를 다 찾았어요
                  </>
                )}
              </h2>

              <div className="mt-4 flex flex-col gap-4">
                {data.found.length > 0 && (
                  <Card title="내가 찾은 단서" className="bg-surface-soft">
                    <ul className="flex flex-wrap gap-2">
                      {data.found.map((cue) => (
                        <li
                          key={cue.cue_id}
                          className="rounded-full border border-success bg-mint-soft px-3 py-1.5 text-sm text-success"
                        >
                          {cue.label}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {data.missed.length > 0 && (
                  <Card title="다음엔 이것도 찾아봐요" className="bg-surface-soft">
                    <ul className="flex flex-col gap-3">
                      {data.missed.map((cue) => (
                        <li key={cue.cue_id}>
                          <span className="inline-block rounded-full border border-primary-ink px-3 py-1.5 text-sm text-primary-ink">
                            {cue.label}
                          </span>
                          <p className="mt-2 text-sm break-keep text-subtle">{cue.sentence}</p>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {data.cards.length > 0 && (
                  <Card title="다음엔 이렇게" className="border border-line bg-white">
                    <ul className="flex flex-col gap-2">
                      {data.cards.map((card, i) => (
                        <li
                          key={i}
                          className={`rounded-2xl border px-4 py-3 text-[0.9375rem] leading-relaxed break-keep ${
                            LEVEL_STYLE[card.level] ?? 'border-line bg-white'
                          }`}
                        >
                          {card.sentence}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
              </div>
            </>
          )}
        </main>

        <div className="flex flex-col gap-2.5 px-5 pt-6 pb-4">
          <Button onClick={() => navigate('/home')}>완료</Button>
          {/* 다시 도전은 can_retry가 true일 때만 — 감정 온도계부터 다시 시작해요 */}
          {status === 'done' && data.can_retry && (
            <Button variant="soft" onClick={() => navigate(`/practice/${areaId}?retry=${sessionId}`)}>
              비슷한 상황 다시 연습하기
            </Button>
          )}
        </div>

        <HomeIndicator />
      </div>
    </div>
  )
}
