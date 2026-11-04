// 백엔드 API 호출 공통 함수
// 서버 주소는 프로젝트 루트의 .env 파일에 VITE_API_URL=http://... 로 넣으세요.
const BASE_URL = import.meta.env.VITE_API_URL ?? ''

export async function api(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
  return res.json()
}
