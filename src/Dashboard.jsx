import React, { useEffect, useState } from 'react'
import { signOut} from 'firebase/auth'
import {auth} from "./firebase.jsx"
import {db} from "./firebase.jsx"
import toast from 'react-hot-toast'
import { collection,addDoc,query,where,getDocs,deleteDoc,doc,serverTimestamp,updateDoc} from 'firebase/firestore'




function Dashboard({user}){

    // if(!user){
    //     return <p>Loading...</p>
    // }

    
    const [project,setProject] = useState([])
    const [name,setName] = useState("")
    const [description,setDescription] = useState("")
    const [loading,setLoading] = useState(false)
    const [editingId,setEditingId] = useState(null)

    useEffect(()=>{
        if(!user){
            return
        }
        fetchProjects()
    },[user])
    

    const addProject = async()=>{
        if(!name || !description){
            toast.error("Project name and description required.")
            return
        }
        try{
            setLoading(true)
            await addDoc(collection(db,"projects"),{
                name,
                description,
                userId:user.uid,
                createdAt:serverTimestamp()
            })
            toast.success("Project Added")
            setName("")
            setDescription("")
            fetchProjects()
        }
        catch(error){
            toast.error(error.message,"Failed to add project")
        }
        finally{
            setLoading(false)
        }
    }

    const fetchProjects = async()=>{
        if(!user || !user.uid)return
        try {
            const q = query(
                collection(db,"projects"),
                where("userId","==",user.uid)
            )
            const snapshot = await getDocs(q)
            setProject(snapshot.docs.map((doc)=>({
                id:doc.id,
                ...doc.data(),
            })))
        } catch (error) {
            toast.error(error.message,"Failed to load projects")
        }
    }
    



    const logout = async()=>{
        await signOut(auth)
        
    }

    const deleteProject = async(id)=>{
        if(!confirmDelete)return
        try {
            await deleteDoc(doc(db,"projects",id))
            toast.success("Project deleted successfully")
            fetchProjects()
        } catch (error) {
            toast.error(error.message,"Delete Failed")
        }
    }

    const confirmDelete = (onConfirm)=>{
        toast((t)=>(
            <div style={{fontSize:"14px"}}>
                <p style={{margin:"0 0 8px"}}>
                    Are you sure you want to delete this project?
                </p>
                <div style={{display:"flex",justifyContent:"flex-end",gap:"8px"}}>
                    <button onClick={()=>toast.dismiss(t.id)} 
                       style={{padding:"4px 10px",border:"1px solid #ddd",borderRadius:"4px", background:"#fff",cursor:'pointer'}}>
                        Cancel
                    </button>

                    <button onClick={()=>{
                        toast.dismiss(t.id); 
                        onConfirm()}} 
                        style={{padding:"4px 10px",borderRadius:"4px", background:"red",border:"none", color:"#fff",cursor:"pointer"}}>
                            Delete
                    </button>

                </div>
            </div>
        ),{duration:Infinity}
      )
    }

    const startEdit = (project)=>{
        setName(project.name)
        setDescription(project.description)
        setEditingId(project.id)
    }

    const EditProject = async()=>{
        if(!name || !description){
            toast.error("Project name and description required.")
            return 
        }
        try{
            setLoading(true);
            await updateDoc(doc(db,"projects",editingId),{
                name,description
            })
            toast.success("Project updated Successfully")
            setName("")
            setDescription("")
            setEditingId(null)
            fetchProjects()
        }
        catch(error){
            toast.error(error.message,"Cannot update your Project")
        }
        finally{
            setLoading(false)
        }
    }




    return(
        <div className='dashboard'>
            <div className='dashboard-header'>
                <h2>Welcome, {auth.currentUser?.displayName}</h2>
                <button className='logout-btn' onClick={logout}>Logout</button>
            </div>
            
            <div className='project-form'>
                <input placeholder='Project-Name' value={name} onChange={(e)=>setName(e.target.value)}/>
                <input placeholder='Description' value={description} onChange={(e)=>setDescription(e.target.value)}/>
                <button onClick={editingId ? EditProject : addProject} disabled={loading}>
                    {loading?"Saving...":editingId ? "Update Project":"Add Project"}
                </button>
            </div>

            <div className='project-list'>
                {project.length === 0 && <p>No projects found</p>}
                {project.map((p)=>(
                    <div key={p.id} className='project-card'>
                        <h4>{p.name}</h4>
                        <p>{p.description}</p>
                        <p className='date'>
                            Created On:{p.createdAt ?. toDate().toLocaleString()}
                        </p>
                        <button style={{marginRight:"8px",background:"#667eea"}}onClick={()=>startEdit(p)}>Edit</button>
                        <button onClick={()=>confirmDelete(()=> deleteProject(p.id))}>Delete</button>
                    </div>
                ))}
            </div>


            {/* <button className='logout-btn' onClick={()=>signOut(auth)}>Logout</button> */}
            
        </div>

        
    )
}

export default Dashboard