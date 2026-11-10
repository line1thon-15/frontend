// 피그마 Components / StatusBar — 시연용 상단 상태바 (393×54, 패딩 좌32·위12·우28)
export default function StatusBar() {
  return (
    <div className="flex h-[3.375rem] items-center justify-between bg-surface pt-3 pr-7 pl-8 text-sm font-semibold text-ink">
      <span>9:41</span>
      <div className="flex gap-1">
        <span className="h-2.5 w-4 rounded-sm bg-ink" />
        <span className="h-2.5 w-4 rounded-sm bg-ink" />
        <span className="h-2.5 w-6 rounded-sm bg-ink" />
      </div>
    </div>
  )
}
