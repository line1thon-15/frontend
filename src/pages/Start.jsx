// Y1 시작
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/common/StatusBar.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'
import Button from '../components/common/Button.jsx'
import logo from '../assets/icons/symbol.svg'

export default function Start() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-page text-[#3A2A12]">
      <StatusBar />

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <img src={logo} alt="" className="mb-6 w-40" />
        <h1 className="text-[22px] leading-snug font-bold">
          느린학습자를 위한
          <br />
          AI 생활 판단 연습
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#3A2A12]/60">
          헷갈리는 상황을 연습하고,
          <br />
          스스로 판단해 봐요
        </p>
      </main>

      <div className="flex flex-col gap-3 px-5 pb-4">
        <p className="mb-1 text-center text-sm text-[#3A2A12]/60">누구로 시작할까요?</p>
        {/* TODO: 아이 로그인 화면 경로 확정되면 수정 */}
        <Button onClick={() => navigate('/child/login')}>아이로 시작하기</Button>
        <Button variant="outline" onClick={() => navigate('/guardian/signup')}>
          보호자로 시작하기
        </Button>
      </div>

      <HomeIndicator />
    </div>
  )
}
