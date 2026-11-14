// Y2-1 첫 설정
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/common/StatusBar.jsx'
import Header from '../components/common/Header.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'
import { saveOnboarding } from '../api/onboarding.js'
import { toMessage } from '../api/errors.js'
import { DEFAULT_FONT_SCALE, saveFontSize } from '../utils/fontSize.js'

// value: 백엔드 font_scale 값 / label: 화면 이름 / sample: 카드 속 '가' 크기(피그마 11·18·26pt)
// 실제 앱 전체 크기는 utils/fontSize.js의 FONT_SCALE ('다 했어요' 이후 다음 화면부터 적용)
const FONT_SIZES = [
  { value: 'normal', label: '작게', sample: 'text-[11px]' },
  { value: 'large', label: '보통', sample: 'text-[18px]' },
  { value: 'xlarge', label: '크게', sample: 'text-[26px]' },
]

const TRUSTED_PEOPLE = ['엄마', '아빠', '선생님', '할머니']

// 진단 3문항 — 백엔드 diagnosis.json과 같은 id·문구 (바뀌면 같이 바꿔야 해요)
const QUESTIONS = [
  {
    id: 'q1',
    text: '모르는 사람이 메시지로 돈을 쉽게 벌 수 있다고 하면 어떻게 할까요?',
    options: [
      { id: 'q1_a', text: '바로 해 본다' },
      { id: 'q1_b', text: '잘 모르겠다' },
      { id: 'q1_c', text: '믿는 어른에게 먼저 물어본다' },
    ],
  },
  {
    id: 'q2',
    text: '친구가 내 이름으로 휴대폰을 만들어 달라고 하면 어떻게 할까요?',
    options: [
      { id: 'q2_a', text: '친구니까 해 준다' },
      { id: 'q2_b', text: '잘 모르겠다' },
      { id: 'q2_c', text: '안 된다고 말한다' },
    ],
  },
  {
    id: 'q3',
    text: '모르는 링크를 눌러 개인정보를 쓰라고 하면 어떻게 할까요?',
    options: [
      { id: 'q3_a', text: '써서 보낸다' },
      { id: 'q3_b', text: '잘 모르겠다' },
      { id: 'q3_c', text: '누르지 않는다' },
    ],
  },
]

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
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SCALE)
  const [trusted, setTrusted] = useState('엄마')
  const [customOpen, setCustomOpen] = useState(false)
  const [customName, setCustomName] = useState('')
  // { 질문id: 선택지id }
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const allAnswered = QUESTIONS.every((q) => answers[q.id])
  const trustedName = customOpen ? customName.trim() : trusted
  const canSubmit = allAnswered && trustedName.length > 0 && !submitting

  const setAnswer = (questionId, optionId) => setAnswers((prev) => ({ ...prev, [questionId]: optionId }))

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setError('')
    try {
      await saveOnboarding({
        display: { font_scale: fontSize, high_contrast: false, tts_enabled: false },
        trusted_contact: { name: trustedName },
        diagnosis_answers: QUESTIONS.map((q) => ({ question_id: q.id, option_id: answers[q.id] })),
        favorite_apps: [],
      })
      // 고른 글자 크기는 '다 했어요'를 누른 뒤 다음 화면부터 적용
      saveFontSize(fontSize)
      navigate('/home', { replace: true })
    } catch (err) {
      setError(toMessage(err, { VALIDATION_ERROR: '입력한 내용을 다시 확인해 주세요.' }))
      setSubmitting(false)
    }
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
              maxLength={20}
              placeholder="예: 이모, 담임 선생님"
              className="mt-2 h-11 w-full rounded-xl border border-[#F0E2BF] bg-white px-4 text-sm outline-none placeholder:text-[#3A2A12]/35 focus:border-[#F2B300]"
            />
          )}

          {/* 3가지 질문 */}
          <p className="mt-5 mb-2 text-sm text-[#6B5A3C]">나를 알아보는 3가지 질문</p>
          <div className="flex flex-col gap-5 rounded-2xl border border-[#F0E2BF] bg-white px-4 py-4">
            {QUESTIONS.map((question, qIndex) => (
              <div key={question.id}>
                <p className="mb-2.5 text-sm font-medium break-keep">
                  {qIndex + 1}. {question.text}
                </p>
                <div className="flex flex-wrap gap-2">
                  {question.options.map((option) => (
                    <Pill
                      key={option.id}
                      selected={answers[question.id] === option.id}
                      onClick={() => setAnswer(question.id, option.id)}
                    >
                      {option.text}
                    </Pill>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[#6B5A3C]">정답은 없어요. 나에게 맞는 연습 순서를 정하는 데 사용해요.</p>
        </main>

        <div className="flex flex-col gap-3 px-5 pt-4 pb-3">
          {error && (
            <p role="alert" className="text-center text-sm text-alert">
              {error}
            </p>
          )}
          <Button disabled={!canSubmit} onClick={handleSubmit}>
            {submitting ? '저장하고 있어요…' : '다 했어요'}
          </Button>
          <p className="text-center text-sm text-[#6B5A3C]">나중에 설정에서 언제든 바꿀 수 있어요</p>
        </div>

        <HomeIndicator />
      </div>
    </div>
  )
}
