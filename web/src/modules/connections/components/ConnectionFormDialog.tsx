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
import type { Connection } from '@/shared/types'

type FormData = { name: string }

interface ConnectionFormDialogProps {
  open: boolean
  editing: Connection | null
  onClose: () => void
  onSave: (name: string) => Promise<void>
}

export function ConnectionFormDialog(props: ConnectionFormDialogProps) {
  const { open, editing, onClose, onSave } = props
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>()

  useEffect(() => {
    if (open) {
      reset({ name: editing?.name ?? '' })
    }
  }, [open, editing, reset])

  const onSubmit = async ({ name }: FormData) => {
    await onSave(name)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{editing ? 'Editar conexão' : 'Nova conexão'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Nome da conexão"
            fullWidth
            autoFocus
            {...register('name', { required: 'Nome obrigatório' })}
            error={!!errors.name}
            helperText={errors.name?.message}
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
