// G2 아이 연결 (아이 등록)
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/common/StatusBar.jsx'
import Header from '../components/common/Header.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'

const GRADES = ['초등 고학년', '중학생', '고등학생']

// TODO: 백엔드 아이 등록 API 응답의 로그인 코드로 교체
const MOCK_LOGIN_CODE = 'ABC-1234'

function TextField({ label, hint, ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm">{label}</span>
      <input
        className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-[0.9375rem] outline-none placeholder:text-muted focus:border-primary"
        {...inputProps}
      />
      {hint && <span className="mt-2 block text-xs text-muted">{hint}</span>}
    </label>
  )
}

export default function ChildConnect() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [grade, setGrade] = useState(null)
  const [pin, setPin] = useState('')

  const canSubmit = nickname.trim() !== '' && grade !== null && pin.length === 4

  const handlePinChange = (e) => {
    setPin(e.target.value.replace(/\D/g, '').slice(0, 4))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    // TODO: 백엔드 아이 등록 API 연동 — 응답의 로그인 코드를 넘기기
    navigate('/guardian/connect/done', {
      state: { nickname: nickname.trim(), grade, loginCode: MOCK_LOGIN_CODE },
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <StatusBar />
      <Header title="아이 등록" />

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col px-5 pb-4">
        <h2 className="mt-4 mb-6 text-xl font-bold">아이를 등록해 주세요</h2>

        <div className="flex flex-col gap-5">
          <TextField
            label="아이 별명"
            placeholder="예: 강아지"
            hint="실명은 적지 않아도 돼요. 아이가 좋아하는 별명이면 충분해요."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <fieldset>
            <legend className="mb-2 text-sm">학년</legend>
            <div className="flex gap-2">
              {GRADES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setGrade(item)}
                  aria-pressed={grade === item}
                  className={`h-9 rounded-full border px-4 text-sm transition-colors ${
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
            hint="'연결 완료'를 누르면 아이 로그인 코드가 만들어져요."
            value={pin}
            onChange={handlePinChange}
          />
        </div>

        <div className="mt-auto pt-6">
          <Button type="submit" disabled={!canSubmit}>
            연결 완료
          </Button>
        </div>
      </form>

      <HomeIndicator />
    </div>
  )
}
