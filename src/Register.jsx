import React, { useState } from 'react'
import {auth} from "./firebase.jsx"
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth"
import { toast } from 'react-hot-toast'

function Register({toLogin}){
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("");

    const register = async()=>{
        if(!name || !email || !password){
            toast.error("All fields are requires")
            return
        }
        if(password.length < 6){
            toast.error("Password must be atleast 6 characters")
            return
        }
        try {
            const userData = await createUserWithEmailAndPassword(auth,email,password)
            await updateProfile(userData.user,{
                displayName:name
            })
            
            toast.success("Registration Successful.")
    
        } catch (error) {
           toast.error(error.message) 
        }
    }
    return(
        <div className='auth-card'>
            <h2>Register</h2>
            <input placeholder='Name' onChange={(e)=>setName(e.target.value)}/>
            <input placeholder='Email' onChange={e=>setEmail(e.target.value)}/>
            <input type='password' placeholder='password' onChange={e =>setPassword(e.target.value)}/>
            <button onClick={register}>Register</button>
            <p onClick={toLogin}className='link' style={{cursor:"pointer"}}>Already have an account? Please Login</p>
        </div>
    )

}

export default Register