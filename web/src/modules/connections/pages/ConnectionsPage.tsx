import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PeopleIcon from '@mui/icons-material/People'
import MessageIcon from '@mui/icons-material/Message'
import { useAuth } from '@/modules/auth'
import { useConnections, createConnection, updateConnection, deleteConnection } from '@/modules/connections'
import { ConnectionFormDialog } from '@/modules/connections/components/ConnectionFormDialog'
import { ConnectionDeleteDialog } from '@/modules/connections/components/ConnectionDeleteDialog'
import type { Connection } from '@/shared/types'

export function ConnectionsPage() {
  const { user } = useAuth()
  const { data: connections, loading } = useConnections(user!.uid)
  const navigate = useNavigate()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Connection | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Connection | null>(null)

  const openCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const openEdit = (connection: Connection) => {
    setEditing(connection)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditing(null)
  }

  const handleSave = async (name: string) => {
    if (editing) {
      await updateConnection(editing.id, name)
    } else {
      await createConnection(user!.uid, name)
    }
  }

  const handleDelete = async () => {
    if (deleteTarget) {
      await deleteConnection(deleteTarget.id)
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

      <ConnectionFormDialog
        open={dialogOpen}
        editing={editing}
        onClose={closeDialog}
        onSave={handleSave}
      />

      <ConnectionDeleteDialog
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Box>
  )
}
