import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Hub from './Hub.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import SneakerDetail from './SneakerDetail.jsx'
import Portfolio from './Portfolio.jsx'
import AddPair from './AddPair.jsx'
import SalesHistory from './SalesHistory.jsx'
import Terms from './Terms.jsx'
import Privacy from './Privacy.jsx'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route
          path="/hub"
          element={
            <ProtectedRoute>
              <Hub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sneaker/:id"
          element={
            <ProtectedRoute>
              <SneakerDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddPair />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <SalesHistory />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/hub" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
