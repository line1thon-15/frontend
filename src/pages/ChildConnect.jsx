// G2 아이 연결 (아이 등록)
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/common/StatusBar.jsx'
import Header from '../components/common/Header.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'
import { registerChild } from '../api/children.js'
import { toMessage } from '../api/errors.js'

const GRADES = ['초등 고학년', '중학생', '고등학생']

function TextField({ label, hint, hintGap = 'mt-2', ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm leading-[1.45] font-medium text-muted">{label}</span>
      <input
        className="w-full rounded-[1.125rem] border border-line bg-white px-4 py-3.5 text-base leading-[1.45] outline-none placeholder:text-[#b8a57e] focus:border-primary-strong"
        {...inputProps}
      />
      {hint && <span className={`${hintGap} block text-xs leading-[1.45] text-faint`}>{hint}</span>}
    </label>
  )
}

export default function ChildConnect() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [grade, setGrade] = useState(null)
  const [pin, setPin] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = nickname.trim() !== '' && grade !== null && pin.length === 4 && !submitting

  const handlePinChange = (e) => {
    setPin(e.target.value.replace(/\D/g, '').slice(0, 4))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    try {
      const child = await registerChild({ nickname: nickname.trim(), grade, pin })
      navigate('/guardian/connect/done', {
        state: { nickname: child.nickname, grade, loginCode: child.link_code },
      })
    } catch (err) {
      setError(
        toMessage(err, {
          UNAUTHENTICATED: '로그인이 필요해요. 가입 화면부터 다시 해 주세요.',
        }),
      )
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <StatusBar />
      <Header title="아이 등록" />

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col px-5 pt-2.5">
        <h2 className="mb-4 text-[1.375rem] leading-[1.45] font-bold">아이를 등록해 주세요</h2>

        <div className="flex flex-col gap-4">
          <TextField
            label="아이 별명"
            placeholder="예: 강아지"
            hint="실명은 적지 않아도 돼요. 아이가 좋아하는 별명이면 충분해요."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <fieldset>
            <legend className="mb-2 text-sm leading-[1.45] font-medium text-muted">학년</legend>
            <div className="flex items-start gap-2">
              {GRADES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setGrade(item)}
                  aria-pressed={grade === item}
                  className={`rounded-full px-3 py-1.5 text-[0.8125rem] leading-[1.45] font-medium transition-colors ${
                    grade === item ? 'bg-primary' : 'border border-[#edd9a8] bg-white'
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
            placeholder="● ● ● ●"
            hintGap="mt-4"
            hint="'연결 완료'를 누르면 아이 로그인 코드가 만들어져요."
            value={pin}
            onChange={handlePinChange}
          />
        </div>

        {error && (
          <p role="alert" className="mt-3 text-sm leading-[1.45] text-[#b4234a]">
            {error}
          </p>
        )}

        <div className="mt-auto py-2">
          <Button type="submit" disabled={!canSubmit} className="text-base!">
            연결 완료
          </Button>
        </div>
      </form>

      <HomeIndicator />
    </div>
  )
}
