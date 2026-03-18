import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useForm, Controller } from 'react-hook-form'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useMessages } from '../hooks/useMessages'
import { useContacts } from '../hooks/useContacts'
import type { Message, MessageStatus } from '../types'

type FormData = {
  content: string
  contactIds: string[]
  scheduledAt: string
}

const statusLabel: Record<MessageStatus, string> = {
  scheduled: 'Agendada',
  sent: 'Enviada',
}

const statusColor: Record<MessageStatus, 'warning' | 'success'> = {
  scheduled: 'warning',
  sent: 'success',
}

export const MessagesPage = () => {
  const { connectionId = '' } = useParams()
  const navigate = useNavigate()

  const [statusFilter, setStatusFilter] = useState<MessageStatus | undefined>(undefined)
  const { messages, loading, create, update, remove } = useMessages(connectionId, statusFilter)
  const { contacts } = useContacts(connectionId)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Message | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

  const openCreate = () => {
    setEditing(null)
    reset({ content: '', contactIds: [], scheduledAt: '' })
    setDialogOpen(true)
  }

  const openEdit = (message: Message) => {
    setEditing(message)
    reset({
      content: message.content,
      contactIds: message.contactIds,
      scheduledAt: format(message.scheduledAt.toDate(), "yyyy-MM-dd'T'HH:mm"),
    })
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditing(null)
    reset()
  }

  const onSubmit = async ({ content, contactIds, scheduledAt }: FormData) => {
    const date = new Date(scheduledAt)
    if (editing) {
      await update(editing.id, content, contactIds, date)
    } else {
      await create(content, contactIds, date)
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
      <Box className="flex items-center gap-3 mb-4">
        <IconButton onClick={() => navigate('/')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={700} className="flex-1">
          Mensagens
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Nova mensagem
        </Button>
      </Box>

      {/* Filtro por status */}
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

      {/* Dialog criar / editar */}
      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Editar mensagem' : 'Nova mensagem'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className="flex flex-col gap-4">
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
              InputLabelProps={{ shrink: true }}
              {...register('scheduledAt', { required: 'Data obrigatória' })}
              error={!!errors.scheduledAt}
              helperText={errors.scheduledAt?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {editing ? 'Salvar' : 'Agendar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Dialog confirmar exclusão */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs">
        <DialogTitle>Excluir mensagem</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir esta mensagem?</Typography>
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
