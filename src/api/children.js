import { api } from './client.js'

// 화면의 학년 선택 → 서버 학년 코드
// TODO: 피그마는 3단계(초등 고학년/중학생/고등학생)라 대표 학년으로 보내요. 백엔드와 확인 필요.
const GRADE_CODE = {
  '초등 고학년': 'E6',
  중학생: 'M2',
  고등학생: 'H2',
}

// TODO: 동의 문서 버전 — 백엔드와 값 확인 필요 (G1에서 필수 동의를 받은 뒤라 consent_agreed는 true)
const CONSENT_VERSION = 'v1'

// 아이 등록 → { child_id, nickname, grade, link_code }
// 오류: CONSENT_REQUIRED(422), VALIDATION_ERROR(422)
export const registerChild = ({ nickname, grade, pin }) =>
  api('/api/v1/children', {
    method: 'POST',
    body: {
      consent_agreed: true,
      consent_version: CONSENT_VERSION,
      nickname,
      grade: GRADE_CODE[grade],
      pin,
    },
  })

// 보호자의 아이 목록 → { children: [{ child_id, nickname, grade }] }
export const listChildren = () => api('/api/v1/children')

// PIN 재설정 → { ok: true } / 오류: CHILD_NOT_FOUND(404)
export const resetChildPin = (childId, pin) =>
  api(`/api/v1/children/${childId}/pin-reset`, { method: 'POST', body: { pin } })

// 연결 코드 재발급 → { link_code }
export const reissueLinkCode = (childId) =>
  api(`/api/v1/children/${childId}/link-code`, { method: 'POST' })
