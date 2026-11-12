// G1 가입·동의 (보호자 가입)
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/common/StatusBar.jsx'
import Header from '../components/common/Header.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'
import { registerGuardian } from '../api/auth.js'
import { toMessage } from '../api/errors.js'

const AGREEMENTS = [
  { id: 'terms', label: '[필수] 서비스 이용약관', required: true },
  { id: 'privacy', label: '[필수] 개인정보 수집·이용', required: true },
  { id: 'childPrivacy', label: '[필수] 아동 개인정보 처리 법정대리인 동의', required: true },
  { id: 'safetyAlert', label: '[선택] 안전 알림 받기', required: false },
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Checkbox({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm leading-[1.45]">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
      <span
        aria-hidden
        className="flex size-5 shrink-0 items-center justify-center rounded-[0.25rem] border-[1.5px] border-[#c9b27a] peer-checked:border-primary-strong peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50"
      >
        {checked && (
          <svg viewBox="0 0 16 16" className="size-3.5 text-ink" fill="none" stroke="currentColor" strokeWidth="2.5">
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
      <span className="mb-1.5 block text-sm leading-[1.45] font-medium text-muted">{label}</span>
      <input
        className="w-full rounded-[1.125rem] border border-line bg-white px-4 py-3.5 text-base leading-[1.45] outline-none placeholder:text-[#b8a57e] focus:border-primary-strong"
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
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const allAgreed = AGREEMENTS.every((item) => agreed[item.id])
  const requiredAgreed = AGREEMENTS.filter((item) => item.required).every((item) => agreed[item.id])
  const canSubmit = EMAIL_PATTERN.test(email) && password.length >= 8 && requiredAgreed && !submitting

  const toggleAll = () => {
    const next = !allAgreed
    setAgreed(Object.fromEntries(AGREEMENTS.map((item) => [item.id, next])))
  }

  const toggleOne = (id) => setAgreed((prev) => ({ ...prev, [id]: !prev[id] }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    try {
      await registerGuardian({ email, password })
      navigate('/guardian/connect')
    } catch (err) {
      setError(toMessage(err, { EMAIL_TAKEN: '이미 가입된 이메일이에요.' }))
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <StatusBar />
      <Header title="보호자 가입" />

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col px-5 pt-3 pb-4">
        <h2 className="mb-4 text-[1.375rem] leading-[1.45] font-bold">보호자 계정을 만들어요</h2>

        <div className="flex flex-col gap-4">
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

        <div className="mt-4 flex flex-col gap-3 rounded-[1.125rem] bg-[#fff3d1] p-4">
          <Checkbox checked={allAgreed} onChange={toggleAll} label="모두 동의하기" />
          <div className="h-px bg-line" />
          {AGREEMENTS.map((item) => (
            <Checkbox
              key={item.id}
              checked={!!agreed[item.id]}
              onChange={() => toggleOne(item.id)}
              label={item.label}
            />
          ))}
        </div>

        <p className="mt-4 text-xs leading-[1.45] text-faint">지능지수나 진단 정보는 묻지 않아요</p>

        {error && (
          <p role="alert" className="mt-3 text-sm leading-[1.45] text-[#b4234a]">
            {error}
          </p>
        )}

        <Button type="submit" disabled={!canSubmit} className="mt-auto text-base!">
          가입하기
        </Button>
      </form>

      <HomeIndicator />
    </div>
  )
}
