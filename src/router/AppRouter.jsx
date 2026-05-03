import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SplashPage from '../pages/SplashPage'
import LoginPage from '../pages/LoginPage'
import SetupSessionPage from '../pages/SetupSessionPage'
import DashboardPage from '../pages/DashboardPage'
import LobbyPage from '../pages/LobbyPage'
import SwipingSessionPage from '../pages/SwipingSessionPage'
import MatchResultPage from '../pages/MatchResultPage'
import SessionHistoryPage from '../pages/SessionHistoryPage'
import UserProfilePage from '../pages/UserProfilePage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/setup" element={<SetupSessionPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/lobby/:sessionId" element={<LobbyPage />} />
        <Route path="/session/:sessionId" element={<SwipingSessionPage />} />
        <Route path="/session/:sessionId/result" element={<MatchResultPage />} />
        <Route path="/history" element={<SessionHistoryPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}
