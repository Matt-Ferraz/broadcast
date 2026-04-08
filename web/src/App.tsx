import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage, RegisterPage, PrivateRoute } from '@/modules/auth'
import { ConnectionsPage } from '@/modules/connections'
import { ContactsPage } from '@/modules/contacts'
import { MessagesPage } from '@/modules/messages'
import { AppLayout } from '@/shared'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout><ConnectionsPage /></AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/connections/:connectionId/contacts"
          element={
            <PrivateRoute>
              <AppLayout><ContactsPage /></AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/connections/:connectionId/messages"
          element={
            <PrivateRoute>
              <AppLayout><MessagesPage /></AppLayout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
