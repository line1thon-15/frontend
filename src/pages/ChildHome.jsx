// Y3 홈
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/common/StatusBar.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'
import chatIcon from '../assets/icons/chat.svg'
import recordIcon from '../assets/icons/record.svg'

// TODO: 백엔드 연동 후 아이 별명·영역별 진행률·배지 수를 API에서 받아오기
const MOCK = {
  nickname: '하늘',
  badgeCount: 3,
  areas: [
    { id: 'fraud', label: '게임 아이템·용돈 사기', progress: 70 },
    { id: 'personal-info', label: '사진·만남·개인정보 요구', progress: 12 },
    { id: 'friend-request', label: '친구의 무리한 부탁', progress: 40 },
  ],
}

function MenuCard({ icon, iconBg, title, description, onClick, children }) {
  return (
    <section className="rounded-3xl border border-line bg-white p-4">
      <button type="button" onClick={onClick} className="flex w-full items-center gap-4 text-left">
        <span className={`flex size-13 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
          <img src={icon} alt="" className="size-8" />
        </span>
        <span>
          <span className="block text-lg font-bold">{title}</span>
          <span className="mt-0.5 block text-sm text-subtle">{description}</span>
        </span>
      </button>
      {children && <div className="mt-3">{children}</div>}
    </section>
  )
}

export default function ChildHome() {
  const navigate = useNavigate()
  const { nickname, badgeCount, areas } = MOCK

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <StatusBar />

      <main className="flex flex-1 flex-col px-5 pt-5">
        <div className="flex items-center justify-between">
          <h1 className="text-[1.375rem] font-bold">{nickname}아, 반가워!</h1>
          <button
            type="button"
            onClick={() => navigate('/child/setup')}
            className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm"
          >
            설정
          </button>
        </div>
        <p className="mt-2 text-sm text-subtle">오늘은 무엇을 해 볼까요?</p>

        <div className="mt-4 flex flex-col gap-4">
          <MenuCard
            icon={chatIcon}
            iconBg="bg-accent-soft"
            title="상황 연습하기"
            description="AI 친구와 대화하며 위험 단서를 찾아요"
          >
            {/* 영역을 고르면 연습 시작 (Y4-1 감정 온도계 → Y4 연습 대화) */}
            <ul className="flex flex-col gap-2.5">
              {areas.map((area) => (
                <li key={area.id}>
                  <button
                    type="button"
                    // TODO: 연습 화면 경로 확정되면 수정
                    onClick={() => navigate(`/practice/${area.id}`)}
                    className="flex h-[1.9375rem] w-full items-center justify-between rounded-full border-[0.7px] border-primary-ink bg-progress px-3.5 text-[0.8125rem]"
                  >
                    <span>{area.label}</span>
                    <span>{area.progress}%</span>
                  </button>
                </li>
              ))}
            </ul>
          </MenuCard>

          <MenuCard
            icon={recordIcon}
            iconBg="bg-mint-soft"
            title="내 성장 기록"
            description="내가 찾은 단서와 변화를 봐요"
            // TODO: 내 성장 화면(프론트 B, 피그마 Y7-5) 경로 확정되면 수정
            onClick={() => navigate('/child/growth')}
          >
            <span className="inline-block rounded-full bg-primary/50 px-3 py-1 text-[0.8125rem] text-primary-ink">
              배지 {badgeCount}개
            </span>
          </MenuCard>
        </div>
      </main>

      <div className="px-5 pt-4 pb-4">
        {/* TODO: 믿는 사람 연락 기능(T-41, 프론트 B와 협의) */}
        <Button variant="outline">도움이 필요해요</Button>
      </div>

      <HomeIndicator />
    </div>
  )
}
