// Home.jsx
import React from 'react'
import { AuthContext } from '../auth/Auth'
import { useNavigate } from 'react-router'
import { getFirestore, getDocs, query, collection } from 'firebase/firestore'
import Club from './Club'

const Home = () => {
  const nav = useNavigate()

  const { currentUser, onLogout } = React.useContext(AuthContext)
  const [clubs, setClubs] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const fecthClubs = async () => {
    setLoading(true)
    const db = getFirestore()
    const clubsCollection = collection(db, 'clubes')
    const snapshot = await getDocs(query(clubsCollection))

    let newClubs = []
    snapshot.docs.map((club) => {
      const { descripcion, nombre, videojuegos } =
        club._document.data.value.mapValue.fields
      const newClub = {
        id: club.id,
        descripcion: descripcion.stringValue,
        nombre: nombre.stringValue,
      }
      newClubs.push(newClub)
    })
    newClubs.sort((a, b) => parseInt(a.id) - parseInt(b.id))
    setClubs(newClubs)
    setLoading(false)
  }

  React.useEffect(() => {
    if (!currentUser) {
      nav('/login')
    }

    // Si existe el usuario se buscan los clubes para mostrarlos
    fecthClubs()
  }, [currentUser, nav])

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '24px',
          color: 'white',
        }}
      >
        Cargando Clubes...
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '2rem',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2rem',
          marginTop: '1rem',
        }}
      >
        <h2 style={{ color: 'white' }}>
          Bienvenido {currentUser?.displayName}
        </h2>
        <button
          name="profile"
          className="btn btn-primary"
          onClick={() => nav('/profile')}
        >
          Ver Perfil
        </button>
        <button className="btn btn-danger" onClick={onLogout}>
          Logout
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '2rem',
          width: '90%',
          marginRight: '5rem',
        }}
      >
        {clubs.map((club) => (
          <Club item={club} key={club.id} />
        ))}
      </div>
    </div>
  )
}

export default Home
