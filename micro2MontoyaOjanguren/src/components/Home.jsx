import React from 'react'
import appFirebase from '../firebase'
import {getAuth,signOut} from 'firebase/auth'
const auth = getAuth(appFirebase)


const Home = ({correoUsuario}) => {
  return (
    <div><h2>Bienvenido Usuario {correoUsuario}<button className='btn btn-primary'onClick={() => signOut(auth)}>Logout</button></h2></div>)
}

export default Home