// G4 코드·PIN 재설정 (보호자)
import StatusBar from '../components/common/StatusBar.jsx'
import Header from '../components/common/Header.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'

// TODO: 백엔드 연동 후 아이 정보·새 로그인 코드를 API에서 받아오기
const MOCK = {
  nickname: '하늘이',
  grade: '초등 고학년',
  oldCode: 'ABC-1234',
  newCode: 'XKP-5821',
}

export default function CodePinReset() {
  const { nickname, grade, oldCode, newCode } = MOCK

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <StatusBar />
      <Header title="코드·PIN 재설정" />

      <form onSubmit={(e) => e.preventDefault()} className="flex flex-1 flex-col px-5 pb-4">
        <h2 className="mt-4 text-xl leading-snug font-bold">
          아이 로그인 정보를
          <br />
          새로 만들어요
        </h2>

        <span className="mt-4 self-start rounded-full bg-primary px-3 py-1 text-sm font-bold">
          {nickname} · {grade}
        </span>

        <p className="mt-5 mb-2 text-sm">로그인 코드</p>
        <div className="rounded-3xl bg-surface-soft px-5 py-5 text-center">
          <p className="text-sm text-muted">새 로그인 코드</p>
          <p className="my-1.5 text-3xl font-bold tracking-wide">{newCode}</p>
          <p className="text-sm text-muted">이전 코드 {oldCode}는 이제 쓸 수 없어요</p>
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-6">
          <Button type="submit" disabled>
            재설정 완료
          </Button>
        </div>
      </form>

      <HomeIndicator />
    </div>
  )
}
