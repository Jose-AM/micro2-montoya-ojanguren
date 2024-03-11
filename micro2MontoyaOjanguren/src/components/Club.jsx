/* eslint-disable react/prop-types */
import React from 'react'
import { getFirestore, updateDoc, doc, getDoc } from 'firebase/firestore'
import { AuthContext } from '../auth/Auth'
import { useNavigate } from 'react-router'

const db = getFirestore()

function Club({ item }) {
  const { currentUser } = React.useContext(AuthContext)

  const belongs = async () => {
    const userRef = doc(db, 'users', currentUser.uid)
    const userDoc = await getDoc(userRef)
    const fields = userDoc._document.data.value.mapValue.fields
    const membresias = fields.membresias
    if (membresias.arrayValue.values) {
      const isMember = membresias.arrayValue.values.map(
        (memb) => memb.stringValue === item.id,
      )
      return isMember[0]
    }
    return false
  }
  const [belongsTo, setBelongsTo] = React.useState(() => {
    belongs().then((res) => setBelongsTo(res))
  })

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
