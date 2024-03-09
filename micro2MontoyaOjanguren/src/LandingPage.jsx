// LandingPage.jsx
import { useState } from 'react';
import * as firebase from 'firebase/app'; // Cambio aquí
import 'firebase/auth';
import 'firebase/firestore';

// Inicializa Firebase con tu configuración
const firebaseConfig = {
    apiKey: "AIzaSyB42V5mzK2fTVY3unU3lc3b-GlbhYYiito",
    authDomain: "micro2-montoya-ojanguren.firebaseapp.com",
    projectId: "micro2-montoya-ojanguren",
    storageBucket: "micro2-montoya-ojanguren.appspot.com",
    messagingSenderId: "241928254275",
    appId: "1:241928254275:web:b115cbd65be888977175f6",
  };
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

export default function LandingPage() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    nombreUsuario: '',
    email: '',
    contraseña: '',
    videojuegoPreferido: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, contraseña, ...rest } = form;
    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, contraseña);
      await db.collection('usuarios').doc(user.uid).set(rest);
    } catch (error) {
      console.error(error);
    }
  };

  console.log("Renderizando LandingPage"); // Mensaje de prueba

  return (
    <div style={{ color: 'white', backgroundColor: 'black' }}>
      <h1>Bienvenido a tu comunidad gamer!</h1>
      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" onChange={handleChange} />
        <input name="apellido" placeholder="Apellido" onChange={handleChange} />
        <input name="nombreUsuario" placeholder="Nombre de usuario" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="contraseña" placeholder="Contraseña" type="password" onChange={handleChange} />
        <input name="videojuegoPreferido" placeholder="Videojuego preferido" onChange={handleChange} />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
