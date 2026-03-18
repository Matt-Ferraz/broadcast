import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { CircularProgress, Box } from '@mui/material'
import type { ReactNode } from 'react'

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Box className="flex items-center justify-center h-screen">
        <CircularProgress />
      </Box>
    )
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />
}
