import { api } from './client.js'

// 보호자 리포트 → { child: { child_id, nickname }, areas, weak_cues, notices, metrics, summary }
// 오류: 401 UNAUTHENTICATED, 403 FORBIDDEN_ROLE, 404 CHILD_NOT_FOUND
export const getReport = (childId) => api(`/api/v1/children/${childId}/report`)
