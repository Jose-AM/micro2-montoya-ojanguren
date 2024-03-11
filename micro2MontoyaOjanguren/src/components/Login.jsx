import { useState } from 'react'
import ImagenLog from '../assets/pngegglogg.png'
import ImagenPerf from '../assets/perfpng.png'
import appFirebase from '../firebase'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'
import { useNavigate } from 'react-router'

const Provider_Google = new GoogleAuthProvider()
const auth = getAuth(appFirebase)
const db = getFirestore()

const handleGoogleLogin = async (nav) => {
  try {
    const result = await signInWithPopup(auth, Provider_Google)
    const user = result.user
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        nombre: user.displayName,
        correo: user.email,
        // Puedes agregar más campos aquí si lo necesitas
      })
    }
    nav('/')
  } catch (error) {
    console.error('Error al iniciar sesión con Google: ', error)
  }
}

const Login = () => {
  const [registrando, setRegistrando] = useState(false)
  const nav = useNavigate()
  const functAutentication = async (e) => {
    e.preventDefault()
    const correo = e.target.email.value
    const password = e.target.password.value
    const nombre = e.target.nombre ? e.target.nombre.value : ''
    const apellido = e.target.apellido ? e.target.apellido.value : ''
    const username = e.target.username ? e.target.username.value : ''
    const videojuego_favorito = e.target.videojuego_favorito
      ? e.target.videojuego_favorito.value
      : ''

    if (registrando) {
      const videojuegosCollection = collection(db, 'videojuegos')
      const videojuegoSnapshot = await getDocs(
        query(
          videojuegosCollection,
          where('titulo', '==', videojuego_favorito),
        ),
      )

      if (videojuegoSnapshot.empty) {
        alert(
          'El videojuego favorito ingresado no existe en nuestra base de datos. Por favor, ingresa un videojuego válido.',
        )
        return
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          correo,
          password,
        )
        const user = userCredential.user

        await addDoc(collection(db, 'users'), {
          uid: user.uid,
          nombre: nombre,
          apellido: apellido,
          username: username,
          videojuego_favorito: videojuego_favorito,
        })
      } catch (error) {
        alert('El correo ya está registrado o la contraseña es muy corta')
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, correo, password)
      } catch (error) {
        alert('El correo o la contraseña son incorrectos')
      }
    }
  }

  return (
    <div
      className="container"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div className="row">
        <div className="col-md-4">
          <div className="padre">
            <div className="card card-body shadow-lg">
              <div className="estilo-titulo">
                {registrando
                  ? 'Adelante, registrate con nosotros!'
                  : 'Bienvenido a tu comunidad, gamer!'}
              </div>
              <img
                src={ImagenPerf}
                alt="Imagen de Perfil"
                className="estilo-profile"
              />
              <form onSubmit={functAutentication}>
                <input
                  type="text"
                  placeholder="Ingresar email"
                  className="cajatexto"
                  id="email"
                />
                <input
                  type="password"
                  placeholder="Ingresar contraseña"
                  className="cajatexto"
                  id="password"
                />
                {registrando && (
                  <>
                    <input
                      type="text"
                      placeholder="Ingresar nombre"
                      className="cajatexto"
                      id="nombre"
                    />
                    <input
                      type="text"
                      placeholder="Ingresar apellido"
                      className="cajatexto"
                      id="apellido"
                    />
                    <input
                      type="text"
                      placeholder="Ingresar nombre de usuario"
                      className="cajatexto"
                      id="username"
                    />
                    <input
                      type="text"
                      placeholder="Ingresar videojuego favorito"
                      className="cajatexto"
                      id="videojuego_favorito"
                    />
                  </>
                )}
                <button className="btnform">
                  {registrando ? 'Registrate' : 'Inicia sesión'}
                </button>
                <button
                  className="btnform"
                  onClick={() => handleGoogleLogin(nav)}
                >
                  Iniciar sesión con Google
                </button>
              </form>
              <h4 className="texto">
                {registrando ? 'Si ya tienes cuenta' : 'No tienes cuenta'}
                <button
                  className="btnswitch"
                  onClick={() => setRegistrando(!registrando)}
                >
                  {registrando ? 'Inicia Sesion' : 'Registrate'}
                </button>
              </h4>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <img
            src={ImagenLog}
            alt="Imagen de Login"
            className="tamano-imagen"
          />
        </div>
      </div>
    </div>
  )
}

export default Login
