// G2 아이 연결 (아이 등록)
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const GRADES = ['초등 고학년', '중학생', '고등학생']

function TextField({ label, ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm">{label}</span>
      <input
        className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-[15px] outline-none placeholder:text-muted focus:border-primary"
        {...inputProps}
      />
    </label>
  )
}

export default function ChildConnect() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [grade, setGrade] = useState(null)

  const canSubmit = name.trim() !== '' && grade !== null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    // TODO: 백엔드 아이 등록 API 연동 후, 성공하면 G3 성장 요약 화면으로 이동
    console.log('아이 연결 요청', { name, grade })
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-screen flex-col px-5 pb-8">
      {/* TODO: 공통 Header 컴포넌트가 나오면 교체 */}
      <header className="relative flex h-14 items-center justify-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          className="absolute left-0 p-1"
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-base font-medium">아이 등록</h1>
      </header>

      <h2 className="mt-4 mb-6 text-xl font-bold">아이를 등록해 주세요</h2>

      <div className="flex flex-col gap-5">
        <TextField
          label="아이 이름 (별명도 괜찮아요)"
          placeholder="예: 하늘"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <fieldset>
          <legend className="mb-2 text-sm">학년</legend>
          <div className="flex gap-2">
            {GRADES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setGrade(item)}
                aria-pressed={grade === item}
                className={`h-9 rounded-full border px-4 text-sm transition-colors ${
                  grade === item ? 'border-primary bg-primary font-bold' : 'border-line bg-white'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {/* TODO: 공통 Button 컴포넌트가 나오면 교체 */}
      <div className="mt-auto pt-6">
        <button
          type="submit"
          disabled={!canSubmit}
          className="h-14 w-full rounded-2xl bg-primary text-base font-bold transition-opacity disabled:opacity-40"
        >
          연결 완료
        </button>
      </div>
    </form>
  )
}
