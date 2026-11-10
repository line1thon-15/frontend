// Y2-1 첫 설정
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/common/StatusBar.jsx'
import Header from '../components/common/Header.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'

// sample: 카드 속 '가' 크기(피그마 11·18·26pt)
// root: '다 했어요' 이후 앱 전체 기준 글자 크기(html font-size). rem 단위 글자·여백이 같이 바뀌어요.
const FONT_SIZES = [
  { value: 'small', label: '작게', sample: 'text-[11px]', root: '14px' },
  { value: 'normal', label: '보통', sample: 'text-[18px]', root: '16px' },
  { value: 'large', label: '크게', sample: 'text-[26px]', root: '18px' },
]

const TRUSTED_PEOPLE = ['엄마', '아빠', '선생님', '할머니']

const QUESTIONS = [
  '모르는 사람이 말을 걸면 대답해요',
  '친구 부탁은 거절하기 어려워요',
  '돈이나 물건 이야기는 헷갈려요',
]
const ANSWERS = ['그래요', '가끔', '아니에요']

// 이 화면 안에서만 쓰는 둥근 선택 버튼
function Pill({ selected, dashed, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-[0.8125rem] whitespace-nowrap transition ${
        selected
          ? 'border border-[#FFC531] bg-[#FFC531]'
          : `border bg-white ${dashed ? 'border-dashed border-[#E6CF95]' : 'border-[#F0E2BF]'}`
      }`}
    >
      {children}
    </button>
  )
}

export default function FirstSetup() {
  const navigate = useNavigate()
  const [fontSize, setFontSize] = useState('normal')
  const [trusted, setTrusted] = useState('엄마')
  const [customOpen, setCustomOpen] = useState(false)
  const [customName, setCustomName] = useState('')
  const [answers, setAnswers] = useState([null, null, null])

  const allAnswered = answers.every((a) => a !== null)
  const trustedName = customOpen ? customName.trim() : trusted
  const canSubmit = allAnswered && trustedName.length > 0

  const setAnswer = (qIndex, answer) =>
    setAnswers((prev) => prev.map((a, i) => (i === qIndex ? answer : a)))

  const handleSubmit = () => {
    if (!canSubmit) return
    // TODO: 첫 설정 저장 API 연동 (새로고침해도 글자 크기가 유지되게 저장 필요) ({ fontSize, trusted: trustedName, answers })
    // 고른 글자 크기는 '다 했어요'를 누른 뒤 다음 화면부터 적용
    const { root } = FONT_SIZES.find((f) => f.value === fontSize)
    document.documentElement.style.fontSize = root
    navigate('/home')
  }

  return (
    // 스크롤은 되지만 스크롤바는 숨김
    <div className="h-screen overflow-y-auto bg-page text-[#3A2A12] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-h-full flex-col">
        <StatusBar />
        <Header title="처음 설정" />

        <main className="flex flex-1 flex-col px-5 pt-4">
          <h2 className="text-[1.375rem] leading-snug font-bold">
            나에게 맞게
            <br />
            설정해 볼까요?
          </h2>

          {/* 글자 크기 */}
          <p className="mt-5 mb-2 text-sm text-[#6B5A3C]">글자 크기</p>
          <div className="grid grid-cols-3 gap-2">
            {FONT_SIZES.map(({ value, label, sample }) => {
              const selected = fontSize === value
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setFontSize(value)}
                  className={`flex h-[4.25rem] flex-col items-center justify-center rounded-2xl ${
                    selected ? 'border-2 border-[#F2B300] bg-[#FFF6D6]' : 'border border-[#F0E2BF] bg-white'
                  }`}
                >
                  <span className={`font-bold ${sample}`}>가</span>
                  <span className="text-xs text-[#6B5A3C]">{label}</span>
                </button>
              )
            })}
          </div>

          {/* 믿는 사람 */}
          <p className="mt-5 mb-2 text-sm text-[#6B5A3C]">믿는 사람 (도움이 필요할 때 연락해요)</p>
          <div className="flex flex-wrap gap-1.5">
            {TRUSTED_PEOPLE.map((name) => (
              <Pill
                key={name}
                selected={!customOpen && trusted === name}
                onClick={() => {
                  setTrusted(name)
                  setCustomOpen(false)
                }}
              >
                {name}
              </Pill>
            ))}
            <Pill dashed selected={customOpen} onClick={() => setCustomOpen(true)}>
              + 직접 쓰기
            </Pill>
          </div>
          {customOpen && (
            <input
              autoFocus
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="예: 이모, 담임 선생님"
              className="mt-2 h-11 w-full rounded-xl border border-[#F0E2BF] bg-white px-4 text-sm outline-none placeholder:text-[#3A2A12]/35 focus:border-[#F2B300]"
            />
          )}

          {/* 3가지 질문 */}
          <p className="mt-5 mb-2 text-sm text-[#6B5A3C]">나를 알아보는 3가지 질문</p>
          <div className="flex flex-col gap-5 rounded-2xl border border-[#F0E2BF] bg-white px-4 py-4">
            {QUESTIONS.map((question, qIndex) => (
              <div key={question}>
                <p className="mb-2.5 text-sm font-medium">
                  {qIndex + 1}. {question}
                </p>
                <div className="flex gap-2">
                  {ANSWERS.map((answer) => (
                    <Pill
                      key={answer}
                      selected={answers[qIndex] === answer}
                      onClick={() => setAnswer(qIndex, answer)}
                    >
                      {answer}
                    </Pill>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[#6B5A3C]">정답은 없어요. 나에게 맞는 연습 순서를 정하는 데 사용해요.</p>
        </main>

        <div className="flex flex-col gap-3 px-5 pt-4 pb-3">
          <Button disabled={!canSubmit} onClick={handleSubmit}>
            다 했어요
          </Button>
          <p className="text-center text-sm text-[#6B5A3C]">나중에 설정에서 언제든 바꿀 수 있어요</p>
        </div>

        <HomeIndicator />
      </div>
    </div>
  )
}
