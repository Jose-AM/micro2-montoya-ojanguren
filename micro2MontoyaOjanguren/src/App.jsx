import { useState } from "react";
import appFirebase from '../src/firebase'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
const auth = getAuth(appFirebase)
import './App.css'
import Login from "./components/Login"
import Home from "./components/Home"




function App() {
  const [user, setUser] = useState(null)
  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase) {
      setUser(usuarioFirebase)
    } else {
      setUser(null)
    }
  })

  return (
    <div>
      {user ? <Home correoUsuario = {user.email}/> : <Login />}
    </div>
  )
}
export default App;
