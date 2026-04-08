import { Navigate } from 'react-router-dom'
import { CircularProgress, Box } from '@mui/material'
import type { ReactNode } from 'react'
import { useAuth } from '@/modules/auth/contexts/AuthContext'

interface PrivateRouteProps {
  children: ReactNode
}

export function PrivateRoute(props: PrivateRouteProps) {
  const { children } = props
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
