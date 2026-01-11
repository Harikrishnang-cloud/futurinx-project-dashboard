import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import {auth}from "./firebase.jsx"
import  toast  from 'react-hot-toast'


function Login({toLogin}){
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [loading,setLoading] = useState(false)

    const login = async()=>{
        if(!email || !password){
            toast.error("Email and Password required")
            return
        }
        try {
            setLoading(true)
            await signInWithEmailAndPassword(auth,email,password)
        } catch (error) {
            if(error.code === "auth/invalid-credential"){
                toast.error("Invalid email or password")
            }
            else{
                toast.error("Something we wrong.Try again")
            }
        }
        finally{
            setLoading(false)
        }
        
    }

    return(
        <div className='auth-card'>
            <h1>Login</h1>
            <input placeholder='Email' onChange={e=>setEmail(e.target.value)}/>
            <input type='password' placeholder='Password' onChange={e=>setPassword(e.target.value)}/>
            <button onClick={login} disabled={loading}>{loading?"Logging in...Please wait":"Login"}</button>
            <p onClick={toLogin} className='link' style={{cursor:'pointer'}}>New User? please Register</p>
        </div>
    )
}

export default Login