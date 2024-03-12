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
  updateDoc,
} from 'firebase/firestore'
import { AuthContext } from '../auth/Auth'
import { belongs } from './Club'

const db = getFirestore()

function ClubPage() {
  const { id } = useParams()
  const { currentUser } = React.useContext(AuthContext)

  const handleClick = async () => {
    const userRef = doc(db, 'users', currentUser.uid)
    const userDoc = await getDoc(userRef)
    const fields = userDoc._document.data.value.mapValue.fields
    const membresias = fields.membresias

    // Si no tiene ninguna membresia
    if (Object.keys(membresias?.arrayValue).length === 0) {
      await updateDoc(userRef, {
        membresias: [id],
      })
      alert(`Te has unido a ${club.nombre}`)
      setIsMember(true)
      return
    }

    const isAlreadySubscribed = membresias.arrayValue.values.find(
      (memb) => memb.stringValue === id,
    )

    // Si ya pertenece al club
    if (isAlreadySubscribed) {
      const newSuscriptions = membresias.arrayValue.values.filter(
        (memb) => memb.stringValue !== id,
      )
      const normalized = newSuscriptions.map((memb) => memb.stringValue)
      await updateDoc(userRef, {
        membresias: normalized,
      })
      alert(`Has dejado de ser parte de ${club.nombre}`)
      setIsMember(false)
      return
    }
    const oldSuscriptions = membresias.arrayValue.values.map(
      (memb) => memb.stringValue,
    )

    // Caso en que no pertenece al club
    const nueva = [...oldSuscriptions, id]
    try {
      await updateDoc(userRef, {
        membresias: nueva,
      })
      alert(`Te has unido a ${club.nombre}`)
      setIsMember(true)
    } catch (err) {
      console.log(err)
    } finally {
      return
    }
  }

  const nav = useNavigate()

  const returnToHome = () => nav('/')
  const [club, setClub] = React.useState({
    descripcion: '',
    nombre: '',
    videojuegos: [],
  })

  const [isMember, setIsMember] = React.useState(false)

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
      const isMemberResult = await belongs(currentUser, clubDoc)
      setIsMember(isMemberResult)
    }
    fetchData()
  }, [id, currentUser])

  return (
    <>
      <div>
        <button className="btn btn-secondary" onClick={returnToHome}>
          Regresar
        </button>
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
        <button
          className={`btn ${isMember ? 'btn-danger' : 'btn-primary'}`}
          onClick={handleClick}
        >{`${isMember ? 'Dejar el Club' : 'Unirse al club'}`}</button>
        <h3
          style={{
            marginTop: '1rem',
          }}
        >
          Lista de Videojuegos
        </h3>
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
