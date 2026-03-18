import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import type { Connection } from '../types'
import {
  subscribeConnections,
  createConnection,
  updateConnection,
  deleteConnection,
} from '../services/connectionsService'

export const useConnections = () => {
  const { user } = useAuth()
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeConnections(user.uid, (data) => {
      setConnections(data)
      setLoading(false)
    })
    return unsubscribe
  }, [user])

  const create = (name: string) => createConnection(user!.uid, name)
  const update = (id: string, name: string) => updateConnection(id, name)
  const remove = (id: string) => deleteConnection(id)

  return { connections, loading, create, update, remove }
}
