// Y7-3 심화 연습 결과
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/common/StatusBar.jsx'
import Header from '../components/common/Header.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'

// TODO: 백엔드(AI) 심화 연습 평가 결과 API 연동 후 교체
const MOCK = {
  title: '잘 지켰어요!',
  myAnswer: '비밀번호는 알려 줄 수 없어. 부모님께 먼저 물어보고 답할게',
  clues: ['비밀번호 요구', '비밀로 하자는 말', '대신 해 준다는 말'],
  tips: ['"싫어", "안 돼"라고 분명하게 말해요', '대화를 멈추고 상대를 차단해요', '이 대화를 부모님께 보여 줘요'],
}

export default function DeepenResult() {
  const navigate = useNavigate()
  const { title, myAnswer, clues, tips } = MOCK

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <StatusBar />
      <Header title="심화 연습 결과" />

      <main className="flex flex-1 flex-col gap-3 px-5 pt-3">
        <section className="rounded-2xl border-2 border-emerald-700/70 bg-mint-soft p-4">
          <h2 className="text-xl font-bold text-emerald-700">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed">내가 한 말: “{myAnswer}”</p>
        </section>

        <section className="rounded-2xl bg-surface-soft p-4">
          <h2 className="text-sm font-bold text-muted">내가 알아챈 단서</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {clues.map((clue) => (
              <li
                key={clue}
                className="rounded-full border border-rose-400 bg-rose-50 px-3 py-1 text-sm text-rose-700"
              >
                {clue}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-line bg-white p-4">
          <h2 className="text-sm font-bold text-muted">이렇게 하면 더 좋아요</h2>
          <ol className="mt-3 flex flex-col gap-2 text-sm">
            {tips.map((tip, i) => (
              <li key={tip}>
                {i + 1}. {tip}
              </li>
            ))}
          </ol>
        </section>

        <p className="text-xs leading-relaxed text-subtle">
          이 피드백은 참고용이에요.
          <br />
          헷갈리면 믿는 사람에게 확인해 보세요.
        </p>
      </main>

      <div className="flex flex-col gap-3 px-5 pt-6 pb-4">
        <Button onClick={() => navigate('/child/next')}>다음으로</Button>
        {/* TODO: 글로/말로 중 아이가 고른 방식의 심화 연습 화면으로 돌아가기 (Y7-1 / Y7-2) */}
        <Button variant="soft" onClick={() => navigate('/child/deepen/write')}>
          내 답 다시 써 보기
        </Button>
      </div>

      <HomeIndicator />
    </div>
  )
}
