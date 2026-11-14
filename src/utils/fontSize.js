// 앱 전체 글자 크기 설정 (첫 설정 화면에서 고름 → 홈부터 적용)
// html의 font-size를 바꾸면 rem 단위로 만든 글자·여백이 함께 커지거나 작아져요.
// → 화면을 만들 때 글자 크기는 px 대신 rem(text-sm, text-lg, text-[1.375rem] 등)으로 써 주세요.

const STORAGE_KEY = 'fontSize'

// 키는 백엔드 font_scale 값 그대로 써요.
// 화면 이름: normal = 작게(0.9배), large = 보통(피그마 크기 그대로), xlarge = 크게(1.15배)
export const FONT_SCALE = {
  normal: '14.4px',
  large: '16px',
  xlarge: '18.4px',
}
export const DEFAULT_FONT_SCALE = 'large'

export function applyFontSize(size) {
  document.documentElement.style.fontSize = FONT_SCALE[size] ?? FONT_SCALE[DEFAULT_FONT_SCALE]
}

// 적용하고 이 브라우저에도 기억해 둬요 (새로고침해도 유지)
export function saveFontSize(size) {
  applyFontSize(size)
  try {
    localStorage.setItem(STORAGE_KEY, size)
  } catch {
    // 저장이 안 되는 환경(시크릿 모드 등)에서는 이번 접속에만 적용
  }
}

// 앱을 열 때 이 브라우저에 기억해 둔 설정을 다시 적용
// (로그인 뒤에는 /auth/me의 display.font_scale로 다시 맞춰요 — 아이 홈)
export function loadFontSize() {
  try {
    applyFontSize(localStorage.getItem(STORAGE_KEY))
  } catch {
    applyFontSize(DEFAULT_FONT_SCALE)
  }
}
