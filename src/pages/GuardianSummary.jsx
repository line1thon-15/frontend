// G3 성장 요약 (보호자)
import { useState } from 'react'
import StatusBar from '../components/common/StatusBar.jsx'
import Button from '../components/common/Button.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'
import { listChildren } from '../api/children.js'
import { getReport } from '../api/report.js'
import { AREA_LABEL } from '../api/areas.js'
import { toMessage } from '../api/errors.js'
import { useLoad } from '../api/useLoad.js'

// MVP는 아이 한 명이라, 목록의 첫 아이 리포트를 불러와요. 하나라도 실패하면 요약 전체를 실패로 처리해요.
async function loadReport() {
  const { children } = await listChildren()
  if (children.length === 0) throw new Error('NO_CHILD')
  return getReport(children[0].child_id)
}

const pad = (n) => String(n).padStart(2, '0')

// '11/3 (화) 오후 4:12'
function formatTime(iso) {
  const d = new Date(iso)
  const day = '일월화수목금토'[d.getDay()]
  const h = d.getHours()
  return `${d.getMonth() + 1}/${d.getDate()} (${day}) ${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${pad(d.getMinutes())}`
}

// 비율 값(0~1)을 %로. TODO: 서버가 0~1로 주는지 0~100으로 주는지 확인 필요
const toPercent = (v) => (v == null ? '–' : `${Math.round(v <= 1 ? v * 100 : v)}%`)

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
  const { status, data, error, reload } = useLoad(loadReport)
  const [selected, setSelected] = useState(null)

  const header = (
    <>
      <StatusBar />
    </>
  )

  if (status !== 'done') {
    return (
      <div className="flex min-h-screen flex-col bg-page text-ink">
        {header}
        <main className="flex flex-1 flex-col items-center justify-center gap-3 px-5 text-center">
          {status === 'loading' ? (
            <p className="text-sm text-subtle">불러오는 중이에요</p>
          ) : (
            <>
              <p className="text-[0.9375rem] leading-[1.45] font-bold">요약을 불러오지 못했어요</p>
              <p role="alert" className="text-[0.8125rem] leading-[1.45] text-muted">
                {error?.message === 'NO_CHILD' ? '등록된 아이가 없어요.' : toMessage(error)}
              </p>
              <Button onClick={reload} className="text-base!">
                다시 시도
              </Button>
            </>
          )}
        </main>
        <HomeIndicator />
      </div>
    )
  }

  const { child, areas, weak_cues: weakCues, notices, metrics } = data
  const alertNotice = notices
    .filter((n) => n.kind === 'safety')
    .sort((x, y) => new Date(y.occurred_at) - new Date(x.occurred_at))[0]
  const totalPractice = areas.reduce((sum, a) => sum + a.practice_count, 0)
  const ahead = metrics.find((m) => m.metric_id === 'ahead_of_ai_ratio')
  const stats = [
    // 서버가 주별 횟수를 주지 않아 전체 연습 횟수로 보여 줘요
    { label: '전체 연습', value: `${totalPractice}회` },
    { label: '먼저 판단', value: ahead?.status === 'ok' ? toPercent(ahead.current) : '–' },
    { label: '약한 단서', value: `${weakCues.length}개` },
  ]
  // 추이를 그릴 수 있는(점 2개 이상) 지표만 탭으로 보여 줘요
  const chartMetrics = metrics.filter((m) => m.status === 'ok' && m.trend.length >= 2)
  const activeMetric = chartMetrics.find((m) => m.metric_id === selected) ?? chartMetrics[0]
  const scale = activeMetric && activeMetric.trend.every((p) => p.value <= 1) ? 100 : 1

  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      {header}

      <main className="flex flex-1 flex-col gap-3 px-5 pt-3">
        <h1 className="py-2 text-[1.0625rem] leading-[1.45] font-bold">{callName(child.nickname)}의 성장 요약</h1>

        {alertNotice && (
          <section className="flex flex-col gap-1.5 rounded-[1.125rem] border-2 border-alert bg-alert-soft p-4">
            <span className="self-start rounded-full bg-alert-strong px-3 py-1.5 text-[0.8125rem] font-medium text-white">
              안전 알림
            </span>
            <p className="text-xs text-subtle">{formatTime(alertNotice.occurred_at)}</p>
            <p className="text-[0.9375rem] leading-[1.45] font-bold">확인이 필요한 메시지 결과가 있었어요</p>
            <p className="text-[0.8125rem] leading-[1.45] text-muted">
              메시지 내용과 사진은 공유되지 않아요. 아이와 편하게 이야기해 보세요.
            </p>
          </section>
        )}

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
          {activeMetric ? (
            <>
              <div className="mt-2 mb-3 flex flex-wrap gap-2" role="tablist">
                {chartMetrics.map((m) => (
                  <button
                    key={m.metric_id}
                    type="button"
                    role="tab"
                    aria-selected={activeMetric.metric_id === m.metric_id}
                    onClick={() => setSelected(m.metric_id)}
                    className={`rounded-full px-3 py-1.5 text-[0.8125rem] font-medium text-primary-ink transition-colors ${
                      activeMetric.metric_id === m.metric_id ? 'border border-primary-ink bg-chip' : 'bg-surface-soft'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <TrendChart
                weeks={activeMetric.trend.map((p) => {
                  const d = new Date(p.date)
                  return `${d.getMonth() + 1}/${d.getDate()}`
                })}
                values={activeMetric.trend.map((p) => p.value * scale)}
              />
            </>
          ) : (
            <p className="mt-2 text-[0.8125rem] text-subtle">아직 기록이 적어요</p>
          )}
        </section>

        <section className="rounded-[1.125rem] bg-surface-soft p-4">
          <h2 className="text-sm font-bold text-muted">영역별 진행</h2>
          <ul className="mt-1.5 flex flex-col gap-1.5 text-sm leading-[1.45]">
            {areas.map((area) => (
              <li key={area.area}>
                {AREA_LABEL[area.area] ?? area.area} · {area.practice_count}번 연습
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
