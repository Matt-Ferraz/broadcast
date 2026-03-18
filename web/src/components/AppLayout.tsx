import { AppBar, Toolbar, Typography, IconButton, Tooltip, Box } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import type { ReactNode } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <Box className="min-h-screen bg-gray-50">
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" fontWeight={700} className="flex-1">
            Broadcast
          </Typography>

          <Typography variant="body2" className="mr-3 opacity-80">
            {user?.email}
          </Typography>

          <Tooltip title="Sair">
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box className="p-6">{children}</Box>
    </Box>
  )
}
