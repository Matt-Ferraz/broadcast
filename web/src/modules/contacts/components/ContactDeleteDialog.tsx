import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import type { Contact } from '@/shared/types'

interface ContactDeleteDialogProps {
  target: Contact | null
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function ContactDeleteDialog(props: ContactDeleteDialogProps) {
  const { target, onClose, onConfirm } = props

  return (
    <Dialog open={!!target} onClose={onClose} maxWidth="xs">
      <DialogTitle>Excluir contato</DialogTitle>
      <DialogContent>
        <Typography>
          Tem certeza que deseja excluir <strong>{target?.name}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  )
}
