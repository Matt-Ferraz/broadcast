import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import type { Message } from '@/shared/types'

interface MessageDeleteDialogProps {
  target: Message | null
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function MessageDeleteDialog(props: MessageDeleteDialogProps) {
  const { target, onClose, onConfirm } = props

  return (
    <Dialog open={!!target} onClose={onClose} maxWidth="xs">
      <DialogTitle>Excluir mensagem</DialogTitle>
      <DialogContent>
        <Typography>Tem certeza que deseja excluir esta mensagem?</Typography>
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
