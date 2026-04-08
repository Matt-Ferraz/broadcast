import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import type { Connection } from '@/shared/types'

interface ConnectionDeleteDialogProps {
  target: Connection | null
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function ConnectionDeleteDialog(props: ConnectionDeleteDialogProps) {
  const { target, onClose, onConfirm } = props

  return (
    <Dialog open={!!target} onClose={onClose} maxWidth="xs">
      <DialogTitle>Excluir conexão</DialogTitle>
      <DialogContent>
        <Typography>
          Tem certeza que deseja excluir <strong>{target?.name}</strong>?
          <br />
          <Typography variant="body2" color="error" component="span">
            Todos os contatos e mensagens desta conexão serão removidos.
          </Typography>
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
