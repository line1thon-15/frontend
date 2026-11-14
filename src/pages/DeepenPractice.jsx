// Y7-1 심화 연습 (글로 답하기) / Y7-2 심화 연습 (말로 답하기)
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/common/StatusBar.jsx'
import Header from '../components/common/Header.jsx'
import Button from '../components/common/Button.jsx'
import Bubble from '../components/common/Bubble.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'
import micIcon from '../assets/icons/mic.svg'

// TODO: 백엔드(AI) 심화 연습 상황 API 연동 후 교체
const MOCK = {
  index: 1,
  total: 5,
  hintLimit: 2,
  messages: ['게임에서 만난 형인데, 네 계정 빌려주면 레벨 대신 올려 줄게!', '비밀번호만 알려 주면 돼. 부모님한테는 비밀로 하자~'],
  hints: ['비밀번호는 나만 알아야 하는 거예요', '모르는 사람이 비밀로 하자고 하면 한 번 멈춰요'],
}

const MAX_LENGTH = 100
// 입력 박스 안의 작은 버튼 (말로 할래요 · 글 쓸래요 · 다시 말하기)
const MINI_BUTTON =
  'flex items-center gap-1 rounded-full border border-line bg-white px-3 py-1.5 text-[0.8125rem] leading-[1.45] font-medium text-primary-ink'
const WAVE = [10, 16, 22, 14, 26, 18, 30, 22, 16, 28, 20, 12, 24, 16, 10, 18, 12, 8]

const SpeechRecognition =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined

function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

// mode: 'write'(글로 답하기) | 'speak'(말로 답하기)
export default function DeepenPractice({ initialMode = 'write' }) {
  const navigate = useNavigate()
  const { index, total, hintLimit, messages, hints } = MOCK
  const [mode, setMode] = useState(initialMode)
  const [text, setText] = useState('')
  const [transcript, setTranscript] = useState('')
  const [seconds, setSeconds] = useState(0)
  const [speechError, setSpeechError] = useState('')
  const [listening, setListening] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const recognitionRef = useRef(null)

  const hintsLeft = hintLimit - hintsUsed
  const visibleHints = hints.slice(0, hintsUsed)

  // 말로 답하기: 브라우저 음성 인식으로 말을 글자로 바꿔요. 녹음 파일은 저장하지 않아요.
  const startListening = () => {
    setTranscript('')
    setSeconds(0)
    setSpeechError('')
    recognitionRef.current?.stop()
    if (!SpeechRecognition) {
      setSpeechError('이 기기에서는 말하기를 쓸 수 없어요. 글로 써 주세요.')
      return
    }
    try {
      const recognition = new SpeechRecognition()
      recognition.lang = 'ko-KR'
      recognition.continuous = true
      recognition.interimResults = true
      recognition.onresult = (event) => {
        setTranscript(Array.from(event.results, (result) => result[0].transcript).join(' '))
      }
      recognition.onerror = () => {
        setSpeechError('마이크를 쓸 수 없어요. 글로 써 주세요.')
        setListening(false)
      }
      recognition.onend = () => setListening(false)
      recognition.start()
      recognitionRef.current = recognition
      setListening(true)
    } catch {
      setSpeechError('말하기를 시작하지 못했어요. 글로 써 주세요.')
    }
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    setListening(false)
  }

  // 마이크는 사용자가 직접 눌러야 시작해요. 말하는 시간은 듣는 동안에만 올라가요.
  useEffect(() => {
    if (!listening) return undefined
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => clearInterval(timer)
  }, [listening])

  useEffect(() => () => recognitionRef.current?.stop(), [])

  const handleHint = () => {
    if (hintsLeft > 0) setHintsUsed((value) => value + 1)
  }

  const answer = mode === 'write' ? text.trim() : transcript.trim()

  const handleSubmit = () => {
    if (!answer) return
    stopListening()
    // TODO: 백엔드 심화 연습 답변 제출 API 연동 — 원문은 저장하지 않고 평가 결과만 받기
    navigate('/child/deepen/result')
  }

  const hintButton = (
    <button
      type="button"
      onClick={handleHint}
      disabled={hintsLeft === 0}
      className="h-14 flex-1 rounded-2xl border border-success bg-success-soft text-lg font-bold text-success transition active:brightness-95 disabled:opacity-40"
    >
      {hintsLeft === 0 ? '힌트를 다 썼어요' : '힌트 사용하기 💡'}
    </button>
  )

  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <StatusBar />
      <Header title="심화 연습" />

      <main className="flex flex-1 flex-col px-5 pt-3">
        <div className="flex gap-1.5">
          <span className="rounded-full border border-primary bg-chip px-3 py-1.5 text-sm font-medium text-primary-ink">
            심화 {index} / {total}
          </span>
          <span className="rounded-full border-[0.8px] border-success bg-success-soft px-3 py-1.5 text-sm font-medium text-success">
            힌트 {hintsLeft}개 남음
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {messages.map((message) => (
            <Bubble key={message}>{message}</Bubble>
          ))}
        </div>

        {visibleHints.length > 0 && (
          <div className="relative mt-5 rounded-3xl bg-success-soft px-5 py-3.5">
            {/* 피그마처럼 긴 점선 테두리 (CSS dashed는 점 간격을 못 바꿔서 SVG로 그림, 연습 대화 화면과 같은 방식) */}
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
            <ul className="mt-1 text-[0.9375rem]">
              {visibleHints.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-4 text-sm leading-[1.45] font-medium text-subtle">
          이럴 때 나는 뭐라고 할까요? {mode === 'write' ? '직접 써 보세요' : '말로 해 보세요'}
        </p>

        {mode === 'write' ? (
          <>
            <section className="mt-2 rounded-[1.125rem] border-2 border-primary bg-white p-4">
              <label className="sr-only" htmlFor="deepen-answer">
                내 답
              </label>
              <textarea
                id="deepen-answer"
                value={text}
                maxLength={MAX_LENGTH}
                onChange={(e) => setText(e.target.value)}
                placeholder="여기에 써 보세요"
                rows={2}
                className="field-sizing-content w-full resize-none bg-transparent text-base leading-[1.45] outline-none placeholder:text-muted"
              />
              <div className="mt-2.5 flex items-center justify-between">
                <button type="button" onClick={() => setMode('speak')} className={MINI_BUTTON}>
                  <img src={micIcon} alt="" className="size-4" />
                  말로 할래요
                </button>
                <span className="text-xs leading-[1.45] text-faint">
                  {text.length} / {MAX_LENGTH}
                </span>
              </div>
            </section>
            <p className="mt-3 text-xs leading-[1.45] text-faint">정답은 없어요. 내 말로 편하게 써도 괜찮아요.</p>
          </>
        ) : (
          <>
            <section className="mt-2 flex flex-col items-center gap-2 rounded-[1.125rem] border-2 border-primary bg-white px-4 py-3.5">
              <button
                type="button"
                onClick={listening ? stopListening : startListening}
                disabled={Boolean(speechError)}
                aria-label={listening ? '말하기 멈추기' : '말하기 시작'}
                className="flex size-16 items-center justify-center rounded-full bg-primary/25 transition active:scale-95 disabled:opacity-40"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-primary">
                  {listening ? (
                    <span className="size-4 rounded-[3px] bg-ink" />
                  ) : (
                    <img src={micIcon} alt="" className="size-[1.375rem]" />
                  )}
                </span>
              </button>
              <p className="text-[0.9375rem] leading-[1.45] font-bold">
                {speechError
                  ? '말하기를 쓸 수 없어요'
                  : listening
                    ? `듣고 있어요… ${formatTime(seconds)}`
                    : transcript
                      ? '다 들었어요'
                      : '마이크를 눌러서 말해 보세요'}
              </p>
              <div className="flex h-[1.875rem] items-center justify-center gap-1" aria-hidden="true">
                {WAVE.map((height, i) => (
                  <span
                    key={i}
                    className={`w-[3px] rounded-full bg-primary-strong ${listening ? 'animate-pulse' : 'opacity-40'}`}
                    style={{ height, animationDelay: `${(i % 6) * 120}ms` }}
                  />
                ))}
              </div>
              <div className="flex w-full flex-col gap-1 rounded-xl bg-[#fffaed] px-3.5 py-2.5 text-left">
                <p className="text-xs leading-[1.45] font-medium text-faint">내가 한 말 · 녹음 파일은 저장하지 않아요</p>
                <p role="status" className="min-h-[1.45rem] text-base leading-[1.45]">
                  {speechError || transcript}
                </p>
              </div>
              <div className="flex justify-center gap-2">
                <button type="button" onClick={() => setMode('write')} className={MINI_BUTTON}>
                  ✏️ 글로 쓸래요
                </button>
                {!listening && transcript && (
                  <button type="button" onClick={startListening} className={MINI_BUTTON}>
                    다시 말하기
                  </button>
                )}
              </div>
            </section>
            <p className="mt-3 text-xs leading-[1.45] text-faint">말한 내용은 글자로 바뀌어요. 정답은 없으니 편하게 말해요.</p>
          </>
        )}
      </main>

      <div className="px-5 pt-4 pb-4">
        {mode === 'write' ? (
          <div className="flex gap-3">
            {hintButton}
            <Button className="flex-1" disabled={!answer} onClick={handleSubmit}>
              보내기
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Button disabled={!answer || listening} onClick={handleSubmit}>
              다 말했어요
            </Button>
            <div className="flex">{hintButton}</div>
          </div>
        )}
      </div>

      <HomeIndicator />
    </div>
  )
}
