// 피그마 Components / Choice — 선택지 (라디오 형태)
// selected: 선택 여부, onClick: 선택 시 호출
export default function Choice({ selected = false, onClick, children }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-ink transition ${
        selected
          ? 'border-2 border-primary-strong bg-surface-selected'
          : 'border border-line bg-white'
      }`}
    >
      <span
        className={`size-4 shrink-0 rounded-full border ${
          selected ? 'border-primary-strong bg-primary' : 'border-line bg-white'
        }`}
        aria-hidden="true"
      />
      {children}
    </button>
  )
}
