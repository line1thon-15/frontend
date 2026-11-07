// 공통 컴포넌트 확인용 임시 페이지 (피그마 프레임 아님, 커밋하지 않기)
import { useState } from 'react'
import StatusBar from '../components/common/StatusBar.jsx'
import Header from '../components/common/Header.jsx'
import HomeIndicator from '../components/common/HomeIndicator.jsx'
import Button from '../components/common/Button.jsx'
import Bubble from '../components/common/Bubble.jsx'
import Choice from '../components/common/Choice.jsx'
import Placeholder from '../components/common/Placeholder.jsx'

function Section({ name, gap = 'gap-2', children }) {
  return (
    <section className={`flex flex-col ${gap}`}>
      <h2 className="text-xs font-bold text-neutral-400">{name}</h2>
      {children}
    </section>
  )
}

export default function ComponentPreview() {
  const [picked, setPicked] = useState(1)
  return (
    <div className="flex min-h-screen flex-col">
      <StatusBar />
      <Header title="컴포넌트 미리보기" />
      <div className="flex flex-1 flex-col gap-6 p-5">
        <Section name="Bubble">
          <Bubble>상대 메시지</Bubble>
          <Bubble from="me">내 메시지</Bubble>
        </Section>
        <Section name="Choice (눌러보세요)">
          {['선택지 1', '선택지 2', '선택지 3'].map((t, i) => (
            <Choice key={t} selected={picked === i} onClick={() => setPicked(i)}>{t}</Choice>
          ))}
        </Section>
        <Section name="Button" gap="gap-3.5">
          <Button>primary</Button>
          <Button variant="outline">outline</Button>
          <Button variant="soft">soft</Button>
        </Section>
        <Section name="Placeholder">
          <Placeholder />
        </Section>
      </div>
      <HomeIndicator />
    </div>
  )
}
