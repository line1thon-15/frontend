// 모바일 화면 기준 레이아웃 (피그마 프레임 너비에 맞춰 가운데 정렬)
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <main className="mx-auto min-h-screen w-full max-w-[390px] bg-white">
        {children}
      </main>
    </div>
  )
}
