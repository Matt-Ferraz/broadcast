import { useForm } from 'react-hook-form'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { TextField, Button, Typography, Box, Alert, Paper } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

type FormData = {
  email: string
  password: string
  confirmPassword: string
}

export const RegisterPage = () => {
  const { register: registerUser, user } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>()

  if (user) return <Navigate to="/" replace />

  const onSubmit = async ({ email, password }: FormData) => {
    setError('')
    try {
      await registerUser(email, password)
      navigate('/')
    } catch {
      setError('Não foi possível criar a conta. Verifique os dados e tente novamente.')
    }
  }

  return (
    <Box className="flex items-center justify-center min-h-screen bg-gray-50">
      <Paper elevation={3} className="w-full max-w-sm p-8">
        <Typography variant="h5" fontWeight={700} className="mb-6 text-center">
          Broadcast
        </Typography>

        <Typography variant="subtitle1" className="mb-6 text-center text-gray-500">
          Crie sua conta
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
            {...register('password', {
              required: 'Senha obrigatória',
              minLength: { value: 6, message: 'Mínimo 6 caracteres' },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <TextField
            label="Confirmar senha"
            type="password"
            fullWidth
            {...register('confirmPassword', {
              required: 'Confirmação obrigatória',
              validate: (val) => val === watch('password') || 'As senhas não coincidem',
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            className="mt-2"
          >
            {isSubmitting ? 'Criando conta...' : 'Cadastrar'}
          </Button>

          <Typography variant="body2" className="text-center text-gray-500">
            Já tem conta?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Entrar
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}
