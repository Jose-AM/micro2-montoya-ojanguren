/* eslint-disable react/prop-types */
import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router'

export const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  const onLogout = () => {
    signOut(auth)
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })
    nav('/')
  }, [])

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
        }}
      >
        <h1>Loading User...</h1>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        onLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
