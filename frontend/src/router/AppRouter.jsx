import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AnalyticsListener from '../components/AnalyticsListener'
import AppLayout from '../components/layout/AppLayout'
import ProtectedRoute from './ProtectedRoute'

import SplashPage from '../pages/SplashPage'
import LoginPage from '../pages/LoginPage'
import AuthPage from '../pages/AuthPage'
import NotFoundPage from '../pages/NotFoundPage'

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
      <AnalyticsListener />
      <Routes>
        {/* public */}
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* protected — share AppLayout (BottomNav) */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/setup" element={<SetupSessionPage />} />
          <Route path="/history" element={<SessionHistoryPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>

        {/* protected — no BottomNav (full-screen flows) */}
        <Route
          path="/lobby/:sessionId"
          element={
            <ProtectedRoute>
              <LobbyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/session/:sessionId"
          element={
            <ProtectedRoute>
              <SwipingSessionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/session/:sessionId/result"
          element={
            <ProtectedRoute>
              <MatchResultPage />
            </ProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
