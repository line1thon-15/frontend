// G1 가입·동의 (보호자 가입)
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AGREEMENTS = [
  { id: 'terms', label: '[필수] 서비스 이용약관', required: true },
  { id: 'privacy', label: '[필수] 개인정보 수집·이용', required: true },
  { id: 'childPrivacy', label: '[필수] 아동 개인정보 처리 법정대리인 동의', required: true },
  { id: 'safetyAlert', label: '[선택] 안전 알림 받기', required: false },
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Checkbox({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-[15px]">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
      <span
        aria-hidden
        className="flex size-6 shrink-0 items-center justify-center rounded-md border-2 border-line-strong bg-white peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50"
      >
        {checked && (
          <svg viewBox="0 0 16 16" className="size-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </label>
  )
}

function TextField({ label, ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm">{label}</span>
      <input
        className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-[15px] outline-none placeholder:text-muted focus:border-primary"
        {...inputProps}
      />
    </label>
  )
}

export default function GuardianSignup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState({})

  const allAgreed = AGREEMENTS.every((item) => agreed[item.id])
  const canSubmit = EMAIL_PATTERN.test(email) && password.length >= 8

  const toggleAll = () => {
    const next = !allAgreed
    setAgreed(Object.fromEntries(AGREEMENTS.map((item) => [item.id, next])))
  }

  const toggleOne = (id) => setAgreed((prev) => ({ ...prev, [id]: !prev[id] }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    // TODO: 백엔드 회원가입 API 연동 후, 성공하면 G2 아이 연결 화면으로 이동
    console.log('보호자 가입 요청', { email, agreed })
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-screen flex-col px-5 pb-8">
      {/* TODO: 공통 Header 컴포넌트가 나오면 교체 */}
      <header className="relative flex h-14 items-center justify-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          className="absolute left-0 p-1 text-xl"
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-base font-medium">보호자 가입</h1>
      </header>

      <h2 className="mt-4 mb-6 text-xl font-bold">보호자 계정을 만들어요</h2>

      <div className="flex flex-col gap-5">
        <TextField
          label="이메일"
          type="email"
          placeholder="example@email.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="비밀번호"
          type="password"
          placeholder="8자 이상"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="mt-6 rounded-3xl bg-surface-soft p-5">
        <Checkbox checked={allAgreed} onChange={toggleAll} label="모두 동의하기" />
        <hr className="my-4 border-line" />
        <div className="flex flex-col gap-3">
          {AGREEMENTS.map((item) => (
            <Checkbox
              key={item.id}
              checked={!!agreed[item.id]}
              onChange={() => toggleOne(item.id)}
              label={item.label}
            />
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-muted">지능지수나 진단 정보는 묻지 않아요</p>

      {/* TODO: 공통 Button 컴포넌트가 나오면 교체 */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-auto h-14 w-full rounded-2xl bg-primary text-base font-bold transition-opacity disabled:opacity-40"
      >
        가입하기
      </button>
    </form>
  )
}
