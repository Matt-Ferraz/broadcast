import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAuth } from '@/modules/auth'
import { useMessages, createMessage, updateMessage, deleteMessage } from '@/modules/messages'
import { useContacts } from '@/modules/contacts'
import { MessageFormDialog } from '@/modules/messages/components/MessageFormDialog'
import { MessageDeleteDialog } from '@/modules/messages/components/MessageDeleteDialog'
import type { Message, MessageStatus } from '@/shared/types'

const statusLabel: Record<MessageStatus, string> = {
  scheduled: 'Agendada',
  sent: 'Enviada',
}

const statusColor: Record<MessageStatus, 'warning' | 'success'> = {
  scheduled: 'warning',
  sent: 'success',
}

export function MessagesPage() {
  const { connectionId = '' } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [statusFilter, setStatusFilter] = useState<MessageStatus | undefined>(undefined)
  const { data: messages, loading } = useMessages(user!.uid, connectionId, statusFilter)
  const { data: contacts } = useContacts(user!.uid, connectionId)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Message | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null)

  const openCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const openEdit = (message: Message) => {
    setEditing(message)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditing(null)
  }

  const handleSave = async (content: string, contactIds: string[], scheduledAt: Date) => {
    if (editing) {
      await updateMessage(editing.id, content, contactIds, scheduledAt)
    } else {
      await createMessage(user!.uid, connectionId, content, contactIds, scheduledAt)
    }
  }

  const handleDelete = async () => {
    if (deleteTarget) {
      await deleteMessage(deleteTarget.id)
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
      <Box className="flex items-center gap-3 mb-4">
        <IconButton onClick={() => navigate('/')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={700} className="flex-1">
          Mensagens
        </Typography>
        <Tooltip title={contacts.length === 0 ? 'Cadastre contatos antes de criar uma mensagem' : ''}>
          <span>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreate}
              disabled={contacts.length === 0}
            >
              Nova mensagem
            </Button>
          </span>
        </Tooltip>
      </Box>

      <Box className="mb-4">
        <ToggleButtonGroup
          value={statusFilter ?? 'all'}
          exclusive
          onChange={(_, val) => setStatusFilter(val === 'all' ? undefined : val as MessageStatus)}
          size="small"
        >
          <ToggleButton value="all">Todas</ToggleButton>
          <ToggleButton value="scheduled">Agendadas</ToggleButton>
          <ToggleButton value="sent">Enviadas</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {messages.length === 0 ? (
        <Box className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Typography variant="body1">Nenhuma mensagem encontrada.</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Mensagem</strong></TableCell>
                <TableCell><strong>Contatos</strong></TableCell>
                <TableCell><strong>Agendamento</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="right"><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages.map((msg) => (
                <TableRow key={msg.id} hover>
                  <TableCell sx={{ maxWidth: 240 }}>
                    <Typography noWrap variant="body2">{msg.content}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {msg.contactIds.length} contato(s)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(msg.scheduledAt.toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabel[msg.status]}
                      color={statusColor[msg.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {msg.status === 'scheduled' && (
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => openEdit(msg)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Excluir">
                      <IconButton size="small" color="error" onClick={() => setDeleteTarget(msg)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <MessageFormDialog
        open={dialogOpen}
        editing={editing}
        contacts={contacts}
        onClose={closeDialog}
        onSave={handleSave}
      />

      <MessageDeleteDialog
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Box>
  )
}
