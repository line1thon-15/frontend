// 피그마 Components / Placeholder — 이미지 자리 표시
export default function Placeholder({ label = '이미지', className = 'h-40' }) {
  return (
    <div className={`flex w-full items-center justify-center rounded-2xl bg-[#FFF6DE] text-xs text-[#7A5600]/60 ${className}`}>
      {label}
    </div>
  )
}
