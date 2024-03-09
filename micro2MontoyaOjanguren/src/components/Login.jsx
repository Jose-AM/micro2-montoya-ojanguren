import React, { useState } from 'react'
import ImagenLog from '../assets/pngegglogg.png'
import ImagenPerf from '../assets/perfpng.png'
import appFirebase from '../firebase'
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithEmailLink} from 'firebase/auth'
const auth = getAuth(appFirebase)

const Login = () => {
    const [registrando, setRegistrando] = useState(false)

    const functAutentication = async (e) => {
        e.preventDefault();
        const correo = e.target.email.value;
        const password = e.target.password.value;
       if (registrando) {
        try{
            await createUserWithEmailAndPassword(auth, correo, password)
        } catch (error) {
            alert("El correo ya está registrado o la contraseña es muy corta")
        }
    }
    else {
        try{
            await signInWithEmailAndPassword(auth, correo, password)
            await signInWithEmailLink(auth, correo, password)
        } catch (error) {
            alert("El correo o la contraseña son incorrectos")
        }
    }
    }
  return (
    <div className='container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className='row'>
            <div className='col-md-4'>
                    <div className="padre" >
                        <div className="card card-body shadow-lg">
                            <div className='estilo-titulo'>Bienvenido a tu comunidad, gamer!</div>
                            <img src = {ImagenPerf} alt="Imagen de Perfil" className='estilo-profile' />
                                <form onSubmit={functAutentication}>
                                    <input type="text" placeholder="Ingresar email" className='cajatexto'id='email'/>
                                    <input type="password" placeholder="Ingresar contraseña"  className='cajatexto' id='password'/>
                                    <button className="btnform">{registrando ? "Registrate" : "Inicia sesión"}</button>
                                </form>
                                    <h4 className='texto'>{registrando ? "Si ya tienes cuenta" : "No tienes cuenta"}<button className='btnswitch' onClick={()=>setRegistrando(!registrando)}>{registrando ? "Inicia Sesion" : "Registrate"}</button></h4>
                        </div>
                    </div>
            </div>
            <div className="col-md-8">
                    <img src={ImagenLog} alt="Imagen de Login" className='tamano-imagen' />
            </div>
        </div>
    </div>
  )
}

export default Login
