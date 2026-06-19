import { Navigate, Route, Routes } from 'react-router-dom'
import { Box, CircularProgress, Container } from '@mui/material'
import { AppFooter } from './components/AppFooter.jsx'
import { AppNavbar } from './components/AppNavbar.jsx'
import { HomeView } from './views/HomeView.jsx'
import { LoginView } from './views/LoginView.jsx'
import { RegisterView } from './views/RegisterView.jsx'
import { ProfileView } from './views/ProfileView.jsx'
import { DashboardView } from './views/DashboardView.jsx'
import { ProductDetailView } from './views/ProductDetailView.jsx'
import { ChatView } from './views/ChatView.jsx'
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
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppNavbar />
      <Container
        maxWidth="xl"
        component="main"
        sx={{
          flexGrow: 1,
          mt: { xs: 2, sm: 3, md: 4 },
          mb: { xs: 2, md: 3 },
          px: { xs: 1.5, sm: 2.5, md: 3 },
        }}
      >
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/products/:productId" element={<ProductDetailView />} />
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
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatView />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
      <AppFooter />
    </Box>
  )
}

export default App
