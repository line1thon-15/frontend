// 보호자 로그인 (이메일 + 비밀번호) — 로그인하면 성장 요약으로 이동
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import StatusBar from '../components/common/StatusBar.jsx'
import Header from '../components/common/Header.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'
import { loginGuardian } from '../api/auth.js'
import { toMessage } from '../api/errors.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function GuardianLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = EMAIL_PATTERN.test(email) && password.length > 0 && !submitting

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    try {
      await loginGuardian({ email: email.trim(), password })
      navigate('/guardian/summary')
    } catch (err) {
      setError(toMessage(err, { INVALID_CREDENTIALS: '이메일이나 비밀번호가 맞지 않아요. 다시 확인해 볼까요?' }))
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-page text-[#3A2A12]">
      <StatusBar />
      <Header title="보호자 로그인" />

      <main className="flex flex-1 flex-col px-5 pt-6">
        <h2 className="text-[22px] leading-snug font-bold">
          가입한 이메일과
          <br />
          비밀번호를 입력해주세요
        </h2>

        <label htmlFor="guardian-email" className="mt-8 mb-2 block text-sm">
          이메일
        </label>
        <input
          id="guardian-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="example@email.com"
          className="h-14 w-full rounded-2xl border border-[#F0E2BF] bg-white px-4 outline-none placeholder:text-[#3A2A12]/35 focus:border-[#F2B300]"
        />

        <label htmlFor="guardian-password" className="mt-6 mb-2 block text-sm">
          비밀번호
        </label>
        <input
          id="guardian-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          autoComplete="current-password"
          className="h-14 w-full rounded-2xl border border-[#F0E2BF] bg-white px-4 outline-none focus:border-[#F2B300]"
        />

        {error && (
          <p role="alert" className="mt-4 text-sm text-[#b4234a]">
            {error}
          </p>
        )}
      </main>

      <div className="flex flex-col gap-3 px-5 pb-4">
        <Button disabled={!canSubmit} onClick={handleSubmit}>
          로그인
        </Button>
        <p className="text-center text-sm text-[#3A2A12]/60">
          처음이라면{' '}
          <Link to="/guardian/signup" className="underline">
            가입하기
          </Link>
        </p>
      </div>

      <HomeIndicator />
    </div>
  )
}
