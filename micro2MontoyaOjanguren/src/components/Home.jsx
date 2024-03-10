// Home.jsx
import React, { useState } from 'react'
import appFirebase from '../firebase'
import {getAuth,signOut} from 'firebase/auth'
import VerPerfil from './VerPerfil'

const auth = getAuth(appFirebase)

const Home = ({correoUsuario}) => {
  const [opcionMenu, setOpcionMenu] = useState('perfil')

  return (
    <div>
      <h2>Bienvenido Usuario {correoUsuario}</h2>
      <div>
        <button onClick={() => setOpcionMenu('perfil')}>Ver perfil</button>
        <button onClick={() => setOpcionMenu('grupos')}>Buscar grupos</button>
        <button onClick={() => setOpcionMenu('videojuegos')}>Buscar videojuegos</button>
      </div>
      {opcionMenu === 'perfil' && <VerPerfil correoUsuario={correoUsuario} />}
      {opcionMenu === 'grupos' && (
        <div>
          {/* Aquí puedes agregar el código para buscar grupos */}
        </div>
      )}
      {opcionMenu === 'videojuegos' && (
        <div>
          {/* Aquí puedes agregar el código para buscar videojuegos */}
        </div>
      )}
      <button className='btn btn-primary'onClick={() => signOut(auth)}>Logout</button>
    </div>
  )
}

export default Home
