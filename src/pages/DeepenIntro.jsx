// Y6 심화학습 넘어가기
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/common/StatusBar.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'
import celebrate from '../assets/illustrations/celebrate.svg'

// TODO: 백엔드 연동 후 완료한 영역 이름과 학습률을 API에서 받아오기
const MOCK = {
  areaLabel: '게임 아이템·용돈 사기',
  progress: 80,
}

export default function DeepenIntro() {
  const navigate = useNavigate()
  const { areaLabel, progress } = MOCK

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <StatusBar />

      <main className="flex flex-1 flex-col items-center justify-center px-5 pb-10 text-center">
        <img src={celebrate} alt="" className="w-[10.5rem]" />
        <h1 className="mt-6 text-[1.375rem] font-bold">축하합니다 !</h1>
        <p className="mt-3 text-sm leading-relaxed text-primary-ink">
          {areaLabel}
          <br />
          학습률 {progress}% 달성 완료
        </p>
      </main>

      <div className="flex flex-col gap-3 px-5 pb-4">
        {/* TODO: 심화 연습 첫 화면(Y7-1 글로 답하기)이 구현되면 경로 확인 */}
        <Button onClick={() => navigate('/child/deepen/write')}>심화 학습으로 넘어가기</Button>
        <Button variant="outline" onClick={() => navigate('/home')}>
          홈으로
        </Button>
      </div>

      <HomeIndicator />
    </div>
  )
}
