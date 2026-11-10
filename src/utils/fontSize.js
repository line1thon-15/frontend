// 앱 전체 글자 크기 설정 (첫 설정 화면에서 고름 → 홈부터 적용)
// html의 font-size를 바꾸면 rem 단위로 만든 글자·여백이 함께 커지거나 작아져요.
// → 화면을 만들 때 글자 크기는 px 대신 rem(text-sm, text-lg, text-[1.375rem] 등)으로 써 주세요.

const STORAGE_KEY = 'fontSize'

// 보통 = 피그마 크기 그대로(16px). 작게 0.9배, 크게 1.15배
export const FONT_SCALE = {
  small: '14.4px',
  normal: '16px',
  large: '18.4px',
}

export function applyFontSize(size) {
  document.documentElement.style.fontSize = FONT_SCALE[size] ?? FONT_SCALE.normal
}

// 첫 설정 '다 했어요'에서 호출 (#4 머지 후 연결)
export function saveFontSize(size) {
  applyFontSize(size)
  try {
    localStorage.setItem(STORAGE_KEY, size)
  } catch {
    // 저장이 안 되는 환경(시크릿 모드 등)에서는 이번 접속에만 적용
  }
}

// 앱을 열 때 저장된 설정을 다시 적용
// TODO: 설정 저장 API(T-31) 연동 후에는 로그인 응답의 설정값으로 applyFontSize 호출
export function loadFontSize() {
  try {
    applyFontSize(localStorage.getItem(STORAGE_KEY))
  } catch {
    applyFontSize('normal')
  }
}
