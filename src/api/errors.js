import { ApiError } from './client.js'

// API 오류를 아이·보호자에게 보여 줄 문장으로 바꿔요.
// byCode: { 서버오류코드: '보여줄 문장' } — 화면마다 필요한 코드만 넘기면 돼요.
export function toMessage(err, byCode = {}) {
  if (err instanceof ApiError) {
    if (err.code && byCode[err.code]) return byCode[err.code]
    if (err.status >= 500) return '잠시 문제가 생겼어요. 조금 뒤에 다시 해 주세요.'
    return '요청을 처리하지 못했어요. 입력한 내용을 확인해 주세요.'
  }
  // fetch 자체가 실패한 경우 (네트워크 끊김 등)
  return '인터넷 연결을 확인하고 다시 해 주세요.'
}
