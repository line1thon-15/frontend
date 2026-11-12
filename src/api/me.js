import { api } from './client.js'

// 아이 홈 → { areas: [{ area }], badges: [{ badge_id, area, label }], streak_days, trusted_contact: { name, phone } | null }
// 오류: 401 UNAUTHENTICATED, 403 FORBIDDEN_ROLE (아이 세션만 가능)
export const getHome = () => api('/api/v1/me/home')

// 내 성장 → { areas: [{ area, practice_count, badges }], streak_days, needs_practice_cues: [{ cue_id, label, sentence }], metrics: [...] }
export const getGrowth = () => api('/api/v1/me/growth')
