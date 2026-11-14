import { useNavigate } from 'react-router-dom'
import backIcon from '../../assets/icons/back.svg'

// 피그마 Components / Header — 뒤로가기 + 가운데 제목
// onBack을 안 넘기면 브라우저 뒤로가기, showBack={false}면 버튼 숨김
export default function Header({ title, showBack = true, onBack }) {
  const navigate = useNavigate()
  return (
    <header className="relative flex h-12 items-center justify-center bg-page px-4 text-ink">
      {showBack && (
        <button
          type="button"
          aria-label="뒤로 가기"
          onClick={onBack ?? (() => navigate(-1))}
          className="absolute left-2 flex size-10 items-center justify-center"
        >
          <img src={backIcon} alt="" className="h-3.5 w-2" />
        </button>
      )}
      <h1 className="text-base font-bold">{title}</h1>
    </header>
  )
}
