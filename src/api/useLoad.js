import { useEffect, useState } from 'react'

// 화면이 열릴 때 API를 한 번 불러오고, reload()로 다시 불러와요.
// load는 컴포넌트 밖에 있는 함수(또는 안정된 함수)를 넘겨 주세요.
// 반환: { status: 'loading' | 'done' | 'error', data, error, reload }
export function useLoad(load) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading', data: null, error: null })
    load()
      .then((data) => {
        if (!cancelled) setState({ status: 'done', data, error: null })
      })
      .catch((error) => {
        if (!cancelled) setState({ status: 'error', data: null, error })
      })
    return () => {
      cancelled = true
    }
  }, [load, tick])

  return { ...state, reload: () => setTick((t) => t + 1) }
}
