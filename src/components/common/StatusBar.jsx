// 피그마 Components / StatusBar — 시연용 상단 상태바
export default function StatusBar() {
  return (
    <div className="flex h-11 items-center justify-between bg-[#FFFBEE] px-6 text-sm font-semibold text-[#3A2A12]">
      <span>9:41</span>
      <div className="flex gap-1">
        <span className="h-2.5 w-4 rounded-sm bg-[#3A2A12]" />
        <span className="h-2.5 w-4 rounded-sm bg-[#3A2A12]" />
        <span className="h-2.5 w-6 rounded-sm bg-[#3A2A12]" />
      </div>
    </div>
  )
}
