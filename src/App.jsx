import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Start from './pages/Start.jsx'
import ChildLogin from './pages/ChildLogin.jsx'
import FirstSetup from './pages/FirstSetup.jsx'
import ChildHome from './pages/ChildHome.jsx'
import NextStep from './pages/NextStep.jsx'
import DeepenResult from './pages/DeepenResult.jsx'
import DeepenPractice from './pages/DeepenPractice.jsx'
import DeepenIntro from './pages/DeepenIntro.jsx'
import CodePinReset from './pages/CodePinReset.jsx'
import GuardianSummary from './pages/GuardianSummary.jsx'
import ChildGrowth from './pages/ChildGrowth.jsx'
import GuardianSignup from './pages/GuardianSignup.jsx'
import ChildConnect from './pages/ChildConnect.jsx'
import ChildConnectDone from './pages/ChildConnectDone.jsx'
import EmotionCheck from './pages/EmotionCheck.jsx'
import PracticeChat from './pages/PracticeChat.jsx'
import PracticeResult from './pages/PracticeResult.jsx'
import ComponentPreview from './pages/ComponentPreview.jsx'

// 화면을 추가할 때 여기에 Route를 한 줄씩 추가하세요.
// 예: <Route path="/growth" element={<Growth />} />
export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/child/login" element={<ChildLogin />} />
        <Route path="/child/setup" element={<FirstSetup />} />
        <Route path="/home" element={<ChildHome />} />
        <Route path="/child/next" element={<NextStep />} />
        <Route path="/child/deepen/result" element={<DeepenResult />} />
        <Route path="/child/deepen/write" element={<DeepenPractice initialMode="write" />} />
        <Route path="/child/deepen/speak" element={<DeepenPractice initialMode="speak" />} />
        <Route path="/child/deepen" element={<DeepenIntro />} />
        <Route path="/guardian/reset" element={<CodePinReset />} />
        <Route path="/guardian/summary" element={<GuardianSummary />} />
        <Route path="/child/growth" element={<ChildGrowth />} />
        <Route path="/guardian/signup" element={<GuardianSignup />} />
        <Route path="/guardian/connect" element={<ChildConnect />} />
        <Route path="/guardian/connect/done" element={<ChildConnectDone />} />
        <Route path="/practice/:areaId" element={<EmotionCheck />} />
        <Route path="/practice/:areaId/chat/:sessionId" element={<PracticeChat />} />
        <Route path="/practice/:areaId/result/:sessionId" element={<PracticeResult />} />
        <Route path="/preview" element={<ComponentPreview />} />
      </Routes>
    </Layout>
  )
}
