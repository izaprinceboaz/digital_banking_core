import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/login'
import Register from './pages/auth/register'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/accounts/Accounts'
import Transactions from './pages/transactions/Transactions'
import ProtectedRoute from './routes/ProtectedRoute'
import PublicRoute from './routes/PublicRoute'
import MainLayout from './layouts/MainLayout'

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <Navigate to="/login" replace />
      } />

      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />

      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />

      <Route element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/transactions" element={<Transactions />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
