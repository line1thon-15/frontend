// Y2 로그인
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/common/StatusBar.jsx'
import Header from '../components/common/Header.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'

const PIN_LENGTH = 4

function speak(text) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'ko-KR'
  window.speechSynthesis.speak(utter)
}

export default function ChildLogin() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [pin, setPin] = useState('')
  const [pinFocused, setPinFocused] = useState(false)
  const [bigText, setBigText] = useState(false)

  const canSubmit = code.trim().length > 0 && pin.length === PIN_LENGTH

  const handleSubmit = () => {
    if (!canSubmit) return
    // TODO: 아이 로그인 API 연동 (코드 + PIN)
    navigate('/child/setup')
  }

  return (
    <div className={`flex min-h-screen flex-col bg-[#FFFBEE] text-[#3A2A12] ${bigText ? 'text-lg' : ''}`}>
      <StatusBar />
      <Header title="아이 로그인" />

      <main className="flex flex-1 flex-col px-5 pt-6">
        <h2 className={`leading-snug font-bold ${bigText ? 'text-[26px]' : 'text-[22px]'}`}>
          보호자에게 받은 코드와
          <br />
          비밀번호를 입력해주세요
        </h2>

        <label htmlFor="child-code" className={`mt-8 mb-2 block ${bigText ? 'text-base' : 'text-sm'}`}>
          내 코드
        </label>
        <input
          id="child-code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ABC-1234"
          autoComplete="off"
          className="h-14 w-full rounded-2xl border border-[#F0E2BF] bg-white px-4 outline-none placeholder:text-[#3A2A12]/35 focus:border-[#F2B300]"
        />

        <p className={`mt-6 mb-2 ${bigText ? 'text-base' : 'text-sm'}`}>비밀번호 (숫자 4개)</p>
        {/* 칸(label)을 누르면 숨겨진 입력창에 포커스 → 숫자 키패드로 입력 */}
        <label htmlFor="child-pin" className="relative flex cursor-text gap-3">
          {Array.from({ length: PIN_LENGTH }, (_, i) => {
            const filled = i < pin.length
            const active = pinFocused && i === Math.min(pin.length, PIN_LENGTH - 1)
            return (
              <div
                key={i}
                className={`flex size-[68px] items-center justify-center rounded-2xl bg-white ${
                  filled || active ? 'border-2 border-[#F2B300]' : 'border border-[#F0E2BF]'
                }`}
              >
                {filled && <span className="size-4 rounded-full bg-[#3A2A12]" />}
              </div>
            )
          })}
          <input
            id="child-pin"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, PIN_LENGTH))}
            onFocus={() => setPinFocused(true)}
            onBlur={() => setPinFocused(false)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            maxLength={PIN_LENGTH}
            aria-label="비밀번호 숫자 4개"
            className="absolute bottom-0 left-0 h-px w-px opacity-0"
          />
        </label>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => speak('보호자에게 받은 코드와 비밀번호를 입력해주세요')}
            className="rounded-full border border-[#F0E2BF] bg-white px-3.5 py-2 text-sm"
          >
            소리로 듣기
          </button>
          <button
            type="button"
            aria-pressed={bigText}
            onClick={() => setBigText((v) => !v)}
            className={`rounded-full border px-3.5 py-2 text-sm ${
              bigText ? 'border-[#F2B300] bg-[#FFF6D6]' : 'border-[#F0E2BF] bg-white'
            }`}
          >
            글자 크게
          </button>
        </div>
      </main>

      <div className="flex flex-col gap-3 px-5 pb-4">
        <Button disabled={!canSubmit} onClick={handleSubmit}>
          들어가기
        </Button>
        <p className="text-center text-sm text-[#3A2A12]/60">코드를 모르면 보호자에게 물어보세요</p>
      </div>

      <HomeIndicator />
    </div>
  )
}
