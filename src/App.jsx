import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Start from './pages/Start.jsx'
import ChildLogin from './pages/ChildLogin.jsx'
import FirstSetup from './pages/FirstSetup.jsx'
import ChildHome from './pages/ChildHome.jsx'
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
        <Route path="/practice/:areaId/result" element={<PracticeResult />} />
        <Route path="/preview" element={<ComponentPreview />} />
      </Routes>
    </Layout>
  )
}