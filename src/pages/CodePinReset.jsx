// G4 코드·PIN 재설정 (보호자)
import { useState } from 'react'
import StatusBar from '../components/common/StatusBar.jsx'
import Header from '../components/common/Header.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'

// TODO: 백엔드 연동 후 아이 정보·현재 코드를 API에서 받아오기
const MOCK = {
  nickname: '하늘이',
  grade: '초등 고학년',
  oldCode: 'ABC-1234',
  // 재설정 API 응답으로 받을 새 코드 (지금은 임시값)
  newCode: 'XKP-5821',
}

const PIN_LENGTH = 4

// 숫자 4개 PIN 입력 — 입력한 만큼 동그라미가 채워지고, 입력 중이면 테두리와 다음 칸이 강조돼요
function PinField({ label, value, onChange }) {
  const [focused, setFocused] = useState(false)

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm leading-[1.45] font-medium text-muted">{label}</span>
      <span
        className={`relative flex h-[3.3125rem] w-full items-center gap-[0.3rem] rounded-[1.125rem] border bg-white px-4 transition-colors ${
          focused ? 'border-primary-strong ring-4 ring-primary/30' : 'border-line'
        }`}
      >
        {Array.from({ length: PIN_LENGTH }, (_, i) => {
          const filled = i < value.length
          const isNext = focused && i === value.length
          return (
            <span
              key={i}
              aria-hidden
              className={`size-3.5 rounded-full border transition-colors ${
                filled ? 'border-ink bg-ink' : isNext ? 'border-primary-strong bg-primary/40' : 'border-ink bg-white'
              }`}
            />
          )
        })}
        <input
          type="password"
          inputMode="numeric"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, PIN_LENGTH))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </span>
    </label>
  )
}

export default function CodePinReset() {
  const { nickname, grade, oldCode, newCode } = MOCK
  const [pin, setPin] = useState('')
  const [pinConfirm, setPinConfirm] = useState('')
  const [done, setDone] = useState(false)
  const [message, setMessage] = useState('')

  const isMismatch = pinConfirm.length === PIN_LENGTH && pin !== pinConfirm
  const canSubmit = pin.length === PIN_LENGTH && pin === pinConfirm

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit || done) return
    // TODO: 백엔드 코드·PIN 재설정 API 연동 — 성공했을 때만 완료 상태로 바꾸고, 응답의 새 코드를 쓰기
    setDone(true)
  }

  const handleShare = async () => {
    const text = `아이 새 로그인 코드: ${newCode}`
    try {
      if (navigator.share) {
        await navigator.share({ text })
      } else {
        await navigator.clipboard.writeText(newCode)
        setMessage('새 코드를 복사했어요')
      }
    } catch {
      // 공유 창을 닫은 경우 등은 무시
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <StatusBar />
      <Header title="코드·PIN 재설정" />

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col px-5 pb-4">
        <h2 className="mt-3 text-[1.375rem] leading-[1.45] font-bold">
          아이 로그인 정보를
          <br />
          새로 만들어요
        </h2>

        <span className="mt-4 self-start rounded-full bg-primary px-3 py-1.5 text-[0.8125rem] leading-[1.45] font-medium">
          {nickname} · {grade}
        </span>

        <p className="mt-4 mb-1.5 text-sm leading-[1.45] font-medium text-muted">로그인 코드</p>
        <div className="flex flex-col items-center gap-1 rounded-[1.125rem] bg-surface-soft p-4 text-center">
          {done ? (
            <>
              <p className="text-[0.8125rem] leading-[1.45] text-muted">새 로그인 코드</p>
              <p className="text-[1.75rem] leading-[1.45] font-bold">{newCode}</p>
              <p className="text-[0.8125rem] leading-[1.45] text-muted">이전 코드 {oldCode}는 이제 쓸 수 없어요</p>
            </>
          ) : (
            <>
              <p className="text-[0.8125rem] leading-[1.45] text-muted">현재 로그인 코드</p>
              <p className="text-[1.75rem] leading-[1.45] font-bold">{oldCode}</p>
              <p className="text-[0.8125rem] leading-[1.45] text-muted">새 PIN을 정하면 새 로그인 코드가 만들어져요</p>
            </>
          )}
        </div>

        {!done && (
          <div className="mt-4 flex flex-col gap-4">
            <PinField label="새 PIN 정하기 (숫자 4개)" value={pin} onChange={setPin} />
            <PinField label="새 PIN 한 번 더" value={pinConfirm} onChange={setPinConfirm} />
            {isMismatch && <p className="-mt-2 text-[0.8125rem] leading-[1.45] text-rose-600">PIN이 서로 달라요. 다시 확인해 주세요.</p>}
          </div>
        )}

        <ul className="mt-4 flex flex-col gap-1 rounded-[1.125rem] border border-success bg-success-soft px-4 py-3 text-[0.8125rem] leading-[1.45] text-success">
          <li>· 아이 기기에서 새 코드와 PIN으로 다시 로그인해요</li>
          <li>· 연습 기록과 성장 기록은 그대로 남아요</li>
        </ul>

        <div className="mt-auto flex flex-col gap-3 pt-5">
          {done ? (
            <Button className="text-base!" onClick={handleShare}>
              새 코드 공유하기
            </Button>
          ) : (
            <Button type="submit" className="text-base!" disabled={!canSubmit}>
              재설정 완료
            </Button>
          )}
          <p role="status" className="h-5 text-center text-sm text-muted">
            {message}
          </p>
        </div>
      </form>

      <HomeIndicator />
    </div>
  )
}
