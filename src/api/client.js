// 백엔드 API 호출 공통 함수
// 서버 주소(VITE_API_URL)는 비워 둡니다. 경로는 /api/v1/... 로 쓰고, 로컬은 vite 프록시·배포는 vercel 리라이트가 백엔드로 넘겨요.
const BASE_URL = import.meta.env.VITE_API_URL ?? ''

// 오류 응답({ error: { code, message } })을 담은 오류.
// 화면에서는 error.status, error.code 로 문구를 고르세요. (예: 401 → 로그인 이동, 409 → 이미 처리됨)
export class ApiError extends Error {
  constructor(status, code, message) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export async function api(path, options = {}) {
  const { body, headers, ...rest } = options
  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: { 'Content-Type': 'application/json', ...headers },
    // 객체를 넘기면 JSON 문자열로 바꿔서 보내요.
    body: body !== undefined && typeof body !== 'string' ? JSON.stringify(body) : body,
  })

  // 성공·실패 모두 본문은 JSON (백엔드는 204를 쓰지 않음). 본문이 비어도 오류 처리는 이어가요.
  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    const error = data?.error
    throw new ApiError(res.status, error?.code ?? null, error?.message ?? `API ${res.status}: ${path}`)
  }
  // 성공인데 JSON이 아니면(예: /api 요청이 시작 화면 HTML로 돌아온 경우) 실패로 처리해요.
  // 이걸 막지 않으면 화면이 조용히 비어 보이거나 가짜 성공으로 넘어가요.
  if (data === null) {
    throw new ApiError(res.status, 'INVALID_RESPONSE', `API 응답이 올바르지 않아요: ${path}`)
  }
  return data
}
