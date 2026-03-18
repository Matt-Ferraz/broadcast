import { useForm } from 'react-hook-form'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { TextField, Button, Typography, Box, Alert, Paper } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

type FormData = {
  email: string
  password: string
}

export const LoginPage = () => {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()

  if (user) return <Navigate to="/" replace />

  const onSubmit = async ({ email, password }: FormData) => {
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('E-mail ou senha inválidos.')
    }
  }

  return (
    <Box className="flex items-center justify-center min-h-screen bg-gray-50">
      <Paper elevation={3} className="w-full max-w-sm p-8">
        <Typography variant="h5" fontWeight={700} className="mb-6 text-center">
          Broadcast
        </Typography>

        <Typography variant="subtitle1" className="mb-6 text-center text-gray-500">
          Acesse sua conta
        </Typography>

        {error && <Alert severity="error" className="mb-4">{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <TextField
            label="E-mail"
            type="email"
            fullWidth
            {...register('email', { required: 'E-mail obrigatório' })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Senha"
            type="password"
            fullWidth
            {...register('password', { required: 'Senha obrigatória', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            className="mt-2"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>

          <Typography variant="body2" className="text-center text-gray-500">
            Não tem conta?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Cadastre-se
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}
