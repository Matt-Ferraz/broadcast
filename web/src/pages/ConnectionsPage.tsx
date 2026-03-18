import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PeopleIcon from '@mui/icons-material/People'
import MessageIcon from '@mui/icons-material/Message'
import { useForm } from 'react-hook-form'
import { useConnections } from '../hooks/useConnections'
import type { Connection } from '../types'

type FormData = { name: string }

export const ConnectionsPage = () => {
  const { connections, loading, create, update, remove } = useConnections()
  const navigate = useNavigate()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Connection | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Connection | null>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>()

  const openCreate = () => {
    setEditing(null)
    reset({ name: '' })
    setDialogOpen(true)
  }

  const openEdit = (connection: Connection) => {
    setEditing(connection)
    reset({ name: connection.name })
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditing(null)
    reset()
  }

  const onSubmit = async ({ name }: FormData) => {
    if (editing) {
      await update(editing.id, name)
    } else {
      await create(name)
    }
    closeDialog()
  }

  const confirmDelete = async () => {
    if (deleteTarget) {
      await remove(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  if (loading) {
    return (
      <Box className="flex items-center justify-center h-64">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box className="flex items-center justify-between mb-6">
        <Typography variant="h5" fontWeight={700}>
          Conexões
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Nova conexão
        </Button>
      </Box>

      {connections.length === 0 ? (
        <Box className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Typography variant="body1">Nenhuma conexão cadastrada.</Typography>
          <Typography variant="body2">Clique em "Nova conexão" para começar.</Typography>
        </Box>
      ) : (
        <Box className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {connections.map((conn) => (
            <Card key={conn.id} elevation={2}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} noWrap>
                  {conn.name}
                </Typography>
              </CardContent>
              <CardActions className="justify-between px-4 pb-3">
                <Box className="flex gap-2">
                  <Button
                    size="small"
                    startIcon={<PeopleIcon />}
                    onClick={() => navigate(`/connections/${conn.id}/contacts`)}
                  >
                    Contatos
                  </Button>
                  <Button
                    size="small"
                    startIcon={<MessageIcon />}
                    onClick={() => navigate(`/connections/${conn.id}/messages`)}
                  >
                    Mensagens
                  </Button>
                </Box>
                <Box className="flex">
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => openEdit(conn)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton size="small" color="error" onClick={() => setDeleteTarget(conn)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      {/* Dialog criar / editar */}
      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="xs">
        <DialogTitle>{editing ? 'Editar conexão' : 'Nova conexão'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
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
            <Button onClick={closeDialog}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {editing ? 'Salvar' : 'Criar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Dialog confirmar exclusão */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs">
        <DialogTitle>Excluir conexão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir <strong>{deleteTarget?.name}</strong>?
            <br />
            <Typography variant="body2" color="error" component="span">
              Todos os contatos e mensagens desta conexão serão removidos.
            </Typography>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
