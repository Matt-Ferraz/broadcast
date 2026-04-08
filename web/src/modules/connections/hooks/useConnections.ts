import { useAtomValue } from 'jotai'
import { connectionsAtom } from '@/modules/connections/atoms/connectionsAtoms'

export function useConnections(userId: string) {
  const data = useAtomValue(connectionsAtom(userId))
  return { data: data ?? [], loading: data === null }
}
