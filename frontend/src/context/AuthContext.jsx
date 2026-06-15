import { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'

export const AuthContext = createContext(null) // eslint-disable-line react-refresh/only-export-components

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
