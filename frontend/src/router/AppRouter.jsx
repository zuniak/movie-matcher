import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AnalyticsListener from '../components/AnalyticsListener'
import AppLayout from '../components/layout/AppLayout'
import ProtectedRoute from './ProtectedRoute'

import SplashScreenPage from '../pages/SplashScreenPage'
import SplashPage from '../pages/SplashPage'
import LoginPage from '../pages/LoginPage'
import AuthPage from '../pages/AuthPage'
import RegisterPage from '../pages/RegisterPage'


import SetupSessionPage from '../pages/SetupSessionPage'
import DashboardPage from '../pages/DashboardPage'
import LobbyPage from '../pages/LobbyPage'
import SwipingSessionPage from '../pages/SwipingSessionPage'
import MatchResultPage from '../pages/MatchResultPage'
import SessionHistoryPage from '../pages/SessionHistoryPage'
import UserProfilePage from '../pages/UserProfilePage'
import MovieCatalogPage from '../pages/MovieCatalogPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AnalyticsListener />
      <Routes>
        {/* public */}
        <Route path="/" element={<SplashScreenPage />} />
        <Route path="/splash" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/register" element={<RegisterPage />} />

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
          <Route path="/catalog" element={<MovieCatalogPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/history" element={<SessionHistoryPage />} />
        </Route>

        {/* public — accessible to guests who joined via code */}
        <Route path="/lobby/:sessionId" element={<LobbyPage />} />
        <Route path="/session/:sessionId" element={<SwipingSessionPage />} />
        <Route path="/session/:sessionId/result" element={<MatchResultPage />} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
