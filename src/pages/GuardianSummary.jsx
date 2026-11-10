// G3 성장 요약 (보호자)
import { useState } from 'react'
import StatusBar from '../components/common/StatusBar.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'

// TODO: 백엔드 연동 후 보호자 성장 요약 API에서 받아오기
const MOCK = {
  nickname: '하늘',
  alert: {
    time: '11/3 (화) 오후 4:12',
    title: '확인이 필요한 메시지 결과가 있었어요',
    description: '메시지 내용과 사진은 공유되지 않아요. 아이와 편하게 이야기해 보세요.',
  },
  stats: [
    { label: '이번 주 연습', value: '12회' },
    { label: '먼저 판단', value: '62%' },
    { label: '약한 단서', value: '2개' },
  ],
  weeks: ['3주 전', '2주 전', '지난주', '이번 주'],
  trends: {
    missed: { label: '위험 놓침', values: [40, 32, 28, 18] },
    doubt: { label: '정상 의심', values: [30, 26, 22, 20] },
    first: { label: '먼저 판단', values: [34, 58, 40, 62] },
  },
  areas: [
    { label: '게임 아이템·용돈 사기', progress: 80 },
    { label: '친구의 무리한 부탁', progress: 40 },
  ],
}

// 받침이 있는 이름 뒤에는 '이'를 붙여요 (하늘 → 하늘이, 강아지 → 강아지)
function callName(name) {
  const code = name.charCodeAt(name.length - 1) - 0xac00
  const hasBatchim = code >= 0 && code <= 11171 && code % 28 !== 0
  return hasBatchim ? `${name}이` : name
}

// 지표 추이 꺾은선 그래프 (피그마 Chart.svg 기준 319×87, 값의 최소~최대가 위아래 끝에 오도록 그려요)
const CHART = { width: 319, height: 87, padX: 40, yTop: 8.25, yBottom: 56.25, grid: [8.25, 44.25, 82.25] }

function TrendChart({ weeks, values }) {
  const { width, height, padX, yTop, yBottom, grid } = CHART
  const min = Math.min(...values)
  const max = Math.max(...values)
  const points = values.map((value, i) => ({
    x: padX + (i * (width - padX * 2)) / (values.length - 1),
    y: yBottom - ((value - min) / (max - min || 1)) * (yBottom - yTop),
  }))
  const last = points[points.length - 1]

  return (
    <div className="relative h-[7.5rem] overflow-hidden rounded-[1.125rem] bg-placeholder">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-x-0 top-2 w-full"
        role="img"
        aria-label="주별 지표 추이"
      >
        {grid.map((y) => (
          <line key={y} x1="0" x2={width} y1={y} y2={y} stroke="#efebe3" />
        ))}
        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="#24211c"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.slice(0, -1).map((p) => (
          <circle key={p.x} cx={p.x} cy={p.y} r="4" fill="#24211c" />
        ))}
        <circle cx={last.x} cy={last.y} r="7" fill="#ffd43b" stroke="#24211c" strokeWidth="2.5" />
      </svg>
      <ul className="absolute inset-x-0 top-24 h-[1.0625rem] text-xs leading-[1.4]">
        {weeks.map((week, i) => (
          <li
            key={week}
            className={`absolute -translate-x-1/2 whitespace-nowrap ${
              i === weeks.length - 1 ? 'font-medium text-[#24211c]' : 'text-[#8e877a]'
            }`}
            style={{ left: `${(points[i].x / width) * 100}%` }}
          >
            {week}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function GuardianSummary() {
  const { nickname, alert, stats, weeks, trends, areas } = MOCK
  const [metric, setMetric] = useState('first')

  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <StatusBar />

      <main className="flex flex-1 flex-col gap-3 px-5 pt-3">
        <h1 className="py-2 text-[1.0625rem] leading-[1.45] font-bold">{callName(nickname)}의 성장 요약</h1>

        {/* TODO: 안전 알림은 메시지 분석 기능과 연결됨 — MVP 포함 여부 확인 필요 */}
        <section className="flex flex-col gap-1.5 rounded-[1.125rem] border-2 border-alert bg-alert-soft p-4">
          <span className="self-start rounded-full bg-alert-strong px-3 py-1.5 text-[0.8125rem] font-medium text-white">
            안전 알림
          </span>
          <p className="text-xs text-subtle">{alert.time}</p>
          <p className="text-[0.9375rem] leading-[1.45] font-bold">{alert.title}</p>
          <p className="text-[0.8125rem] leading-[1.45] text-muted">{alert.description}</p>
        </section>

        <ul className="grid grid-cols-3 gap-2">
          {stats.map((item) => (
            <li key={item.label} className="flex flex-col items-center gap-0.5 rounded-[1.125rem] bg-surface-soft p-4">
              <p className="text-xl font-bold">{item.value}</p>
              <p className="text-xs text-subtle">{item.label}</p>
            </li>
          ))}
        </ul>

        <section className="rounded-[1.125rem] border border-line bg-white p-4">
          <h2 className="text-sm font-bold text-muted">지표 추이</h2>
          <div className="mt-2 mb-3 flex gap-2" role="tablist">
            {Object.entries(trends).map(([key, trend]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={metric === key}
                onClick={() => setMetric(key)}
                className={`rounded-full px-3 py-1.5 text-[0.8125rem] font-medium text-primary-ink transition-colors ${
                  metric === key
                    ? 'border border-primary-ink bg-chip'
                    : 'bg-surface-soft'
                }`}
              >
                {trend.label}
              </button>
            ))}
          </div>
          <TrendChart weeks={weeks} values={trends[metric].values} />
        </section>

        <section className="rounded-[1.125rem] bg-surface-soft p-4">
          <h2 className="text-sm font-bold text-muted">영역별 진행</h2>
          <ul className="mt-1.5 flex flex-col gap-1.5 text-sm leading-[1.45]">
            {areas.map((area) => (
              <li key={area.label}>
                {area.label} · {area.progress}%
              </li>
            ))}
          </ul>
        </section>
      </main>

      <div className="px-5 pt-4 pb-4">
        {/* TODO: 약한 단서 상세 화면이 정해지면 연결 */}
        <Button variant="outline" className="text-base!">
          약한 단서 자세히 보기
        </Button>
      </div>

      <HomeIndicator />
    </div>
  )
}
