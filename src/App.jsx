import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import Register from './Register.jsx'
import Login from './Login.jsx'
import Dashboard from './Dashboard.jsx'
import { auth } from './firebase.jsx'
import {Toaster} from 'react-hot-toast'
import toast from 'react-hot-toast'

function App(){
  const [user,setUser] =  useState(null)
  const [register,setRegister]=useState(true)
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth,(u)=>{
      setUser(u)
      setLoading(false)
      if(u){
        toast.success(`Welcome ${u.displayName || "User"}`)
      }
      else{
        toast.success("Logout successfully  ")
      }
    })
    return ()=>unsubscribe()
  },[])

  if(loading)return <p>Loading...</p>

  // if(!user){
  //   return register ? (
  //     <Register toLogin={()=>setRegister(false)}/>
  //   ):(
  //     <Login toLogin={()=>setRegister(true)}/>
  //   )
  // }
  return(
    <div>
      <Toaster position='top-center' reverseOrder={false}/>
      {!user?(
        register?(
          <Register toLogin={()=>setRegister(false)}/>
        ):(
          <Login toLogin={()=>setRegister(true)}/>
        )
      
      )  :(
          <Dashboard user={user}/>
        )}
    </div>
  )
}


export default App