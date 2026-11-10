// Y5 연습 결과
import { useNavigate, useParams } from 'react-router-dom'
import StatusBar from '../components/common/StatusBar.jsx'
import Header from '../components/common/Header.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'

// TODO: 연습 결과 API(T-16) 연동 — 지금은 피그마 시안 내용 그대로
const MOCK_RESULT = {
  title: ['잘했어요!', '부모님께 먼저 물어본 건 좋은 선택이에요'],
  foundClues: ['서두르게 함', '상품권 번호 요구'],
  missedClue: { label: '너무 싼 가격', tip: '보통보다 훨씬 싸면 한 번 더 의심해 봐요' },
  nextAction: '돈이나 번호를 달라고 하면 → 멈추고 믿는 사람에게 물어봐요',
}

function Card({ title, className, children }) {
  return (
    <section className={`rounded-3xl p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-muted">{title}</h3>
      <div className="mt-2.5">{children}</div>
    </section>
  )
}

export default function PracticeResult() {
  const navigate = useNavigate()
  const { areaId } = useParams()
  const { title, foundClues, missedClue, nextAction } = MOCK_RESULT

  return (
    // 글자를 크게 하면 길어질 수 있어서 스크롤 가능 (스크롤바는 숨김)
    <div className="h-screen overflow-y-auto bg-page text-ink [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-h-full flex-col">
        <StatusBar />
        <Header title="연습 결과" />

        <main className="flex flex-1 flex-col px-5 pt-4">
          <h2 className="text-xl leading-snug font-bold break-keep">
            {title[0]}
            <br />
            {title[1]}
          </h2>

          <div className="mt-4 flex flex-col gap-4">
            <Card title="내가 찾은 단서" className="bg-surface-soft">
              <ul className="flex flex-wrap gap-2">
                {foundClues.map((clue) => (
                  <li
                    key={clue}
                    className="rounded-full border border-hint bg-mint-soft px-3 py-1.5 text-sm text-hint"
                  >
                    {clue}
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="다음엔 이것도 찾아봐요" className="bg-surface-soft">
              <span className="inline-block rounded-full border border-primary-ink px-3 py-1.5 text-sm text-primary-ink">
                {missedClue.label}
              </span>
              <p className="mt-2.5 text-sm text-subtle">{missedClue.tip}</p>
            </Card>

            <Card title="다음엔 이렇게" className="border border-line bg-white">
              <p className="text-[0.9375rem] leading-relaxed break-keep">{nextAction}</p>
            </Card>
          </div>
        </main>

        <div className="flex flex-col gap-2.5 px-5 pt-6 pb-4">
          <Button onClick={() => navigate('/home')}>완료</Button>
          {/* TODO: 다시 도전 출제(T-16) — 같은 단서를 다른 상황으로 연습 */}
          <Button variant="soft" onClick={() => navigate(`/practice/${areaId}`)}>
            비슷한 상황 다시 연습하기
          </Button>
        </div>

        <HomeIndicator />
      </div>
    </div>
  )
}
