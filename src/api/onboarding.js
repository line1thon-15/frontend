import { api } from './client.js'

// 첫 설정 저장 (아이 세션만 가능)
// body: { display: { font_scale: 'normal'|'large'|'xlarge', high_contrast, tts_enabled },
//         trusted_contact: { name(1~20자), phone(선택) },
//         diagnosis_answers: [{ question_id, option_id }] (3개, 질문 중복 안 됨),
//         favorite_apps: [] (선택) }
// 응답: { start_difficulty }
// 오류: 401 UNAUTHENTICATED, 403 FORBIDDEN_ROLE, 422 VALIDATION_ERROR
export const saveOnboarding = (body) => api('/api/v1/me/onboarding', { method: 'PUT', body })
