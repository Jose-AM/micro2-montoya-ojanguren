/* eslint-disable react/prop-types */
import React from 'react'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { AuthContext } from '../auth/Auth'
import { useNavigate } from 'react-router'

const db = getFirestore()

export const belongs = async (currentUser, item) => {
  console.log(item)
  const userRef = doc(db, 'users', currentUser.uid)
  const userDoc = await getDoc(userRef)
  const { membresias } = userDoc.data()
  return membresias.includes(item.id)
}

function Club({ item }) {
  const { currentUser } = React.useContext(AuthContext)

  const [belongsTo, setBelongsTo] = React.useState()

  React.useEffect(() => {
    setBelongsTo(belongs(currentUser, item).then((res) => setBelongsTo(res)))
  }, [item, currentUser])

  const navigate = useNavigate()

  const viewDetails = () => {
    navigate(`/clubs/${item.id}`)
  }

  return (
    <div className="club-item" role="button" onClick={viewDetails}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h2>{item?.nombre}</h2>
        <p>{item?.descripcion}</p>
        <p>{`${belongsTo ? 'Perteneces' : 'No Perteneces'} a este club`}</p>
      </div>
      <div
        style={{
          borderRadius: '9999px',
          width: '12px',
          height: '12px',
          backgroundColor: belongsTo ? '#45eb36' : 'red',
        }}
      />
    </div>
  )
}

export default Club
