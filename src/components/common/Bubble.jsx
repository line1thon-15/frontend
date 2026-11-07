// 피그마 Components / Bubble — 대화 말풍선
// from: 'other'(상대, 왼쪽·프로필 있음) | 'me'(나, 오른쪽)
export default function Bubble({ from = 'other', children }) {
  if (from === 'me') {
    return (
      <div className="flex justify-end">
        <p className="max-w-[75%] rounded-3xl bg-[#FFC531] px-4 py-2.5 text-sm text-[#3A2A12]">{children}</p>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2">
      <span className="size-8 shrink-0 rounded-full bg-[#FF9466]" aria-hidden="true" />
      <p className="max-w-[75%] rounded-3xl bg-[#FFF1C7] px-4 py-2.5 text-sm text-[#3A2A12]">{children}</p>
    </div>
  )
}
