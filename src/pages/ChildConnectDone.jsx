// G2-1 연결 완료
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

export default function ChildConnectDone() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [shareMessage, setShareMessage] = useState('')

  // G2에서 연결 완료를 거치지 않고 바로 들어오면 G2로 돌려보내기
  if (!state?.loginCode) {
    return <Navigate to="/guardian/connect" replace />
  }

  const { nickname, grade, loginCode } = state

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

  const handleSummary = () => {
    // TODO: G3 성장 요약 화면이 나오면 이동
    console.log('G3 성장 요약으로 이동 예정')
  }

  return (
    <div className="flex min-h-screen flex-col px-5 pb-8">
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

      <h2 className="mt-4 text-xl leading-snug font-bold">
        연결이 완료됐어요!
        <br />
        아이에게 코드를 알려 주세요
      </h2>

      <span className="mt-4 self-start rounded-full bg-primary px-3 py-1 text-sm font-bold">
        {nickname} · {grade}
      </span>

      <div className="mt-5 rounded-3xl bg-surface-soft px-5 py-6 text-center">
        <p className="text-sm text-muted">아이 로그인 코드</p>
        <p className="my-2 text-3xl font-bold tracking-wide">{loginCode}</p>
        <p className="text-sm text-muted">아이 기기에서 이 코드와 PIN으로 로그인해요</p>
      </div>

      <p className="mt-4 text-sm text-muted">
        코드를 잊어버리면 설정의 '코드·PIN 재설정'에서 새로 만들 수 있어요.
      </p>

      {/* TODO: 공통 Button 컴포넌트로 교체 */}
      <div className="mt-auto flex flex-col gap-3 pt-6">
        <button
          type="button"
          onClick={handleShare}
          className="h-14 w-full rounded-2xl bg-primary text-base font-bold"
        >
          코드 공유하기
        </button>
        <button
          type="button"
          onClick={handleSummary}
          className="h-14 w-full rounded-2xl border border-primary bg-white text-base font-bold"
        >
          성장 요약 보기
        </button>
        <p role="status" className="h-5 text-center text-sm text-muted">
          {shareMessage}
        </p>
      </div>
    </div>
  )
}
