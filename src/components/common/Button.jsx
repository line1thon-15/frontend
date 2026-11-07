// 피그마 Components / Button
// variant: 'primary'(1번, 노랑) | 'outline'(2번, 테두리) | 'soft'(3번, 연노랑)
const VARIANTS = {
  primary: 'bg-[#FFC531] text-[#3A2A12]',
  outline: 'bg-white text-[#7A5600] border-[1.5px] border-[#F2B300]',
  soft: 'bg-[#FFF1C7] text-[#7A5600]',
}

export default function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      type="button"
      className={`h-12 w-full rounded-xl text-base font-bold transition active:brightness-95 disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
