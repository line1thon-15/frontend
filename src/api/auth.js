import { api } from './client.js'

// 보호자 가입 → 성공하면 서버가 세션 쿠키(sid)를 내려줘요.
// 오류: EMAIL_TAKEN(409)
export const registerGuardian = ({ email, password }) =>
  api('/api/v1/guardians', { method: 'POST', body: { email, password } })

// 오류: INVALID_CREDENTIALS(401)
export const loginGuardian = ({ email, password }) =>
  api('/api/v1/auth/guardian/login', { method: 'POST', body: { email, password } })

// 아이 로그인 (연결 코드 6자리 + PIN 4자리) → { first_login }
// 오류: INVALID_CODE_OR_PIN(401)
export const loginChild = ({ linkCode, pin }) =>
  api('/api/v1/auth/child/login', { method: 'POST', body: { link_code: linkCode, pin } })

// 로그인한 사람 정보. 아이 세션이면 { role:'child', nickname, grade, onboarding_completed, display:{ font_scale, high_contrast, tts_enabled } }
// 오류: 401 UNAUTHENTICATED
export const getMe = () => api('/api/v1/auth/me')
