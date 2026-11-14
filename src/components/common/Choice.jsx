// 피그마 Components / Choice — 선택지 (라디오 형태)
// selected: 선택 여부, onClick: 선택 시 호출
// 피그마: 높이 54, 패딩 좌우16·위아래14, 모서리 16, 선택 시 안쪽 테두리 2px
// (테두리 두께가 달라도 글자 위치가 그대로이도록 좌우 패딩을 테두리만큼 줄임)
export default function Choice({ selected = false, onClick, children }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`flex min-h-[3.375rem] w-full items-center gap-3 rounded-2xl py-3.5 text-left text-sm text-ink transition ${
        selected
          ? 'border-2 border-primary-strong bg-surface-selected px-[0.875rem]'
          : 'border border-line bg-white px-[0.9375rem]'
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
