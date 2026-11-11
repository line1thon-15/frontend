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
const WAVE = [7, 13, 20, 14, 24, 18, 27, 21, 15, 22, 11, 17, 8, 6]

const SpeechRecognition =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined

function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

function MicIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" strokeLinecap="round" />
    </svg>
  )
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
  const [hintsUsed, setHintsUsed] = useState(0)
  const recognitionRef = useRef(null)

  const hintsLeft = hintLimit - hintsUsed
  const visibleHints = hints.slice(0, hintsUsed)

  // 말로 답하기: 브라우저 음성 인식으로 말을 글자로 바꿔요. 녹음 파일은 저장하지 않아요.
  const startListening = () => {
    setTranscript('')
    setSeconds(0)
    setSpeechError('')
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
      recognition.onerror = () => setSpeechError('마이크를 쓸 수 없어요. 글로 써 주세요.')
      recognition.start()
      recognitionRef.current = recognition
    } catch {
      setSpeechError('말하기를 시작하지 못했어요. 글로 써 주세요.')
    }
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    recognitionRef.current = null
  }

  useEffect(() => {
    if (mode !== 'speak') return undefined
    startListening()
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => {
      clearInterval(timer)
      stopListening()
    }
  }, [mode])

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

      <main className="flex flex-1 flex-col px-5 pt-2">
        <div className="flex gap-2">
          <span className="rounded-full border border-primary bg-chip px-3 py-1.5 text-sm font-medium text-primary-ink">
            심화 {index} / {total}
          </span>
          <span className="rounded-full border-[0.8px] border-success bg-success-soft px-3 py-1.5 text-sm font-medium text-success">
            힌트 {hintsLeft}개 남음
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          {messages.map((message) => (
            <Bubble key={message}>{message}</Bubble>
          ))}
        </div>

        {visibleHints.length > 0 && (
          <div className="mt-5 rounded-3xl border border-dashed border-success bg-success-soft px-5 py-3.5">
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
            <section className="mt-2 rounded-[1.125rem] border-2 border-primary bg-white p-4 text-center">
              <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-surface-soft">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary">
                  <MicIcon className="size-5" />
                </span>
              </span>
              <p className="mt-2 text-base leading-[1.45] font-bold">
                {speechError ? '말하기를 쓸 수 없어요' : `듣고 있어요… ${formatTime(seconds)}`}
              </p>
              <div className="mt-2 flex h-7 items-center justify-center gap-[0.3rem]" aria-hidden="true">
                {WAVE.map((height, i) => (
                  <span key={i} className="w-1 rounded-full bg-primary-strong" style={{ height }} />
                ))}
              </div>
              <div className="mt-2.5 rounded-xl bg-surface px-4 py-2.5 text-left">
                <p className="text-xs leading-[1.45] text-faint">내가 한 말 · 녹음 파일은 저장하지 않아요</p>
                <p role="status" className="mt-0.5 min-h-[1.45rem] text-base leading-[1.45]">
                  {speechError || transcript}
                </p>
              </div>
              <div className="mt-2.5 flex justify-center gap-2">
                <button type="button" onClick={() => setMode('write')} className={MINI_BUTTON}>
                  ✏️ 글로 쓸래요
                </button>
                <button type="button" onClick={startListening} className={MINI_BUTTON}>
                  다시 말하기
                </button>
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
            <Button disabled={!answer} onClick={handleSubmit}>
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
