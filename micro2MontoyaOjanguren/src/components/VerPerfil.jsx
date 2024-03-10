// VerPerfil.jsx
import React, { useState, useEffect } from 'react'
import {getFirestore, doc, getDoc, updateDoc} from 'firebase/firestore'

const db = getFirestore();

const VerPerfil = ({correoUsuario}) => {
  const [perfil, setPerfil] = useState(null)

  useEffect(() => {
    const fetchPerfil = async () => {
      const perfilDoc = await getDoc(doc(db, "users", correoUsuario))
      if (perfilDoc.exists()) {
        setPerfil(perfilDoc.data())
      }
    }

    fetchPerfil()
  }, [correoUsuario])

  const handleGuardarCambios = async () => {
    await updateDoc(doc(db, "users", correoUsuario), perfil)
  }

  return (
    perfil && (
      <div>
        <input type="text" value={perfil.nombre} onChange={(e) => setPerfil({...perfil, nombre: e.target.value})} />
        <input type="text" value={perfil.apellido} onChange={(e) => setPerfil({...perfil, apellido: e.target.value})} />
        <input type="text" value={perfil.videojuego_favorito} onChange={(e) => setPerfil({...perfil, videojuego_favorito: e.target.value})} />
        <button onClick={handleGuardarCambios}>Guardar cambios</button>
      </div>
    )
  )
}

export default VerPerfil
