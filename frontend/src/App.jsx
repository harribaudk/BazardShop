import { Navigate, Route, Routes } from 'react-router-dom'
import { Box, CircularProgress, Container } from '@mui/material'
import { AppNavbar } from './components/AppNavbar.jsx'
import { HomeView } from './views/HomeView.jsx'
import { LoginView } from './views/LoginView.jsx'
import { RegisterView } from './views/RegisterView.jsx'
import { ProfileView } from './views/ProfileView.jsx'
import { DashboardView } from './views/DashboardView.jsx'
import { useAuth } from './context/AuthContext.jsx'
import './App.css'

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth()
  if (loading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <>
      <AppNavbar />
      <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, mb: 6 }}>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardView />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
    </>
  )
}

export default App
