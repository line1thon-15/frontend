// G2 아이 연결 (아이 등록)
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const GRADES = ['초등 고학년', '중학생', '고등학생']

// TODO: 백엔드 아이 등록 API 응답의 로그인 코드로 교체
const MOCK_LOGIN_CODE = 'ABC-1234'

function TextField({ label, ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm">{label}</span>
      <input
        className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-[15px] outline-none placeholder:text-muted focus:border-primary disabled:opacity-60"
        {...inputProps}
      />
    </label>
  )
}

export default function ChildConnect() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [grade, setGrade] = useState(null)
  const [pin, setPin] = useState('')
  // 연결 완료 후 서버에서 받은 로그인 코드 (연결 전에는 null)
  const [loginCode, setLoginCode] = useState(null)
  const [shareMessage, setShareMessage] = useState('')

  const isConnected = loginCode !== null
  const canSubmit = nickname.trim() !== '' && grade !== null && pin.length === 4

  const handlePinChange = (e) => {
    setPin(e.target.value.replace(/\D/g, '').slice(0, 4))
  }

  const handleShare = async () => {
    const text = `아이 로그인 코드: ${loginCode}`
    try {
      if (navigator.share) {
        await navigator.share({ text })
      } else {
        await navigator.clipboard.writeText(loginCode)
        setShareMessage('코드를 복사했어요')
      }
    } catch {
      // 공유 창을 닫은 경우 등은 무시
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit || isConnected) return
    // TODO: 백엔드 아이 등록 API 연동 — 응답의 로그인 코드를 setLoginCode에 넣기
    console.log('아이 연결 요청', { nickname, grade })
    setLoginCode(MOCK_LOGIN_CODE)
  }

  const handleNext = () => {
    // TODO: G3 성장 요약 화면이 나오면 이동
    console.log('G3 성장 요약으로 이동 예정')
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-screen flex-col px-5 pb-8">
      {/* TODO: 공통 Header 컴포넌트로 교체 */}
      <header className="relative flex h-14 items-center justify-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          className="absolute left-0 p-1"
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-base font-medium">아이 등록</h1>
      </header>

      <h2 className="mt-4 mb-6 text-xl font-bold">아이를 등록해 주세요</h2>

      <div className="flex flex-col gap-5">
        <TextField
          label="별명"
          placeholder="예: 하늘"
          value={nickname}
          disabled={isConnected}
          onChange={(e) => setNickname(e.target.value)}
        />

        <fieldset disabled={isConnected}>
          <legend className="mb-2 text-sm">학년</legend>
          <div className="flex gap-2">
            {GRADES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setGrade(item)}
                aria-pressed={grade === item}
                className={`h-9 rounded-full border px-4 text-sm transition-colors disabled:opacity-60 ${
                  grade === item ? 'border-primary bg-primary font-bold' : 'border-line bg-white'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>

        <TextField
          label="아이 PIN 정하기 (숫자 4개)"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          placeholder="••••"
          value={pin}
          disabled={isConnected}
          onChange={handlePinChange}
        />
      </div>

      {isConnected && (
        <div className="mt-6 rounded-3xl bg-surface-soft px-5 py-6 text-center">
          <p className="text-sm text-muted">아이 로그인 코드</p>
          <p className="my-2 text-3xl font-bold tracking-wide">{loginCode}</p>
          <p className="text-sm text-muted">아이 기기에서 이 코드와 PIN으로 로그인해요</p>
        </div>
      )}

      {/* TODO: 공통 Button 컴포넌트로 교체 */}
      <div className="mt-auto flex flex-col gap-3 pt-6">
        {isConnected ? (
          <>
            <button
              type="button"
              onClick={handleShare}
              className="h-14 w-full rounded-2xl bg-primary text-base font-bold"
            >
              코드 공유하기
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="h-14 w-full rounded-2xl border border-primary bg-white text-base font-bold"
            >
              다음으로
            </button>
            <p role="status" className="h-5 text-center text-sm text-muted">
              {shareMessage}
            </p>
          </>
        ) : (
          <button
            type="submit"
            disabled={!canSubmit}
            className="h-14 w-full rounded-2xl bg-primary text-base font-bold transition-opacity disabled:opacity-40"
          >
            연결 완료
          </button>
        )}
      </div>
    </form>
  )
}
