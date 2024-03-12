// VerPerfil.jsx
import React, { useState, useEffect } from 'react'
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore'
import { AuthContext } from '../auth/Auth'
import { useNavigate } from 'react-router'

const db = getFirestore()

const VerPerfil = () => {
  const { currentUser } = React.useContext(AuthContext)
  const [perfil, setPerfil] = useState()
  const nav = useNavigate()

  useEffect(() => {
    if (!currentUser) {
      nav('/login')
    }

    const fetchDoc = async () => {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
      setPerfil(userDoc.data())
    }

    fetchDoc()
  }, [currentUser, nav])

  const handleGuardarCambios = async () => {
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), perfil)
      const updatedDocRef = doc(db, 'users', currentUser.uid)
      const updatedDocSnap = await getDoc(updatedDocRef)
      if (updatedDocSnap.exists()) {
        // Update state with the new perfil data
        setPerfil(updatedDocSnap.data())
        alert('Actualizado')
      }
      return
    } catch (err) {
      alert('error')
    }
  }

  return (
    <div className="container">
      <button className="btn btn-secondary" onClick={() => nav('/')}>
        Volver
      </button>
      <div className="info">
        <h2>Perfil de {currentUser?.displayName}</h2>
        <label htmlFor="nombre">Nombre</label>
        <input
          type="text"
          value={perfil?.nombre}
          onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })}
        />
        <label htmlFor="nombre">Apellido</label>
        <input
          type="text"
          value={perfil?.apellido}
          onChange={(e) => setPerfil({ ...perfil, apellido: e.target.value })}
        />
        <label htmlFor="nombre">Videojuego Favorito</label>
        <input
          type="text"
          value={perfil?.videojuego_favorito}
          onChange={(e) =>
            setPerfil({ ...perfil, videojuego_favorito: e.target.value })
          }
        />
        <button onClick={handleGuardarCambios}>Guardar cambios</button>
      </div>
    </div>
  )
}

export default VerPerfil
