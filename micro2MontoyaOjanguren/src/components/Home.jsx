// Home.jsx
import React from 'react'
import VerPerfil from './VerPerfil'
import { AuthContext } from '../auth/Auth'
import { useNavigate } from 'react-router'

const Home = () => {
  const [opcionMenu, setOpcionMenu] = React.useState('perfil')
  const nav = useNavigate()

  const { currentUser, onLogout } = React.useContext(AuthContext)

  React.useEffect(() => {
    if (!currentUser) {
      nav('/login')
    }
  }, [currentUser, nav])

  return (
    <div>
      <h2>Bienvenido Usuario {currentUser?.email}</h2>
      <div>
        <button onClick={() => setOpcionMenu('perfil')}>Ver perfil</button>
        <button onClick={() => setOpcionMenu('grupos')}>Buscar grupos</button>
        <button onClick={() => setOpcionMenu('videojuegos')}>
          Buscar videojuegos
        </button>
      </div>
      {opcionMenu === 'perfil' && <VerPerfil />}
      {opcionMenu === 'grupos' && (
        <div>{/* Aquí puedes agregar el código para buscar grupos */}</div>
      )}
      {opcionMenu === 'videojuegos' && (
        <div>{/* Aquí puedes agregar el código para buscar videojuegos */}</div>
      )}
      <button className="btn btn-primary" onClick={onLogout}>
        Logout
      </button>
    </div>
  )
}

export default Home
