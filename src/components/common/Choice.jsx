// 피그마 Components / Choice — 선택지 (라디오 형태)
// selected: 선택 여부, onClick: 선택 시 호출
export default function Choice({ selected = false, onClick, children }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-[#3A2A12] transition ${
        selected
          ? 'border-2 border-[#F2B300] bg-[#FFF6D6]'
          : 'border border-[#F0E2BF] bg-white'
      }`}
    >
      <span
        className={`size-4 shrink-0 rounded-full border ${
          selected ? 'border-[#F2B300] bg-[#FFC531]' : 'border-[#F0E2BF] bg-white'
        }`}
        aria-hidden="true"
      />
      {children}
    </button>
  )
}
