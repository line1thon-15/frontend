// 피그마 Components / StatusBar — 시연용 상단 상태바
export default function StatusBar() {
  return (
    <div className="flex h-11 items-center justify-between bg-surface px-6 text-sm font-semibold text-ink">
      <span>9:41</span>
      <div className="flex gap-1">
        <span className="h-2.5 w-4 rounded-sm bg-ink" />
        <span className="h-2.5 w-4 rounded-sm bg-ink" />
        <span className="h-2.5 w-6 rounded-sm bg-ink" />
      </div>
    </div>
  )
}
