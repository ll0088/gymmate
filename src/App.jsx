import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCurrentUser } from './lib/supabase'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Swipe from './pages/Swipe'
import Matches from './pages/Matches'
import Chat from './pages/Chat'
import Pulse from './pages/Pulse'
import Marketplace from './pages/Marketplace'
import Shop from './pages/Shop'
import FoodScanner from './pages/FoodScanner'
import Profile from './pages/Profile'
import BottomNav from './components/BottomNav'
import PulseFAB from './components/PulseFAB'
import './index.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-cream)]">
        <div className="w-12 h-12 border-4 border-[var(--primary-teal)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--bg-cream)]">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
          <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/swipe" element={user ? <Swipe /> : <Navigate to="/" />} />
          <Route path="/matches" element={user ? <Matches /> : <Navigate to="/" />} />
          <Route path="/chat/:matchId" element={user ? <Chat /> : <Navigate to="/" />} />
          <Route path="/pulse" element={user ? <Pulse /> : <Navigate to="/" />} />
          <Route path="/marketplace" element={user ? <Marketplace /> : <Navigate to="/" />} />
          <Route path="/shop" element={user ? <Shop /> : <Navigate to="/" />} />
          <Route path="/scanner" element={user ? <FoodScanner /> : <Navigate to="/" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
        </Routes>

        {user && (
          <>
            <PulseFAB />
            <BottomNav />
          </>
        )}
      </div>
    </BrowserRouter>
  )
}

export default App
