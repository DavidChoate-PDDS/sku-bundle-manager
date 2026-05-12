import { Routes, Route } from 'react-router-dom'
import BundlesPage from './pages/BundlesPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BundlesPage />} />
    </Routes>
  )
}
