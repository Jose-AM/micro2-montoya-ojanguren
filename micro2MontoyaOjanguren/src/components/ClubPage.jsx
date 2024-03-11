import React from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router'
import {
  getFirestore,
  getDoc,
  doc,
  query,
  where,
  getDocs,
  collection,
} from 'firebase/firestore'
import { AuthContext } from '../auth/Auth'

const db = getFirestore()

function ClubPage() {
  const { id } = useParams()
  const { currentUser } = React.useContext(AuthContext)

  

  const nav = useNavigate()

  const returnToHome = () => nav('/')
  const [club, setClub] = React.useState({
    descripcion: '',
    nombre: '',
    videojuegos: [],
  })

  React.useEffect(() => {
    const fetchData = async () => {
      const clubDoc = await getDoc(doc(db, 'clubes', id))
      const { descripcion, nombre, videojuegos } =
        clubDoc._document.data.value.mapValue.fields

      const videoIds = videojuegos.arrayValue.values
      const sanitizedData = videoIds.map((vd) => vd.stringValue)
      const videojuegosCollection = collection(db, 'videojuegos')

      const promises = sanitizedData.map(async (id) => {
        const querySnapshot = await getDocs(
          query(videojuegosCollection, where('ID', '==', id)),
        )
        const { ID, descripcion, genero, titulo } =
          querySnapshot.docs[0]._document.data.value.mapValue.fields
        return {
          id: ID.stringValue,
          descripcion: descripcion.stringValue,
          genero: genero.stringValue,
          titulo: titulo.stringValue,
        }
      })

      const videos = await Promise.all(promises)

      setClub({
        descripcion: descripcion.stringValue,
        nombre: nombre.stringValue,
        videojuegos: videos,
      })
    }
    fetchData()
  }, [])

  return (
    <>
      <div>
        <button onClick={returnToHome}>Regresar</button>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          flexDirection: 'column',
        }}
      >
        <h1>{club?.nombre}</h1>
        <p>{club?.descripcion}</p>
        <p>Video juegos</p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '2rem',
            padding: '2rem',
          }}
        >
          {club.videojuegos.map((juego) => (
            <div
              key={juego.id}
              style={{
                color: 'black',
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '1rem',
              }}
            >
              <h2>{juego.titulo}</h2>
              <h3>{juego.genero}</h3>
              <h4>{juego.descripcion}</h4>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ClubPage
