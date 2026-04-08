import { useEffect } from 'react'
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import type { Contact } from '@/shared/types'

type FormData = { name: string; phone: string }

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10)
    return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2')
  return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2')
}

interface ContactFormDialogProps {
  open: boolean
  editing: Contact | null
  onClose: () => void
  onSave: (name: string, phone: string) => Promise<void>
}

export function ContactFormDialog(props: ContactFormDialogProps) {
  const { open, editing, onClose, onSave } = props
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>()

  useEffect(() => {
    if (open) {
      reset({ name: editing?.name ?? '', phone: editing?.phone ?? '' })
    }
  }, [open, editing, reset])

  const onSubmit = async ({ name, phone }: FormData) => {
    await onSave(name, phone)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{editing ? 'Editar contato' : 'Novo contato'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Nome"
            fullWidth
            autoFocus
            {...register('name', { required: 'Nome obrigatório' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Telefone"
            fullWidth
            placeholder="(00) 00000-0000"
            {...register('phone', {
              required: 'Telefone obrigatório',
              validate: (v) => v.replace(/\D/g, '').length >= 10 || 'Telefone inválido',
            })}
            onChange={(e) => setValue('phone', formatPhone(e.target.value), { shouldValidate: true })}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {editing ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
