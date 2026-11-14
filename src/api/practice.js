import { api } from './client.js'

// 연습 세션 응답(A15·A16·A17 공통)
// { session_id, mode, area, is_retry, status: 'in_progress' | 'ended' | 'stopped',
//   turn: { turn_index, speaker_name, platform, ai_line, choices: [{ id, text }], hint(1차 항상 null), substituted } | null }
// 아이 세션만 가능 (401 UNAUTHENTICATED, 403 FORBIDDEN_ROLE)

// A15 연습 시작 — 처음 하는 연습 (area: scam | identity_lending | friend_pressure)
// 오류: 409 NO_SCENARIO_AVAILABLE, 503 AI_UNAVAILABLE
export const startPractice = (area) =>
  api('/api/v1/practice/sessions', { method: 'POST', body: { mode: 'area', area } })

// A15 연습 시작 — 다시 도전 (retryOf: 끝난 세션 id)
export const startRetry = (retryOf) =>
  api('/api/v1/practice/sessions', { method: 'POST', body: { mode: 'retry', retry_of: retryOf } })

// A16 현재 턴 조회
// 오류: 404 SESSION_NOT_FOUND
export const getSession = (sessionId) => api(`/api/v1/practice/sessions/${sessionId}`)

// A17 답하기 — turnIndex는 받은 turn.turn_index 그대로 (빠지면 422)
// 오류: 409 TURN_ALREADY_ANSWERED(이미 처리됨 → A16 다시 조회), 409 SESSION_ENDED(→ 결과), 409 SESSION_STOPPED(→ 홈),
//       422 INVALID_CHOICE, 503 AI_UNAVAILABLE(같은 답으로 다시 시도)
export const answerTurn = (sessionId, { choiceId, turnIndex }) =>
  api(`/api/v1/practice/sessions/${sessionId}/turns`, {
    method: 'POST',
    body: { choice_id: choiceId, turn_index: turnIndex },
  })

// 결과 → { session_id, found: [{ cue_id, label, sentence }], missed: [...],
//          normal_outcome: 'trusted_correctly' | 'over_warned' | null,
//          cards: [{ level: 'red' | 'yellow' | 'green', sentence }], can_retry }
// 오류: 409 SESSION_NOT_ENDED, 404 SESSION_NOT_FOUND, 503 AI_UNAVAILABLE
export const getResult = (sessionId) => api(`/api/v1/practice/sessions/${sessionId}/result`)
