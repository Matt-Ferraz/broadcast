import { useEffect } from 'react'
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { format } from 'date-fns'
import type { Contact, Message } from '@/shared/types'

type FormData = {
  content: string
  contactIds: string[]
  scheduledAt: string
}

interface MessageFormDialogProps {
  open: boolean
  editing: Message | null
  contacts: Contact[]
  onClose: () => void
  onSave: (content: string, contactIds: string[], scheduledAt: Date) => Promise<void>
}

export function MessageFormDialog(props: MessageFormDialogProps) {
  const { open, editing, contacts, onClose, onSave } = props

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

  useEffect(() => {
    if (open) {
      reset({
        content: editing?.content ?? '',
        contactIds: editing?.contactIds ?? [],
        scheduledAt: editing
          ? format(editing.scheduledAt.toDate(), "yyyy-MM-dd'T'HH:mm")
          : '',
      })
    }
  }, [open, editing, reset])

  const onSubmit = async ({ content, contactIds, scheduledAt }: FormData) => {
    await onSave(content, contactIds, new Date(scheduledAt))
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editing ? 'Editar mensagem' : 'Nova mensagem'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Texto da mensagem"
            fullWidth
            multiline
            rows={3}
            autoFocus
            {...register('content', { required: 'Mensagem obrigatória' })}
            error={!!errors.content}
            helperText={errors.content?.message}
          />

          <FormControl fullWidth error={!!errors.contactIds}>
            <InputLabel>Contatos</InputLabel>
            <Controller
              name="contactIds"
              control={control}
              rules={{ validate: (v) => v.length > 0 || 'Selecione ao menos um contato' }}
              render={({ field }) => (
                <Select
                  {...field}
                  multiple
                  label="Contatos"
                  renderValue={(selected) =>
                    (selected as string[])
                      .map((id) => contacts.find((c) => c.id === id)?.name ?? id)
                      .join(', ')
                  }
                >
                  {contacts.map((contact) => (
                    <MenuItem key={contact.id} value={contact.id}>
                      {contact.name} — {contact.phone}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.contactIds && (
              <FormHelperText>{errors.contactIds.message}</FormHelperText>
            )}
          </FormControl>

          <TextField
            label="Data e hora de envio"
            type="datetime-local"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            {...register('scheduledAt', {
              required: 'Data obrigatória',
              validate: (v) => new Date(v) > new Date() || 'A data deve ser no futuro',
            })}
            error={!!errors.scheduledAt}
            helperText={errors.scheduledAt?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {editing ? 'Salvar' : 'Agendar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
