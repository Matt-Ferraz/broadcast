import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ConnectionsPage } from './pages/ConnectionsPage'
import { ContactsPage } from './pages/ContactsPage'
import { PrivateRoute } from './components/PrivateRoute'
import { AppLayout } from './components/AppLayout'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout>
                <ConnectionsPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/connections/:connectionId/contacts"
          element={
            <PrivateRoute>
              <AppLayout>
                <ContactsPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
