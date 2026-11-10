// G2-1 연결 완료
import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import StatusBar from '../components/common/StatusBar.jsx'
import Header from '../components/common/Header.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'

export default function ChildConnectDone() {
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
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <StatusBar />
      <Header title="아이 등록" />

      <div className="flex flex-1 flex-col px-5 pb-4">
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

        <div className="mt-auto flex flex-col gap-3 pt-6">
          <Button onClick={handleShare}>코드 공유하기</Button>
          <Button variant="outline" onClick={handleSummary}>
            성장 요약 보기
          </Button>
          <p role="status" className="h-5 text-center text-sm text-muted">
            {shareMessage}
          </p>
        </div>
      </div>

      <HomeIndicator />
    </div>
  )
}
