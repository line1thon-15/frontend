import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Start from './pages/Start.jsx'
import ChildLogin from './pages/ChildLogin.jsx'
import FirstSetup from './pages/FirstSetup.jsx'
import ChildHome from './pages/ChildHome.jsx'
import DeepenResult from './pages/DeepenResult.jsx'
import DeepenPractice from './pages/DeepenPractice.jsx'
import DeepenIntro from './pages/DeepenIntro.jsx'
import CodePinReset from './pages/CodePinReset.jsx'
import GuardianSummary from './pages/GuardianSummary.jsx'
import ChildGrowth from './pages/ChildGrowth.jsx'
import GuardianSignup from './pages/GuardianSignup.jsx'
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
        <Route path="/child/deepen/result" element={<DeepenResult />} />
        <Route path="/child/deepen/write" element={<DeepenPractice initialMode="write" />} />
        <Route path="/child/deepen/speak" element={<DeepenPractice initialMode="speak" />} />
        <Route path="/child/deepen" element={<DeepenIntro />} />
        <Route path="/guardian/reset" element={<CodePinReset />} />
        <Route path="/guardian/summary" element={<GuardianSummary />} />
        <Route path="/child/growth" element={<ChildGrowth />} />
        <Route path="/guardian/signup" element={<GuardianSignup />} />
        <Route path="/preview" element={<ComponentPreview />} />
      </Routes>
    </Layout>
  )
}