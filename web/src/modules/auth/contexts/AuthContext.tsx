import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { useSetAtom } from 'jotai'
import { auth } from '@/shared/lib/firebase'
import { userAtom } from '@/modules/auth/atoms/authAtoms'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider(props: AuthProviderProps) {
  const { children } = props
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const setUserAtom = useSetAtom(userAtom)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setUserAtom(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [setUserAtom])

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const register = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
