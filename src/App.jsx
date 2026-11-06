import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import GuardianSignup from './pages/GuardianSignup.jsx'
import ChildConnect from './pages/ChildConnect.jsx'

// 화면을 추가할 때 여기에 Route를 한 줄씩 추가하세요.
// 예: <Route path="/growth" element={<Growth />} />
export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guardian/signup" element={<GuardianSignup />} />
        <Route path="/guardian/connect" element={<ChildConnect />} />
      </Routes>
    </Layout>
  )
}
