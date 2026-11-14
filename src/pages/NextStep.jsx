// Y7-4 다음 단계 (선택 전 / 선택 후)
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/common/StatusBar.jsx'
import Header from '../components/common/Header.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'

// TODO: 백엔드 연동 후 같은 영역의 다음 심화 연습 순서(예: 2 / 5)를 API에서 받아오기
const MOCK = { nextIndex: 2, total: 5 }

// 각 선택지가 이동할 경로
// TODO: 심화 연습 화면(Y7-1/Y7-2)과 다른 영역 연습이 연결되면 경로 확인
const OPTIONS = [
  { id: 'refine', title: '내 답 다듬기', description: '팁을 보고 내 답을 다시 쓰거나 말해 봐요', to: '/child/deepen/write' },
  {
    id: 'similar',
    title: '비슷한 상황 더 연습하기',
    description: ({ nextIndex, total }) => `같은 영역의 다음 심화 연습을 해요 (${nextIndex} / ${total})`,
    to: '/child/deepen/write',
  },
  { id: 'other-area', title: '다른 영역 도전하기', description: '사진·만남·개인정보 요구 상황으로 넘어가요', to: '/home' },
  { id: 'growth', title: '성장 기록 확인하기', description: '지금까지의 기록을 통해 강점과 약점을 확인해요', to: '/child/growth' },
]

export default function NextStep() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const target = OPTIONS.find((option) => option.id === selected)

  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <StatusBar />
      <Header title="다음 단계" />

      <main className="flex flex-1 flex-col px-5 pt-3">
        <h2 className="text-[1.375rem] leading-[1.45] font-bold">이제 무엇을 해 볼까요?</h2>

        <div className="mt-3 flex flex-col gap-3">
          <div role="radiogroup" aria-label="다음 단계" className="flex flex-col gap-3">
          {OPTIONS.map((option) => {
            const isSelected = selected === option.id
            const description =
              typeof option.description === 'function' ? option.description(MOCK) : option.description
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelected(option.id)}
                className={`flex flex-col gap-1 rounded-[1.125rem] p-4 text-left transition-colors ${
                  isSelected ? 'border-2 border-primary-strong bg-chip' : 'border border-line bg-white'
                }`}
              >
                <span className="block text-[1.0625rem] leading-[1.45] font-bold">{option.title}</span>
                <span className="block text-sm leading-[1.45] text-subtle">{description}</span>
              </button>
            )
          })}
          </div>

          <section className="flex flex-col gap-1 rounded-[1.125rem] border border-[#ef4a67] bg-[#fff9fb] p-4">
            <h3 className="text-sm leading-[1.45] font-bold">보호자에게 알려지는 것</h3>
            <ul className="flex flex-col gap-1 text-[0.8125rem] leading-[1.45]">
              <li>· 심화 연습을 했다는 사실과 횟수</li>
              <li>· 내가 쓴 답, 녹음, 기분은 보내지 않아요</li>
            </ul>
          </section>
        </div>
      </main>

      <div className="flex flex-col gap-3 px-5 pt-6 pb-4">
        {/* 선택 전에는 테두리 버튼, 선택하면 채워진 버튼으로 바뀌어요 */}
        <Button
          variant={target ? 'primary' : 'outline'}
          className={target ? 'text-base!' : 'border-2! border-primary! text-base! text-ink!'}
          aria-disabled={!target}
          onClick={() => target && navigate(target.to)}
        >
          다음으로
        </Button>
        <Button variant="soft" className="text-base!" onClick={() => navigate('/home')}>
          홈으로
        </Button>
      </div>

      <HomeIndicator />
    </div>
  )
}
