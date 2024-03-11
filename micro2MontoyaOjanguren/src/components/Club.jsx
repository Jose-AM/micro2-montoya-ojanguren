/* eslint-disable react/prop-types */
import React from 'react'
import { getFirestore, updateDoc, doc, getDoc } from 'firebase/firestore'
import { AuthContext } from '../auth/Auth'

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

    // return isAlreadySubscribed
  }
  const [belongsTo, setBelongsTo] = React.useState(() => {
    belongs().then((res) => setBelongsTo(res))
  })

  const handleClickOnItem = async () => {
    const userRef = doc(db, 'users', currentUser.uid)
    const userDoc = await getDoc(userRef)
    const fields = userDoc._document.data.value.mapValue.fields
    const membresias = fields.membresias

    // Si no tiene ninguna membresia
    if (Object.keys(membresias?.arrayValue).length === 0) {
      await updateDoc(userRef, {
        membresias: [item.id],
      })
      alert(`Te has unido a ${item.nombre}`)
      return
    }

    const isAlreadySubscribed = membresias.arrayValue.values.find(
      (memb) => memb.stringValue === item.id,
    )

    // Si ya pertenece al club
    if (isAlreadySubscribed) {
      const newSuscriptions = membresias.arrayValue.values.filter(
        (memb) => memb.stringValue !== item.id,
      )
      const normalized = newSuscriptions.map((memb) => memb.stringValue)
      await updateDoc(userRef, {
        membresias: normalized,
      })
      alert(`Has dejado de ser parte de ${item.nombre}`)
      return
    }
    const oldSuscriptions = membresias.arrayValue.values.map(
      (memb) => memb.stringValue,
    )

    // Caso en que no pertenece al club
    const nueva = [...oldSuscriptions, item.id]
    try {
      await updateDoc(userRef, {
        membresias: nueva,
      })
      alert(`Te has unido a ${item.nombre}`)
    } catch (err) {
      console.log(err)
    } finally {
      return
    }
  }

  return (
    <div
      className="club-item"
      role="button"
      // onClick={handleClickOnItem}
    >
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
