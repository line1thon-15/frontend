// 피그마 Components / Button
// variant: 'primary'(1번, 노랑) | 'outline'(2번, 테두리) | 'soft'(3번, 연노랑)
const VARIANTS = {
  primary: 'bg-primary text-ink',
  outline: 'bg-white text-primary-ink border-[1.5px] border-primary-strong',
  soft: 'bg-surface-soft text-primary-ink',
}

export default function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      type="button"
      className={`h-14 w-full rounded-2xl text-lg font-bold transition active:brightness-95 disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
